const dashboardNow=new Date();
const referenceDate=new Date(dashboardNow.getFullYear(),dashboardNow.getMonth(),dashboardNow.getDate());
const mockDue=days=>{
  const date=new Date(referenceDate.getFullYear(),referenceDate.getMonth(),referenceDate.getDate()+days);
  return `Due ${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
};
const tasks = [
  {title:'Complete Identification Information',description:'Add the missing identification details to your employee profile.',due:'Due 20/09/2026'},
  {title:'Confirm September 2026 Timesheet',description:'Review and confirm your September timesheet before the timesheet lock date.',due:'Due 18/09/2026'},
  {title:'Complete Security Awareness Assessment',description:'Complete the mandatory information security assessment.',due:'Due 12/09/2026'},
  // Prototype-only tasks with relative deadlines keep urgent and normal states reviewable.
  {title:'Confirm Next Week Work Schedule',description:'Review and confirm your upcoming work schedule before it is finalized.',due:mockDue(3)},
  {title:'Review Emergency Contact Details',description:'Check that your emergency contact information is still up to date.',due:mockDue(8)}
];
const learning = [
  {type:'Assessment',title:'Internal Policy Assessment',due:'Due 22/09/2026',image:'assets/learning-policy.png'},
  {type:'Course',title:'Information Security 2026',due:'Due 25/09/2026',image:'assets/learning-security.png'},
  {type:'Course',title:'FPT Culture Training',due:'Due 30/09/2026',image:'assets/learning-culture.png'},
  // Prototype fixtures for validating carousel navigation; not production HR data.
  {type:'Course',title:'Personal Data Protection',due:'Due 05/10/2026',image:'assets/learning-personal-data.png'},
  {type:'Assessment',title:'Information Security Awareness Assessment',due:'Due 10/10/2026',image:'assets/learning-awareness.png'},
  {type:'Course',title:'Workplace Safety Essentials',due:mockDue(0),image:'assets/learning-policy.png'},
  {type:'Assessment',title:'Code of Conduct Assessment',due:mockDue(7),image:'assets/learning-awareness.png'},
  {type:'Course',title:'Effective Collaboration',due:mockDue(8),image:'assets/learning-culture.png'}
];
const groups = [
  {name:'Employee Records & Documents',items:['Update Employee Information','Document Verification & Issuance','Change Personal Information']},
  {name:'Time & Attendance',items:['Request Leave','Attendance Adjustment','Request Overtime']},
  {name:'Accounts & Access',items:['Request Account','Request System Access','IT Support']},
  {name:'Assets & Equipment',items:['Request Asset','Replace / Return Asset','Request Equipment']}
];
const demoState=new URLSearchParams(location.search).get('state');
if(demoState==='empty'){tasks.length=0;learning.length=0;groups.length=0;}
/* ---- Dashboard v2 rendering (content area only) ---- */
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const parseDue=text=>{
  const m=/(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(text||'');
  if(!m)return null;
  const date=new Date(+m[3],+m[2]-1,+m[1]);
  return date.getFullYear()===+m[3]&&date.getMonth()===+m[2]-1&&date.getDate()===+m[1]?date:null;
};
const fmtShort=d=>d?`${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()]}`:'';
function getDeadlineUrgency(dueDate,day=referenceDate){
  if(!dueDate||Number.isNaN(dueDate.getTime()))return null;
  const soonEnd=new Date(day.getFullYear(),day.getMonth(),day.getDate()+7);
  return dueDate<day?'overdue':dueDate<=soonEnd?'due-soon':'normal';
}
const ICON={
  chev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  course:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5M8 7h7"/></svg>',
  exam:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h3v16H5V5h3Z"/><path d="m9 13 2 2 4-4"/></svg>',
  clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  ticket:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4Z"/></svg>',
  hr:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
const GROUP_STYLE=[
  {c:'blue',i:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 13h6M9 17h4"/></svg>'},
  {c:'green',i:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'},
  {c:'violet',i:'<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'},
  {c:'teal',i:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>'}
];
const QUICK=[
  {n:'Request Leave',c:'green',i:'<svg viewBox="0 0 24 24"><path d="M12 3c3 3 4.5 6 4.5 9a4.5 4.5 0 0 1-9 0C7.5 9 9 6 12 3Z"/><path d="M12 21v-6"/></svg>'},
  {n:'Attendance Adjustment',c:'blue',i:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/></svg>'},
  {n:'Request Overtime',c:'amber',i:'<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>'},
  {n:'Update Employee Information',c:'violet',i:'<svg viewBox="0 0 24 24"><circle cx="10" cy="8" r="4"/><path d="M3 21a7 7 0 0 1 10-6.3M17 14l3 3-4 4h-3v-3Z"/></svg>'},
  {n:'IT Support',c:'teal',i:'<svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>'},
  {n:'Request Asset',c:'red',i:'<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>'}
];
function dashboardTasks(){return demoState==='empty'?[]:window.HrmTaskStore.records.filter(t=>window.HrmTaskStore.actionable(t)).map(t=>({...t,description:t.desc,date:t.due,due:t.due?`Due ${String(t.due.getDate()).padStart(2,'0')}/${String(t.due.getMonth()+1).padStart(2,'0')}/${t.due.getFullYear()}`:'No due date',src:t.type==='manual'?'Manual Task':'Approval'}))}
let allTasks=dashboardTasks();
let currentFilter='all';

/* Greeting */
(function(){
  const now=dashboardNow,h=now.getHours();
  const [g,icon]=h<12?['Good morning','<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>']
    :h<18?['Good afternoon','<path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M19 12h2M17 7l1.4-1.4"/><path d="M7 16a5 5 0 0 1 10 0"/><path d="M3 20h18"/>']
    :['Good evening','<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>'];
  document.getElementById('dvGreeting').textContent=g+', Quang';
  document.getElementById('dvGreetIcon').innerHTML=icon;
  document.getElementById('dvToday').textContent=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
})();

/* KPI visuals */
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const worked=3,total=21,leave=5,entitled=14,C=2*Math.PI*24;
  document.getElementById('dvRing').style.strokeDashoffset=String(C*(1-worked/total));
  document.getElementById('dvRingPct').textContent=Math.round(worked/total*100)+'%';
  document.getElementById('dvLeaveBar').style.width=(leave/entitled*100)+'%';
}));

/* Action items */
const taskListElement=document.getElementById('taskList');
function taskRow(t){
  const urgency=getDeadlineUrgency(t.date);
  const status=urgency==='overdue'?'overdue':urgency==='due-soon'?'upcoming':'';
  const pill=status?`<span class="dv-pill ${status==='overdue'?'red':'amber'}">${status==='overdue'?'Overdue':'Due Soon'}</span>`:'';
  const attrs=`data-task-id="${escapeHtml(t.id)}"`;
  const src=escapeHtml(t.src);
  return `<button class="dv-task ${status}" type="button" ${attrs} title="${escapeHtml(t.description||t.title)}">
    <span class="dv-date" aria-hidden="true"><small>${t.date?MONTHS[t.date.getMonth()]:'—'}</small><b>${t.date?String(t.date.getDate()).padStart(2,'0'):'--'}</b></span>
    <span class="dv-task-copy"><span class="dv-task-title">${escapeHtml(t.title)}</span>${t.description?`<span class="dv-task-desc">${escapeHtml(t.description)}</span>`:''}<span class="dv-task-src">${src}</span></span>
    <span class="dv-task-end">${pill}<span class="dv-sub" style="margin:0;white-space:nowrap">${escapeHtml(t.due)}</span><span class="dv-chev">${ICON.chev}</span></span>
  </button>`;
}
function renderTasks(filter=currentFilter){
  currentFilter=filter;
  const urgencyFilter=filter==='upcoming'?'due-soon':filter;
  const list=(filter==='all'?allTasks:allTasks.filter(t=>getDeadlineUrgency(t.date)===urgencyFilter)).slice().sort((a,b)=>(a.date?.getTime()??Infinity)-(b.date?.getTime()??Infinity)).slice(0,5);
  taskListElement.innerHTML=list.length?list.map(taskRow).join('')
    :`<div class="dv-empty"><img class="dashboard-empty-image" src="assets/quick-actions-empty.png" width="289" height="192" alt="No information yet">You're all caught up — no items in this category.</div>`;
  taskListElement.scrollTop=0;
  syncCardReload("dvTasks",!list.length);
}
function renderTaskStats(){
  const n={all:allTasks.length,upcoming:allTasks.filter(t=>getDeadlineUrgency(t.date)==='due-soon').length,overdue:allTasks.filter(t=>getDeadlineUrgency(t.date)==='overdue').length};
  document.querySelectorAll('#dashboard [data-n]').forEach(el=>el.textContent=n[el.dataset.n]);
  syncCardReload('kpi-task-summary',!n.all);
  document.getElementById('dvTaskCount').textContent=n.all;
  document.getElementById('dvTaskTotal').textContent=String(n.all).padStart(2,'0');
  document.getElementById('dvTaskPills').innerHTML=(n.overdue?`<span class="dv-pill red">${n.overdue} overdue</span>`:'')+(n.upcoming?`<span class="dv-pill amber">${n.upcoming} due soon</span>`:'')+(!n.overdue&&!n.upcoming?'<span class="dv-pill gray">Nothing urgent</span>':'');
}

