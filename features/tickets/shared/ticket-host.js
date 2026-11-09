

const ready={employee:false,manager:false};let mode='mine',lastTab='mine';
const frames={employee:document.getElementById('employee'),manager:document.getElementById('manager')};
const drawerPortal=createTicketDrawerPortal({dialog:document.getElementById('ticketDrawerDialog'),frame:document.getElementById('ticketDrawerFrame'),onRequestClose:(role,kind)=>{const win=frames[role].contentWindow;if(kind==='delegation')win.mergeDelegClose();else{win.mergeDecisionCancel?.(false);win.closeDrawer()}}});
// Native top-layer dialog covers the whole Tickets viewport, outside embedded lists.
let delegationCancelPending=null;
const delegationCancelDialog=document.getElementById('delegationCancelDialog');
function openDelegationCancel(data){
 if(delegationCancelPending)finishDelegationCancel(false);
 delegationCancelPending={requestId:data.requestId};
 document.getElementById('delegationCancelPeople').textContent=data.delegator+' → '+data.delegate;
 document.getElementById('delegationCancelConfirm').disabled=false;
 delegationCancelDialog.showModal();document.getElementById('delegationCancelKeep').focus();
}
function finishDelegationCancel(confirmed){
 const pending=delegationCancelPending;if(!pending)return;
 delegationCancelPending=null;document.getElementById('delegationCancelConfirm').disabled=true;
 delegationCancelDialog.close();frames.manager.focus();send('manager','delegation-cancel-result',{requestId:pending.requestId,confirmed});
}
delegationCancelDialog.addEventListener('cancel',e=>{e.preventDefault();finishDelegationCancel(false)});
delegationCancelDialog.addEventListener('close',()=>{if(delegationCancelPending)finishDelegationCancel(false)});
delegationCancelDialog.addEventListener('click',e=>{if(e.target!==delegationCancelDialog)return;const r=delegationCancelDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)finishDelegationCancel(false)});

let delegationEditPending=null;
const delegationEditDialog=document.getElementById('delegationEditDialog');
function openDelegationEdit(data){
 if(delegationEditPending)finishDelegationEdit(false);
 delegationEditPending={requestId:data.requestId,from:data.from,fromLabel:data.fromLabel};
 document.getElementById('delegationEditPeople').textContent=data.delegator+' → '+data.delegate;
 document.getElementById('delegationEditFrom').value=data.from;
 const until=document.getElementById('delegationEditUntil');until.value=data.until;until.min=data.from;until.removeAttribute('aria-invalid');
 document.getElementById('delegationEditError').textContent='';document.getElementById('delegationEditSave').disabled=false;
 delegationEditDialog.showModal();until.focus();
}
function finishDelegationEdit(save){
 const pending=delegationEditPending;if(!pending)return;
 const until=document.getElementById('delegationEditUntil');
 if(save&&(!until.value||until.value<pending.from||until.value<tkTodayIso())){
  document.getElementById('delegationEditError').textContent=!until.value?'Please select the new To date.':until.value<pending.from?'To date must not be earlier than From date ('+pending.fromLabel+').':'To date must not be earlier than today.';until.setAttribute('aria-invalid','true');until.focus();return;
 }
 delegationEditPending=null;document.getElementById('delegationEditSave').disabled=true;delegationEditDialog.close();frames.manager.focus();send('manager','delegation-edit-result',{requestId:pending.requestId,save,until:until.value});
}
delegationEditDialog.addEventListener('cancel',e=>{e.preventDefault();finishDelegationEdit(false)});
delegationEditDialog.addEventListener('close',()=>{if(delegationEditPending)finishDelegationEdit(false)});
delegationEditDialog.addEventListener('click',e=>{if(e.target!==delegationEditDialog)return;const r=delegationEditDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)finishDelegationEdit(false)});

