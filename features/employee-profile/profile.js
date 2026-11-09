// One fixture per block feeds the full read-only card and the existing edit form.
const prototypeValues=window.profileMockFixtures;
const hasValue=value=>value!==null&&value!==undefined&&!(typeof value==='string'&&(!value.trim()||/^(?:N\/A|--|null|undefined)$/i.test(value.trim())));
// Displayed-record dates are read-only. Existing work/relative date fields
// are promoted once; missing fixture values remain empty.
const recordDates={
  'thong-tin-co-ban':{label:'Effective Date',key:'Effective Date'},
  'tai-khoan-ngan-hang':{label:'Effective Date',key:'Effective Date'},
  'dia-chi':{label:'Effective Date',key:'Effective Date'},
  'nguoi-than':{label:'Effective Date',key:'Start Date',promote:true},
  'lien-he-khan-cap':{label:'Effective Date',key:'Effective Date'},
  'thong-tin-khac':{label:'Start date',key:'Start Date'},
  'thong-tin-cong-viec':{label:'Effective Date',key:'Effective Date',promote:true}
};
// Matrix English names are the card copy source. Keep schema labels untouched
// because the edit form shares that schema.
const cardFieldOverrides={
  'thong-tin-co-ban':{'Social Name':'Display Name','Marrital Status':'Marital Status'},
  'thong-tin-cong-viec':{'Emp Level':'Employee Level'},
  'chung-chi':{'Name':'Certificate Name','Traning places':'Training Places'},
  'kinh-nghiem-lam-viec':{'Responbility':'Responsibility'}
};
const cardFieldLabel=(id,name)=>cardFieldOverrides[id]?.[name]||name;
function buildSection(id,title,actions=[],recordValues,cardCopy=true){
  const schema=window.profileFieldSchemas[id];
  const values=recordValues||prototypeValues[id]||{};
  const date=recordDates[id];
  // The existing summary's EmpDisplayName and detail's Social Name represent
  // the same confirmed display-name field. Keep the visible summary value.
  const fields=schema.full.filter(([name])=>!(date?.promote&&name===date.key)).map(([name,label])=>[cardCopy?cardFieldLabel(id,name):label,id==='thong-tin-co-ban'&&name==='Social Name' ? values.EmpDisplayName ?? values[name] : values[name]]);
  // Phone and Email are separate displayed records within the Contact card.
  // Their date values are independent and deliberately empty until supplied.
  const contactDates=id==='lien-lac' ? [
    [cardCopy?'Effective Date':'Effective date',values['Phone Effective Date']],
    [cardCopy?'Effective Date':'Effective date',values['Email Effective Date']]
  ] : null;
  return {id,title,actions,cardCopy,locked:!!window.profileLockedBlocks?.[id],recordDate:date?[cardCopy?date.label.replace('date','Date'):date.label,values[date.key]]:null,contactDates,fields};
}
const sections=[
  buildSection('thong-tin-co-ban','Basic Information',['Cập nhật']),
  buildSection('thong-tin-dinh-danh','National ID Information',['Thêm mới']),
  buildSection('tai-khoan-ngan-hang','Bank Details',['Thêm mới']),
  buildSection('ma-so-thue','PIT Code Information'),
  buildSection('lien-lac','Contact Information',['Cập nhật','Thêm mới']),
  buildSection('dia-chi','Address Information',['Cập nhật','Thêm mới']),
  buildSection('nguoi-than','Family / Dependent Information',['Cập nhật','Thêm mới']),
  buildSection('lien-he-khan-cap','Emergency Contact',['Cập nhật','Thêm mới']),
  buildSection('thong-tin-khac','Other Special Information',['Cập nhật','Thêm mới'])
];
const workSection=buildSection('thong-tin-cong-viec','Job Data Information');
const workSections=[workSection,buildSection('kinh-nghiem-lam-viec','Work Experience',['Cập nhật','Thêm mới'])];
const capabilitySections=[buildSection('trinh-do-hoc-van','Education Information',['Thêm mới']),buildSection('chung-chi','Certificate Information',['Thêm mới'])];
const rewardsSections=[buildSection('khen-thuong','Reward Information',['Thêm mới']),buildSection('ky-luat','Disciplinary Information',['Thêm mới'])];
const otherSections=[buildSection('to-chuc-xa-hoi','Social Organization Information',['Cập nhật','Thêm mới'])];
const allSections=[...sections,...workSections,...capabilitySections,...rewardsSections,...otherSections];
const safe = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
// One navigation definition and renderer serve every left-profile group.
const profileNavItems={
  basic:sections.map(({id,title})=>[id,title]),
  work:workSections.map(({id,title})=>[id,title]),
  capability:capabilitySections.map(({id,title})=>[id,title]),
  rewards:rewardsSections.map(({id,title})=>[id,title]),
  other:otherSections.map(({id,title})=>[id,title])
};
document.querySelectorAll('[data-profile-nav]').forEach(nav=>{
  nav.innerHTML=profileNavItems[nav.dataset.profileNav].map(([id,label],index)=>`<a href="#${id}"${index===0?' class="selected" aria-current="location"':''}>${safe(label)}</a>`).join('');
});
// Group the existing field order without changing or omitting any detail field.
const fieldGroups={
  'nguoi-than':[['Thông tin cơ bản',0,17],['Thông tin liên lạc',17,19],['Thông tin định danh',19,23],['Địa chỉ & công việc',23,32]],
  'lien-lac':[['Thông tin điện thoại',0,3],['Thông tin email',3,5]],
  'kinh-nghiem-lam-viec':[['Kinh nghiệm làm việc',0,18],['Quyết định công nhận chức danh nghề nghiệp',18,25]]
};
const cardGroupTitles={
  'nguoi-than':['Basic Information','Contact Information','National ID Information','Address & Job Information'],
  'lien-lac':['Phone Information','Email Information'],
  'kinh-nghiem-lam-viec':['Work Experience','Professional Title Recognition Decision']
};
const overviewExpanded=new Set(allSections.map(section=>section.id));
function overviewField([label,value]){return `<div class="fact"><dt>${safe(label)}</dt><dd class="${hasValue(value)?'':'empty'}">${safe(hasValue(value)?value:'—')}</dd></div>`}
// Record lifecycle dates share one body header; personal/business dates stay in their field groups.
const isOverviewRecordDate=label=>/^(?:Effective Date|Issued? Date|Start Date)$/i.test(label);
function overviewDates(section){
 const dates=section.recordDate?[section.recordDate]:[];
 for(const field of section.fields){if(isOverviewRecordDate(field[0]))dates.push(field);}
 if(section.contactDates)section.contactDates.forEach(([,value],i)=>dates.push([i===0?'Phone Effective Date':'Email Effective Date',value]));
 return dates;
}
function overviewDateHeader(section){
 const dates=overviewDates(section);
 return dates.length?`<dl class="record-meta" aria-label="Record dates">${dates.map(([label,value])=>`<div class="record-meta-fact"><dt>${safe(label)}:</dt><dd class="${hasValue(value)?'':'empty'}">${safe(hasValue(value)?value:'—')}</dd></div>`).join('')}</dl>`:'<span class="detail-caption">Full details</span>';
}
function overviewBody(section){
 let groups=fieldGroups[section.id];
 if(section.id==='thong-tin-co-ban')groups=[['Identity',0,2],['Birth Information',2,7],['Personal Information',7,section.fields.length]];
 const bodyFields=fields=>fields.filter(([label])=>!isOverviewRecordDate(label)).map(overviewField).join('');
 if(!groups)return `<dl class="fields">${bodyFields(section.fields)}</dl>`;
 return groups.map(([title,a,b],i)=>{const fields=section.fields.slice(a,b);const heading=section.id==='thong-tin-co-ban'?title:cardGroupTitles[section.id]?.[i]||title;return `<section class="subgroup"><h3>${safe(heading)}</h3><dl class="fields">${bodyFields(fields)}</dl></section>`}).join('');
}
const profilePlusSvg='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const profileEditSvg='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>';
function profileAddAction(section){const enabled=section.actions.includes('Thêm mới')&&!section.locked;return `<button class="profile-card-action record-add-action" type="button" data-add-record="${section.id}" aria-label="Add new ${safe(section.title)}" title="${enabled?'Add new':section.locked?'Pending approval':'Adding records is unavailable under current permissions'}" ${enabled?'':'disabled'}>${profilePlusSvg}</button>`;}
const renderSingleCard=section=>{const open=overviewExpanded.has(section.id);return `<section class="accordion ${open?'open':''}" id="${section.id}" data-block="${section.id}"><h2 class="accordion-heading"><button type="button" class="accordion-trigger" id="toggle-${section.id}" data-block-toggle="${section.id}" aria-expanded="${open}" aria-controls="detail-${section.id}"><span class="block-label"><strong>${safe(section.title)}</strong>${window.HrmProfileRecords?.hasPending(section.id)?'<span class="pill">Pending Approval</span>':''}</span><span class="chevron" aria-hidden="true"></span></button></h2><div class="accordion-body" aria-hidden="${!open}" ${open?'':'inert'} id="detail-${section.id}" aria-labelledby="toggle-${section.id}" ${open?'':'hidden'}><div class="accordion-body-inner"><div class="detail-toolbar"><div>${overviewDateHeader(section)}</div><div class="actions"><button class="profile-card-action" type="button" data-edit="${section.id}" aria-label="Edit ${safe(section.title)}"${section.locked||!section.actions.includes('Cập nhật')?` aria-disabled="true" title="${section.locked?'Pending approval':'View only under current permissions'}"`:' title="Edit"'}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button>${profileAddAction(section)}</div></div>${overviewBody(section)}</div></div></section>`};
// Multi-record rendering is configured per block, with one identity field only.
const expandedProfileRecords=new Map();
function recordIdentity(block,record){const value=record.values[window.profileCollectionConfig[block].identityField];return hasValue(value)?String(value):'Record without identifying information';}
function renderCollectionRecord(section,record,index,count){
 const key=section.id+':'+record.entityId;
 if(!expandedProfileRecords.has(key))expandedProfileRecords.set(key,index===0);
 const open=count===1||expandedProfileRecords.get(key);
 const item=buildSection(section.id,section.title,section.actions,record.values);
 const bodyId='record-body-'+record.entityId;
 const enabled=section.actions.includes('Cập nhật')&&!record.pending&&!section.locked;
 const edit=`<button class="profile-card-action" type="button" data-edit="${section.id}" data-record="${safe(record.entityId)}" aria-label="Edit ${safe(recordIdentity(section.id,record))}" title="${enabled?'Edit':record.pending||section.locked?'Pending approval':'Editing is unavailable under current permissions'}" ${enabled?'':'disabled'}>${profileEditSvg}</button>`;
 const tools=`<div class="detail-toolbar"><div>${overviewDateHeader(item)}</div>${count===1?`<div class="actions">${edit}</div>`:''}</div>`;
 const body=`${tools}${record.pending?'<p class="record-pending-notice" role="status">A request for this record is pending approval.</p>':''}${overviewBody(item)}`;
 if(count===1)return `<div class="profile-record single-record" data-record-entity="${safe(record.entityId)}">${body}</div>`;
 return `<section class="profile-record ${open?'open':''}" data-record-entity="${safe(record.entityId)}"><div class="profile-record-header"><h3 class="profile-record-heading"><button class="profile-record-trigger" data-record-toggle="${safe(key)}" aria-expanded="${open}" aria-controls="${bodyId}"><span class="record-chevron" aria-hidden="true"></span><span class="record-identity">${safe(recordIdentity(section.id,record))}</span></button></h3><div class="actions record-header-actions">${edit}</div></div><div id="${bodyId}" class="profile-record-body" ${open?'':'hidden inert'}>${body}</div></section>`;
}
function renderCard(section){
 if(!window.profileCollectionConfig?.[section.id])return renderSingleCard(section);
 const rows=window.HrmProfileRecords.collectionRecords(section.id),open=overviewExpanded.has(section.id);
 const add=profileAddAction(section);
 return `<section class="accordion ${open?'open':''}" id="${section.id}" data-block="${section.id}"><div class="collection-block-heading"><h2 class="accordion-heading"><button type="button" class="accordion-trigger" id="toggle-${section.id}" data-block-toggle="${section.id}" aria-expanded="${open}" aria-controls="detail-${section.id}"><span class="block-label"><strong>${safe(section.title)}</strong><span class="record-count" aria-label="${rows.length} records">${rows.length}</span></span><span class="chevron" aria-hidden="true"></span></button></h2>${add}</div><div class="accordion-body" aria-hidden="${!open}" ${open?'':'inert hidden'} id="detail-${section.id}" aria-labelledby="toggle-${section.id}"><div class="accordion-body-inner collection-body">${rows.length?rows.map((record,index)=>renderCollectionRecord(section,record,index,rows.length)).join(''):'<p class="record-empty">No information available</p>'}</div></div></section>`;
}