/* Personal Quick Actions — device-local prototype preference, scoped to mock employee. */
const MAX_QUICK_ACTIONS=6;
const QUICK_STORAGE_KEY='hrm-ess:quick-actions:v1:01138569';
const SERVICE_OPTIONS=groups.flatMap((g,gi)=>g.items.map((name,si)=>({id:`service-${gi}-${si}`,n:name,...(QUICK.find(q=>q.n===name)||GROUP_STYLE[gi])})));
const defaults=QUICK.map(q=>SERVICE_OPTIONS.find(s=>s.n===q.n)?.id).filter(Boolean);
let selectedServiceIds=defaults.slice();
try {
 const stored=localStorage.getItem(QUICK_STORAGE_KEY);
 if(stored!==null){const parsed=JSON.parse(stored);if(Array.isArray(parsed))selectedServiceIds=[...new Set(parsed)].filter(id=>SERVICE_OPTIONS.some(s=>s.id===id)).slice(0,MAX_QUICK_ACTIONS);}
}catch { /* Keep safe defaults if the stored preference cannot be read. */ }
const quickCard=document.getElementById('quickCard');
const quickGrid=document.getElementById('dvQuick');
const STAR_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.55 4.44 1.08 6.26L12 17.34l-5.63 2.96 1.08-6.26L2.9 9.6l6.3-.9Z"/></svg>';
function renderQuickActions(){
 const selected=selectedServiceIds.map(id=>SERVICE_OPTIONS.find(s=>s.id===id));
 quickCard.classList.toggle('is-empty',!selected.length);
 quickGrid.classList.toggle('has-fewer',selected.length>0&&selected.length<6);
 quickGrid.style.setProperty('--quick-rows',Math.ceil(selected.length/2)||1);
 quickGrid.innerHTML=selected.length?selected.map(q=>`<button class="dv-qa" type="button" data-open="${escapeHtml(q.n)}"><span class="dv-ico ${q.c}">${q.i}</span>${escapeHtml(q.n)}</button>`).join(''):
 '<div class="dashboard-empty illustrated-empty"><img class="dashboard-empty-image" src="assets/quick-actions-empty.png" width="289" height="192" alt="No information yet"><p>Add services using the stars in Service Catalog.</p></div>';
 syncCardReload('quickCard',!selected.length);
 ['quickSelectionCount','catalogSelectionCount'].forEach(id=>document.getElementById(id).textContent=`${selected.length}/6 selected`);
}
function updateStar(button){
 const selected=selectedServiceIds.includes(button.dataset.quickId);
 const service=SERVICE_OPTIONS.find(s=>s.id===button.dataset.quickId);
 const label=`${selected?'Remove from':'Add to'} Quick Actions: ${service.n}`;
 button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',label);button.title=label;
}
function quickNotice(message){
 window.HrmNotifications?.dismissUndo();document.getElementById('toastUndo').hidden=true;
 document.getElementById('toastMessage').textContent=message;toast.hidden=false;
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true},4500);
}
function toggleQuickAction(button){
 const id=button.dataset.quickId,wasSelected=selectedServiceIds.includes(id);
 if(!wasSelected&&selectedServiceIds.length>=MAX_QUICK_ACTIONS){quickNotice('You can add up to 6 services. Remove one to add another.');return;}
 const next=wasSelected?selectedServiceIds.filter(value=>value!==id):[...selectedServiceIds,id];
 button.disabled=true;button.setAttribute('aria-busy','true');
 try {
  localStorage.setItem(QUICK_STORAGE_KEY,JSON.stringify(next));selectedServiceIds=next;
  renderQuickActions();document.querySelectorAll('[data-quick-id]').forEach(updateStar);
  const service=SERVICE_OPTIONS.find(s=>s.id===id);
  quickNotice(`${service.n} ${wasSelected?'removed from':'added to'} Quick Actions.`);
 }catch {quickNotice('Could not save your Quick Actions. Please try again.');}
 finally {button.disabled=false;button.removeAttribute('aria-busy');}
}
renderQuickActions();

