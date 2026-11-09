// Client-only current-record and request lifecycle model. Fixtures and per-tab submissions are not production HR data.
(()=>{
 const KEY='hrm-ess-record-history-demo-v47';
 const copy=v=>JSON.parse(JSON.stringify(v));
 const dateKey=value=>{const s=String(value||'');let m=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);if(m)return Number(m[3]+m[2]+m[1]);m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s);return m?Number(m[1]+m[2]+m[3]):-Infinity};
 const dayKey=day=>Number(`${day.getFullYear()}${String(day.getMonth()+1).padStart(2,'0')}${String(day.getDate()).padStart(2,'0')}`);
 const status=r=>String(r.requestStatus||'').toUpperCase().replace(/[ _-]/g,'');
 const accepted=r=>r.approved===true||r.committed===true||['APPROVED','COMPLETED','SUCCEEDED'].includes(status(r));
 const unsuccessful=r=>!accepted(r)&&['CANCELLED','CANCELED','REJECTED','FAILED'].includes(status(r));
 const pending=r=>!accepted(r)&&!unsuccessful(r)&&(r.provisional===true||!!r.requestStatus);
 function derive(records,day=new Date()){
  const visible=records.filter(r=>!unsuccessful(r)&&(accepted(r)||pending(r))).map(r=>({...r,lifecycle:null,current:false,latest:false}));
  const effective=r=>dateKey(r.effectiveDate||r.values?.['Effective Date']);
  visible.sort((a,b)=>effective(b)-effective(a)||dateKey(b.audit?.createdOn)-dateKey(a.audit?.createdOn));
  const eligible=visible.filter(r=>accepted(r)&&effective(r)<=dayKey(day)&&effective(r)!==-Infinity);
  const current=eligible[0]||visible.find(r=>accepted(r)&&records.find(o=>o.id===r.id)?.current&&effective(r)===-Infinity);
  const latest=visible.slice().sort((a,b)=>{
   const created=r=>{const value=r.submittedAt||r.audit?.createdOn,date=dateKey(value),time=String(value||'').match(/(?:T| )(\d{2}):(\d{2})(?::(\d{2}))?/);return (date===-Infinity?effective(r):date)*1000000+(time?Number(time[1]+time[2]+(time[3]||'00')):0)};
   return created(b)-created(a)||effective(b)-effective(a);
  })[0];
  for(const r of visible){r.current=r===current;r.latest=r===latest;r.lifecycle=pending(r)?'Pending Approval':accepted(r)&&effective(r)>dayKey(day)?'Scheduled':r.current?'Current':null;}
  return visible;
 }
 let saved={records:{},requestAudit:[]};try{const value=JSON.parse(sessionStorage.getItem(KEY));if(value?.records)saved=value;}catch{}
 function raw(block){return saved.records[block]||window.profileRecordFixtures?.[block]||(window.profileMockFixtures[block]?[{id:'displayed',current:true,committed:true,values:window.profileMockFixtures[block],audit:null,workflow:[]}]:[]);}
 function records(block,day){return derive(raw(block),day);}
 function collectionRaw(block){return saved.collections?.[block]||window.profileCollectionFixtures?.[block]||[];}
 function collectionRecords(block,day){
  const rows=collectionRaw(block),entities=[...new Set(rows.map(r=>r.entityId))];
  return entities.flatMap(entityId=>{
   const versions=derive(rows.filter(r=>r.entityId===entityId),day);
   // Pending edits do not replace the committed snapshot. A pending new entity
   // is visible as a provisional record until its request is resolved.
   const selected=versions.find(r=>r.current)||versions.find(r=>r.lifecycle==='Pending Approval');
   return selected?[{...selected,entityId,pending:versions.some(r=>r.lifecycle==='Pending Approval')}]:[];
  });
 }
 function persist(){try{sessionStorage.setItem(KEY,JSON.stringify(saved));}catch{}window.dispatchEvent(new CustomEvent('profile-record-change'));}
 function submit(block,values,context={}){
  const now=new Date(),id='submitted-'+now.getTime()+'-'+Math.random().toString(36).slice(2,6);
  const normalized=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,/^\d{4}-\d{2}-\d{2}$/.test(String(v))?String(v).split('-').reverse().join('/'):v]));
  const effectiveDate=normalized['Effective Date']||normalized['Start Date']||normalized['Start date']||now.toLocaleDateString('en-GB');
  const base=window.profileCollectionConfig?.[block]?(context.operation==='update'?collectionRecords(block).find(r=>r.entityId===context.entityId)?.values||{}:{}):window.profileMockFixtures[block];
  const record={id,provisional:true,committed:false,approved:false,requestStatus:'Submitted',effectiveDate,values:{...base,...normalized},audit:{createdBy:'Nguyễn Quang',createdOn:now.toLocaleDateString('en-GB')+' '+now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})},workflow:[{code:'INITIATE',date:now.toLocaleString('en-GB'),participant:'Nguyễn Quang',comment:null}]};
  if(window.profileCollectionConfig?.[block]){
   const target=collectionRecords(block).find(r=>r.entityId===context.entityId);
   if(context.operation==='update'&&(!target||target.pending))throw Error('This record is unavailable or pending approval.');
   record.entityId=context.operation==='update'?context.entityId:'entity-'+id;
   saved.collections??={};saved.collections[block]=[...copy(collectionRaw(block)),record];
  }else saved.records[block]=[...copy(raw(block)),record];saved.requestAudit.push({block,recordId:id,status:'Submitted'});persist();return id;
 }
 function transition(block,id,next){
  const isCollection=!!window.profileCollectionConfig?.[block];const list=copy(isCollection?collectionRaw(block):raw(block)),record=list.find(r=>r.id===id);if(!record||accepted(record))return false;record.requestStatus=next;
  if(['APPROVED','COMPLETED','SUCCEEDED'].includes(status(record))){record.approved=true;record.committed=true;record.provisional=false;record.workflow??=[];record.workflow.push({code:'APPROVE',date:new Date().toLocaleString('en-GB'),participant:'Trần Minh Anh',comment:null});}
  saved.requestAudit.push({block,recordId:id,status:next});if(isCollection){saved.collections??={};saved.collections[block]=list.filter(r=>!unsuccessful(r));}else saved.records[block]=list.filter(r=>!unsuccessful(r));persist();return true;
 }
 for(const block of Object.keys({...window.profileRecordFixtures,...saved.records})){const current=records(block).find(r=>r.current);if(current)window.profileMockFixtures[block]={...window.profileMockFixtures[block],...current.values};}
 window.HrmProfileRecords={derive,records,collectionRecords,submit,transition,hasPending:block=>window.profileCollectionConfig?.[block]?collectionRecords(block).some(r=>r.pending):records(block).some(r=>r.lifecycle==='Pending Approval')};
})();