document.getElementById('profileCards').innerHTML=sections.map(renderCard).join('');
document.getElementById('workCards').innerHTML=workSections.map(renderCard).join('');
document.getElementById('capabilityCards').innerHTML=capabilitySections.map(renderCard).join('');
document.getElementById('rewardsCards').innerHTML=rewardsSections.map(renderCard).join('');
document.getElementById('otherCards').innerHTML=otherSections.map(renderCard).join('');

// Employee Profile always opens the current-record overview.
// Retired History links resolve to the corresponding profile block.
const profileParams=new URLSearchParams(location.search);
if(profileParams.has('history')){
  const retiredBlock=profileParams.get('history');
  profileParams.delete('history');
  const query=profileParams.toString();
  const anchor=allSections.some(section=>section.id===retiredBlock)?`#${encodeURIComponent(retiredBlock)}`:location.hash;
  HrmEnvironment.replaceState(null,'',location.pathname+(query?'?'+query:'')+anchor);
}
document.body.classList.add('profile-overview');
document.querySelector('.profile-top').hidden=false;

const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('floatingMenu');
const avatarButton = document.getElementById('avatarButton');
const avatarMenu = document.getElementById('avatarMenu');
const toast = document.getElementById('toast');
let toastTimer;
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false')}
function closeAvatar(){avatarMenu.hidden=true;avatarButton.setAttribute('aria-expanded','false')}
function showToast(label,plain=false){window.HrmNotifications?.dismissUndo();document.getElementById('toastMessage').textContent=plain?label:`Selected: ${label}`;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,4500)}
function openForm(section,entityId){
  if(!section)return;
  if(section.locked){showToast('Thông tin đang chờ xử lý, chưa thể chỉnh sửa.',true);return}
  if(!section.actions.includes('Cập nhật')){showToast('Block này chưa cho phép chỉnh sửa bản ghi hiện tại.',true);return}
  const record=entityId?window.HrmProfileRecords.collectionRecords(section.id).find(r=>r.entityId===entityId):null;
  if(entityId&&(!record||record.pending)){showToast('This record is unavailable or pending approval.',true);return;}
  window.HrmProfileForm.open(section.id,'update',entityId);
}