/* Learning carousel (scroll-snap) */
const learningTrack=document.getElementById('learningTrack');
const learningPrevious=document.getElementById('learningPrevious');
const learningNext=document.getElementById('learningNext');
learning.sort((a,b)=>(parseDue(a.due)?.getTime()??Infinity)-(parseDue(b.due)?.getTime()??Infinity));
const dots=document.getElementById('dvDots');
let learningStart=0;
function visibleLearning(){return innerWidth>=1200?3:innerWidth>=768?2:1}
function renderLearning(){
 const visible=visibleLearning();
  learningTrack.innerHTML=learning.length?Array.from({length:Math.min(visible,learning.length)},(_,i)=>learning[(learningStart+i)%learning.length]).map(item=>{
    const urgency=getDeadlineUrgency(parseDue(item.due));
    const badge=urgency==='overdue'?'<span class="dv-pill red">Overdue</span>':urgency==='due-soon'?'<span class="dv-pill amber">Due Soon</span>':'';
    return `<button class="dv-lc" type="button" data-open="${escapeHtml(item.title)}"><span class="dv-lc-media"><img src="${item.image}" alt=""></span><span class="dv-lc-body"><span class="option-type">${item.type}</span><span class="dv-lc-title">${escapeHtml(item.title)}</span><span class="dv-lc-footer">${item.due?`<span class="dv-sub">${escapeHtml(item.due)}</span>`:''}${badge}</span></span></button>`;
  }).join(''):'<p class="module-empty">No required learning at the moment.</p>';
 learningPrevious.hidden=learningNext.hidden=learning.length<=visible;
 learningTrack.style.setProperty('--visible',Math.min(visible,learning.length)||1);
}
const nextDue=learning.map(l=>parseDue(l.due)).filter(Boolean).sort((a,b)=>a-b)[0];
document.getElementById('dvLearnDesc').textContent=`${learning.length} required items${nextDue?` · next due ${fmtShort(nextDue)}`:''}. Complete them by their due dates.`;
function stepLearning(dir){if(!learning.length)return;learningStart=(learningStart+dir+learning.length)%learning.length;renderLearning()}
learningPrevious.addEventListener('click',()=>stepLearning(-1));learningNext.addEventListener('click',()=>stepLearning(1));
learningTrack.addEventListener('keydown',e=>{if(e.target===learningTrack&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();stepLearning(e.key==='ArrowRight'?1:-1)}});
let touchX;
learningTrack.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
learningTrack.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45)stepLearning(delta<0?1:-1)},{passive:true});
window.addEventListener('resize',renderLearning);renderLearning();

