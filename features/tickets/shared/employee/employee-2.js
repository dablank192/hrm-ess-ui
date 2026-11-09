/* Unified v10: shared navigation; v10 schema, forms, diagrams and progress retained. */
const MERGE_ROLE='employee';
// Single-ticket withdrawal requires confirmation using the existing business action.
let mergeWithdrawPending=null;
function mergeBindWithdrawButton(){
 const button=Array.from(document.querySelectorAll('#drw .drw-f button')).find(el=>(el.getAttribute('onclick')||'').includes('withdrawDon()'));
 if(button){button.id='withdrawTicketAction';button.onclick=()=>mergeWithdrawOpen()}
}
function mergeWithdrawOpen(){
 const ticket=dCur;if(!ticket||!DONS.includes(ticket)||ticket.st!=='cho')return;
 mergeWithdrawPending={ticket,trigger:document.activeElement};
 let layer=document.getElementById('withdrawConfirmationLayer');
 if(!layer){layer=document.createElement('div');layer.id='withdrawConfirmationLayer';layer.className='withdraw-confirmation-layer';document.body.appendChild(layer);layer.onclick=e=>{if(e.target===layer)mergeWithdrawCancel()}}
 layer.innerHTML='<div class="mdl ticket-decision-modal withdrawal-confirmation" role="dialog" aria-modal="true" aria-labelledby="withdrawHeading" aria-describedby="withdrawDescription"><div class="mdl-h" id="withdrawHeading">Withdraw ticket</div><div class="mdl-b"><p id="withdrawDescription">Are you sure you want to withdraw ticket <b>'+esc(ticket.c)+'</b>?</p></div><div class="mdl-f"><button id="withdrawCancel" class="btn" type="button" onclick="mergeWithdrawCancel()">Cancel</button><button id="withdrawConfirm" class="btn pri" type="button" onclick="mergeWithdrawConfirm()">Confirm</button></div></div>';
 layer.hidden=false;document.getElementById('drw').inert=true;document.getElementById('withdrawCancel').focus();
}
function mergeWithdrawCancel(restore=true){
 const pending=mergeWithdrawPending;mergeWithdrawPending=null;const layer=document.getElementById('withdrawConfirmationLayer');if(layer)layer.hidden=true;document.getElementById('drw').inert=false;if(restore)pending?.trigger?.focus();
}
function mergeWithdrawConfirm(){
 const pending=mergeWithdrawPending;if(!pending)return;
 if(!DONS.includes(pending.ticket)||pending.ticket.st!=='cho'){mergeWithdrawCancel(false);toast('Ticket can no longer be withdrawn');return}
 document.getElementById('withdrawConfirm').disabled=true;mergeWithdrawCancel(false);dCur=pending.ticket;withdrawDon();document.querySelector('#drw .drw-f button')?.focus();
}
function mergeWithdrawKeydown(e){
 if(!mergeWithdrawPending)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();mergeWithdrawCancel();return}
 if(e.key==='Tab'){
  const first=document.getElementById('withdrawCancel'),last=document.getElementById('withdrawConfirm');
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
}
document.addEventListener('keydown',mergeWithdrawKeydown,true);

function mergeSend(type,data){parent.postMessage({merge:true,role:MERGE_ROLE,type,data},'*')}
const originalGo=go,originalClose=closeDrawer,originalDraw=drawDrawer;
go=function(k,arg){if(k==='thong-bao'){toggleInbox();return}if(mergeWithdrawPending)mergeWithdrawCancel(false);document.getElementById('view').className='content route-'+(k==='tao-don'?'catalog':k==='thong-bao'?'notifications':'list');originalGo(k,arg);mergeCount();mergeSend('route',{k})};
closeDrawer=function(){if(mergeWithdrawPending)mergeWithdrawCancel(false);originalClose();mergeSend('detail',{open:false})};
drawDrawer=function(){originalDraw();mergeBindWithdrawButton();mergeSend('detail',{open:true});requestAnimationFrame(()=>{fvPlace();fvFit()})};
fvPlace=function(){const dr=document.getElementById('drw');if(dr)dr.style.left='auto'};
function mergeCount(){mergeSend('count',{total:DONS.length,unread:NOTIFS.filter(n=>n.u).length})}
let mineSearch='';
/* MTK-BR-034: Title = ticket type name + " — " + submitter full name; no form field is joined into Title */
function mergeBuildTitle(type){const t=type+' — '+ME.name;return t.length>80?t.slice(0,80)+'…':t}
function mergeMineTitle(ticket){
 const type=TYPES[ticket.t]?.n||ticket.lo||'Ticket';
 return mergeBuildTitle(type);
}