function setProfileView(view){
  for(const key of ['basic','work','capability','rewards','other'])document.getElementById(`${key}View`).hidden=view!==key;
  const firstAnchor=document.querySelector(`#${view}View .profile-section-nav a`);
  if(firstAnchor)setCurrent(firstAnchor.hash.slice(1));
  document.querySelectorAll('[data-profile-view]').forEach(button=>{const active=button.dataset.profileView===view;button.classList.toggle('selected',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
  const pane=document.querySelector(`#${view}View .profile-scroll`);pane.scrollTo({top:0,behavior:'auto'});
}
menuButton.addEventListener('click',()=>{const open=menu.hidden;closeAvatar();menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open))});
avatarButton.addEventListener('click',()=>{const open=avatarMenu.hidden;closeMenu();avatarMenu.hidden=!open;avatarButton.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add-record]');
  if(add){const section=allSections.find(s=>s.id===add.dataset.addRecord);if(section&&!section.locked&&section.actions.includes('Thêm mới'))window.HrmProfileForm.open(section.id,'add');return;}
  const recordToggle=event.target.closest('[data-record-toggle]');
  if(recordToggle){const open=recordToggle.getAttribute('aria-expanded')!=='true';expandedProfileRecords.set(recordToggle.dataset.recordToggle,open);recordToggle.setAttribute('aria-expanded',String(open));const body=document.getElementById(recordToggle.getAttribute('aria-controls'));body.hidden=!open;body.inert=!open;recordToggle.closest('.profile-record').classList.toggle('open',open);scheduleOverviewScroll();return;}
  const edit=event.target.closest('[data-edit]');
  if(edit){openForm(allSections.find(section=>section.id===edit.dataset.edit),edit.dataset.record);return}
  const profileView=event.target.closest('[data-profile-view]');
  if(profileView){HrmEnvironment.replaceState(null,'',profileView.dataset.profileView==='basic' ? location.pathname+location.search : location.pathname+location.search+`#${profileView.dataset.profileView}`);setProfileView(profileView.dataset.profileView);return}
  const action=event.target.closest('[data-open]');
  if(action){showToast(action.dataset.open);closeMenu();closeAvatar();return}
  if(!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
  if(!avatarMenu.contains(event.target)&&!avatarButton.contains(event.target))closeAvatar();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();closeAvatar();toast.hidden=true}});