/* Service catalog + search */
const serviceGrid=document.getElementById('serviceGrid');
function renderServices(q=''){
  const needle=q.trim().toLowerCase();
  const mark=s=>{if(!needle)return escapeHtml(s);const i=s.toLowerCase().indexOf(needle);return i<0?escapeHtml(s):escapeHtml(s.slice(0,i))+'<mark>'+escapeHtml(s.slice(i,i+needle.length))+'</mark>'+escapeHtml(s.slice(i+needle.length))};
  let shown=0;
  serviceGrid.innerHTML=groups.map((g,gi)=>{
    const st=GROUP_STYLE[gi%GROUP_STYLE.length];
    const items=needle&&!g.name.toLowerCase().includes(needle)?g.items.filter(i=>i.toLowerCase().includes(needle)):g.items;
    shown+=items.length;
    return `<div class="dv-sg" ${items.length?'':'hidden'}><div class="dv-sg-head"><span class="dv-ico ${st.c}">${st.i}</span><div><h3>${escapeHtml(g.name)}</h3><small>${g.items.length} services</small></div></div>${items.map(i=>{const option=SERVICE_OPTIONS.find(s=>s.n===i),selected=selectedServiceIds.includes(option.id),label=`${selected?'Remove from':'Add to'} Quick Actions: ${i}`;return `<div class="dv-service-row"><button type="button" class="dv-service-star" data-quick-id="${option.id}" aria-pressed="${selected}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${STAR_ICON}</button><button type="button" class="dv-svc" data-open="${escapeHtml(i)}" aria-label="Submit request: ${escapeHtml(i)}"><span>${mark(i)}</span>${ICON.chev}</button></div>`}).join('')}</div>`;
  }).join('')+(shown?'':`<p class="dv-noresult">${q?`No services match “${escapeHtml(q)}”.`:"No services available."}</p>`);
  syncCardReload('serviceCatalog',!shown);
}
document.getElementById('dvServiceSearch').addEventListener('input',e=>renderServices(e.target.value));
renderServices();

