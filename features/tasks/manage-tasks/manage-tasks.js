(async () => {
await window.HrmTaskStore.ready;

const today=new Date();today.setHours(0,0,0,0);const fmt=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'});function relative(n){const d=new Date(today);d.setDate(d.getDate()+n);return d}function dateLabel(d){return d?fmt.format(d):'No due date'}
const tasks=window.HrmTaskStore.records;
let currentDeadlineFilter='all';let currentStatusFilter='all';let pendingTask=null,pendingStatus=null;
let taskPage=1,taskPageSize=25;
let searchDraft='',searchQuery='';
const normalizeTaskSearch=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
function matchesSearch(t){const query=normalizeTaskSearch(searchQuery);return !query||normalizeTaskSearch(t.id).includes(query)||normalizeTaskSearch(t.title).includes(query)}
const taskPageSizes=[10,25,50,100];
const currentUser={id:'quang',name:'Nguyễn Quang',account:'quangn',email:'quangn@example.com',unit:'FPT Software'};
const people=[currentUser,{id:'anh',name:'Trần Minh Anh',account:'anhtm',email:'anhtm@example.com',unit:'HR · FPT Software'},{id:'ha',name:'Lê Thu Hà',account:'halt',email:'halt@example.com',unit:'FPT IS'},{id:'hai',name:'Nguyễn Hải An',account:'annh',email:'annh@example.com',unit:'FPT Software'}];
const personLabel=u=>`${u.name} · ${u.account} · ${u.email} · ${u.unit}`;
const isMine=t=>window.HrmTaskStore.mine(t);
const transitions={"To Do":[['In Progress','Start Task'],['Cancel','Cancel Task']],"In Progress":[['Complete','Complete Task'],['Cancel','Cancel Task']],"Complete":[['To Do','Request Rework']],"Cancel":[]};
function allowed(t){return isMine(t)?(t.status==='Complete'?[]:transitions[t.status]||[]):[]}
let statusSaving=false;
function changeButton(t){return allowed(t).map(([next,label])=>{if(next==='In Progress'&&t.start&&t.start>new Date())label='Start Early';return `<button class="btn ${next==='Cancel'?'task-cancel':'primary'}" data-change="${t.id}" data-next="${next}">${label}</button>`}).join('')}
function bindChanges(root=main){root.querySelectorAll('[data-change]').forEach(b=>b.onclick=()=>{const t=tasks.find(t=>t.id===b.dataset.change);if(['Cancel','Complete'].includes(b.dataset.next))openChange(t,b.dataset.next);else saveTaskStatus(t,b.dataset.next)})}
function openChange(t,next){
if(statusSaving||!t||!['Cancel','Complete'].includes(next)||!allowed(t).some(([v])=>v===next))return;
pendingTask=t;pendingStatus=next;
const complete=next==='Complete',dialog=document.getElementById('statusDialog'),confirm=document.getElementById('confirmStatus');
dialog.dataset.action=next;
document.getElementById('statusIcon').textContent=complete?'✓':'×';
document.getElementById('statusHeading').textContent=complete?'Complete this task?':'Cancel this task?';
document.getElementById('changeTitle').textContent=t.title;
document.getElementById('statusDescription').textContent=complete?'This task will be marked as Complete.':'This task will move to Cancel and no longer appear in your action items.';
confirm.textContent=complete?'Complete Task':'Cancel Task';confirm.className=complete?'btn primary':'btn task-cancel-confirm';
document.getElementById('statusError').hidden=true;dialog.showModal();document.getElementById('dismissStatus').focus();
}
async function saveTaskStatus(t,next){
if(statusSaving||!t||!allowed(t).some(([v])=>v===next))return;
statusSaving=true;const close=document.getElementById('closeTaskWorkspace');close.disabled=true;
const buttons=Array.from(document.querySelectorAll('[data-change],#confirmStatus,#dismissStatus'));buttons.forEach(b=>b.disabled=true);
const active=document.getElementById('statusDialog').open?document.getElementById('confirmStatus'):buttons.find(b=>b.dataset?.next===next);const label=active.textContent;active.textContent='Saving…';
const previous=t.status;t.status=next;
try{await window.HrmTaskStore.save()}catch{t.status=previous;if(document.getElementById('statusDialog').open){const error=document.getElementById('statusError');error.textContent=next==='Complete'?'Could not complete the task. Please try again.':'Could not cancel the task. Please try again.';error.hidden=false}else showTaskNotice('Could not save the status. Please try again.');return}
finally{statusSaving=false;close.disabled=false;buttons.forEach(b=>b.disabled=false);active.textContent=label}
if(document.getElementById('statusDialog').open)document.getElementById('statusDialog').close();pendingTask=null;pendingStatus=null;list();route();
const toast=document.getElementById('statusToast');toast.textContent=t.id+' updated to '+next;toast.hidden=false;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.hidden=true,3000);
}

const main=document.getElementById('main');const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function urgency(t){if(!t.due||['Complete','Cancel'].includes(t.status))return '';const days=Math.round((t.due-today)/86400000);return days<0?'overdue':days<=7?'soon':''}function deadline(t){const u=urgency(t);return u?`<span class="tag ${u}">${u==='overdue'?'Overdue':'Due Soon'}</span>`:''}function status(t){return `<span class="tag ${t.status==='In Progress'?'inprogress':t.status==='Complete'?'completed':''}">${esc(t.status)}</span>`}
function terminalStatusSelected(){return ['Complete','Cancel'].includes(currentStatusFilter)}
function matchesStatus(t){return currentStatusFilter==='all'||t.status===currentStatusFilter}
function resetFilters(){currentStatusFilter='all';currentDeadlineFilter='all';searchDraft='';searchQuery='';taskPage=1;list();document.getElementById('statusFilter').focus()}

let createFromCalendar=false,creationDate=null,lastCreatedTask=null;
let view='list',month=new Date(today.getFullYear(),today.getMonth(),1),selectedDay=new Date(today);
const keyDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const monthFmt=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric'});
const fullDayFmt=new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const listIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 5h10M7 10h10M7 15h10M3 5h1M3 10h1M3 15h1"/></svg>';
const calIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M6 2v4M14 2v4M3 8h14M6 11h2M11 11h2M6 14h2"/></svg>';
const calendarDate=t=>t.start;
function plannedLabel(t){return t.status==='To Do'&&t.start&&t.start>today?`<span class="planned-label">Starts ${dateLabel(t.start)}</span>`:''}
function startLabel(t){return t.start?'Start '+dateLabel(t.start):'Start date unavailable'}
function beginCalendarCreate(key){const d=new Date(key+'T00:00:00');const now=new Date();now.setHours(0,0,0,0);if(!Number.isFinite(d.getTime())||d<now)return;creationDate=key;createFromCalendar=true;document.getElementById('calendarDay').close();location.hash='create-task'}
function dayCreateButton(d){return d>=today?`<button class="day-create" data-create-day="${keyDate(d)}" aria-label="Create task starting ${fullDayFmt.format(d)}">+ <span>Create Task</span></button>`:''}
function compactRow(t){return `<div class="task-row"><a class="task-main" href="#task/${t.id}"><span class="title">${esc(t.title)}</span><span class="summary">${esc(t.desc.split('\n')[0])}</span><span class="row-meta">${t.id}${t.start?` · ${startLabel(t)}`:''}</span>${plannedLabel(t)}</a><div class="datebox">${status(t)} ${deadline(t)}<span class="compact-due">Due: ${dateLabel(t.due)}</span></div></div>`}
function tableRow(t){return `<div class="task-row task-table-row"><a class="task-code" data-label="Code" href="#task/${t.id}">${esc(t.id)}</a><a href="#task/${t.id}" class="task-main" data-label="Title"><span class="title">${esc(t.title)}</span></a><span class="task-description" data-label="Description" title="${esc(t.desc)}">${esc(t.desc.split('\n')[0])}</span><span class="task-start" data-label="Start Date">${t.start?dateLabel(t.start):'—'}</span><span class="datebox" data-label="Due Date">${dateLabel(t.due)}${deadline(t)}</span><span class="creator-column muted" data-label="Created By">${esc(t.creator)}</span><span class="status-column" data-label="Status">${status(t)}</span><a href="#task/${t.id}" class="chev" aria-label="View ${esc(t.title)}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></a></div>`}
function visibleTasks(){return tasks.filter(isMine).filter(matchesSearch).filter(matchesStatus).filter(t=>currentDeadlineFilter==='all'||urgency(t)===currentDeadlineFilter)}
function eventCard(t){const u=urgency(t),term=['Complete','Cancel'].includes(t.status);return `<a href="#task/${t.id}" class="event ${u} ${term?'terminal':''}" title="${esc(t.title+' · '+t.id+' · '+t.status+' · '+startLabel(t)+' · Due '+dateLabel(t.due))}" aria-label="${esc(t.title+', '+t.status+', due '+dateLabel(t.due))}"><span class="event-title">${esc(t.title)}</span><span class="event-meta"><span>${esc(t.status)}</span>${u?`<span class="urgency">${u==='overdue'?'Overdue':'Due Soon'}</span>`:''}</span><span class="event-date">Due: ${dateLabel(t.due)}</span></a>`}

let pickerYear=month.getFullYear();
const shortMonths=Array.from({length:12},(_,i)=>new Intl.DateTimeFormat('en-GB',{month:'short'}).format(new Date(2026,i,1)));
function renderMonthPicker(){
const picker=document.getElementById('monthPicker');
picker.innerHTML=`<div class="picker-header"><button class="picker-year-step" type="button" data-picker-year="-1" aria-label="Previous year">‹</button><h2 id="monthPickerTitle" aria-live="polite">${pickerYear}</h2><button class="picker-year-step" type="button" data-picker-year="1" aria-label="Next year">›</button></div><div class="picker-months" role="group" aria-label="Choose month">${shortMonths.map((label,i)=>{const selected=pickerYear===month.getFullYear()&&i===month.getMonth(),current=pickerYear===today.getFullYear()&&i===today.getMonth();return `<button type="button" data-picker-month="${i}" class="picker-month ${selected?'chosen':''}" aria-pressed="${selected}" aria-label="${new Intl.DateTimeFormat('en-GB',{month:'long'}).format(new Date(pickerYear,i,1))} ${pickerYear}${current?', this month':''}">${label}${current?'<span class="current-month-dot" aria-hidden="true"></span>':''}</button>`}).join('')}</div><div class="picker-footer"><button class="picker-current" type="button" data-picker-current>This month</button><span>A dot marks this month</span></div>`;
picker.querySelectorAll('[data-picker-year]').forEach(b=>b.onclick=()=>{pickerYear+=Number(b.dataset.pickerYear);renderMonthPicker();picker.querySelector(`[data-picker-year="${b.dataset.pickerYear}"]`).focus()});
picker.querySelectorAll('[data-picker-month]').forEach(b=>b.onclick=()=>chooseCalendarMonth(pickerYear,Number(b.dataset.pickerMonth)));
picker.querySelector('[data-picker-current]').onclick=()=>chooseCalendarMonth(today.getFullYear(),today.getMonth());
}
function positionMonthPicker(){const trigger=document.getElementById('monthPickerTrigger'),picker=document.getElementById('monthPicker');if(!trigger||picker.hidden)return;const r=trigger.getBoundingClientRect(),width=Math.min(300,innerWidth-24),height=picker.offsetHeight||300;picker.style.width=width+'px';picker.style.left=Math.max(12,Math.min(r.left,innerWidth-width-12))+'px';picker.style.top=Math.max(12,r.bottom+height+8<=innerHeight-12?r.bottom+8:r.top-height-8)+'px';picker.style.maxHeight=(innerHeight-24)+'px'}
function openMonthPicker(){const picker=document.getElementById('monthPicker');pickerYear=month.getFullYear();renderMonthPicker();picker.hidden=false;document.getElementById('monthPickerTrigger').setAttribute('aria-expanded','true');positionMonthPicker();picker.querySelector(`[data-picker-month="${month.getMonth()}"]`).focus()}
function closeMonthPicker(restoreFocus=true){const picker=document.getElementById('monthPicker');if(!picker||picker.hidden)return;picker.hidden=true;const trigger=document.getElementById('monthPickerTrigger');trigger?.setAttribute('aria-expanded','false');if(restoreFocus)trigger?.focus()}
function chooseCalendarMonth(year,index){closeMonthPicker(false);month=new Date(year,index,1);selectedDay=year===today.getFullYear()&&index===today.getMonth()?new Date(today):new Date(month);list();document.getElementById('monthPickerTrigger').focus()}
document.addEventListener('click',e=>{if(!e.target.closest('#monthPicker,#monthPickerTrigger'))closeMonthPicker(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('monthPicker').hidden){e.preventDefault();closeMonthPicker()}});
document.getElementById('monthPicker').onkeydown=e=>{const b=e.target.closest('[data-picker-month]');if(!b)return;const i=Number(b.dataset.pickerMonth),offset={ArrowLeft:-1,ArrowRight:1,ArrowUp:-3,ArrowDown:3}[e.key];let next;if(offset!==undefined)next=(i+offset+12)%12;else if(e.key==='Home')next=0;else if(e.key==='End')next=11;else return;e.preventDefault();document.getElementById('monthPicker').querySelector(`[data-picker-month="${next}"]`).focus()};
document.addEventListener('focusin',e=>{if(!e.target.closest('#monthPicker,#monthPickerTrigger'))closeMonthPicker(false)});
window.addEventListener('scroll',()=>closeMonthPicker(false));
window.addEventListener('resize',positionMonthPicker);
function calendar(visible){
const start=new Date(month);start.setDate(1-((start.getDay()+6)%7));
const cells=Math.ceil((((month.getDay()+6)%7)+new Date(month.getFullYear(),month.getMonth()+1,0).getDate())/7)*7;
let days='';for(let i=0;i<cells;i++){const d=new Date(start);d.setDate(d.getDate()+i);const key=keyDate(d),rows=visible.filter(t=>calendarDate(t)&&keyDate(calendarDate(t))===key);
const limit=window.innerWidth<=1100?2:3;
days+=`<div class="day ${d.getMonth()!==month.getMonth()?'other':''} ${key===keyDate(today)?'today':''} ${key===keyDate(selectedDay)?'selected':''}"><button class="date-number" data-day="${key}" aria-label="${fullDayFmt.format(d)}, ${rows.length} tasks" ${key===keyDate(today)?'aria-current="date"':''}>${d.getDate()}</button>${dayCreateButton(d)}<div class="day-items">${rows.slice(0,limit).map(eventCard).join('')}${rows.length>limit?`<button class="more" data-day="${key}">+${rows.length-limit} more</button>`:''}</div><span class="mobile-count">${rows.length?rows.length+' task'+(rows.length>1?'s':''):'&nbsp;'}</span></div>`}
const monthly=visible.filter(t=>calendarDate(t)&&calendarDate(t).getMonth()===month.getMonth()&&calendarDate(t).getFullYear()===month.getFullYear());
const selected=visible.filter(t=>calendarDate(t)&&keyDate(calendarDate(t))===keyDate(selectedDay));
return `<div class="calendar-controls"><div class="month-controls"><button class="calendar-icon" data-month="-1" aria-label="Previous month">‹</button><button class="month-trigger" id="monthPickerTrigger" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="monthPicker"><span aria-live="polite">${monthFmt.format(month)}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m2 4 4 4 4-4"/></svg></button><button class="calendar-icon" data-month="1" aria-label="Next month">›</button><button class="btn" data-today>Today</button></div></div><div class="calendar-scroll" role="region" aria-label="Task calendar" tabindex="0"><div class="calendar-grid">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<div class="weekday">${d}</div>`).join('')}${days}</div>${!monthly.length?`<p class="month-empty">No tasks ${currentStatusFilter!=='all'||currentDeadlineFilter!=='all'?'match your filters':'are scheduled'} this month. Browse another month or select Today.</p>`:''}<section class="mobile-agenda" aria-label="Selected day tasks"><div class="agenda-heading"><h3>${fullDayFmt.format(selectedDay)}</h3>${dayCreateButton(selectedDay)}</div>${selected.length?selected.map(compactRow).join(''):'<p class="muted">No tasks scheduled for this day.</p>'}</section></div>`;
}
function showDay(key){selectedDay=new Date(key+'T00:00:00');if(window.innerWidth<=700){list();return}const rows=visibleTasks().filter(t=>calendarDate(t)&&keyDate(calendarDate(t))===key);document.getElementById('dayTitle').textContent=fullDayFmt.format(selectedDay);document.getElementById('dayList').innerHTML=rows.length?rows.map(compactRow).join(''):'<p class="muted" style="padding:24px 0">No tasks scheduled for this day.</p>';document.getElementById('dayList').innerHTML+=dayCreateButton(selectedDay);document.getElementById('dayList').querySelectorAll('[data-create-day]').forEach(b=>b.onclick=()=>beginCalendarCreate(b.dataset.createDay));document.getElementById('calendarDay').showModal()}
// Pagination operates on the filtered List only; Calendar keeps the full matching set.
function taskPageNumbers(total){
 if(total<=7)return Array.from({length:total},(_,i)=>i+1);
 const start=taskPage<=4?1:taskPage>=total-3?total-4:taskPage-2;
 const pages=new Set([1,total,...Array.from({length:5},(_,i)=>start+i)]);
 const ordered=[...pages].sort((a,b)=>a-b),items=[];
 ordered.forEach((page,i)=>{if(i&&page-ordered[i-1]>1)items.push('ellipsis');items.push(page)});
 return items;
}
function taskPagination(total){
 const pages=Math.max(1,Math.ceil(total/taskPageSize));
 const start=total?(taskPage-1)*taskPageSize+1:0,end=Math.min(taskPage*taskPageSize,total);
 const button=(page,label,extra='')=>`<button type="button" class="task-page-button ${extra}" data-task-page="${page}" ${!total||page<1||page>pages?'disabled':''}>${label}</button>`;
 return `<footer class="task-pagination"><div class="task-pagination-summary"><label for="taskPageSize">Rows Per Page:</label><select id="taskPageSize">${taskPageSizes.map(size=>`<option value="${size}" ${size===taskPageSize?'selected':''}>${size}</option>`).join('')}</select><span class="task-page-range" role="status" aria-live="polite">${start} - ${end} of ${total}</span></div><nav class="task-page-navigation" aria-label="Task list pagination">${button(taskPage===1?0:1,'First','text')}${button(taskPage-1,'<span aria-hidden="true">‹</span><span class="sr-only">Previous page</span>')}${taskPageNumbers(pages).map(page=>page==='ellipsis'?'<span class="task-page-ellipsis" aria-hidden="true">…</span>':`<button type="button" class="task-page-button number" data-task-page="${page}" aria-label="Page ${page}" ${page===taskPage?'aria-current="page"':''} ${!total?'disabled':''}>${page}</button>`).join('')}${button(taskPage+1,'<span aria-hidden="true">›</span><span class="sr-only">Next page</span>')}${button(taskPage===pages?pages+1:pages,'Last','text')}</nav></footer>`;
}
function bindTaskPagination(){
 if(view!=='list')return;
 const total=visibleTasks().length,pages=Math.max(1,Math.ceil(total/taskPageSize));
 function go(page,focusPage=true){
  if(!Number.isInteger(page)||page<1||page>pages||!total)return;
  taskPage=page;list();
  if(focusPage)main.querySelector('.task-page-button[aria-current="page"]')?.focus({preventScroll:true});
 }
 main.querySelectorAll('[data-task-page]').forEach(button=>button.onclick=()=>go(Number(button.dataset.taskPage)));
 document.getElementById('taskPageSize').onchange=event=>{
  const size=Number(event.target.value);if(!taskPageSizes.includes(size))return;
  taskPageSize=size;taskPage=1;list();document.getElementById('taskPageSize').focus({preventScroll:true});
 };

}

function list(){
closeMonthPicker(false);
if(terminalStatusSelected())currentDeadlineFilter='all';
const mine=tasks.filter(isMine).filter(matchesSearch),statusTasks=mine.filter(matchesStatus),visible=visibleTasks();
const filtered=Boolean(searchQuery)||currentStatusFilter!=='all'||currentDeadlineFilter!=='all';
taskPage=Math.max(1,Math.min(taskPage,Math.max(1,Math.ceil(visible.length/taskPageSize))));
const pageRows=visible.slice((taskPage-1)*taskPageSize,taskPage*taskPageSize);
main.innerHTML=`<div class="page-head"><h1 tabindex="-1">Manage Tasks</h1><a class="btn primary create-entry" data-create-entry href="#create-task">Create Task</a></div><form id="taskSearchForm" class="task-search-toolbar" role="search" aria-label="Search tasks"><div class="task-search-field"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></svg><input id="taskSearch" type="search" name="taskSearch" aria-label="Search tasks by code or title" placeholder="Search" autocomplete="off" value="${esc(searchDraft)}"></div></form><div class="creation-notice" id="creationNotice" role="status" hidden><span id="creationMessage"></span><button class="clear-filters" id="revealCreated" hidden>Clear filters</button></div><section class="panel" aria-label="Manage Tasks"><div class="filter-toolbar"><div class="deadline-controls"><span class="filter-label">Deadline:</span><div class="deadline-filters" role="group" aria-label="Deadline filter">${[['all','All'],['soon','Due Soon'],['overdue','Overdue']].map(([key,label])=>`<button class="deadline-filter" data-deadline-filter="${key}" aria-pressed="${currentDeadlineFilter===key}" ${terminalStatusSelected()&&key!=='all'?'disabled':''}>${label}<span class="filter-count">${statusTasks.filter(t=>key==='all'||urgency(t)===key).length}</span></button>`).join('')}</div></div><div class="task-toolbar-right"><div class="status-filter"><label for="statusFilter">Status</label><select id="statusFilter">${['all','To Do','In Progress','Complete','Cancel'].map(s=>`<option value="${s}" ${currentStatusFilter===s?'selected':''}>${s==='all'?'All statuses':s}</option>`).join('')}</select></div><div class="view-switch" role="group" aria-label="Task view"><button data-view="list" aria-pressed="${view==='list'}">${listIcon}List</button><button data-view="calendar" aria-pressed="${view==='calendar'}">${calIcon}Calendar</button></div>${filtered?'<button class="clear-filters" data-clear-filters>Clear filters</button>':''}</div>${terminalStatusSelected()?'<p class="filter-help">Deadline filters apply to To Do and In Progress tasks.</p>':''}</div>${view==='calendar'?calendar(visible):`<div class="task-table-scroll" role="region" aria-label="Task table" tabindex="0"><div class="tablehead"><span>Code</span><span>Title</span><span>Description</span><span>Start Date</span><span>Due Date</span><span class="creator-column">Created By</span><span>Status</span><span></span></div><div class="task-list-rows">${visible.length?pageRows.map(tableRow).join(''):'<div class="empty"><h2>No tasks match your filters</h2><p class="muted">Try another search, status or deadline filter.</p><button class="btn" data-clear-filters>Clear filters</button></div>'}</div></div>${taskPagination(visible.length)}`}</section>`;
bindChanges();bindTaskPagination();
const searchInput=document.getElementById('taskSearch');
searchInput.oninput=()=>{searchDraft=searchInput.value};
document.getElementById('taskSearchForm').onsubmit=event=>{event.preventDefault();searchQuery=searchDraft.trim();taskPage=1;list();document.getElementById('taskSearch').focus()};
main.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;list();main.querySelector(`[data-view="${view}"]`).focus()});
document.getElementById('statusFilter').onchange=e=>{currentStatusFilter=e.target.value;taskPage=1;list();document.getElementById('statusFilter').focus()};
main.querySelectorAll('[data-clear-filters]').forEach(b=>b.onclick=resetFilters);
main.querySelectorAll('[data-deadline-filter]').forEach(b=>b.onclick=()=>{currentDeadlineFilter=b.dataset.deadlineFilter;taskPage=1;list();main.querySelector(`[data-deadline-filter="${currentDeadlineFilter}"]`).focus()});
main.querySelectorAll('[data-month]').forEach(b=>b.onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+Number(b.dataset.month),1);selectedDay=new Date(month);list();main.querySelector(`[data-month="${b.dataset.month}"]`).focus()});
main.querySelector('#monthPickerTrigger')?.addEventListener('click',()=>{document.getElementById('monthPicker').hidden?openMonthPicker():closeMonthPicker()});
main.querySelector('[data-today]')?.addEventListener('click',()=>{month=new Date(today.getFullYear(),today.getMonth(),1);selectedDay=new Date(today);list();main.querySelector('[data-today]').focus()});
main.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>showDay(b.dataset.day));
main.querySelectorAll('[data-create-day]').forEach(b=>b.onclick=()=>beginCalendarCreate(b.dataset.createDay));
main.querySelector('[data-create-entry]').onclick=()=>{creationDate=null;createFromCalendar=false};
if(lastCreatedTask){const t=lastCreatedTask;document.getElementById('creationNotice').hidden=false;document.getElementById('creationMessage').textContent=visible.some(x=>x.id===t.id)?'Task created. Planned start: '+dateLabel(t.start)+'.':'Task created. Your current filters hide this task.';document.getElementById('revealCreated').hidden=visible.some(x=>x.id===t.id);document.getElementById('revealCreated').onclick=()=>{resetFilters()}}
}
document.querySelector('#calendarDay .dialog-close').onclick=()=>document.getElementById('calendarDay').close();
document.getElementById('dayList').onclick=e=>{if(e.target.closest('a'))document.getElementById('calendarDay').close()};
let resizeWidth=innerWidth;window.addEventListener('resize',()=>{if((resizeWidth<=700)!==(innerWidth<=700)||(resizeWidth<=1100)!==(innerWidth<=1100)){resizeWidth=innerWidth;if(!location.hash||location.hash==='#tasks')list()}else resizeWidth=innerWidth});
let taskWorkspaceReturn=null,taskWorkspaceScroll=0,taskWorkspaceRowsScroll=0,taskSaving=false;
const drawerBackdrop=document.getElementById('taskDrawerBackdrop');
function activeTaskDrawer(){const drawer=document.getElementById('taskWorkspaceDrawer');return drawer.hidden?null:drawer}
function syncTaskDrawer(){const open=Boolean(activeTaskDrawer());drawerBackdrop.hidden=!open;document.body.classList.toggle('task-drawer-open',open);document.querySelector('.global-header').inert=open;main.inert=open;const sidebar=document.getElementById('taskSidebar');if(sidebar)sidebar.inert=open;}
drawerBackdrop.onclick=dismissTaskWorkspace;
document.addEventListener('keydown',e=>{const drawer=activeTaskDrawer();if(!drawer||document.querySelector('dialog[open]')||e.key!=='Tab')return;const nodes=Array.from(drawer.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')).filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(!first){e.preventDefault();drawer.querySelector('h2').focus();return}if(e.shiftKey&&(document.activeElement===first||!nodes.includes(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!nodes.includes(document.activeElement))){e.preventDefault();first.focus()}});
document.addEventListener('focusin',e=>{const drawer=activeTaskDrawer();if(drawer&&!document.querySelector('dialog[open]')&&!drawer.contains(e.target))drawer.querySelector('h2').focus({preventScroll:true})});
function openTaskWorkspace(title,mode='detail'){const drawer=document.getElementById('taskWorkspaceDrawer');drawer.classList.toggle('is-create-modal',mode==='create');document.getElementById('closeTaskWorkspace').setAttribute('aria-label',mode==='create'?'Close create task':'Close task drawer');if(drawer.hidden&&!taskWorkspaceReturn){taskWorkspaceReturn=document.activeElement;taskWorkspaceScroll=window.scrollY;taskWorkspaceRowsScroll=main.querySelector('.task-list-rows')?.scrollTop||0}drawer.hidden=false;closeMonthPicker(false);window.HrmNotifications?.close?.();const footer=document.getElementById('taskWorkspaceFooter');footer.hidden=true;footer.innerHTML='';syncTaskDrawer();document.getElementById('taskWorkspaceTitle').textContent=title;document.getElementById('taskWorkspaceTitle').focus({preventScroll:true});document.getElementById('taskWorkspaceBody').scrollTop=0;return document.getElementById('taskWorkspaceBody')}
const createTaskExitDialog=document.getElementById('createTaskExitDialog');
let createTaskExitReturnFocus=null;
function finishCreateTaskExit(confirmed){
 if(!createTaskExitDialog.open)return;
 createTaskExitDialog.close();document.body.classList.remove('task-exit-confirm-open');
 if(!confirmed){if(createTaskExitReturnFocus?.isConnected)createTaskExitReturnFocus.focus({preventScroll:true});return}
 creationDate=null;createFromCalendar=false;location.hash='tasks';
}
function dismissTaskWorkspace(){
 if(taskSaving||statusSaving)return;
 const drawer=document.getElementById('taskWorkspaceDrawer');
 if(!drawer.hidden&&drawer.classList.contains('is-create-modal')){
  if(createTaskExitDialog.open)return;
  createTaskExitReturnFocus=document.activeElement;document.body.classList.add('task-exit-confirm-open');
  createTaskExitDialog.showModal();document.getElementById('createTaskStay').focus();return;
 }
 if(location.hash!=='#tasks')location.hash='tasks';else route();
}
document.getElementById('createTaskStay').onclick=()=>finishCreateTaskExit(false);
document.getElementById('createTaskLeave').onclick=()=>finishCreateTaskExit(true);
createTaskExitDialog.addEventListener('cancel',e=>{e.preventDefault();finishCreateTaskExit(false)});
document.getElementById('closeTaskWorkspace').onclick=dismissTaskWorkspace;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('taskWorkspaceDrawer').hidden&&!document.querySelector('dialog[open]')){e.preventDefault();dismissTaskWorkspace()}});
function details(t){const main=openTaskWorkspace(t.title);const attachments=t.attachments||(t.file?[t.file]:[]);main.innerHTML=`<a class="back" href="#tasks">‹ Back to My Tasks</a><div class="page-head"><div class="detail-title"><h1 tabindex="-1">${esc(t.title)}</h1></div><p class="muted">${esc(t.id)}</p></div><div class="detail-grid"><section class="panel" aria-label="Task details"><div class="section"><h2>Description</h2><p class="description">${esc(t.desc||'No description provided')}</p></div><div class="section"><h2>Attachments${attachments.length?` <span class="count">${attachments.length}</span>`:''}</h2>${attachments.length?attachments.map((f,i)=>`<div class="attachment"><div style="flex:1"><div class="file-name">${esc(f.name)}</div><p class="muted">${f.size?`${Math.ceil(f.size/1024)} KB`:'Sample attachment · TXT'}</p></div><button class="btn" data-download="${i}">Download</button></div>`).join(''):'<p class="muted">No attachments</p>'}</div></section><aside class="panel" aria-label="Task information"><div class="section"><h2>Task Information</h2><dl class="props"><div><dt>Status</dt><dd>${status(t)}</dd></div><div><dt>Start Date</dt><dd>${t.start?dateLabel(t.start):'Start date unavailable'}${plannedLabel(t)}</dd></div><div><dt>Due Date</dt><dd class="datebox">${dateLabel(t.due)} ${deadline(t)}</dd></div><div><dt>Assignee</dt><dd>${esc((people.find(u=>u.id===(t.assignee||currentUser.id))||currentUser).name)}</dd></div><div><dt>Created By</dt><dd>${esc(t.creator)}</dd></div><div><dt>Created At</dt><dd>${t.created}</dd></div></dl></div></aside></div>`;if(allowed(t).length){const footer=document.getElementById('taskWorkspaceFooter');footer.innerHTML=`${t.status==='To Do'&&t.start&&t.start>new Date()?'<p class="early-start-help">Starting now will move this task to In Progress before its planned start date.</p>':''}<div class="task-status-actions">${changeButton(t)}</div>`;footer.hidden=false;bindChanges(footer)}main.querySelectorAll('[data-download]').forEach(b=>b.onclick=()=>{const f=attachments[Number(b.dataset.download)];if(!f.blob&&f.text===undefined){showTaskNotice('This attachment is unavailable in this browser.');return}const u=URL.createObjectURL(f.blob||new Blob([f.text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)})}
function home(){main.innerHTML=`<div class="home-identity"><p style="margin-bottom:8px">Welcome back</p><h1 tabindex="-1">Nguyễn Quang</h1><p>FPT Software JSC</p></div><section class="panel"><div class="home-card"><div><h2>Action Items <span class="count">${tasks.filter(isMine).length}</span></h2><p class="muted">Things that need your attention</p></div><a class="btn" href="#tasks">View All</a></div><div style="padding:0 24px 20px">${tasks.filter(isMine).slice(0,3).map(t=>`<div class="home-item"><a href="#task/${t.id}">${esc(t.title)}</a>${deadline(t)}</div>`).join('')}</div></section><p class="notice">Entry-point preview · sample data</p>`}
function createTask(){
const main=openTaskWorkspace('Create Task','create');
const localDate=new Date();const minDate=`${localDate.getFullYear()}-${String(localDate.getMonth()+1).padStart(2,'0')}-${String(localDate.getDate()).padStart(2,'0')}`;
const initialStart=creationDate&&creationDate>=minDate?creationDate:minDate;
main.innerHTML=`<div class="create-shell"><section class="panel"><form class="task-form" id="createTaskForm" novalidate><div class="form-field"><label for="taskName">Task Name <span class="required-mark" aria-hidden="true">*</span></label><input id="taskName" name="title" required maxlength="200" placeholder="What needs to be done?" aria-describedby="nameError"><p class="form-error" id="nameError" hidden></p></div><div class="form-field"><label for="assignee">Assignee <span class="required-mark" aria-hidden="true">*</span></label><input id="assignee" list="assigneeOptions" required autocomplete="off" value="${esc(personLabel(currentUser))}" aria-describedby="assigneeError"><datalist id="assigneeOptions">${people.map(u=>`<option value="${esc(personLabel(u))}"></option>`).join('')}</datalist><p class="form-error" id="assigneeError" hidden></p></div><div class="form-grid date-grid"><div class="form-field"><label for="startDate">Start Date <span class="required-mark" aria-hidden="true">*</span></label><input id="startDate" name="startDate" type="date" required min="${minDate}" value="${initialStart}" aria-describedby="startError"><p class="form-error" id="startError" hidden></p></div><div class="form-field"><label for="dueDate">Due Date</label><input id="dueDate" type="date" min="${initialStart}" aria-describedby="dueError"><p class="form-error" id="dueError" hidden></p></div></div><div class="form-field"><label for="taskDescription">Description</label><textarea id="taskDescription" placeholder="Add context, instructions and the expected result."></textarea></div><div class="form-field"><label for="taskAttachments">Attachments</label><div class="upload-area"><input id="taskAttachments" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt" aria-describedby="uploadHelp uploadError"><p class="field-help" id="uploadHelp">Up to 5 files, 10 MB each. PDF, Word, Excel, PNG, JPG or TXT.</p><p class="form-error" id="uploadError" hidden></p><div id="draftFiles"></div></div></div><div class="form-footer"><button class="btn" type="button" id="cancelCreate">Cancel</button><button class="btn primary" type="submit" id="submitTask">Create Task</button></div></form></section></div>`;
const footer=document.getElementById('taskWorkspaceFooter');footer.appendChild(main.querySelector('.form-footer'));footer.hidden=false;document.getElementById('submitTask').setAttribute('form','createTaskForm');
let draftFiles=[];let submitting=false;
const form=document.getElementById('createTaskForm');
function error(id,msg){const e=document.getElementById(id);e.textContent=msg;e.hidden=!msg;const control={nameError:'taskName',assigneeError:'assignee',startError:'startDate',dueError:'dueDate',uploadError:'taskAttachments'}[id];document.getElementById(control).setAttribute('aria-invalid',String(Boolean(msg)))}
function renderFiles(){document.getElementById('draftFiles').innerHTML=draftFiles.map((f,i)=>`<div class="draft-file"><span>${esc(f.name)} · ${Math.ceil(f.size/1024)} KB</span><button class="btn" type="button" data-remove-file="${i}" aria-label="Remove ${esc(f.name)}">Remove</button></div>`).join('');main.querySelectorAll('[data-remove-file]').forEach(b=>b.onclick=()=>{draftFiles.splice(Number(b.dataset.removeFile),1);error('uploadError','');renderFiles()})}
document.getElementById('taskAttachments').onchange=e=>{const files=Array.from(e.target.files);const ext=/\.(pdf|docx?|xlsx?|png|jpe?g|txt)$/i;let msg='';if(draftFiles.length+files.length>5)msg='Attach up to 5 files.';else if(files.some(f=>f.size>10*1024*1024))msg='Each file must be 10 MB or smaller.';else if(files.some(f=>!ext.test(f.name)))msg='Choose a supported file type.';error('uploadError',msg);if(!msg){draftFiles.push(...files);renderFiles()}e.target.value=''};
document.getElementById('cancelCreate').onclick=dismissTaskWorkspace;
document.getElementById('startDate').onchange=()=>{const start=document.getElementById('startDate');const due=document.getElementById('dueDate');due.min=start.value||minDate;error('startError',!start.value||start.value<keyDate(new Date())||!start.validity.valid?'Choose today or a future start date.':'');error('dueError',due.value&&start.value&&due.value<start.value?'Due date must be on or after the start date.':'')};
document.getElementById('dueDate').onchange=()=>{const due=document.getElementById('dueDate'),start=document.getElementById('startDate');error('dueError',due.value&&((start.value&&due.value<start.value)||!due.validity.valid)?'Due date must be on or after the start date.':'')};
form.onsubmit=async e=>{e.preventDefault();if(submitting)return;const title=document.getElementById('taskName').value.trim();const person=people.find(u=>personLabel(u)===document.getElementById('assignee').value);const dueValue=document.getElementById('dueDate').value;const startValue=document.getElementById('startDate').value;const currentMin=keyDate(new Date());const badStart=!startValue||startValue<currentMin||!document.getElementById('startDate').validity.valid;const badDate=dueValue&&((startValue&&dueValue<startValue)||!document.getElementById('dueDate').validity.valid);error('nameError',!title?'Enter a task name.':title.length>200?'Use 200 characters or fewer.':'');error('assigneeError',person?'':'Select a person from the suggestions.');error('startError',badStart?'Choose today or a future start date.':'');error('dueError',badDate?'Due date must be on or after the start date.':'');if(!title||title.length>200||!person||badStart||badDate){form.querySelector('[aria-invalid="true"]')?.focus();return}submitting=true;taskSaving=true;document.getElementById('closeTaskWorkspace').disabled=true;document.getElementById('cancelCreate').disabled=true;document.getElementById('submitTask').disabled=true;const now=new Date();const id='TSK-'+String(Math.max(0,...tasks.map(t=>Number(t.id.slice(4))).filter(Number.isFinite))+1).padStart(4,'0');tasks.push({id,type:'manual',title,start:new Date(startValue+'T00:00:00'),createdAt:now.toISOString(),desc:document.getElementById('taskDescription').value.trim(),due:dueValue?new Date(dueValue+'T00:00:00'):null,assignee:person.id,creator:currentUser.name,created:fmt.format(now)+', '+now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),status:'To Do',attachments:draftFiles.map(f=>({name:f.name,size:f.size,blob:f}))});try{await window.HrmTaskStore.save()}catch{tasks.pop();submitting=false;taskSaving=false;document.getElementById('closeTaskWorkspace').disabled=false;document.getElementById('cancelCreate').disabled=false;document.getElementById('submitTask').disabled=false;showTaskNotice('Could not save the task. Please try again.');return}taskSaving=false;document.getElementById('closeTaskWorkspace').disabled=false;if(createFromCalendar){const t=tasks[tasks.length-1];lastCreatedTask=t;view='calendar';month=new Date(t.start.getFullYear(),t.start.getMonth(),1);selectedDay=new Date(t.start);location.hash='tasks'}else location.hash='task/'+id;creationDate=null;createFromCalendar=false;const toast=document.getElementById('statusToast');toast.textContent='Task created and assigned to '+person.name;toast.hidden=false;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.hidden=true,3500)};
}

