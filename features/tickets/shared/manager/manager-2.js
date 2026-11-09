/* Unified v10: original approval view, schemas and workflow component retained. */
const MERGE_ROLE='manager';
function mergeSend(type,data){parent.postMessage({merge:true,role:MERGE_ROLE,type,data},'*')}
const originalGo=go,originalClose=closeDrawer,originalDraw=drawDrawer;
go=function(k){mergeDelegClose(false);if(mergeDecisionPending)mergeDecisionCancel(false);document.getElementById('view').className='content route-'+(k==='uy-quyen'?'delegation':'list');originalGo(k);mergeCount()};
closeDrawer=function(){originalClose();mergeSend('detail',{open:false})};
drawDrawer=function(){originalDraw();mergeBindDecisionButtons();mergeSend('detail',{open:true});requestAnimationFrame(()=>{fvPlace();fvFit()})};
fvPlace=function(){const d=document.getElementById('drw');if(d)d.style.left='auto'};
function mergeCount(){mergeSend('count',{total:QUEUE.length})}
const sourceBody=hvBody;
let mergeSearch='',mergeType='',mergeResult='',mergePeriod='';
function mergeApprovalView(value){setHv(value);document.getElementById('approvalViewTrigger')?.focus()}
function approvalViewControl(){return '<details class="approval-view-dropdown"><summary id="approvalViewTrigger" aria-haspopup="true">Approval view: '+(hvTab==='cho'?'Pending approval ('+QUEUE.length+')':'Processed ('+LICHSU.length+')')+'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true"><path d="m2 4 4 4 4-4"/></svg></summary><div class="approval-view-options" role="group" aria-label="Approval view options">'+[['cho','Pending approval',QUEUE.length],['xong','Processed',LICHSU.length]].map(([value,label,count])=>'<button type="button" aria-pressed="'+(hvTab===value)+'" onclick="mergeApprovalView(\''+value+'\')">'+label+' ('+count+')<span aria-hidden="true">'+(hvTab===value?'✓':'')+'</span></button>').join('')+'</div></details>'}
document.addEventListener('click',e=>{if(!e.target.closest('.approval-view-dropdown'))document.querySelectorAll('.approval-view-dropdown[open]').forEach(d=>d.removeAttribute('open'))});
document.addEventListener('keydown',e=>{const d=document.querySelector('.approval-view-dropdown[open]');if(!d)return;if(e.key==='Escape'){d.removeAttribute('open');d.querySelector('summary').focus();e.preventDefault();return}if(!d.contains(e.target))return;const items=[...d.querySelectorAll('.approval-view-options button')],i=items.indexOf(document.activeElement);let next;if(e.key==='ArrowDown')next=(i+1)%items.length;else if(e.key==='ArrowUp')next=i<0?items.length-1:(i-1+items.length)%items.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=items.length-1;else return;e.preventDefault();items[next].focus()});
hvBody=function(){let html=sourceBody();if(hvTab==='xong'){html=html.replace('<th>Processed by</th>','').replace(/<tr onclick="openXong\([\s\S]*?<\/tr>/g,row=>{let column=0;return row.replace(/<td\b[^>]*>[\s\S]*?<\/td>/g,cell=>++column===4?'':cell)})}const boundary=html.indexOf('<div class="card">');html=html.slice(boundary);html=html.replace('<div class="card">','<div class="card approval-list-card">').replace('Rows / page','Rows Per Page:').replace('<span class="go">Go to page</span>','<span class="go">Go to</span>');html=html.replace('<div class="filters">','<div class="filters approval-toolbar" aria-label="Approval controls">'+approvalViewControl()+'<div class="field" style="width:280px"><input id="msrch" class="inp" aria-label="Search by ticket code or content" value="'+esc(mergeSearch)+'" placeholder="Search by ticket code or content" oninput="mergeFilter(this.value)"></div>');html=html.replace(/<label>([^<]+)<\/label><select class="inp">([\s\S]*?)<\/select>/g,(_,label,options)=>'<select class="inp" aria-label="'+esc(label)+'">'+options.replace(/<option([^>]*)>([^<]*)<\/option>/g,(_,attrs,text)=>'<option'+attrs+'>'+esc(label)+': '+(text==='All ticket types'?'All':text)+'</option>')+'</select>');return html.replace(/View &amp; approve/g,'View &amp; Approve')};
function mergeFilter(v){mergeSearch=v;mergeFilterData();hvRefresh();let e=document.getElementById('msrch');if(e){e.focus();e.setSelectionRange(v.length,v.length)}}
let mergeAllQueue=QUEUE;
function mergeFilterData(){QUEUE=mergeAllQueue.filter(q=>!mergeSearch||(q.c+' '+q.ti+' '+q.nv).toLowerCase().includes(mergeSearch.toLowerCase()))}
const srcSendCm=sendCm;
sendCm=function(){let before=dCur?.cm.length;srcSendCm();if(dCur?.cm.length>before)mergeSend('discussion',{code:dCur.c,comment:dCur.cm.at(-1)})};
decide=function(kind,reason){if(kind==='bosung')kind='tuchoi';let d=dCur;if(!d||!mergeAllQueue.includes(d)){toast('Ticket already processed');return}const typed=document.getElementById('ykien')?.value.trim()||'';let why=reason||typed;if(kind!=='duyet'&&!why){toast('Comment required','Enter a reason before continuing');document.getElementById('ykien')?.focus();return}let who=actingPerson(d),at=nowStr();APPLOG.push({don:d.c,buoc:who.step,nguoi:who.n,uq:who.uq,thay:who.of||'',hd:kind,at,reason:why});d.cm.push({w:who.n,r:who.r,at,x:why||'Approved'});let pv=kind==='bosung'?prevStep(d):null;let currentStep=d.sp.find(x=>x.s==='cur');if(currentStep){currentStep.at=at;currentStep.s=kind==='tuchoi'?'rej':kind==='bosung'?'pend':'done';if(kind==='bosung'&&pv){pv.s='cur';pv.note='Requested more info: '+why}}LICHSU.unshift({...d,st:kind,xl:at,tg:'—',kq:kind==='duyet'?'Approved this step; moved to next step':kind==='tuchoi'?'Workflow ended':'Returned to previous step: '+(pv?.t||'Submit ticket')+' · '+(pv?.w||d.nv)});mergeAllQueue=mergeAllQueue.filter(q=>q!==d);mergeFilterData();delete sel[d.c];tkSort();closeDrawer();hvRefresh();mergeSend('decision',{code:d.c,kind,reason:why,who:who.n,at});mergeCount();toast('Decision recorded',d.c)};
let mergeBulkPending=null,mergeBulkSerial=0;
bulk=function(kind){
 const ids=Object.keys(sel).filter(k=>sel[k]);if(!ids.length||mergeBulkPending||!['duyet','tuchoi'].includes(kind))return;
 if(ids.length>100){toast('You can process up to 100 tickets at a time.');return}
 const requestId=++mergeBulkSerial;mergeBulkPending={requestId,kind,ids,trigger:document.activeElement};
 mergeSend('bulk-decision-open',{requestId,kind,count:ids.length});
};
function mergeBulkResult(data){
 const pending=mergeBulkPending;if(!pending||data.requestId!==pending.requestId)return;
 const text=(data.reason||'').trim();if(data.confirmed&&pending.kind==='tuchoi'&&!text)return;
 mergeBulkPending=null;
 if(!data.confirmed){pending.trigger?.focus();return}
 let processed=0;const skipped=[];
 pending.ids.forEach(id=>{const t=mergeAllQueue.find(q=>q.c===id);
  if(!t){skipped.push(id+' (already processed)');return}
  if(pending.kind==='duyet'&&(t.reqField||t.reqComment)){skipped.push(id+' (required fields)');return}
  if(t.techErr){t.techErr=false;skipped.push(id+' (technical error — try again)');return}
  dCur=t;decide(pending.kind,text);processed++});
 sel={};hvRefresh();toast('Processed '+processed+' tickets');
 if(skipped.length){const m=document.getElementById('mdl');m.innerHTML='<div class="mdl" role="dialog" aria-label="Bulk result"><div class="mdl-h">Processed '+processed+' ticket(s)</div><div class="mdl-b"><p>'+skipped.length+' ticket(s) skipped / Not processed:</p><ul>'+skipped.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></div><div class="mdl-f"><button class="btn pri" type="button" onclick="document.getElementById(\'mdl\').classList.remove(\'on\')">OK</button></div></div>';m.classList.add('on')}
}
const srcDelegate=PAGES['uy-quyen'];
// Approval detail confirmation; business decision execution stays in decide().
let mergeDecisionPending=null;
function mergeBindDecisionButtons(){
 const buttons=document.querySelectorAll('#drw .drw-f button');
 if(buttons[0]){buttons[0].id='approveTicketAction';buttons[0].onclick=()=>mergeDecisionOpen('duyet')}
 if(buttons[1]){buttons[1].id='rejectTicketAction';buttons[1].onclick=()=>mergeDecisionOpen('tuchoi')}
 }
function mergeDecisionOpen(kind){
 const ticket=dCur;if(!ticket||!mergeAllQueue.includes(ticket))return;
 const reject=kind==='tuchoi';mergeDecisionPending={kind,ticket,trigger:document.activeElement};
 const modal=document.getElementById('mdl');
 modal.innerHTML='<div class="mdl ticket-decision-modal" role="dialog" aria-modal="true" aria-labelledby="decisionHeading" aria-describedby="decisionDescription">'+
 '<div class="mdl-h" id="decisionHeading">'+(reject?'Reject ticket':'Approve ticket')+'</div><div class="mdl-b">'+
 '<p id="decisionDescription">Are you sure you want to '+(reject?'reject':'approve')+' ticket <b>'+esc(ticket.c)+'</b>?</p>'+
 (reject?'<div class="field decision-reason"><label for="decisionReason">Rejection reason <span aria-hidden="true">*</span></label><textarea id="decisionReason" class="inp" required aria-required="true" aria-describedby="decisionError" placeholder="Enter the reason for rejection"></textarea></div>':'')+
 '<div class="err" id="decisionError" role="alert"></div></div><div class="mdl-f"><button id="decisionCancel" class="btn" type="button" onclick="mergeDecisionCancel()">Cancel</button><button id="decisionConfirm" class="btn pri" type="button" onclick="mergeDecisionConfirm()">Confirm</button></div></div>';
 modal.classList.add('on');document.getElementById('drw').inert=true;
 (document.getElementById(reject?'decisionReason':'decisionCancel')).focus();
}
function mergeDecisionCancel(restore=true){
 const pending=mergeDecisionPending;mergeDecisionPending=null;document.getElementById('mdl').classList.remove('on');document.getElementById('drw').inert=false;
 if(restore)pending?.trigger?.focus();
}
function mergeDecisionConfirm(){
 const pending=mergeDecisionPending;if(!pending)return;
 const reason=pending.kind==='tuchoi'?(document.getElementById('decisionReason')?.value||'').trim():undefined;
 if(pending.kind==='tuchoi'&&!reason){document.getElementById('decisionError').textContent='Enter a rejection reason.';const field=document.getElementById('decisionReason');field.setAttribute('aria-invalid','true');field.focus();return}
 if(!mergeAllQueue.includes(pending.ticket)){mergeDecisionCancel(false);toast('Ticket already processed');return}
 document.getElementById('decisionConfirm').disabled=true;
 mergeDecisionCancel(false);dCur=pending.ticket;decide(pending.kind,reason);document.getElementById('approvalViewTrigger')?.focus();
}
const mergeOriginalAskClose=askClose;
askClose=function(){if(mergeDecisionPending)mergeDecisionCancel();else mergeOriginalAskClose()};

// Delegation reuses the Approval/My Ticket pagination engine and visual control.
HPG.delegation={size:10,page:1};
// Delegation uses the shared full-viewport portal with a centered form modal.
let mergeDelegReturnFocus=null;
PAGES['uy-quyen']=function(){
 srcDelegate();const view=document.getElementById('view');const cards=view.querySelectorAll('.card');const last=cards[cards.length-1];
 if(last){
  const formBody=last.querySelector('.card-b').innerHTML.replace(/<button class="btn pri"[\s\S]*?<\/button>/,'');last.remove();
  document.getElementById('delegationLayer')?.remove();
  const layer=document.createElement('div');layer.id='delegationLayer';layer.className='delegation-layer delegation-modal-layer';layer.hidden=true;
  const boundary=formBody.indexOf('<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:13px">');
  const information=boundary<0?formBody:formBody.slice(0,boundary),period=boundary<0?'':formBody.slice(boundary);
  layer.innerHTML='<aside class="delegation-drawer delegation-form-modal merge-deleg-form" role="dialog" aria-modal="true" aria-labelledby="delegationDrawerTitle"><div class="delegation-drawer-head"><h2 id="delegationDrawerTitle">Create new delegation</h2><button class="x-btn" type="button" aria-label="Close create delegation" onclick="mergeDelegClose()">'+svg(I.x)+'</button></div><div class="delegation-modal-layout">'+
   '<nav class="delegation-modal-sections" aria-label="Delegation form sections"><h3>Section</h3><button type="button" data-deleg-section="dgInformation" aria-current="step" onclick="mergeDelegSection(\'dgInformation\')"><span>1</span>Delegation details</button><button type="button" data-deleg-section="dgPeriod" onclick="mergeDelegSection(\'dgPeriod\')"><span>2</span>Period &amp; reason</button></nav>'+
   '<div class="delegation-modal-scroll"><section class="delegation-form-card" id="dgInformation" aria-labelledby="dgInformationTitle"><h3 id="dgInformationTitle">Delegation details</h3>'+information+'</section><section class="delegation-form-card" id="dgPeriod" aria-labelledby="dgPeriodTitle"><h3 id="dgPeriodTitle">Period &amp; reason</h3>'+period+'</section><div class="err" id="dgNewErr" role="alert"></div></div>'+
   '<aside class="delegation-modal-overview" aria-labelledby="dgOverviewTitle"><h3 id="dgOverviewTitle">Overview</h3><dl><div><dt>Delegate</dt><dd id="dgOverviewDelegate">—</dd></div><div><dt>Delegation scope</dt><dd id="dgOverviewScope">All ticket types</dd></div><div><dt>From date</dt><dd id="dgOverviewFrom">—</dd></div><div><dt>To date</dt><dd id="dgOverviewUntil">—</dd></div></dl></aside></div>'+
   '<div class="delegation-drawer-foot"><button class="btn" type="button" onclick="mergeDelegClose()">Cancel</button><button class="btn pri" type="button" onclick="mergeDelegSave()">Create delegation</button></div></aside>';

  layer.onclick=e=>{if(e.target===layer)mergeDelegClose()};document.body.appendChild(layer);
  const fields=Array.from(layer.querySelectorAll('select,input,textarea')).filter(field=>!field.closest('#dgTypes'));['dgNewTo','dgNewScope','dgNewFrom','dgNewUntil','dgNewReason'].forEach((id,i)=>{fields[i].id=id});
  layer.querySelectorAll('.field').forEach(field=>{const input=field.querySelector('select,input,textarea'),label=field.querySelector('label');if(input&&label)label.setAttribute('for',input.id)});
  const bar=document.createElement('div');bar.className='create-delegation-head';bar.innerHTML='<h1 class="delegation-title">Approval Delegation</h1><button id="createDelegationTrigger" class="btn pri" onclick="mergeDelegNew()">+ Create delegation</button>';view.prepend(bar);
 }
 view.querySelector('.card')?.classList.add('delegation-list-card');
 view.querySelector('.card .card-h')?.remove();
 const pagination=document.createElement('div');pagination.innerHTML=hpBar('delegation',DELEG.length).replace('Rows / page','Rows Per Page:').replace('<span class="go">Go to page</span>','<span class="go">Go to</span>');view.querySelector('.delegation-list-card .card-b').appendChild(pagination.firstChild);
 const delegationPage=HPG.delegation;
 view.querySelectorAll('tbody tr').forEach((row,i)=>{row.hidden=i<(delegationPage.page-1)*delegationPage.size||i>=delegationPage.page*delegationPage.size});
 view.querySelectorAll('tbody tr').forEach((row,i)=>{const cells=row.querySelectorAll('td'),buttons=row.querySelectorAll('button');if(DELEG[i].st==='cancelled'){cells[5].innerHTML='<span class="chip c-draft">Cancelled</span>';cells[6].innerHTML=''}else if(DELEG[i].st==='expired'){cells[6].innerHTML=''}else if(buttons[1])buttons[1].onclick=()=>mergeDelegCancel(i)});
};
function mergeDelegOverview(){
 const delegate=document.getElementById('dgNewTo').value;
 document.getElementById('dgOverviewDelegate').textContent=delegate.includes('Select')?'—':delegate;
 document.getElementById('dgOverviewScope').textContent=dgScopeText();
 for(const [input,output]of [['dgNewFrom','dgOverviewFrom'],['dgNewUntil','dgOverviewUntil']]){
  const value=document.getElementById(input).value;document.getElementById(output).textContent=value?iso2dmy(value):'—';
 }
}
function mergeDelegSection(id){
 const target=document.getElementById(id),scroller=target.closest('.delegation-modal-scroll');
 scroller.scrollTo({top:scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-20,behavior:'smooth'});
 document.querySelectorAll('[data-deleg-section]').forEach(button=>{if(button.getAttribute('data-deleg-section')===id)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
}
for(const type of ['input','change'])document.addEventListener(type,event=>{if(event.target.closest('.delegation-form-modal'))mergeDelegOverview()});
function mergeDelegNew(){
 const layer=document.getElementById('delegationLayer');if(!layer)return;
 mergeDelegReturnFocus=document.activeElement;mergeDelegOverview();layer.hidden=false;document.getElementById('view').inert=true;mergeSend('detail',{open:true});document.getElementById('dgNewTo').focus();
}
function mergeDelegClose(restore=true){
 const layer=document.getElementById('delegationLayer');if(!layer||layer.hidden)return;
 dgTypesOpen(false);layer.hidden=true;document.getElementById('view').inert=false;mergeSend('detail',{open:false});if(restore)(document.getElementById('createDelegationTrigger')||mergeDelegReturnFocus)?.focus();
}
function mergeDelegSave(){
 const to=document.getElementById('dgNewTo').value,scope=dgScopeText(),from=document.getElementById('dgNewFrom').value,until=document.getElementById('dgNewUntil').value,ly=document.getElementById('dgNewReason').value.trim(),err=document.getElementById('dgNewErr');
 if(to.includes('Select')||!from||!until){err.textContent='Select a delegate and both dates.';return}
 if(until<from){err.textContent='To date must not be earlier than From date.';return}
 if(document.getElementById('dgNewScope').value==='Selected ticket types'&&scope==='Selected ticket types'){err.textContent='Select at least one ticket type.';return}
 let [name,account]=to.split(' - ');DELEG.push({of:ME.name,ofr:ME.title,ofa:ME.id,to:name,toa:account,tor:'',from:iso2dmy(from),until:iso2dmy(until),scope,st:'active',ly});delegRecalc();mergeDelegClose(false);go('uy-quyen');document.getElementById('createDelegationTrigger')?.focus();toast('Delegation created');
}
function mergeOverlayKeydown(e){
 const decision=mergeDecisionPending?document.querySelector('.ticket-decision-modal'):null;
 const layer=document.getElementById('delegationLayer');const drawer=layer&&!layer.hidden?layer.querySelector('.delegation-drawer'):null;
 const surface=decision||drawer;if(!surface)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();const picker=document.getElementById('dgTypesPanel');if(drawer&&picker&&!picker.hidden)dgTypesOpen(false,true);else decision?mergeDecisionCancel():mergeDelegClose();return}
 if(e.key==='Tab'){
   const controls=Array.from(surface.querySelectorAll('button,input,select,textarea,[tabindex]')).filter(el=>!el.disabled&&!el.hidden&&!el.closest('[hidden]')&&el.getAttribute('tabindex')!=='-1');
  if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&(document.activeElement===first||!surface.contains(document.activeElement))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&(document.activeElement===last||!surface.contains(document.activeElement))){e.preventDefault();first.focus()}
 }
}
document.addEventListener('keydown',mergeOverlayKeydown,true);

let mergeDelegCancelPending=null,mergeDelegCancelSerial=0;
function mergeDelegCancel(i){
 const record=DELEG[i];if(!record||record.st==='cancelled'||mergeDelegCancelPending)return;
 const requestId=++mergeDelegCancelSerial;
 mergeDelegCancelPending={requestId,index:i,record,trigger:document.activeElement};
 mergeSend('delegation-cancel-open',{requestId,delegator:record.of,delegate:record.to});
}
function mergeDelegCancelResult(data){
 const pending=mergeDelegCancelPending;if(!pending||data.requestId!==pending.requestId)return;
 mergeDelegCancelPending=null;
 if(data.confirmed&&DELEG[pending.index]===pending.record&&pending.record.st!=='cancelled'){
  pending.record.st='cancelled';go('uy-quyen');document.getElementById('createDelegationTrigger')?.focus();toast('Delegation cancelled');
 }else pending.trigger?.focus();
}

let mergeDelegEditPending=null,mergeDelegEditSerial=0;
delegEdit=function(index){
 const record=DELEG[index];if(!record||record.st==='cancelled'||record.st==='expired'||mergeDelegEditPending)return;
 const requestId=++mergeDelegEditSerial;mergeDelegEditPending={requestId,index,record,trigger:document.activeElement};
 mergeSend('delegation-edit-open',{requestId,delegator:record.of+' - '+record.ofa,delegate:record.to+' - '+record.toa,from:dmy2iso(record.from),fromLabel:record.from,until:dmy2iso(record.until)});
};
function mergeDelegEditResult(data){
 const pending=mergeDelegEditPending;if(!pending||data.requestId!==pending.requestId)return;
 mergeDelegEditPending=null;
 if(!data.save){pending.trigger?.focus();return}
 const record=DELEG[pending.index];if(record!==pending.record||record.st==='cancelled'){toast('Delegation is no longer editable');return}
 if(!data.until||data.until<dmy2iso(record.from)){toast('Invalid To date');return}
 const old=record.until;record.until=iso2dmy(data.until);delegRecalc();go('uy-quyen');
 document.querySelectorAll('#view tbody tr')[pending.index]?.querySelector('button')?.focus();toast('Delegation updated','To date '+record.until);
}
const srcOpenXong=openXong;
openXong=function(code){srcOpenXong(code);mergeSend('detail',{open:true})};
window.addEventListener('message',e=>{if(e.source!==parent||!e.data?.merge)return;const {type,data}=e.data;
 if(type==='delegation-cancel-result')mergeDelegCancelResult(data);
 if(type==='bulk-decision-result')mergeBulkResult(data);
 if(type==='delegation-edit-result')mergeDelegEditResult(data);
 if(type==='route'){go(data.k==='delegation'?'uy-quyen':'hop-viec')}
 if(type==='ticket'||type==='supplement'){let d=data.ticket;if(!data.submit&&type==='ticket')return;let cur=d.sp.find(s=>s.s==='cur');if(!cur||!cur.w.includes(ME.name))return;let q={...d,nv:'Nguyễn Văn An',ma:'NV-00412',cd:'Sales Specialist',pb:'Sales Department',donvi:'fsoft',lo:data.lo||data.ticket.lo||'Request',w:[],me:{},cach:'UserGroup'};mergeAllQueue=mergeAllQueue.filter(x=>x.c!==q.c);mergeAllQueue.unshift(q);mergeFilterData();if(page==='hop-viec')hvRefresh();mergeCount()}
 if(type==='withdraw'){mergeAllQueue=mergeAllQueue.filter(x=>x.c!==data.code);mergeFilterData();if(page==='hop-viec')hvRefresh();mergeCount()}
 if(type==='discussion'){let d=mergeAllQueue.find(x=>x.c===data.code);if(d){d.cm.push(data.comment);if(dCur===d&&document.getElementById('dtC_td'))document.getElementById('dtC_td').innerHTML=cmHTML(d)}}
});
go('hop-viec');mergeSend('ready',{});