let bulkDecisionPending=null;
const bulkDecisionDialog=document.getElementById('bulkDecisionDialog');
function openBulkDecision(data){
 if(bulkDecisionPending)finishBulkDecision(false);
 bulkDecisionPending={requestId:data.requestId,kind:data.kind};
 const reject=data.kind==='tuchoi',reason=document.getElementById('bulkDecisionReason');
 document.getElementById('bulkDecisionTitle').textContent=(reject?'Reject':'Approve')+' '+data.count+' selected tickets';
 document.getElementById('bulkDecisionLabel').textContent='Comment'+(reject?' *':'');reason.value='';reason.required=reject;reason.removeAttribute('aria-invalid');
 document.getElementById('bulkDecisionError').textContent='';document.getElementById('bulkDecisionConfirm').disabled=false;
 bulkDecisionDialog.showModal();document.getElementById('bulkDecisionCancel').focus();
}
function finishBulkDecision(confirmed){
 const pending=bulkDecisionPending;if(!pending)return;
 const reason=document.getElementById('bulkDecisionReason'),text=reason.value.trim();
 if(confirmed&&pending.kind==='tuchoi'&&!text){document.getElementById('bulkDecisionError').textContent='Enter a rejection reason.';reason.setAttribute('aria-invalid','true');reason.focus();return}
 bulkDecisionPending=null;document.getElementById('bulkDecisionConfirm').disabled=true;bulkDecisionDialog.close();frames.manager.focus();send('manager','bulk-decision-result',{requestId:pending.requestId,confirmed,reason:text});
}
bulkDecisionDialog.addEventListener('cancel',e=>{e.preventDefault();finishBulkDecision(false)});
bulkDecisionDialog.addEventListener('close',()=>{if(bulkDecisionPending)finishBulkDecision(false)});
bulkDecisionDialog.addEventListener('click',e=>{if(e.target!==bulkDecisionDialog)return;const r=bulkDecisionDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)finishBulkDecision(false)});

function send(role,type,data){frames[role].contentWindow.postMessage({merge:true,type,data},'*')}
function showToast(t){const e=document.getElementById('outerToast');e.textContent=t;e.hidden=false;clearTimeout(window.outerTimer);window.outerTimer=setTimeout(()=>e.hidden=true,2800)}
function syncTicketNavigation(){
 document.getElementById('ticketPageTitle').textContent=mode==='approval'?'Approval':'Tickets';
 document.getElementById('createTicketAction').hidden=mode==='approval';
 for(const [id,target]of [['mineTab','mine'],['approvalTab','approval'],['delegationTab','delegation']]){
  const item=document.getElementById(id),active=(mode==='delegation'?'delegation':['catalog','form'].includes(mode)?'mine':lastTab)===target;
  item.classList.toggle('selected',active);
  if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');
 }
}
function route(m){drawerPortal.requestClose();drawerPortal.close();if(bulkDecisionPending)finishBulkDecision(false);if(delegationEditPending)finishDelegationEdit(false);if(delegationCancelPending)finishDelegationCancel(false);mode=m;document.getElementById('top').dataset.ticketView=m;if(['mine','approval'].includes(m))lastTab=m;const role=['approval','delegation'].includes(m)?'manager':'employee';frames.employee.hidden=role!=='employee';frames.manager.hidden=role!=='manager';document.getElementById('top').classList.toggle('mode-other',!['mine','approval'].includes(m));document.getElementById('subTitle').textContent=({catalog:'New ticket',form:'New ticket',delegation:'Approval Delegation',notifications:'Notifications'})[m]||'';syncTicketNavigation();if(ready[role])send(role,'route',{k:m});if(ready.manager&&!tk.error)send('manager','recount',{});}
window.addEventListener('message',e=>{let role=Object.keys(frames).find(r=>frames[r].contentWindow===e.source);if(!role||!e.data?.merge)return;const {type,data}=e.data;if(type==='bulk-decision-open'&&role==='manager'&&mode==='approval'&&['duyet','tuchoi'].includes(data.kind)&&Number.isInteger(data.count)&&data.count>0)openBulkDecision(data);if(type==='delegation-cancel-open'&&role==='manager'&&mode==='delegation')openDelegationCancel(data);if(type==='delegation-edit-open'&&role==='manager'&&mode==='delegation')openDelegationEdit(data);if(type==='ready'){ready[role]=true;if(role==='employee')tkLoaded();if((['approval','delegation'].includes(mode)?'manager':'employee')===role)send(role,'route',{k:mode});applyTicketLink(role)}if(type==='count'&&role==='manager')setApprovalBadge(data.total);
 if(type==='navigate'&&data.k==='delegation'){route('delegation')}
 if(type==='detail'){const activeRole=['approval','delegation'].includes(mode)?'manager':'employee';if(role===activeRole&&data.open)drawerPortal.open(role,mode==='delegation'?'delegation':'ticket');else if(!data.open&&drawerPortal.isOwner(role))drawerPortal.close()}
 if(type==='route'&&role==='employee'&&data.k==='form'){mode='form';document.getElementById('top').dataset.ticketView='form';document.getElementById('top').classList.add('mode-other');document.getElementById('subTitle').textContent=data.title;syncTicketNavigation();}
 if(type==='route'&&role==='employee'&&data.k==='don-cua-toi'&&!['approval','delegation'].includes(mode)){mode='mine';lastTab='mine';document.getElementById('top').dataset.ticketView='mine';document.getElementById('top').classList.remove('mode-other');document.getElementById('mineTab').classList.add('selected');document.getElementById('approvalTab').classList.remove('selected');syncTicketNavigation()}
 if(['decision','discussion','withdraw','supplement','ticket'].includes(type)){const other=role==='employee'?'manager':'employee';if(ready[other])send(other,type,data)}
});