document.getElementById('toastClose').addEventListener('click',()=>{toast.hidden=true;clearTimeout(toastTimer)});

const navLinks=[...document.querySelectorAll('.profile-view .profile-section-nav a')];
function setCurrent(id){navLinks.forEach(link=>{const selected=link.hash.slice(1)===id;link.classList.toggle('selected',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}
const overviewAnimations=new Map();
function setOverviewOpen(id,open){
  const block=document.getElementById(id);if(!block)return;
  const body=block.querySelector('.accordion-body');
  const previous=overviewAnimations.get(id);
  if(block.classList.contains('open')===open)return;
  const startHeight=body.hidden?0:body.getBoundingClientRect().height;
  if(previous){previous.cancel();overviewAnimations.delete(id);}
  block.classList.remove('is-opening','is-closing');
  block.classList.toggle('open',open);
  block.querySelector('[data-block-toggle]').setAttribute('aria-expanded',String(open));
  body.setAttribute('aria-hidden',String(!open));body.inert=!open;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){body.hidden=!open;body.style.overflow='';scheduleOverviewScroll();return;}
  body.hidden=false;
  const endHeight=open?body.scrollHeight:0;
  block.classList.add(open?'is-opening':'is-closing');
  body.style.overflow='hidden';
  const animation=body.animate([{height:`${startHeight}px`},{height:`${endHeight}px`}],{duration:350,easing:'ease'});
  overviewAnimations.set(id,animation);
  animation.finished.then(()=>{
    if(overviewAnimations.get(id)!==animation)return;
    overviewAnimations.delete(id);body.hidden=!open;body.style.overflow='';
    block.classList.remove('is-opening','is-closing');scheduleOverviewScroll();
  }).catch(()=>{});
  scheduleOverviewScroll();
}
document.addEventListener('click',event=>{const toggle=event.target.closest('[data-block-toggle]');if(!toggle)return;const block=document.getElementById(toggle.dataset.blockToggle);setOverviewOpen(block.id,!block.classList.contains('open'));setCurrent(block.id);});
navLinks.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();const id=link.hash.slice(1);setOverviewOpen(id,true);setCurrent(id);document.getElementById(id).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});document.getElementById('toggle-'+id).focus({preventScroll:true});}));
let scrollFrame=0;
function syncOverviewScroll(){scrollFrame=0;const visible=document.querySelector('.profile-view:not([hidden])');if(!visible)return;const pane=visible.querySelector('.profile-scroll'),blocks=[...pane.querySelectorAll('[data-block]')];if(!blocks.length||!pane.clientHeight)return;let current=blocks[0];const marker=pane.getBoundingClientRect().top+32;for(const block of blocks){if(block.getBoundingClientRect().top<=marker)current=block;else break;}if(pane.scrollTop>0&&pane.scrollTop+pane.clientHeight>=pane.scrollHeight-2)current=blocks.at(-1);setCurrent(current.id);const selected=visible.querySelector('.profile-section-nav a.selected'),rail=visible.querySelector('.sticky');if(selected){const a=selected.getBoundingClientRect(),b=rail.getBoundingClientRect();if(a.top<b.top+8)rail.scrollTop+=a.top-b.top-8;else if(a.bottom>b.bottom-8)rail.scrollTop+=a.bottom-b.bottom+8;}}
function scheduleOverviewScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(syncOverviewScroll);}
document.querySelectorAll('.profile-scroll').forEach(pane=>{pane.addEventListener('scroll',scheduleOverviewScroll,{passive:true});new ResizeObserver(scheduleOverviewScroll).observe(pane);});
const hashId=location.hash.slice(1);
if(hashId==='work'||['capability','rewards','other'].includes(hashId))setProfileView(hashId==='work'?'work':hashId);
else if(hashId){
  const group=Object.keys(profileNavItems).find(view=>profileNavItems[view].some(([id])=>id===hashId));
  if(group){
    if(group!=='basic')setProfileView(group);
    setOverviewOpen(hashId,true);setCurrent(hashId);
    requestAnimationFrame(()=>document.getElementById(hashId).scrollIntoView({behavior:'auto',block:'start'}));
  }
}

// Lifecycle changes refresh the selected snapshot and block indicators using the same model.
window.addEventListener('profile-record-change',()=>location.reload());
const nextDay=new Date();nextDay.setHours(24,0,0,30);setTimeout(()=>location.reload(),nextDay-new Date());

