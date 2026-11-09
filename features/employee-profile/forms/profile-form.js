// Client-only Employee Profile request form prototype. Change requests persist per tab; no backend request is sent.
const params=new URLSearchParams(window.essProfileSearch??location.search);
const blockId=params.get('block');
const operation=params.get('operation');
const config=window.profileFormSchemas[blockId];
const contract=operation==='add'?config?.add:operation==='update'?config?.update:null;
// The displayed business email is view-only under the Matrix; this update targets the displayed phone record.
const definition=blockId==='lien-lac'&&operation==='update'&&window.profileMockFixtures['lien-lac']['Email Type']==='Email công việc'?
  contract.filter(field=>!['Email Address','Email Type'].includes(field.key)):contract;
if(!config||!definition){location.replace('features/employee-profile/index.html')}
else {
const sections=Array.isArray(definition)&&definition[0]?.fields?definition:[{fields:definition}];
const decisionFields=config.decision||[];
const fields=[...sections.flatMap(section=>section.fields),...decisionFields];
const state={};
const inputs=new Map();
const wrappers=new Map();
const fieldDefs=new Map(fields.map(field=>[field.key,field]));
const form=document.getElementById('profileForm');
const fieldRoot=document.getElementById('formFields');
const entityId=params.get('record');
const collection=!!window.profileCollectionConfig?.[blockId];
const selectedEntity=collection&&entityId?window.HrmProfileRecords.collectionRecords(blockId).find(r=>r.entityId===entityId):null;
if(collection&&operation==='update'&&(!selectedEntity||selectedEntity.pending)){location.replace('features/employee-profile/index.html#'+encodeURIComponent(blockId));throw Error('Invalid or locked profile record.');}
const record=selectedEntity?.values||window.profileMockFixtures[blockId]||{};
// Form-only demo values stand in for the masked phone values on read-only cards.
const formOnlyMockValues={'lien-lac':{'Phone Number':'0901234789'},'nguoi-than':{'Phone Number':'0912345123'},'lien-he-khan-cap':{'Mobile phone':'0912345123'},'dia-chi':{'Address Type':'Địa chỉ hiện tại'}};
// Only replace an existing masked demo phone; do not copy another entity's phone into blank records.
const collectionFormValues=collection&&typeof record['Phone Number']==='string'&&record['Phone Number'].includes('•')?{'Phone Number':formOnlyMockValues[blockId]?.['Phone Number']}:{};
const displayRecord={...record,...(collection?collectionFormValues:formOnlyMockValues[blockId])};
const profileUrl='features/employee-profile/index.html#'+encodeURIComponent(blockId);
const embedded=params.get('embed')==='1'&&window.parent!==window;
function returnToProfile(submitted=false){
  if(embedded)window.parent.postMessage({type:'profile-form-close',submitted},HrmEnvironment.targetOrigin);
  else location.assign(profileUrl);
}
if(embedded)document.body.classList.add('profile-form-embedded');
const isUpdate=operation==='update';
document.title=(isUpdate?'Cập nhật ':'Thêm mới ')+config.title+' | HRM ESS';
document.getElementById('formTitle').textContent=(isUpdate?'Cập nhật ':'Thêm mới ')+config.title;

function normalizeDate(value){
  if(!value||typeof value!=='string')return '';
  const match=value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso=match?match[3]+'-'+match[2]+'-'+match[1]:value;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return '';
  const date=new Date(iso+'T00:00:00Z');
  return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===iso?iso:'';
}
function formatDate(value){return /^\d{4}-\d{2}-\d{2}$/.test(value||'')?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):value||''}
function initialValue(field){
  const value=isUpdate?(displayRecord[field.key]??(field.key.startsWith('relative-address-')?displayRecord[field.key.slice(17)]:undefined)):field.defaultValue;
  if(field.type==='checkbox')return value===true||value==='Có';
  if(field.type==='date')return normalizeDate(value);
  return typeof value==='string'&&!/^(?:N\/A|--|null|undefined)$/i.test(value.trim())?value:'';
}
for(const field of fields)state[field.key]=initialValue(field);
if(blockId==='tai-khoan-ngan-hang'&&!isUpdate){
  state['Bank Country']='Việt Nam';state['Payment currency']='VND';state.Payee='Nguyễn Quang';
}
if(blockId==='thong-tin-dinh-danh'&&!isUpdate)state['National ID Type']='Căn cước công dân';
if(blockId==='kinh-nghiem-lam-viec'&&isUpdate&&decisionFields.some(field=>state[field.key]))state['Decision to recognize professional titles']=true;