function route(){
if(createTaskExitDialog.open&&location.hash!=='#create-task')finishCreateTaskExit(false);
closeMonthPicker(false);
const h=location.hash.slice(1)||'tasks';
if(h==='home'){location.assign('features/dashboard/index.html');return}
if(h==='tickets'){location.assign('features/tickets/my-tickets/index.html#my-tickets');return}
if(h==='create-task'||h.startsWith('task/')){
if(!main.innerHTML)list();
if(h==='create-task')createTask();else{const t=tasks.find(x=>x.id===h.slice(5)&&isMine(x));if(t)details(t);else{const body=openTaskWorkspace('Task not found');body.innerHTML='<section class="panel empty"><p>This task is unavailable.</p></section>'}}
return;
}
const drawer=document.getElementById('taskWorkspaceDrawer'),wasOpen=!drawer.hidden,returnHref=taskWorkspaceReturn?.getAttribute?.('href'),returnDay=taskWorkspaceReturn?.dataset?.createDay;
drawer.hidden=true;document.getElementById('taskWorkspaceBody').innerHTML='';document.getElementById('taskWorkspaceFooter').innerHTML='';document.getElementById('taskWorkspaceFooter').hidden=true;syncTaskDrawer();
list();
if(wasOpen){window.scrollTo(0,taskWorkspaceScroll);const rows=main.querySelector('.task-list-rows');if(rows)rows.scrollTop=taskWorkspaceRowsScroll;if(taskWorkspaceReturn?.isConnected)taskWorkspaceReturn.focus({preventScroll:true});else{const target=returnHref?Array.from(main.querySelectorAll('a[href]')).find(a=>a.getAttribute('href')===returnHref):returnDay?main.querySelector(`[data-create-day="${returnDay}"]`):null;(target||main.querySelector('.create-entry'))?.focus({preventScroll:true})}taskWorkspaceReturn=null}else main.querySelector('h1')?.focus({preventScroll:true});
}
document.getElementById('dismissStatus').onclick=()=>{if(!statusSaving){document.getElementById('statusDialog').close();pendingTask=null;pendingStatus=null}};
document.getElementById('statusDialog').addEventListener('cancel',e=>{if(statusSaving)e.preventDefault();else{pendingTask=null;pendingStatus=null}});
document.getElementById('statusForm').onsubmit=async e=>{e.preventDefault();await saveTaskStatus(pendingTask,pendingStatus)};window.addEventListener('hashchange',route);route();

})();