function mergeFilterSelect(_,label,attrs,options){
 let preview='';
 const cleanOptions=options.replace(/<option([^>]*)>([^<]*)<\/option>/g,(_,a,text)=>{
  const value=['All ticket types','All statuses'].includes(text)?'All':text;
  if(!preview||/\bselected\b/.test(a))preview=value;
  return '<option'+a+'>'+value+'</option>';
 });
 return '<span class="ticket-select-preview"><select'+attrs+' aria-label="'+esc(label)+'">'+cleanOptions+'</select><span class="ticket-select-preview-value" aria-hidden="true">'+esc(label)+': '+preview+'</span></span>';
}
document.addEventListener('change',event=>{
 const select=event.target,wrapper=select.closest('.ticket-select-preview');
 if(wrapper&&select.tagName==='SELECT')wrapper.querySelector('.ticket-select-preview-value').textContent=select.getAttribute('aria-label')+': '+select.options[select.selectedIndex].textContent;
});
const sourceMyDonsCard=myDonsCard;
myDonsCard=function(pg){const all=DONS;let html;try{DONS=all.filter(d=>!mineSearch||(d.c+' '+mergeMineTitle(d)+' '+d.ti).toLowerCase().includes(mineSearch.toLowerCase())).map(d=>({...d,ti:esc(mergeMineTitle(d))}));html=sourceMyDonsCard(pg)}finally{DONS=all}html=html.replace('<div class="filters">','<div class="filters ticket-list-toolbar"><div class="field" style="width:280px"><input id="mineSearch" class="inp" value="'+esc(mineSearch)+'" placeholder="Search by ticket code or content" aria-label="Search by ticket code or content" oninput="mergeMineSearch(this.value)"></div>');html=html.replace(/<label>([^<]+)<\/label><select([^>]*)>([\s\S]*?)<\/select>/g,mergeFilterSelect);html=html.replace('Rows / page','Rows Per Page:').replace('<span class="go">Go to page</span>','<span class="go">Go to</span>');html=html.replace('onclick="flt=','onclick="mineSearch=\'\';flt=');return html};
function mergeMineSearch(value){mineSearch=value;PG.page=1;PAGES[page]();const input=document.getElementById('mineSearch');if(input){input.focus();input.setSelectionRange(value.length,value.length)}}
PAGES['don-cua-toi']=function(){let html=myDonsCard('don-cua-toi');html=html.replace('<div class="card-h"><h2>My tickets</h2></div>','');V(html)};
let mergeDraft=null,mergeDraftValues={},mergeFiles={};
const originalForm=openForm;
openForm=function(k){mergeDraft=null;mergeDraftValues={};mergeFiles={};originalForm(k);mergeWireForm(k)};
function mergeWireForm(k){
 document.getElementById('view').className='content route-form';mergeSend('route',{k:'form',title:TYPES[k].n});
 const form=document.getElementById('view');
 mergeBindDraftDelete(form);
 TYPES[k].f.forEach(f=>{const el=document.getElementById('f_'+f.k);if(el&&f.r)el.required=true;
 if(f.t==='file'){
 const target=[...form.querySelectorAll('.field')].find(x=>x.querySelector('label')?.getAttribute('for')==='f_'+f.k);
 const upload=target?.querySelector('.upload');if(!upload)return;
 upload.classList.add('ticket-attachments-upload');
 upload.innerHTML='<div class="ticket-file-picker"><label class="ticket-upload-trigger" for="f_'+f.k+'">'+svg(I.up)+'Upload files<input type="file" id="f_'+f.k+'" multiple accept=".pdf,.jpg,.jpeg,.png,.docx" aria-label="Upload attachments"'+(f.r?' required':'')+'></label><span class="hint">PDF, JPG, PNG, DOCX — 10 MB per file</span></div><div id="formAttachments_'+f.k+'" class="ticket-file-list" aria-live="polite"></div>'+(f.link?'<div class="ticket-link-paste" style="margin-top:8px"><input class="inp" type="url" id="fl_'+f.k+'" placeholder="Paste a link" aria-label="Paste a link"></div>':'');
 upload.querySelector('input').onchange=e=>{
  const files=[...e.target.files];if(files.some(x=>x.size>10*1024*1024)){e.target.value='';toast('File too large','Maximum 10 MB per file');return}
  mergeFiles[f.k]=files.map(x=>({n:x.name,s:Math.ceil(x.size/1024)+' KB',url:URL.createObjectURL(x)}));mergeRenderFormAttachments(f.k);
 };
 mergeRenderFormAttachments(f.k);
 }});

}