const places={
  'Việt Nam':{'Hà Nội':{'Cầu Giấy':['Dịch Vọng','Nghĩa Tân'],'Ba Đình':['Điện Biên','Kim Mã']},'TP. Hồ Chí Minh':{'TP. Thủ Đức':['Phường Thảo Điền','Phường An Khánh'],'Quận 1':['Phường Bến Nghé','Phường Bến Thành']},'Đà Nẵng':{'Hải Châu':['Thạch Thang','Bình Hiên']}},
  'Singapore':{'Singapore':{'Central':['Downtown Core','Orchard']}},
  'Hoa Kỳ':{'California':{'San Francisco':['SOMA','Mission']}}
};
const certificates=[
  {Category:'Công nghệ thông tin',Specialize:'Điện toán đám mây',Type:'Cloud',Name:'AWS Certified Cloud Practitioner',Level:'Foundation'},
  {Category:'Công nghệ thông tin',Specialize:'Điện toán đám mây',Type:'Cloud',Name:'Azure Fundamentals',Level:'Associate'},
  {Category:'An ninh thông tin',Specialize:'Bảo mật',Type:'Security',Name:'CompTIA Security+',Level:'Professional'}
];
const rewards=[
  {'Type Of Reward':'Cá nhân','Decision By':'Công ty','Rewards Category':'Khen thưởng cá nhân','Rewards Title':'Nhân viên xuất sắc'},
  {'Type Of Reward':'Tập thể','Decision By':'Tập đoàn','Rewards Category':'Khen thưởng tập thể','Rewards Title':'Tập thể xuất sắc'},
  {'Type Of Reward':'Cá nhân','Decision By':'Khác','Rewards Category':'Khen thưởng cá nhân','Rewards Title':'Khác'}
];
const unique=items=>[...new Set(items.filter(Boolean))];
function locationOptions(field){
  const prefix=field.key.startsWith('relative-address-')?'relative-address-':'';
  const country=state[prefix+'Country'];
  const city=state[prefix+'City'];
  const district=state[prefix+'District'];
  if(field.dependency==='country')return Object.keys(places);
  if(field.dependency==='city')return Object.keys(places[country]||{});
  if(field.dependency==='district')return Object.keys(places[country]?.[city]||{});
  return places[country]?.[city]?.[district]||[];
}
function selectOptions(field){
  if(['country','city','district','ward'].includes(field.dependency))return locationOptions(field);
  if(field.dependency?.startsWith('certificate-')){
    if(field.key==='Category')return unique(certificates.map(item=>item.Category));
    if(field.key==='Specialize')return unique(certificates.filter(item=>item.Category===state.Category).map(item=>item.Specialize));
    if(field.key==='Type')return unique(certificates.filter(item=>item.Category===state.Category&&item.Specialize===state.Specialize).map(item=>item.Type));
    return unique(certificates.filter(item=>(!state.Category||item.Category===state.Category)&&(!state.Specialize||item.Specialize===state.Specialize)&&(!state.Type||item.Type===state.Type)).map(item=>item.Name));
  }
  if(blockId==='chung-chi'&&field.key==='Level')return unique(certificates.filter(item=>!state.Type||item.Type===state.Type).map(item=>item.Level));
  if(blockId==='khen-thuong'&&field.key==='Rewards Title')
    return unique(rewards.filter(item=>['Type Of Reward','Decision By','Rewards Category'].every(key=>!state[key]||item[key]===state[key])).map(item=>item['Rewards Title']));
  return field.options||[];
}
function clearError(key){
  const wrapper=wrappers.get(key);
  if(!wrapper)return;
  const error=wrapper.querySelector('.form-error');
  error.textContent='';error.hidden=true;inputs.get(key)?.removeAttribute('aria-invalid');
}
function setError(key,message){
  const wrapper=wrappers.get(key);
  if(!wrapper)return;
  const error=wrapper.querySelector('.form-error');
  error.textContent=message;error.hidden=false;inputs.get(key)?.setAttribute('aria-invalid','true');
}
function updateInput(key){
  const input=inputs.get(key);
  if(!input)return;
  if(input.type==='checkbox')input.checked=!!state[key];
  else if(input.tagName==='OUTPUT')input.textContent=state[key]||'—';
  else input.value=fieldDefs.get(key)?.type==='date'?formatDate(state[key]):state[key]||'';
}
function clearFields(keys){
  for(const key of keys){state[key]='';updateInput(key);clearError(key)}
}
function refreshSelect(key){
  const input=inputs.get(key),field=fieldDefs.get(key);
  if(!input||input.tagName!=='SELECT')return;
  const options=[...selectOptions(field)];
  // An update form can show the current mock record even if the sample catalog is sparse.
  if(isUpdate&&!field.dependency&&state[key]&&!options.includes(state[key]))options.unshift(state[key]);
  input.replaceChildren(new Option('Chọn '+field.label.toLowerCase(),''));
  for(const value of unique(options))input.add(new Option(value,value));
  if(state[key]&&!options.includes(state[key])){state[key]='';clearError(key)}
  input.value=state[key]||'';
  input.disabled=field.dependency==='city'&&!state[key.startsWith('relative-address-')?'relative-address-Country':'Country']||
    field.dependency==='district'&&!state[key.startsWith('relative-address-')?'relative-address-City':'City']||
    field.dependency==='ward'&&!state[key.startsWith('relative-address-')?'relative-address-District':'District']||
    field.key==='Specialize'&&!state.Category||field.key==='Type'&&!state.Specialize;
}
function refreshSelects(){for(const field of fields)if(field.type==='select')refreshSelect(field.key)}
let calendar=null,calendarTrigger=null,calendarKey=null,calendarYear=0,calendarMonth=0;
const months=['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
function closeCalendar(){if(calendar)calendar.remove();calendar=null;calendarTrigger?.setAttribute('aria-expanded','false');calendarTrigger=null}
function renderCalendar(){
  if(!calendar)return;
  calendar.replaceChildren();
  const header=document.createElement('div');header.className='calendar-header';
  const previous=document.createElement('button');previous.type='button';previous.textContent='‹';previous.setAttribute('aria-label','Tháng trước');
  const next=document.createElement('button');next.type='button';next.textContent='›';next.setAttribute('aria-label','Tháng tiếp theo');
  const month=document.createElement('select');month.setAttribute('aria-label','Tháng');
  months.forEach((name,index)=>month.add(new Option(name,String(index),false,index===calendarMonth)));
  const year=document.createElement('select');year.setAttribute('aria-label','Năm');
  for(let value=1940;value<=2100;value++)year.add(new Option(String(value),String(value),false,value===calendarYear));
  previous.addEventListener('click',()=>{calendarMonth--;if(calendarMonth<0){calendarMonth=11;calendarYear--}renderCalendar()});
  next.addEventListener('click',()=>{calendarMonth++;if(calendarMonth>11){calendarMonth=0;calendarYear++}renderCalendar()});
  month.addEventListener('change',()=>{calendarMonth=Number(month.value);renderCalendar()});
  year.addEventListener('change',()=>{calendarYear=Number(year.value);renderCalendar()});
  header.append(previous,month,year,next);calendar.append(header);
  const days=document.createElement('div');days.className='calendar-days';
  for(const label of ['T2','T3','T4','T5','T6','T7','CN']){const day=document.createElement('span');day.textContent=label;days.append(day)}
  const offset=(new Date(Date.UTC(calendarYear,calendarMonth,1)).getUTCDay()+6)%7;
  for(let i=0;i<offset;i++)days.append(document.createElement('span'));
  const total=new Date(Date.UTC(calendarYear,calendarMonth+1,0)).getUTCDate();
  for(let day=1;day<=total;day++){
    const button=document.createElement('button');button.type='button';button.textContent=String(day);
    const iso=String(calendarYear).padStart(4,'0')+'-'+String(calendarMonth+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
    button.setAttribute('aria-label',formatDate(iso));
    if(state[calendarKey]===iso)button.className='selected';
    button.addEventListener('click',()=>{const key=calendarKey,trigger=calendarTrigger;state[key]=iso;updateInput(key);clearError(key);closeCalendar();trigger.focus()});
    days.append(button);
  }
  calendar.append(days);
}
function openCalendar(key,trigger){
  if(calendarTrigger===trigger){closeCalendar();return}
  closeCalendar();calendarKey=key;calendarTrigger=trigger;trigger.setAttribute('aria-expanded','true');
  const selected=normalizeDate(state[key]);const date=selected?new Date(selected+'T00:00:00Z'):new Date();
  calendarYear=date.getUTCFullYear();calendarMonth=date.getUTCMonth();
  calendar=document.createElement('div');calendar.id='calendarPopup';calendar.className='calendar-popup';calendar.setAttribute('role','dialog');calendar.setAttribute('aria-label','Chọn '+fieldDefs.get(key).label.toLowerCase());
  trigger.parentElement.append(calendar);renderCalendar();
}
function createField(field,index){
  const wrap=document.createElement('div');wrap.className='form-field';wrap.dataset.field=field.key;
  const id='form-field-'+index;
  let input;
  if(field.type==='checkbox'){
    wrap.classList.add('form-checkbox-field');
    input=document.createElement('input');input.type='checkbox';input.id=id;input.name=field.key;
    const label=document.createElement('label');label.htmlFor=id;label.textContent=field.label;
    wrap.append(input,label);
  }else{
    const label=document.createElement('label');label.htmlFor=id;label.textContent=field.label;
    if(field.required){const star=document.createElement('span');star.className='required-star';star.textContent=' *';star.setAttribute('aria-hidden','true');label.append(star)}
    if(field.type==='select')input=document.createElement('select');
    else if(field.type==='calculated')input=document.createElement('output');
    else{input=document.createElement('input');input.type='text'}
    input.id=id;input.name=field.key;
    if(field.type==='calculated')input.setAttribute('aria-live','polite');
    if(field.type==='date'){input.placeholder='dd/mm/yyyy';input.inputMode='numeric';input.maxLength=10}
    if(field.required&&field.type!=='calculated')input.setAttribute('aria-required','true');
    if(field.type==='date'){
      const control=document.createElement('div');control.className='date-control';control.append(input);
      const trigger=document.createElement('button');trigger.className='date-trigger';trigger.type='button';trigger.setAttribute('aria-label','Chọn '+field.label.toLowerCase());trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','calendarPopup');
      trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>';
      trigger.addEventListener('click',()=>openCalendar(field.key,trigger));
      control.append(trigger);wrap.append(label,control);
    }else wrap.append(label,input);
  }
  if(field.type!=='calculated')input.dataset.fieldKey=field.key;
  const error=document.createElement('span');error.className='form-error';error.id=id+'-error';error.hidden=true;
  input.setAttribute('aria-describedby',error.id);
  wrap.append(error);inputs.set(field.key,input);wrappers.set(field.key,wrap);
  return wrap;
}
let fieldIndex=0;
for(const section of sections){
  const group=document.createElement('section');
  group.className=section.title?'form-section':'form-section form-section-plain';
  if(section.title){const heading=document.createElement('h2');heading.textContent=section.title;group.append(heading)}
  const grid=document.createElement('div');grid.className='form-section-grid';
  for(const field of section.fields){
    grid.append(createField(field,fieldIndex++));
    if(field.key==='Decision to recognize professional titles'&&decisionFields.length){
      const conditional=document.createElement('div');conditional.className='conditional-section';conditional.id='workDecision';
      const heading=document.createElement('h2');heading.textContent='Thông tin quyết định công nhận chức danh nghề nghiệp';conditional.append(heading);
      const inner=document.createElement('div');inner.className='form-section-grid';
      for(const decision of decisionFields)inner.append(createField(decision,fieldIndex++));
      conditional.append(inner);grid.append(conditional);
    }
  }
  group.append(grid);fieldRoot.append(group);
}
if(embedded){
  const complex=['nguoi-than','trinh-do-hoc-van','chung-chi','kinh-nghiem-lam-viec','to-chuc-xa-hoi','khen-thuong','ky-luat'].includes(blockId);
  document.body.classList.toggle('profile-form-expanded',complex);
  const heading=document.querySelector('.form-heading');
  const close=document.getElementById('backArrow');close.setAttribute('aria-label','Đóng biểu mẫu');close.textContent='×';heading.append(close);
  const main=document.querySelector('.profile-form-page');
  main.before(heading);document.getElementById('backFooter').textContent='Hủy';
  if(complex){
    // Existing multi-section contracts retain their original grouping.
    if(sections.length===1){
      const dateKeys=new Set(fields.filter(f=>f.type==='date').map(f=>f.key));
      const groups=blockId==='kinh-nghiem-lam-viec'?
        [['Thời gian làm việc',fields.filter(f=>dateKeys.has(f.key)&&!decisionFields.includes(f)).map(f=>f.key)],['Thông tin công việc',fields.filter(f=>!dateKeys.has(f.key)&&!decisionFields.includes(f)&&!['Decision to recognize professional titles','Notes'].includes(f.key)).map(f=>f.key)],['Thông tin bổ sung',['Decision to recognize professional titles','Notes']]]:
        [['Thông tin thời gian',fields.filter(f=>dateKeys.has(f.key)).map(f=>f.key)],['Thông tin chi tiết',fields.filter(f=>!dateKeys.has(f.key)).map(f=>f.key)]];
      const original=fieldRoot.querySelector('.form-section');
      for(const [title,keys] of groups){
        if(!keys.some(key=>wrappers.has(key)))continue;
        const section=document.createElement('section');section.className='form-section';
        const h=document.createElement('h2');h.textContent=title;section.append(h);
        const grid=document.createElement('div');grid.className='form-section-grid';
        for(const key of keys){const wrap=wrappers.get(key);if(wrap)grid.append(wrap);if(key==='Decision to recognize professional titles'){const decision=document.getElementById('workDecision');if(decision)grid.append(decision)}}
        section.append(grid);fieldRoot.append(section);
      }
      original.remove();
    }
    const layout=document.createElement('div');layout.className='profile-form-layout';main.before(layout);
    const nav=document.createElement('nav');nav.className='profile-form-sections';nav.setAttribute('aria-label','Các phần biểu mẫu');
    const navHeading=document.createElement('h2');navHeading.textContent='Nội dung';nav.append(navHeading);
    const groups=[...fieldRoot.children];
    groups.forEach((group,index)=>{group.id='profile-form-section-'+index;const button=document.createElement('button');button.type='button';button.textContent=(index+1)+'. '+group.querySelector('h2').textContent;button.addEventListener('click',()=>{group.scrollIntoView({block:'start',behavior:'smooth'});group.querySelector('input,select')?.focus({preventScroll:true})});nav.append(button)});
    const updateNav=()=>{let active=0;const top=main.getBoundingClientRect().top+32;groups.forEach((group,i)=>{if(group.getBoundingClientRect().top<=top)active=i});nav.querySelectorAll('button').forEach((button,i)=>{if(i===active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})};
    main.addEventListener('scroll',updateNav);layout.append(nav,main);updateNav();
    const summary=document.createElement('aside');summary.className='profile-form-summary';
    const title=document.createElement('h2');title.textContent='Tóm tắt';summary.append(title);
    const list=document.createElement('dl');summary.append(list);layout.append(summary);
    function summaryItem(label,value){const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;list.append(dt,dd)}
    function updateSummary(){list.replaceChildren();summaryItem('Nhân viên','Nguyễn Quang · 01138569');summaryItem('Thông tin',config.title);summaryItem('Thao tác',isUpdate?'Cập nhật bản ghi':'Thêm mới bản ghi');const identity=fields.find(f=>f.type!=='date'&&f.type!=='checkbox'&&state[f.key]);if(identity)summaryItem(identity.label,state[identity.key]);}
    form.addEventListener('input',updateSummary);form.addEventListener('change',updateSummary);updateSummary();
  }
  // Constrain keyboard navigation to this embedded form, including its footer.
  document.addEventListener('keydown',event=>{if(event.key!=='Tab'||!document.getElementById('modalOverlay').hidden)return;const items=[...document.querySelectorAll('button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus()}});
  requestAnimationFrame(()=>inputs.values().next().value?.focus());
  if(!complex){const resize=()=>window.parent.postMessage({type:'profile-form-size',height:Math.ceil(form.getBoundingClientRect().height+document.querySelector('.form-heading').getBoundingClientRect().height+document.querySelector('.form-footer').getBoundingClientRect().height+40)},HrmEnvironment.targetOrigin);new ResizeObserver(resize).observe(form);resize();}
}
refreshSelects();
for(const field of fields)updateInput(field.key);

function syncCalculated(){
  if(blockId!=='nguoi-than'||!inputs.has('Full Name'))return;
  state['Full Name']=[state['Last Name'],state['Middle Name'],state['First Name']].filter(Boolean).join(' ').trim();
  updateInput('Full Name');
}
function syncConditions(){
  if(decisionFields.length){
    const on=!!state['Decision to recognize professional titles'];
    document.getElementById('workDecision').hidden=!on;
    if(!on)clearFields(decisionFields.map(field=>field.key));
  }
  if(blockId==='khen-thuong'){
    for(const [parent,value,child] of [['Decision By','Khác','Organize Rewards'],['Rewards Title','Khác','Other Rewards Title']]){
      const on=state[parent]===value;
      wrappers.get(child).hidden=!on;
      if(!on)clearFields([child]);
    }
  }
}
syncCalculated();syncConditions();
function updateLocation(key){
  const prefix=key.startsWith('relative-address-')?'relative-address-':'';
  const chain=[prefix+'Country',prefix+'City',prefix+'District',prefix+'Ward'];
  const index=chain.indexOf(key);
  if(index<0)return;
  for(const child of chain.slice(index+1)){
    const options=selectOptions(fieldDefs.get(child));
    if(!options.includes(state[child]))clearFields([child]);
  }
}
function updateCertificate(key){
  const chain=['Category','Specialize','Type','Name'];
  if(key==='Name'&&state.Name){
    const match=certificates.find(item=>item.Name===state.Name);
    if(match){for(const parent of chain.slice(0,3)){state[parent]=match[parent];updateInput(parent)}}
  }else if(chain.includes(key)){
    clearFields(chain.slice(chain.indexOf(key)+1));
    if(key!=='Name')clearFields(['Level']);
  }
}
function updateRewards(key){
  if(key==='Rewards Title'&&state[key]){
    const match=rewards.find(item=>item['Rewards Title']===state[key]);
    if(match){for(const parent of ['Type Of Reward','Decision By','Rewards Category'])if(!state[parent]){state[parent]=match[parent];updateInput(parent)}}
  }else if(['Type Of Reward','Decision By','Rewards Category'].includes(key)&&state['Rewards Title']){
    const current=rewards.find(item=>item['Rewards Title']===state['Rewards Title']);
    if(!current||['Type Of Reward','Decision By','Rewards Category'].some(parent=>state[parent]&&current[parent]!==state[parent]))clearFields(['Rewards Title']);
  }
}
form.addEventListener('input',event=>{
  const key=event.target.dataset.fieldKey;
  if(!key)return;
  state[key]=event.target.type==='checkbox'?event.target.checked:fieldDefs.get(key)?.type==='date'?(normalizeDate(event.target.value)||event.target.value):event.target.value;
  clearError(key);syncCalculated();
});
form.addEventListener('change',event=>{
  const key=event.target.dataset.fieldKey;
  if(!key)return;
  state[key]=event.target.type==='checkbox'?event.target.checked:fieldDefs.get(key)?.type==='date'?(normalizeDate(event.target.value)||event.target.value):event.target.value;
  if(fieldDefs.get(key)?.type==='date'&&normalizeDate(state[key]))updateInput(key);
  clearError(key);
  if((blockId==='dia-chi'||key.startsWith('relative-address-'))&&['Country','City','District','Ward'].some(part=>key===(key.startsWith('relative-address-')?'relative-address-':'')+part))updateLocation(key);
  if(blockId==='chung-chi')updateCertificate(key);
  if(blockId==='khen-thuong')updateRewards(key);
  refreshSelects();syncCalculated();syncConditions();
});
function isSectionActive(section){
  if(!section.optional)return true;
  return section.fields.some(field=>Boolean(state[field.key]));
}
function validate(){
  let first=null;
  for(const section of sections){
    const active=isSectionActive(section)||blockId==='nguoi-than'&&section.title==='Thông tin liên lạc'&&state['Is emergency']==='Có';
    for(const field of section.fields){
      if(!wrappers.get(field.key)||wrappers.get(field.key).hidden)continue;
      clearError(field.key);
      if(field.required&&active&&!state[field.key]){
        setError(field.key,'Vui lòng nhập '+field.label.toLowerCase()+'.');first??=inputs.get(field.key);
      }
    }
  }
  if(decisionFields.length&&state['Decision to recognize professional titles'])
    for(const field of decisionFields){clearError(field.key);if(field.required&&!state[field.key]){setError(field.key,'Vui lòng nhập '+field.label.toLowerCase()+'.');first??=inputs.get(field.key)}}
  for(const field of fields)if(field.type==='date'&&wrappers.get(field.key)&&!wrappers.get(field.key).hidden&&state[field.key]&&!normalizeDate(state[field.key])){
    setError(field.key,'Ngày không đúng định dạng dd/mm/yyyy.');first??=inputs.get(field.key);
  }
  const email=state['Email Address']||state.Email;
  const emailKey=state['Email Address']?'Email Address':'Email';
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError(emailKey,'Email không đúng định dạng.');first??=inputs.get(emailKey)}
  if(blockId==='thong-tin-dinh-danh'&&state.Country==='Việt Nam'&&state['National ID']){
    const type=state['National ID Type'];
    const valid=type==='Chứng minh nhân dân'?/^(?:\d{9}|\d{12})$/.test(state['National ID']):
      ['Căn cước công dân','Thẻ căn cước','Mã số định danh cá nhân'].includes(type)?/^\d{12}$/.test(state['National ID']):true;
    if(!valid){setError('National ID',type==='Chứng minh nhân dân'?'Chứng minh nhân dân cần 9 hoặc 12 chữ số.':'Loại định danh này cần đúng 12 chữ số.');first??=inputs.get('National ID')}
  }
  if(blockId==='nguoi-than'&&state.Country==='Việt Nam'&&state['National ID Number']){
    const valid=state['National ID Type']==='Chứng minh nhân dân'?/^(?:\d{9}|\d{12})$/.test(state['National ID Number']):/^\d{12}$/.test(state['National ID Number']);
    if(!valid){setError('National ID Number','Mã định danh cần 9 hoặc 12 chữ số theo loại đã chọn.');first??=inputs.get('National ID Number')}
  }
  const datePairs=blockId==='chung-chi'?[['Start Date','End date']]:blockId==='thong-tin-dinh-danh'?[['Issue Date','End Date']]:blockId==='kinh-nghiem-lam-viec'?[['Start date','End date'],['Effective start date','Effective end date']]:blockId==='nguoi-than'?[['Start Date','End Date']]:blockId==='to-chuc-xa-hoi'?[['Start Date','End Date'],['Start Date of the Position','End Date of the Position']]:[];
  for(const [start,end] of datePairs)if(normalizeDate(state[start])&&normalizeDate(state[end])&&state[end]<state[start]){setError(end,'Ngày kết thúc không được trước ngày bắt đầu.');first??=inputs.get(end)}
  const today=new Date().toISOString().slice(0,10);
  const limitedDates=blockId==='chung-chi'?['Start Date']:blockId==='kinh-nghiem-lam-viec'&&!isUpdate?['Start date','End date']:[];
  for(const key of limitedDates)if(normalizeDate(state[key])&&state[key]>today){setError(key,'Ngày không được sau ngày hiện tại.');first??=inputs.get(key)}
  if(blockId==='thong-tin-dinh-danh'&&state['Issue Date']){
    const birth=normalizeDate(window.profileMockFixtures['thong-tin-co-ban']['Date of Birth']);
    if(birth&&state['Issue Date']<=birth){setError('Issue Date','Ngày cấp phải sau ngày sinh.');first??=inputs.get('Issue Date')}
  }
  if(first){first.focus();first.scrollIntoView({block:'center',behavior:'smooth'});return false}
  return true;
}
const overlay=document.getElementById('modalOverlay');
const modalTitle=document.getElementById('modalTitle');
const modalBody=document.getElementById('modalBody');
const modalPrimary=document.getElementById('modalPrimary');
const modalSecondary=document.getElementById('modalSecondary');
const modalActions=document.getElementById('modalActions');
const modalClose=document.getElementById('modalClose');
const modalIcon=document.getElementById('modalIcon');
// Portal the confirmation above the complete host shell, including its border/shadow.
const hostDialog=embedded?window.parent.document.querySelector('.profile-editor-dialog'):null;
if(hostDialog)hostDialog.parentElement.append(overlay);
let modalKind=null,returnFocus=null;
function hideModal(){overlay.hidden=true;modalKind=null;if(hostDialog)hostDialog.inert=false;returnFocus?.focus()}
if(hostDialog)overlay.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(modalKind!=='success')hideModal();return}
  if(event.key==='Tab'){
    const items=[...overlay.querySelectorAll('button:not([hidden])')].filter(el=>el.getClientRects().length);
    const active=overlay.ownerDocument.activeElement;
    if(event.shiftKey&&active===items[0]){event.preventDefault();items.at(-1).focus()}
    else if(!event.shiftKey&&active===items.at(-1)){event.preventDefault();items[0].focus()}
  }
});
window.requestProfileFormClose=()=>{if(modalKind==='success')returnToProfile(true);else showModal('back')};
function showModal(kind){
  returnFocus=document.activeElement;modalKind=kind;if(hostDialog)hostDialog.inert=true;overlay.hidden=false;
  const success=kind==='success';modalClose.hidden=!success;modalIcon.hidden=!success;modalActions.hidden=success;
  modalTitle.textContent=success?'Đã gửi yêu cầu cập nhật':kind==='back'?'Xác nhận quay lại':'Xác nhận cập nhật';
  modalBody.textContent=success?'Yêu cầu cập nhật thông tin của bạn đã được gửi thành công. Vui lòng chờ hệ thống xử lý và xác nhận.':kind==='back'?'Thông tin đã thay đổi sẽ không được lưu. Bạn có chắc chắn muốn quay lại?':'Bạn chắc chắn muốn gửi yêu cầu cập nhật';
  modalSecondary.textContent=kind==='back'?'Ở lại':'Thoát';
  modalPrimary.textContent=kind==='back'?'Quay lại':'Đồng ý';
  (success?modalClose:modalSecondary).focus();
}
document.getElementById('backArrow').addEventListener('click',()=>showModal('back'));
document.getElementById('backFooter').addEventListener('click',()=>showModal('back'));
document.getElementById('submitForm').addEventListener('click',()=>showModal('submit'));
modalSecondary.addEventListener('click',hideModal);
modalPrimary.addEventListener('click',()=>{if(modalKind==='back')returnToProfile();else{hideModal();if(validate()){window.HrmProfileRecords.submit(blockId,state,{operation,entityId});showModal('success')}}});
modalClose.addEventListener('click',()=>returnToProfile(true));
overlay.addEventListener('click',event=>{if(event.target===overlay&&modalKind!=='success')hideModal()});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    if(!overlay.hidden&&modalKind!=='success'){event.preventDefault();hideModal()}
    else if(calendar){closeCalendar()}else if(embedded){event.preventDefault();showModal('back')}else{closeMenu();closeAvatar()}
  }
  if(event.key==='Tab'&&!overlay.hidden){
    const focusables=[...overlay.querySelectorAll('button:not([hidden])')].filter(element=>element.getClientRects().length>0);
    if(event.shiftKey&&document.activeElement===focusables[0]){event.preventDefault();focusables.at(-1).focus()}
    else if(!event.shiftKey&&document.activeElement===focusables.at(-1)){event.preventDefault();focusables[0].focus()}
  }
});
const menuButton=document.getElementById('menuButton');
const menu=document.getElementById('floatingMenu');
const avatarButton=document.getElementById('avatarButton');
const avatarMenu=document.getElementById('avatarMenu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false')}
function closeAvatar(){avatarMenu.hidden=true;avatarButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const open=menu.hidden;closeAvatar();menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open))});
avatarButton.addEventListener('click',()=>{const open=avatarMenu.hidden;closeMenu();avatarMenu.hidden=!open;avatarButton.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',event=>{
  if(calendar&&!calendar.contains(event.target)&&!calendarTrigger?.contains(event.target))closeCalendar();
  const action=event.target.closest('[data-open]');
  if(action){window.HrmNotifications?.dismissUndo();document.getElementById('toastMessage').textContent='Đã chọn: '+action.dataset.open;document.getElementById('toast').hidden=false;closeMenu();closeAvatar();return}
  if(!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
  if(!avatarMenu.contains(event.target)&&!avatarButton.contains(event.target))closeAvatar();
});
document.getElementById('toastClose').addEventListener('click',()=>document.getElementById('toast').hidden=true);
}