let deepLinkApplied=false;
function applyTicketLink(role){const p=new URLSearchParams(location.search),type=p.get('ticketType');if(deepLinkApplied||role!=='employee'||!type)return;deepLinkApplied=true;route('catalog');send('employee','open-form',{ticketType:type,requestGroup:p.get('requestGroup'),requestTitle:p.get('requestTitle')});}
window.addEventListener('hashchange',()=>{route(location.hash==='#approvals'?'approval':location.hash==='#delegation'?'delegation':location.hash==='#create-ticket'?'catalog':'mine')});
if(location.hash==='#approvals')route('approval');else if(location.hash==='#delegation')route('delegation');else if(location.hash==='#create-ticket')route('catalog');

syncTicketNavigation();
for(const role of Object.keys(frames))frames[role].srcdoc=HrmEnvironment.embed(docs[role]);

/* Task Q261106-1715: Approval badge (MTK-BR-045) and loading / error states (MTK-BR-046, UI-020). */
const tk={error:false,failOnce:new URLSearchParams(location.search).get('tkState')==='error'}; /* demo: ?tkState=error shows the load error once; Retry then succeeds */
function tkTodayIso(){const t=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2)}
function setApprovalBadge(n){
 document.querySelectorAll('[data-approval-badge]').forEach(b=>{
  const show=!tk.error&&Number.isInteger(n)&&n>0;b.hidden=!show;
  if(show){b.textContent=n>99?'99+':String(n);b.setAttribute('role','img');b.setAttribute('aria-label',n+' tickets waiting for your approval')}
  else{b.textContent='';b.removeAttribute('aria-label')}
 });
}
function tkBusy(on){
 document.getElementById('workspace').classList.toggle('tk-blocked',on);
 document.getElementById('createTicketAction').disabled=on;
}
function tkLoaded(){
 if(tk.error)return;
 if(tk.failOnce){tk.failOnce=false;tk.error=true;document.getElementById('loading').hidden=true;document.getElementById('loadError').hidden=false;setApprovalBadge(0);return}
 document.getElementById('loading').hidden=true;tkBusy(false);
 if(ready.manager)send('manager','recount',{});
}
function tkRetry(){
 tk.error=false;document.getElementById('loadError').hidden=true;document.getElementById('loading').hidden=false;tkBusy(true);
 setTimeout(()=>{document.getElementById('loading').hidden=true;tkBusy(false);if(ready.manager)send('manager','recount',{})},500);
}
tkBusy(true);