/* Dashboard-only interactions */
document.addEventListener('click',e=>{
  const star=e.target.closest('#dashboard [data-quick-id]');
  if(star){e.preventDefault();e.stopPropagation();toggleQuickAction(star);return;}
  const sc=e.target.closest('#dashboard [data-scroll]');
  if(sc){e.preventDefault();const target=document.getElementById(sc.dataset.scroll);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(target?.id==='serviceCatalog')document.getElementById('dvServiceSearch').focus({preventScroll:true});return}
},true);

renderTaskStats();renderTasks();
window.addEventListener('pageshow',()=>{allTasks=dashboardTasks();renderTaskStats();renderTasks()});

const menuButton=document.getElementById('menuButton'), menu=document.getElementById('floatingMenu'), toast=document.getElementById('toast');
let toastTimer;
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false')}
function showToast(label){window.HrmNotifications?.dismissUndo();document.getElementById('toastMessage').textContent=`Selected: ${label}`;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true},4500)}
menuButton.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;menuButton.setAttribute('aria-expanded',String(opening))});
document.addEventListener('click',event=>{
  const task=event.target.closest('#dashboard [data-task-id]');if(task){location.assign('features/tasks/manage-tasks/index.html#task/'+encodeURIComponent(task.dataset.taskId));return}
  const filter=event.target.closest('#dashboard [data-filter]');
  if(filter){document.querySelectorAll('#dashboard [data-filter]').forEach(button=>button.setAttribute('aria-selected',String(button===filter)));renderTasks(filter.dataset.filter);return}
  const action=event.target.closest('[data-open]');
  if(action){openPrototype(action.dataset.open);closeMenu();return}
  if(!menu.hidden&&!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){closeMenu();toast.hidden=true}
  if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&document.activeElement.matches('#dashboard [data-filter]')){
    const buttons=[...document.querySelectorAll('#dashboard [data-filter]')],i=buttons.indexOf(document.activeElement),next=buttons[(i+(event.key==='ArrowRight'?1:buttons.length-1))%buttons.length];
    next.focus();next.click();event.preventDefault();
  }
});
document.getElementById('toastClose').addEventListener('click',()=>{toast.hidden=true;clearTimeout(toastTimer)});
document.querySelectorAll('.avatar-photo').forEach(img=>img.addEventListener('error',()=>img.hidden=true));

const dialog=document.getElementById('prototypeDialog');
const SERVICE_TICKET_FORMS = Object.freeze({
 'Request Leave': {type:'nghi-phep'},
 'Attendance Adjustment': {type:'xac-nhan-cong'},
 'Request Overtime': {type:'ot'},
 'Request Account': {type:'ticket-it',group:'Accounts & permissions',title:'Request Account'},
 'Request System Access': {type:'ticket-it',group:'Accounts & permissions',title:'Request System Access'},
 'IT Support': {type:'ticket-it'}
});
function openPrototype(label){
 const target=SERVICE_TICKET_FORMS[label];
 if(target){
  const params=new URLSearchParams({ticketType:target.type});
  if(target.group)params.set('requestGroup',target.group);
  if(target.title)params.set('requestTitle',target.title);
  location.assign('features/tickets/my-tickets/index.html?'+params.toString());
  return;
 }
 document.getElementById('dialogTitle').textContent=label;
 document.getElementById('dialogBody').innerHTML=label==='All action items'?(allTasks.slice().sort((a,b)=>a.date-b.date).map(taskRow).join('')||'<p>No action items need your attention.</p>'):label==='Payslip'?'<p>Your payslip amount stays hidden in this prototype.</p>':`<p>${escapeHtml(label)}</p><p>This action is ready to connect to the corresponding HR service.</p>`;
 if(!dialog.open)dialog.showModal();
}
document.getElementById('dialogClose').onclick=()=>dialog.close();