function mergeRenderFormAttachments(key){
 const list=document.getElementById('formAttachments_'+key);if(!list)return;
 const files=Object.values(mergeFiles).flat();
 list.innerHTML=files.map((file,index)=>'<div class="ticket-file-chip">'+svg(I.file)+'<span class="ticket-file-name" title="'+esc(file.n)+'">'+esc(file.n)+'</span><button type="button" class="ticket-file-download" aria-label="Download '+esc(file.n)+'" title="Download '+esc(file.n)+'" onclick="mergeDownloadFormFile('+index+')"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 3v9m-3-3 3 3 3-3M4 12v4h12v-4" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>').join('');
}
function mergeDownloadFormFile(index){
 const file=Object.values(mergeFiles).flat()[index];if(!file)return;
 if(!file.url){toast('Sample document','No document bytes are attached to this sample file');return}
 const link=document.createElement('a');link.href=file.url;link.download=file.n;link.click();
}

function mergeBindDraftDelete(form){
 if(!mergeDraft||mergeDraft.st!=='nhap')return;
 const cancel=[...form.querySelectorAll('button')].find(button=>button.textContent.trim()==='Cancel');if(!cancel)return;
 const button=document.createElement('button');button.id='deleteDraftAction';button.type='button';button.className='btn dgr';button.textContent='Delete draft';button.onclick=mergeDeleteDraft;cancel.parentElement.appendChild(button);
}
function mergeDeleteDraft(){
 const draft=mergeDraft;if(!draft||draft.st!=='nhap'||!DONS.includes(draft))return;
 DONS=DONS.filter(ticket=>ticket!==draft);mergeDraft=null;mergeDraftValues={};mergeFiles={};AP=null;
 go('don-cua-toi');toast('Draft deleted',draft.c);
}
function mergeRead(k){let v={};TYPES[k].f.forEach(f=>{let e=document.getElementById('f_'+f.k);if(e&&f.t!=='file')v[f.k]=e.value});return v}
function mergeValidate(k){let first=null;TYPES[k].f.forEach(f=>{let e=document.getElementById('f_'+f.k);if(e&&f.r&&!e.checkValidity()&&!first)first=e});if(first){first.reportValidity();return false}let v=mergeRead(k);if(v.tu&&v.den&&/^\d{4}-/.test(v.tu)&&v.den<v.tu){toast('Invalid period','To date must not be earlier than From date');return false}return true}
function mergeStore(k,draft){const values=mergeRead(k),files=Object.values(mergeFiles).flat();let code=mergeDraft?.c||tkNext(),fi=TYPES[k].f.filter(f=>values[f.k]!==undefined).map(f=>[f.l,values[f.k]]),steps=[];
 if(!draft){steps=[{t:'Submit ticket',w:ME.name,at:nowStr(),s:'done'}];apSteps(k).forEach(s=>{if(apNeed(s,values)==='no')return;let p=s.kind==='task'?accBy(apUG(s,values)):null;steps.push({t:s.t,w:p?p.n:s.w,s:'pend',kind:s.kind,cond:s.cond})});if(steps[1])steps[1].s='cur';}
 let obj={c:code,t:k,ti:mergeBuildTitle(TYPES[k].n),ct:mergeDraft?.ct||nowStr(),st:draft?'nhap':'cho',cur:1,inst:'demo-'+code,v:values,fi,at:files,cm:mergeDraft?.cm||[],sp:steps,cach:'UserGroup'};
 if(mergeDraft)Object.assign(mergeDraft,obj);else DONS.unshift(obj);mergeDraft=null;AP=null;go('don-cua-toi');mergeCount();mergeSend('ticket',{ticket:{...obj,lo:TYPES[k].n},submit:!draft});toast(draft?'Draft saved':'Ticket sent',code);
}
submitForm=function(k){if(!mergeValidate(k))return;mergeStore(k,false)};
apDraft=function(){if(AP)mergeStore(AP.k,true)};
const origOpenDon=openDon;
openDon=function(code){let d=DONS.find(x=>x.c===code);if(!d)return;if(d.st==='nhap'){originalForm(d.t);mergeDraft=d;mergeFiles={restored:d.at||[]};mergeWireForm(d.t);for(let key in d.v){let e=document.getElementById('f_'+key);if(e&&e.type!=='file')e.value=d.v[key]}apRender();return}origOpenDon(code)};
const origBody=drwBody;
drwBody=function(d){let body=origBody(d);if(dTab==='td')body=body.replace(/onclick="toast\([^\"]*\)"/g,'onclick="mergeDiscussion()"');if(dTab==='tl'){body=body.replace(/onclick="toast\([^\"]*\)"/g,'onclick="mergeDownload(this)"');body=body.replace('Add documents to the ticket','<input type="file" multiple accept=".pdf,.jpg,.png,.docx" onchange="mergeAddFiles(this)">Add documents to the ticket')}return body};
function mergeDiscussion(){let e=document.querySelector('#dtC textarea'),v=e?.value.trim();if(!v){toast('Enter a message first');return}dCur.cm.push({w:ME.name,r:'Submitter',at:nowStr(),x:v});document.getElementById('dtC').innerHTML=drwBody(dCur);mergeSend('discussion',{code:dCur.c,comment:dCur.cm.at(-1)});toast('Message sent')}
function mergeDownload(button){let name=button.closest('.att')?.querySelector('div')?.textContent;let f=dCur.at.find(f=>f.n===name);if(f?.url){let a=document.createElement('a');a.href=f.url;a.download=f.n;a.click()}else toast('Sample document','No document bytes are attached to this sample file')}
function mergeAddFiles(input){let files=[...input.files];if(files.some(f=>f.size>10*1024*1024)){toast('File too large','Maximum 10 MB per file');return}files.forEach(f=>dCur.at.push({n:f.name,s:Math.ceil(f.size/1024)+' KB',url:URL.createObjectURL(f)}));document.getElementById('dtC').innerHTML=drwBody(dCur);toast('Documents added')}
const origWithdraw=withdrawDon;
withdrawDon=function(){origWithdraw();mergeSend('withdraw',{code:dCur.c});mergeCount()};
window.addEventListener('message',e=>{if(e.source!==parent||!e.data?.merge)return;const {type,data}=e.data;
 if(type==='route'){if(data.k==='catalog')go('tao-don');else if(data.k==='notifications')go('thong-bao');else go('don-cua-toi')}
 if(type==='discussion'){let d=DONS.find(x=>x.c===data.code);if(d){d.cm.push(data.comment);if(dCur===d&&dTab==='td')document.getElementById('dtC').innerHTML=drwBody(d)}}
 if(type==='decision'){let d=DONS.find(x=>x.c===data.code);if(!d)return;let i=d.sp.findIndex(s=>s.s==='cur');d.cm.push({w:data.who,r:'Approver',at:data.at,x:data.reason||data.kind});if(data.kind==='bosung'||data.kind==='tuchoi'){if(i>=0){d.sp[i].s='rej';d.sp[i].at=data.at;if(data.reason)d.sp[i].note=data.reason;}d.st='tuchoi';delete d.returnStep}else{d.sp[i].s='done';d.sp[i].at=data.at;let next=d.sp.find(s=>s.s==='pend');if(next){next.s='cur';d.st='cho'}else d.st='duyet'}NOTIFS.unshift({x:esc(data.who)+' updated ticket '+d.c,t:data.at,u:1,go:d.c});if(page==='don-cua-toi')PAGES[page]();mergeCount()}
});
go('don-cua-toi');mergeSend('ready',{});