/* Empty-card retry controls. Each action refreshes its own module only. */
function syncCardReload(id,empty){
 const card=document.getElementById(id);if(!card)return;
 let button=card.querySelector('[data-card-reload]');
 if(!empty){if(button){button.hidden=true;button.closest('.dv-reload-actions').hidden=true;}return;}
 const host=id==='quickCard'?card.querySelector('.dashboard-empty'):
  id==='dvTasks'?card.querySelector('.dv-empty'):
  id==='serviceCatalog'?card.querySelector('.dv-noresult'):
  id==='kpi-task-summary'?card:card.querySelector('.dv-metric-empty');
 if(!host)return;
 let actions=host.querySelector('.dv-reload-actions');
 if(!actions){
  actions=document.createElement('span');actions.className='dv-reload-actions';host.appendChild(actions);
 }
 if(!button){
  button=document.createElement('button');button.type='button';button.className='dv-card-reload';button.dataset.cardReload=id;
  const label=card.querySelector('.dv-card-title,.dv-kpi-label')?.textContent.trim()||'card';
  button.setAttribute('aria-label','Reload '+label.replace(/\s+\d+$/,''));button.title=button.getAttribute('aria-label');
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17"/></svg><span>Reload</span>';
 }
 actions.insertBefore(button,actions.firstChild);actions.hidden=false;button.hidden=false;
 button.disabled=card.getAttribute('aria-busy')==='true';
 if(button.disabled)button.setAttribute('aria-busy','true');
}
function renderMetricAvailability(){
 ['worked','leave'].forEach(key=>{
  const card=document.getElementById('kpi-'+key),empty=demoState==='empty';
  card.querySelector('.dv-kpi-body').hidden=empty;
  let placeholder=card.querySelector('.dv-metric-empty');
  if(!placeholder){placeholder=document.createElement('div');placeholder.className='dv-metric-empty';placeholder.textContent='No information available.';card.appendChild(placeholder);}
  placeholder.hidden=!empty;syncCardReload(card.id,empty);
 });
}
renderMetricAvailability();
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-card-reload]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(button.disabled)return;
 const id=button.dataset.cardReload,card=document.getElementById(id),hadFocus=document.activeElement===button;
 button.disabled=true;button.setAttribute('aria-busy','true');card.setAttribute('aria-busy','true');
 try{
  await new Promise(resolve=>requestAnimationFrame(resolve));
  if(id==='dvTasks'||id==='kpi-task-summary'){allTasks=dashboardTasks();renderTaskStats();renderTasks();}
  else if(id==='quickCard'){
   const stored=localStorage.getItem(QUICK_STORAGE_KEY);
   if(stored!==null){const ids=JSON.parse(stored);if(Array.isArray(ids))selectedServiceIds=[...new Set(ids)].filter(id=>SERVICE_OPTIONS.some(s=>s.id===id)).slice(0,MAX_QUICK_ACTIONS);}
   renderQuickActions();document.querySelectorAll('[data-quick-id]').forEach(updateStar);
  }
  else if(id==='serviceCatalog')renderServices(document.getElementById('dvServiceSearch').value);
  else renderMetricAvailability();
  let status=card.querySelector('.dv-reload-status');
  if(!status){status=document.createElement('span');status.className='dv-reload-status';status.setAttribute('role','status');card.appendChild(status);}
  status.textContent=card.querySelector('[data-card-reload]:not([hidden])')?'Card refreshed. No information available.':'Card updated.';
 }catch{quickNotice('Could not reload this card. Please try again.');}
 finally{const current=card.querySelector('[data-card-reload]');button.disabled=false;button.removeAttribute('aria-busy');if(current){current.disabled=false;current.removeAttribute('aria-busy');if(hadFocus&&!current.hidden)current.focus({preventScroll:true});}card.removeAttribute('aria-busy');}
},true);
