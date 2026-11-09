
/* =====================================================================
   SAMPLE DATA — in the real product this comes from the BPM + HRM API
   ===================================================================== */
var ME={name:'Nguyễn Văn An',code:'NV-00412',title:'Sales Specialist',dept:'Sales Department',
  manager:'Trần Văn Dũng',managerId:'dungvt4',hr:'Phạm Thu Hà',email:'an.nv@congty.vn',
  phone:'0912 345 678',joined:'02/03/2022',contract:'Indefinite term'};

var I={
  doc:'<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>',
  home:'<path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  tick:'<path d="M9 11l2.5 2.5L16 8"/><circle cx="12" cy="12" r="9"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  ticket:'<path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z"/><path d="M13 5v14"/>',
  arrow:'<path d="M9 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  warn:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  up:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/>',
  file:'<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>',
  money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  plane:'<path d="M17 10l4-2a1.5 1.5 0 0 0-1-2.8L4 9 2 7.5 1 9l2.5 3L2 15l1 1.5L5 15l16 3.8a1.5 1.5 0 0 0 1-2.8l-4-2"/>',
  clock2:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  swap:'<path d="M7 4v13M4 14l3 3 3-3M17 20V7M14 10l3-3 3 3"/>',
  exit:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  undo:'<path d="M3 7v6h6"/><path d="M3.5 13a9 9 0 1 0 2.1-6"/>',
  print:'<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"/><path d="M6 14h12v7H6z"/>'
};
function svg(p,c){return '<svg viewBox="0 0 24 24" class="'+(c||'')+'">'+p+'</svg>'}

/* --- Ticket type catalog: configurable in the Admin portal --- */
/* =====================================================================
   FORM LAYOUT — 12-column grid, shared by the 3 portals (FR-BC-01/02/08, FR-BC-34)
   Fields: w (3/4/6/8/9/12) · nl (start new row) · bl (left divider) · rows (3/5/8)
   Presentation elements: section (section title) · note · divider (horizontal rule)
   ===================================================================== */
var BC_STEPS=[3,4,6,8,9,12];
function bcType(t){ return ({textarea:'area',readonly:'ro'})[t]||t }
function bcIsData(f){ var t=bcType(f.t); return t!=='section'&&t!=='note'&&t!=='divider' }
/* Only section titles and dividers are always full width; every other field can span 2–12 columns */
function bcFull(f){ var t=bcType(f.t); return t==='section'||t==='divider' }
function bcDefW(f){ var t=bcType(f.t); return (bcFull(f)||t==='area'||t==='file'||t==='table'||t==='radio'||t==='check'||t==='note')?12:6 }
function bcW(f){ if(bcFull(f)) return 12; var w=Math.round(+f.w); return (w>=2&&w<=12)?w:bcDefW(f) }
/* Derive rows: max 4 fields, total width at most 12; section title / divider on their own row */
function bcRows(form,skip){
  var out=[],cur=null;
  (form||[]).forEach(function(f,i){
    if(skip&&skip(f)) return;
    var t=bcType(f.t);
    if(t==='section'||t==='divider'){ out.push({k:t,items:[{f:f,i:i,w:12}]}); cur=null; return }
    var w=bcW(f);
    if(!cur||f.nl||cur.sum+w>12||cur.items.length>=4){ cur={k:'row',items:[],sum:0}; out.push(cur) }
    cur.items.push({f:f,i:i,w:w}); cur.sum+=w;
  });
  return out;
}
/* Note: **bold**, *italic*, [text](https://link) */
function bcNote(s){
  return esc(s||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>')
    .replace(/\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
}
var BC_FILE='<svg viewBox="0 0 24 24"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>';
/* Value in read-only mode (FR-BC-34) */
function bcRoVal(f,o){
  var t=bcType(f.t), v=o.val?o.val(f):'';
  if(t==='file'){
    var fs=o.files?o.files(f):[];
    return fs.length?fs.map(function(x){
      return '<a class="bc-file" href="javascript:void(0)" onclick="'+(o.fileClick?o.fileClick(x):'')+'">'+BC_FILE+esc(x.n||x)+'</a>';
    }).join(''):'<span class="bc-empty">—</span>';
  }
  if(v===undefined||v===null||String(v).trim()==='') return '<span class="bc-empty">—</span>';
  if(t==='area') return '<span class="bc-pre">'+esc(v)+'</span>';
  return esc(v);
}
/* o.mode: 'edit' | 'ro' ; o.input(f) returns input HTML (edit) ; o.val(f), o.files(f) (ro) */
function bcRender(form,o){
  o=o||{};
  var ro=o.mode==='ro';
  var skip=function(f){
    if(bcType(f.t)==='note'&&ro&&!f.ro) return true;     /* input guidance notes hidden when viewing a ticket */
    return o.skip?o.skip(f):false;
  };
  var rows=bcRows(form,skip);
  if(!rows.length) return o.empty||'';
  return '<div class="bc'+(ro?' bc-ro':'')+'">'+rows.map(function(r){
    var f0=r.items[0].f;
    if(r.k==='section') return '<div class="bc-sec">'+esc(f0.l||'Section title')+'</div>';
    if(r.k==='divider') return '<hr class="bc-hr">';
    return '<div class="bc-row">'+r.items.map(function(it){
      var f=it.f, t=bcType(f.t), cls='bc-c'+(f.bl?' bl':''), st=' style="grid-column:span '+it.w+'"';
      if(t==='note') return '<div class="'+cls+'"'+st+'><div class="bc-note '+(f.tone==='warn'?'warn':'info')+'">'+bcNote(f.text)+'</div></div>';
      if(ro) return '<div class="'+cls+'"'+st+'><div class="bc-lb">'+esc(f.l)+'</div><div class="bc-v">'+bcRoVal(f,o)+'</div></div>';
      return '<div class="'+cls+'"'+st+'>'+o.input(f)+'</div>';
    }).join('')+'</div>';
  }).join('')+'</div>';
}
/* Legacy tickets only have label–value pairs: build them into fields to display in the same read-only style */
function bcPairs(fi){
  var form=[],val={};
  (fi||[]).forEach(function(p,i){
    var k='p'+i, long=String(p[1]).length>48;
    form.push({k:k,l:p[0],t:long?'area':'text'}); val[k]=p[1];
  });
  return {form:form,val:val};
}
/* Compact "Approved levels" block: one line per level (spec assumption 1) */
function bcApprovals(sp,whoFmt){
  return (sp||[]).filter(function(s,i){ return i>0&&s.at&&(s.s==='done'||s.s==='rej')&&/approv|confirm/i.test(s.t) }).map(function(s){
    var note=s.note||'', kq=s.s==='rej'?'Rejected':/confirm/i.test(s.t)?'Confirmed':'Approved';
    var cls=s.s==='rej'?'rej':'ok';
    return '<div class="bc-apl"><b>'+esc(s.t)+'</b> · '+(whoFmt?whoFmt(s):esc(s.w))+' · <b class="'+cls+'">'+kq+'</b> · <span class="num">'+esc(s.at)+'</span>'+
      (note?' · “'+esc(note)+'”':'')+'</div>';
  }).join('');
}

/* Forms follow the Submit ticket node layout designed in the Admin portal (w, nl, bl, rows, section, divider) */
var TYPES={
'nghi-phep':{n:'Leave',i:I.cal,g:'HR',d:'Annual leave, unpaid leave, sick leave, statutory leave.',sla:24,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'HR Head approval',w:'Phạm Thu Hà',s:'Only if leave exceeds 2 days',cond:1},
        {t:'Update timesheet',w:'HRM System',s:'Automatic'}],
  f:[{k:'secTT',t:'section',l:'Leave information'},
     {k:'loai',l:'Leave type',t:'select',o:['Annual leave','Unpaid leave','Sick leave (social insurance)','Maternity leave','Paid personal leave'],r:1},
     {k:'tu',l:'From date',t:'date',r:1,w:3},{k:'den',l:'To date',t:'date',r:1,w:3},
     {k:'buoi',l:'Session',t:'select',o:['Full day','Morning only','Afternoon only']},
     {k:'so',l:'Number of days',t:'text',v:'3',h:'Calculated automatically from the work calendar, excluding public holidays',ro:1,bl:1},
     {k:'hrBG',t:'divider'},
     {k:'bangiao',l:'Handover person',t:'select',o:['Lê Thị Mai (NV-00398)','Hoàng Minh Tuấn (NV-00421)','No handover needed']},
     {k:'ly',l:'Reason',t:'area',r:1,full:1},
     {k:'file',l:'Attachments',t:'file',h:'Required for sick leave of 2+ days: social insurance leave certificate',full:1,link:1}]},

'ot':{n:'Overtime request',i:I.clock2,g:'HR',d:'Register OT on weekdays, weekends, public holidays or night shifts.',sla:24,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'HR Head approval',w:'Phạm Thu Hà',s:'When monthly OT exceeds 40 hours',cond:1},
        {t:'Record to timesheet',w:'HRM System',s:'Automatic'}],
  f:[{k:'ngay',l:'Overtime date',t:'date',r:1},
     {k:'loai',l:'Day type',t:'select',o:['Weekday (150%)','Weekly day off (200%)','Public holiday / Tet (300%)','Night shift (extra 30%)'],r:1},
     {k:'tu',l:'From time',t:'time',r:1},{k:'den',l:'To time',t:'time',r:1},
     {k:'so',l:'Number of hours',t:'text',v:'3',ro:1,h:'Calculated automatically, excluding break time'},
     {k:'duan',l:'Project / task',t:'select',o:['ERP project phase 2','Q3 figures closing','After-hours customer support']},
     {k:'ly',l:'Work description',t:'area',r:1,full:1}]},

'cong-tac':{n:'Business trip',i:I.plane,g:'HR',d:'Register a domestic or overseas business trip, with an expense estimate.',sla:24,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'Director approval',w:'Vũ Quốc Hưng',s:'When overseas or longer than 5 days',cond:1},
        {t:'Accounting advance',w:'Accounting Department',s:'If an advance is requested',cond:1}],
  f:[{k:'noi',l:'Destination',t:'text',r:1},
     {k:'pv',l:'Scope',t:'select',o:['Domestic','Overseas'],r:1},
     {k:'tu',l:'From date',t:'date',r:1},{k:'den',l:'To date',t:'date',r:1},
     {k:'pt',l:'Transport',t:'select',o:['Plane','Company car','Train','Self-arranged']},
     {k:'ut',l:'Advance request (VND)',t:'text',h:'Leave blank if no advance'},
     {k:'md',l:'Purpose of trip',t:'area',r:1,full:1}]},

'tang-luong':{n:'Salary increase proposal',i:I.money,g:'Pay & benefits',d:'Propose a salary adjustment for yourself or a subordinate employee.',sla:24,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'Director approval',w:'Vũ Quốc Hưng',s:'When increase exceeds 10%',cond:1},
        {t:'Update payroll',w:'HR Department',s:'Effective from next pay period'}],
  f:[{k:'nv',l:'Proposed employee',t:'text',v:'Nguyễn Văn An (NV-00412)',ro:1},
     {k:'ht',l:'Current salary (VND)',t:'text',v:'18,000,000',ro:1},
     {k:'dx',l:'Proposed salary (VND)',t:'text',r:1},
     {k:'pt',l:'Increase',t:'text',v:'—',ro:1,h:'Calculated automatically when proposed salary is entered'},
     {k:'hl',l:'Effective from pay period',t:'select',o:['October 2026','November 2026','December 2026'],r:1},
     {k:'ly',l:'Basis for proposal',t:'area',r:1,full:1,h:'State work results, contributions and market comparison'}]},

'tam-ung':{n:'Advance / payment',i:I.money,g:'Pay & benefits',d:'Request an expense advance or reimbursement settlement after a business trip.',sla:48,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'Chief Accountant approval',w:'Đỗ Thanh Bình',s:'SLA 48 hours'},
        {t:'Disbursement',w:'Accounting Department',s:'Per weekly payment schedule'}],
  f:[{k:'loai',l:'Request type',t:'select',o:['Advance','Advance settlement','Payment of incurred expenses'],r:1},
     {k:'st',l:'Amount (VND)',t:'text',r:1},
     {k:'ht',l:'Receiving method',t:'select',o:['Bank transfer','Cash']},
     {k:'hd',l:'Date needed',t:'date'},
     {k:'ly',l:'Expense description',t:'area',r:1,full:1},
     {k:'file',l:'Supporting documents',t:'file',h:'Invoices, receipts — required for advance settlement',full:1}]},

'doi-ca':{n:'Shift change',i:I.swap,g:'Timekeeping',d:'Request a shift change, make-up work or a shift swap with a colleague.',sla:12,
  flow:[{t:'Swap partner confirmation',w:'Colleague',s:'SLA 12 hours'},
        {t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'Update work schedule',w:'HRM System',s:'Automatic'}],
  f:[{k:'ngay',l:'Date to change',t:'date',r:1},
     {k:'ca',l:'Current shift',t:'select',o:['Office hours shift (08:00–17:00)','Morning shift (06:00–14:00)','Afternoon shift (14:00–22:00)','Night shift (22:00–06:00)'],r:1},
     {k:'canew',l:'Shift to change to',t:'select',o:['Office hours shift (08:00–17:00)','Morning shift (06:00–14:00)','Afternoon shift (14:00–22:00)','Night shift (22:00–06:00)'],r:1},
     {k:'nguoi',l:'Swap with',t:'select',o:['No swap, shift change only','Lê Thị Mai (NV-00398)','Hoàng Minh Tuấn (NV-00421)']},
     {k:'ly',l:'Reason',t:'area',r:1,full:1}]},

'xac-nhan-cong':{n:'Timesheet confirmation',i:I.clock,g:'Timekeeping',d:'Explain a missed or incomplete clock-in/out or a faulty time clock.',sla:24,
  flow:[{t:'Line manager confirmation',w:'Trần Văn Dũng',s:'SLA 24 hours'},
        {t:'HR timesheet update',w:'Phạm Thu Hà',s:'Before timesheet period lock'}],
  f:[{k:'ngay',l:'Date to confirm',t:'date',r:1},
     {k:'loai',l:'Case',t:'select',o:['Forgot check-in','Forgot check-out','Forgot both','Faulty time clock','Worked outside the office'],r:1},
     {k:'vao',l:'Actual start time',t:'time',r:1},{k:'ra',l:'Actual end time',t:'time',r:1},
     {k:'ly',l:'Explanation',t:'area',r:1,full:1},
     {k:'file',l:'Supporting evidence',t:'file',h:'Screenshots, emails, meeting minutes… if any',full:1}]},

'thoi-viec':{n:'Resignation',i:I.exit,g:'HR',d:'Give notice of labor contract termination and hand over work.',sla:72,
  flow:[{t:'Line manager approval',w:'Trần Văn Dũng',s:'SLA 72 hours'},
        {t:'HR Head approval',w:'Phạm Thu Hà',s:'SLA 72 hours'},
        {t:'Director approval',w:'Vũ Quốc Hưng',s:'SLA 72 hours'},
        {t:'Handover & benefits settlement',w:'HR + Accounting',s:'Per resignation workflow'}],
  f:[{k:'ngay',l:'Desired last working day',t:'date',r:1,h:'At least 45 days notice required for an indefinite-term labor contract'},
     {k:'bao',l:'Notice days',t:'text',v:'45',ro:1},
     {k:'bg',l:'Handover recipient',t:'select',o:['Lê Thị Mai (NV-00398)','Hoàng Minh Tuấn (NV-00421)','Not yet determined']},
     {k:'ly',l:'Reason for resignation',t:'area',r:1,full:1}]},

'ticket-it':{n:'IT / Admin request',i:I.ticket,g:'Support',d:'Report equipment faults, request access, book meeting rooms, order office supplies.',sla:8,
  flow:[{t:'Intake & triage',w:'Support team',s:'Response SLA 8 hours'},
        {t:'Handling',w:'Assigned technician',s:'By priority'},
        {t:'Requester confirmation',w:'Nguyễn Văn An',s:'Close ticket'}],
  f:[{k:'nhom',l:'Request category',t:'select',o:['Devices & hardware','Accounts & permissions','Internal software','Network & connectivity','Admin - office'],r:1},
     {k:'ut',l:'Priority',t:'select',o:['Low — does not affect work','Medium — a workaround exists','High — unable to work','Urgent — affects many people'],r:1},
     {k:'td',l:'Title',t:'text',r:1,full:1},
     {k:'mt',l:'Detailed description',t:'area',r:1,full:1,h:'Describe the symptom, when it occurred and what you have tried'},
     {k:'file',l:'Screenshot',t:'file',full:1}]}
};


/* CR-01 — scope of application by unit; CR-08 — workflow locks approver self-selection */
TYPES['thoi-viec'].tuChon=false;
TYPES['dat-phong-hop']={n:'Meeting room booking',i:I.cal,g:'Support',d:'Book a meeting room at the FPT IS office.',sla:8,phamVi:['fptis'],
  flow:[{t:'Administration processing',w:'Administration',s:'SLA 8 hours'},{t:'Requester confirms',w:'Submitter',s:'Close ticket'}],
  f:[{k:'ngay',l:'Meeting date',t:'date',r:1},{k:'ly',l:'Content',t:'area',r:1,full:1}]};
TYPES['profile-update']={n:'Employee Profile Update',i:I.user,g:'HR',d:'',noStart:1,sla:0,
  flow:[{t:'HR approves profile change',w:'Phạm Thu Hà',s:''}],f:[]};
/* v7 - SLA removed from Employee Portal */
Object.keys(TYPES).forEach(function(k){ TYPES[k].flow.forEach(function(s){ if(/^SLA/.test(s.s||'')) s.s='' }) });

/* =====================================================================
   CR-01 - UNIT (sample data, simulating HRM)
   ===================================================================== */
ME.u='annv'; ME.donvi='fsoft';
var UNITS={fsoft:'Fsoft',fptis:'FPT IS'};
function typeKeys(all){
  return Object.keys(TYPES).filter(function(k){ return (TYPES[k].phamVi||['fsoft']).indexOf(ME.donvi)>=0&&(all||!TYPES[k].noStart) });
}

/* =====================================================================
   CR-06 - SELECT APPROVER ON TICKET
   Directory includes accounts of all units (ĐC-02) - in the real product fetched via search API
   ===================================================================== */
var DANHBA=[
 {u:'hungvq',n:'Vũ Quốc Hưng',cd:'Director',pb:'Board of Directors',dv:'fsoft',tt:1},
 {u:'dungvt4',n:'Trần Văn Dũng',cd:'Department Head',pb:'Sales Department',dv:'fsoft',tt:1},
 {u:'haptt',n:'Phạm Thu Hà',cd:'Department Head',pb:'HR Department',dv:'fsoft',tt:1},
 {u:'binhdt',n:'Đỗ Thanh Bình',cd:'Chief Accountant',pb:'Accounting Department',dv:'fsoft',tt:1},
 {u:'annv',n:'Nguyễn Văn An',cd:'Specialist',pb:'Sales Department',dv:'fsoft',tt:1},
 {u:'mailt',n:'Lê Thị Mai',cd:'Specialist',pb:'Sales Department',dv:'fsoft',tt:1},
 {u:'tuanhm',n:'Hoàng Minh Tuấn',cd:'Team Leader',pb:'Sales Department',dv:'fsoft',tt:1},
 {u:'sonpt',n:'Phan Thanh Sơn',cd:'Employee',pb:'Sales Department',dv:'fsoft',tt:1},
 {u:'huylq',n:'Lê Quang Huy',cd:'Specialist',pb:'IT Department',dv:'fsoft',tt:1},
 {u:'lannt',n:'Ngô Thị Lan',cd:'Specialist',pb:'Administration Department',dv:'fsoft',tt:0},
 {u:'khanhlv',n:'Lê Văn Khánh',cd:'Director',pb:'Board of Directors',dv:'fptis',tt:1},
 {u:'namnv',n:'Nguyễn Văn Nam',cd:'Department Head',pb:'HR Department',dv:'fptis',tt:1},
 {u:'hoatt',n:'Trần Thị Hoa',cd:'Department Head',pb:'Solutions Department',dv:'fptis',tt:1},
 {u:'ducpm',n:'Phạm Minh Đức',cd:'Specialist',pb:'Solutions Department',dv:'fptis',tt:1}
];
function accBy(u){ return DANHBA.filter(function(x){return x.u===u})[0]||null }

/* Configurable workflow parameters (condition thresholds) - no hard-coded numbers in code */
var NGUONG={NGUONG_NGAY_CAP2:2,NGUONG_PHAN_TRAM:10,TRAN_OT_THANG:40,NGUONG_NGAY_CT:5};

/* Working days (Mon - Fri) between two dates, inclusive of both ends */
function apWorkdays(a,b){
  if(!a||!b) return null;
  var d1=new Date(a+'T00:00:00'), d2=new Date(b+'T00:00:00');
  if(isNaN(d1)||isNaN(d2)||d2<d1) return null;
  var n=0; for(var d=new Date(d1);d<=d2;d.setDate(d.getDate()+1)){ var w=d.getDay(); if(w!==0&&w!==6) n++ }
  return n;
}
function apMoney(s){ var x=String(s||'').replace(/[^\d]/g,''); return x?+x:null }

/* Which steps need an approver. kind: task = approval step by one person · queue = department / team handles it
   · sys = system · self = the submitter. ifx(v) returns true / false / null (null = not enough data to calculate).
   ext = condition uses data outside the form → selection always required (BR-ND-04). */
var APMETA={
 'nghi-phep':[
   {id:'n2',kind:'task',ug:'dungvt4'},
   {id:'n4',kind:'task',ug:'haptt',dep:'Leave over threshold?',
    ifx:function(v){ var s=parseFloat(String(v.so||'').replace(',','.')); return isNaN(s)?null:s>NGUONG.NGUONG_NGAY_CAP2 },
    ifw:function(v){ return 'leave ticket of '+v.so+(parseFloat(v.so)===1?' day':' days')+' (> '+NGUONG.NGUONG_NGAY_CAP2+' days)' },
    ifl:'leave exceeds '+NGUONG.NGUONG_NGAY_CAP2+' days'},
   {kind:'sys'}],
 'ot':[
   {id:'o2',kind:'task',ug:'dungvt4'},
   {id:'o4',kind:'task',ug:'haptt',dep:'Monthly OT cap exceeded?',ext:'Only used when monthly OT exceeds '+NGUONG.TRAN_OT_THANG+' hours'},
   {kind:'sys'}],
 'cong-tac':[
   {id:'c2',kind:'task',ug:'dungvt4'},
   {id:'c3',kind:'task',ug:'hungvq',dep:'Overseas or over 5 days?',ifl:'business trip is overseas or exceeds '+NGUONG.NGUONG_NGAY_CT+' days',
    ifx:function(v){ var d=apWorkdays(v.tu,v.den); if(v.pv==='Overseas') return true; if(!v.pv||d===null) return null; return d>NGUONG.NGUONG_NGAY_CT },
    ifw:function(v){ return v.pv==='Overseas'?'overseas business trip':'business trip of '+apWorkdays(v.tu,v.den)+' days (> '+NGUONG.NGUONG_NGAY_CT+' days)' }},
   {kind:'queue'}],
 'tang-luong':[
   {id:'s2',kind:'task',ug:'dungvt4'},
   {id:'s4',kind:'task',ug:'hungvq',dep:'Raise over threshold %?',ifl:'salary increase exceeds '+NGUONG.NGUONG_PHAN_TRAM+'%',
    ifx:function(v){ var a=apMoney(v.ht), b=apMoney(v.dx); if(!a||!b) return null; return (b-a)/a*100>NGUONG.NGUONG_PHAN_TRAM },
    ifw:function(v){ var a=apMoney(v.ht), b=apMoney(v.dx); return 'salary increase of '+((b-a)/a*100).toFixed(1)+'% (> '+NGUONG.NGUONG_PHAN_TRAM+'%)' }},
   {kind:'queue'}],
 'tam-ung':[{id:'a2',kind:'task',ug:'dungvt4'},{id:'a3',kind:'task',ug:'binhdt'},{kind:'queue'}],
 'doi-ca':[
   {id:'d1',kind:'task',ugf:function(v){ return /Lê Thị Mai/.test(v.nguoi||'')?'mailt':/Hoàng Minh Tuấn/.test(v.nguoi||'')?'tuanhm':'' },
    ifl:'swapping shifts with a colleague',
    ifx:function(v){ return v.nguoi?!/^No swap/.test(v.nguoi):null },
    ifw:function(){ return 'a shift swap with a colleague' }},
   {id:'d2',kind:'task',ug:'dungvt4'},{kind:'sys'}],
 'xac-nhan-cong':[{id:'x2',kind:'task',ug:'dungvt4'},{kind:'queue'}],
 'thoi-viec':[{id:'t2',kind:'task',ug:'dungvt4'},{id:'t3',kind:'task',ug:'haptt'},{id:'t4',kind:'task',ug:'hungvq'},{kind:'queue'}],
 'ticket-it':[{kind:'queue'},{kind:'queue'},{kind:'self'}],
 'dat-phong-hop':[{kind:'queue'},{kind:'self'}],
 'profile-update':[{id:'pf2',kind:'task',ug:'haptt'}]
};

/* ---- Save "previous approver" (BR-ND-08..10) - demo uses localStorage, real version stores it in BPM ---- */
var LS_LAST='bpm-nguoiduyet-gannhat', LS_MODE='bpm-cachchon-nguoiduyet';
var LAST_SEED={'NV-00412|nghi-phep|n2':'tuanhm','NV-00412|nghi-phep|n4':'lannt'};
var RECENT_SEED=['tuanhm','haptt'];
function lsGet(k,d){ try{ var s=localStorage.getItem(k); return s?JSON.parse(s):d }catch(e){ return d } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)) }catch(e){} }
function lastMap(){ return lsGet(LS_LAST,LAST_SEED) }
function apRecent(){
  var m=lastMap(), out=[];
  Object.keys(m).forEach(function(k){ if(k.indexOf(ME.code+'|')===0&&out.indexOf(m[k])<0) out.push(m[k]) });
  RECENT_SEED.forEach(function(u){ if(out.indexOf(u)<0) out.push(u) });
  return out.filter(function(u){ var p=accBy(u); return p&&p.tt&&p.u!==ME.u }).slice(0,5);
}

/* ---- State of the "Approver" card ---- */
var AP=null;
function apSteps(k){
  var m=APMETA[k]||[];
  return TYPES[k].flow.map(function(s,i){
    var x=m[i]||{kind:'sys'}, o={i:i,t:s.t,w:s.w,s:s.s,cond:s.cond};
    for(var p in x) o[p]=x[p];
    if(!o.id) o.id='s'+i;
    return o;
  });
}
function apCanChoose(k){ return false } /* The submitter does not choose approvers (REF-05 v0.6) */
function apVals(){
  var v={}; (TYPES[AP.k].f||[]).forEach(function(f){ var e=document.getElementById('f_'+f.k); if(e) v[f.k]=e.value });
  return v;
}
/* need: yes = required · no = not applicable · unk = not enough data · ext = uses data outside the form */
function apNeed(s,v){
  if(s.kind!=='task') return 'na';
  if(s.ext) return 'ext';
  if(!s.ifx) return 'yes';
  var r=s.ifx(v); return r===null?'unk':r?'yes':'no';
}
function apUG(s,v){ return s.ugf?s.ugf(v):s.ug }
function apOpen(k){
  var modes=lsGet(LS_MODE,{});
  AP={k:k,mode:'UserGroup',sel:{},txt:{},err:{},pre:{},note:{},open:null,hi:0,filled:0};
  if(AP.mode==='TuChon') apPrefill();
}
function apPrefill(){
  if(AP.filled) return; AP.filled=1;
  var m=lastMap();
  apSteps(AP.k).forEach(function(s){
    if(s.kind!=='task'||AP.sel[s.id]) return;
    var a=m[ME.code+'|'+AP.k+'|'+s.id]; if(!a) return;
    var p=accBy(a);
    if(p&&p.tt&&p.u!==ME.u){ AP.sel[s.id]=a; AP.pre[s.id]=1 }
    else if(p&&!p.tt) AP.note[s.id]=a;
  });
}
function apMode(m){
  if(!AP||AP.mode===m) return;
  AP.mode=m; AP.open=null;
  if(m==='TuChon') apPrefill();
  apRender();
}
function vnNorm(s){
  return String(s||'').normalize('NFC').split('').map(function(c){
    return c.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().charAt(0)||c;
  }).join('');
}
function apSearch(q){
  q=vnNorm(q).trim();
  if(q.length<2) return null;
  var rec=apRecent(), out=[];
  DANHBA.forEach(function(p){
    if(!p.tt||p.u===ME.u) return;
    var a=vnNorm(p.u), n=vnNorm(p.n), g;
    if(a.indexOf(q)===0) g=1;
    else if(n.indexOf(q)===0||n.split(' ').some(function(w){return w.indexOf(q)===0})) g=2;
    else if(a.indexOf(q)>=0||n.indexOf(q)>=0) g=3;
    else return;
    out.push({p:p,g:g,r:rec.indexOf(p.u)>=0?0:1});
  });
  out.sort(function(x,y){ return x.g-y.g||x.r-y.r||(x.p.u<y.p.u?-1:1) });
  return out.slice(0,8).map(function(o){return o.p});
}
/* Highlight the match - normalised per character so positions match the original string */
function apHl(t,q){
  q=vnNorm(q).trim(); var n=vnNorm(t), i=q?n.indexOf(q):-1;
  if(i<0) return esc(t);
  return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length));
}
function apPersonLine(p){ return esc(p.cd)+' · '+esc(p.pb)+' · '+esc(UNITS[p.dv]||p.dv) }

/* ---- Render card ---- */
function apCardHTML(){
  var k=AP.k, v=apVals(), steps=apSteps(k), can=apCanChoose(k);
  var h='<div class="card ap-card" id="apCard"><div class="card-h"><h2>Approver</h2>'+
    (AP.mode==='TuChon'?'<div class="r"><span class="chip c-info nb">Chosen by you</span></div>':'')+'</div><div class="card-b">';
  if(can){
    h+='<div class="ap-seg" role="radiogroup" aria-label="How to choose approvers">'+
      [['UserGroup','By User Group'],['TuChon','Pick approvers myself']].map(function(o){
        var on=AP.mode===o[0];
        return '<button type="button" role="radio" aria-checked="'+on+'" class="'+(on?'on':'')+'" onclick="apMode(\''+o[0]+'\')">'+
          '<i aria-hidden="true"></i>'+o[1]+'</button>';
      }).join('')+'</div>'+
      '<p class="ap-help">'+(AP.mode==='TuChon'
        ?'Enter the approver Account for each step. The approvers you entered last time for '+esc(TYPES[k].n.toLowerCase())+' are pre-filled - check them before sending.'
        :'The system determines approvers automatically from the workflow configuration. Use “Pick approvers myself” if you are working for another department / project.')+'</p>';
  } else {
    h+='<p class="ap-help">'+(TYPES[k].tuChon===false
      ?'This workflow does not allow the ticket creator to choose approvers - the system determines them by User Group.'
      :'This ticket type has no approval step that needs an approver.')+'</p>';
  }
  h+='<div class="ap-steps">'+steps.map(function(s,n){ return AP.mode==='TuChon'?apStepPick(s,n,v):apStepView(s,n,v) }).join('')+'</div>';
  return h+'</div></div>';
}
function apWhoHTML(p,extra){
  if(!p) return '<span class="ap-none">No one assigned</span>';
  return '<div class="ap-who"><div class="av">'+initials(p.n)+'</div><div><b>'+esc(p.n)+'</b> <span class="mono ap-acc">'+esc(p.u)+'</span>'+
    '<span class="ap-sub">'+apPersonLine(p)+'</span></div>'+(extra||'')+'</div>';
}
function apCondText(s,v,need){
  if(need==='ext') return '<span class="ap-cond">'+esc(s.ext)+'</span>';
  if(!s.ifx) return '';
  if(need==='yes') return '<span class="ap-cond">Required because of '+esc(s.ifw(v))+'</span>';
  if(need==='no') return '<span class="ap-cond off">Only when '+esc(s.ifl)+'</span>';
  return '<span class="ap-cond">Only when '+esc(s.ifl)+' - calculated once you enter all the data</span>';
}
function apStepView(s,n,v){
  var need=apNeed(s,v), right;
  if(s.kind==='task') right=need==='no'?'<span class="ap-none">Not applicable to this ticket</span>':apWhoHTML(accBy(apUG(s,v)));
  else if(s.kind==='self') right='<span class="ap-none">You confirm</span>';
  else if(s.kind==='queue') right='<span class="ap-none">Handled by '+esc(s.w)+'</span>';
  else right='<span class="ap-none">No approver needed</span>';
  return '<div class="ap-step'+(s.kind!=='task'||need==='no'?' dim':'')+'"><span class="ap-n'+(s.kind==='task'?'':' auto')+'">'+(n+1)+'</span>'+
    '<div class="ap-st"><b>'+esc(s.t)+'</b>'+(s.s?'<span class="ap-sub">'+esc(s.s)+'</span>':'')+apCondText(s,v,need)+'</div>'+
    '<div class="ap-r">'+right+'</div></div>';
}
function apStepPick(s,n,v){
  var need=apNeed(s,v), id=s.id;
  if(s.kind!=='task'){
    var t=s.kind==='self'?'You confirm':s.kind==='queue'?'Handled by '+esc(s.w)+' - no selection needed':'Automatic, no approver needed';
    return '<div class="ap-step dim"><span class="ap-n auto">'+(n+1)+'</span><div class="ap-st"><b>'+esc(s.t)+'</b><span class="ap-sub">'+t+'</span></div></div>';
  }
  var req=need==='yes'||need==='ext';
  var lbl='<label class="ap-lbl" for="apIn_'+id+'"><span class="ap-n">'+(n+1)+'</span>'+esc(s.t)+(req?'<span class="req">*</span>':'')+apCondText(s,v,need)+'</label>';
  var box;
  if(need==='no'){
    box='<div class="ap-box off"><input class="inp" disabled value="Not applicable to this ticket" aria-label="'+esc(s.t)+'"></div>';
  } else if(AP.sel[id]){
    var p=accBy(AP.sel[id]);
    box='<div class="ap-box"><div class="ap-chosen'+(AP.err[id]?' bad':'')+'" tabindex="0" role="button" aria-label="Change approver for step '+esc(s.t)+'" '+
      'onclick="apEdit(\''+id+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();apEdit(\''+id+'\')}">'+
      apWhoHTML(p,(AP.pre[id]?'<span class="chip c-info nb ap-pre">Last time</span>':''))+
      '<button type="button" class="ap-x" title="Remove selected person" aria-label="Remove selected person" onclick="event.stopPropagation();apClear(\''+id+'\')">'+svg(I.x)+'</button></div></div>';
  } else {
    var open=AP.open===id;
    box='<div class="ap-box"><input class="inp'+(AP.err[id]?' bad':'')+'" id="apIn_'+id+'" role="combobox" aria-autocomplete="list" autocomplete="off" spellcheck="false" '+
      'aria-expanded="'+open+'" aria-controls="apLb_'+id+'" '+(open?'aria-activedescendant="apOp_'+id+'_'+AP.hi+'" ':'')+
      'placeholder="Type Account or full name" value="'+esc(AP.txt[id]||'')+'" '+
      'onfocus="apFocus(\''+id+'\')" oninput="apType(\''+id+'\',this.value)" onkeydown="apKey(event,\''+id+'\')" onblur="apBlur(\''+id+'\')">'+
      '<div id="apLbW_'+id+'">'+(open?apListHTML(id):'')+'</div></div>';
  }
  var msg='';
  if(AP.err[id]) msg+='<div class="ap-err" id="apErr_'+id+'">'+svg(I.warn)+'<span>'+AP.err[id]+'</span></div>';
  if(AP.note[id]&&!AP.sel[id]){ var q=accBy(AP.note[id]);
    msg+='<div class="ap-note">'+svg(I.info)+'<span>Previous approver ('+esc(q?q.n:'')+' · '+esc(AP.note[id])+') is inactive, so was not pre-filled.</span></div>'; }
  var ug=accBy(apUG(s,v));
  if(need!=='no'&&ug) msg+='<div class="ap-cmp">By User Group it would be: '+esc(ug.n)+' ('+esc(ug.u)+')</div>';
  return '<div class="ap-pick" id="apStep_'+id+'">'+lbl+box+msg+'</div>';
}
function apListHTML(id){
  var q=AP.txt[id]||'', res=apSearch(q), head='', list;
  if(res===null){
    list=apRecent().map(accBy).filter(Boolean);
    if(!list.length) return '';
    head='<div class="ap-lh">Recent</div>';
  } else list=res;
  if(!list.length) return '<div class="ap-lb" id="apLb_'+id+'" role="listbox"><div class="ap-empty">No matching account found for “'+esc(q)+'”. Check the Account or type the full name.</div></div>';
  if(AP.hi>=list.length) AP.hi=list.length-1;
  var last=lastMap()[ME.code+'|'+AP.k+'|'+id];
  return '<div class="ap-lb" id="apLb_'+id+'" role="listbox" aria-label="Approver suggestions">'+head+list.map(function(p,i){
    return '<div class="ap-op'+(i===AP.hi?' hi':'')+'" id="apOp_'+id+'_'+i+'" role="option" aria-selected="'+(i===AP.hi)+'" '+
      'onmousedown="event.preventDefault()" onclick="apPick(\''+id+'\',\''+p.u+'\')" onmousemove="apHover(\''+id+'\','+i+')">'+
      '<div class="av">'+initials(p.n)+'</div><div class="ap-opt"><b>'+apHl(p.n,q)+'</b> · <span class="mono">'+apHl(p.u,q)+'</span>'+
      '<span class="ap-sub">'+apPersonLine(p)+'</span></div>'+(last===p.u?'<span class="chip c-info nb">Last time</span>':'')+'</div>';
  }).join('')+
  '<div class="ap-lf">↑ ↓ to select · Enter to confirm · Esc to close · '+list.length+(list.length===1?' result':' results')+'</div></div>';
}
function apListItems(id){ var r=apSearch(AP.txt[id]||''); return r===null?apRecent().map(accBy).filter(Boolean):r }
function apListOnly(id){
  var w=document.getElementById('apLbW_'+id), inp=document.getElementById('apIn_'+id); if(!w||!inp) return;
  w.innerHTML=AP.open===id?apListHTML(id):'';
  inp.setAttribute('aria-expanded',AP.open===id&&!!w.innerHTML);
  if(AP.open===id) inp.setAttribute('aria-activedescendant','apOp_'+id+'_'+AP.hi); else inp.removeAttribute('aria-activedescendant');
}
function apFocus(id){ AP.open=id; AP.hi=0; apListOnly(id) }
function apType(id,val){ AP.txt[id]=val; AP.open=id; AP.hi=0; if(AP.err[id]){ delete AP.err[id]; var e=document.getElementById('apErr_'+id); if(e) e.remove(); var i=document.getElementById('apIn_'+id); if(i) i.classList.remove('bad') } apListOnly(id) }
function apHover(id,i){ if(AP.hi===i) return; AP.hi=i; apListOnly(id) }
function apKey(e,id){
  var items=apListItems(id);
  if(e.key==='ArrowDown'){ e.preventDefault(); AP.open=id; AP.hi=Math.min(AP.hi+1,Math.max(items.length-1,0)); apListOnly(id) }
  else if(e.key==='ArrowUp'){ e.preventDefault(); AP.hi=Math.max(AP.hi-1,0); apListOnly(id) }
  else if(e.key==='Enter'){
    e.preventDefault();
    if(AP.open===id&&items[AP.hi]) return apPick(id,items[AP.hi].u);
    apCommit(id);
  }
  else if(e.key==='Escape'){ if(AP.open===id){ e.preventDefault(); e.stopPropagation(); AP.open=null; apListOnly(id) } }
}
/* Exact Account typed then Enter / blur: validate input (BR-ND-05, 06) */
function apCommit(id){
  var t=String(AP.txt[id]||'').trim(); if(!t) return;
  var p=accBy(t.toLowerCase());
  if(p&&p.u===ME.u) AP.err[id]='You cannot approve your own ticket.';
  else if(p&&!p.tt) AP.err[id]='Account “'+esc(t)+'” is inactive. Choose another person.';
  else if(p) return apPick(id,p.u);
  else AP.err[id]='Select an approver from the suggestion list. No such account: “'+esc(t)+'”.';
  AP.open=null; apRender();
}
function apBlur(id){
  setTimeout(function(){
    if(!AP||AP.sel[id]) return;
    var a=document.activeElement; if(a&&a.id==='apIn_'+id) return;
    if(AP.open===id) AP.open=null;
    if(String(AP.txt[id]||'').trim()) apCommit(id); else apListOnly(id);
  },120);
}
function apPick(id,u){
  AP.sel[id]=u; delete AP.pre[id]; delete AP.err[id]; AP.txt[id]=''; AP.open=null; apRender();
  var c=document.querySelector('#apStep_'+id+' .ap-chosen'); if(c) c.focus();
}
function apClear(id){ delete AP.sel[id]; delete AP.pre[id]; AP.txt[id]=''; apRender(); var i=document.getElementById('apIn_'+id); if(i) i.focus() }
function apEdit(id){ var u=AP.sel[id]; delete AP.sel[id]; delete AP.pre[id]; AP.txt[id]=u||''; AP.open=id; AP.hi=0; apRender(); var i=document.getElementById('apIn_'+id); if(i){ i.focus(); i.select() } }

/* ---- "This ticket will go through" card updates by mode (FR-ND-10) ---- */
function apFlowHTML(){
  var k=AP.k, v=apVals();
  return '<ul class="flowprev">'+apSteps(k).map(function(s,i){
    var need=apNeed(s,v), who=s.w, src='';
    if(s.kind==='task'){
      var g=accBy(apUG(s,v)); who=g?g.n:s.w;
    }
    var dep=s.dep?'<span>Depends on “'+esc(s.dep)+'”</span>':'';
    if(s.kind==='task'){
      var srcT=STEP_SRC[s.t]||'', pn=(accBy(apUG(s,v))||{}).n||s.w;
      var line=srcT==='Named approver'?esc(srcT+' — '+pn):esc(srcT)+(srcT?' — ':'')+'Expected: '+esc(pn)+(/^User Group/.test(srcT)?' +1':'');
      return '<li class="'+(s.cond?'cond':'')+'"><span class="n">'+(i+1)+'</span><div><b>'+esc(s.t)+'</b><span>'+line+'</span>'+dep+'</div></li>';
    }
    return '<li class="'+(s.cond?'cond':'')+'"><span class="n">'+(i+1)+'</span><div><b>'+esc(s.t)+'</b><span>'+(s.kind==='sys'?'Automatic':esc(who))+'</span></div></li>';
  }).join('')+'</ul>';
}
function apRender(){
  var c=document.getElementById('apCard'); if(c) c.outerHTML=apCardHTML();
  var f=document.getElementById('apFlow'); if(f) f.innerHTML=apFlowHTML();
  if(AP.open){ var i=document.getElementById('apIn_'+AP.open); if(i){ i.focus(); var l=i.value.length; try{ i.setSelectionRange(l,l) }catch(e){} } }
}
/* Form data changed → recompute conditions (BR-ND-04) */
function apOnForm(e){
  if(!AP) return;
  var id=e&&e.target?e.target.id:'';
  if(AP.k==='nghi-phep'&&(id==='f_tu'||id==='f_den')){
    var d=apWorkdays(document.getElementById('f_tu').value,document.getElementById('f_den').value), so=document.getElementById('f_so');
    if(d!==null&&so) so.value=String(d);
  }
  apRender();
}
/* ---- Validation on send (FR-ND-07) ---- */
function apValidate(){
  if(!AP||AP.mode!=='TuChon') return true;
  var v=apVals(), first=null, n=0;
  apSteps(AP.k).forEach(function(s){
    var need=apNeed(s,v); if(s.kind!=='task'||need==='no') return;
    var t=String(AP.txt[s.id]||'').trim();
    if(AP.sel[s.id]&&AP.sel[s.id]!==ME.u) return;
    if(t){ var p=accBy(t.toLowerCase());
      AP.err[s.id]=p&&p.u===ME.u?'You cannot approve your own ticket.':p&&!p.tt?'Account “'+esc(t)+'” is inactive. Choose another person.':'Select an approver from the suggestion list. No such account: “'+esc(t)+'”.'; }
    else AP.err[s.id]='Select an approver for this step.';
    n++; if(!first) first=s.id;
  });
  if(!n) return true;
  AP.open=null; apRender();
  var el=document.getElementById('apIn_'+first)||document.getElementById('apStep_'+first);
  if(el){ el.scrollIntoView({block:'center'}); if(el.focus) el.focus() }
  toast('Ticket could not be sent',n+(n===1?' step still has':' steps still have')+' no approver selected');
  return false;
}
function apSaveAfterSubmit(){
  var modes=lsGet(LS_MODE,{}); modes[ME.code+'|'+AP.k]=AP.mode; lsSet(LS_MODE,modes);
  if(AP.mode!=='TuChon') return;
  var m=lastMap(), v=apVals();
  apSteps(AP.k).forEach(function(s){ if(s.kind==='task'&&apNeed(s,v)!=='no'&&AP.sel[s.id]) m[ME.code+'|'+AP.k+'|'+s.id]=AP.sel[s.id] });
  lsSet(LS_LAST,m);
}
function apFirstTarget(){
  var v=apVals(), s=apSteps(AP.k).filter(function(x){ return x.kind==='task'&&apNeed(x,v)!=='no' })[0];
  if(!s) return null;
  var p=accBy(AP.mode==='TuChon'?AP.sel[s.id]:apUG(s,v));
  return {t:s.t,p:p};
}
document.addEventListener('click',function(e){
  if(!AP||!AP.open) return;
  if(e.target.closest&&e.target.closest('#apStep_'+AP.open)) return;
  var id=AP.open; AP.open=null; apListOnly(id);
});

function apAfterForm(){
  document.querySelectorAll('#view [id^="f_"]').forEach(function(e){
    e.addEventListener('input',apOnForm); e.addEventListener('change',apOnForm);
  });
  apRender();
}
function apDraft(){ toast('Draft saved','Ticket has not been sent for approval') }
/* CR-05, CR-07 — right column of the detail panel */
function apSrcChip(d){ return d.cach==='TuChon'?'<span class="chip c-info nb src">Chosen by you</span>':'<span class="chip c-draft nb src">Per User Group</span>' }
function isApStep(s,i){ return i>0&&/approv|confirm/i.test(s.t)&&!/System|Department|Team/i.test(s.w) }
function dSide(d,cur){
  var ci=d.sp.indexOf(cur), hasAp=apSteps(d.t).some(function(x){return x.kind==='task'});
  return '<aside class="drw-side" aria-label="Key ticket details">'+
   '<div class="ds-sec"><div class="ds-t">Status</div><div class="ds-row">'+chip(d.st)+'</div></div>'+
   '<div class="ds-sec"><div class="ds-t">Current handler</div>'+(cur
     ?'<div class="ds-p"><div class="av">'+initials(cur.w)+'</div><div><b>'+esc(cur.w)+'</b><span>'+esc(cur.t)+'</span>'+
       '</div></div>'
     :'<div class="ds-p"><div><b>Ended</b><span>No steps pending</span></div></div>')+'</div>'+
   '<div class="ds-sec"><div class="ds-t">Submitter</div><div class="ds-p"><div class="av">'+initials(ME.name)+'</div><div><b>'+esc(ME.name)+'</b>'+
     '<span>'+ME.code+' · '+esc(ME.title)+'</span><span>'+esc(ME.dept)+' · '+UNITS[ME.donvi]+'</span></div></div></div>'+
   '<div class="ds-sec"><div class="ds-t">Ticket details</div><dl class="ds-kv">'+
     '<dt>Type</dt><dd>'+esc(TYPES[d.t].n)+'</dd><dt>Title</dt><dd>'+esc(d.ti)+'</dd><dt>Submitted on</dt><dd class="num">'+esc(d.ct)+'</dd>'+
     '<dt>Version</dt><dd>'+esc(tkVer(d))+'</dd>'+'</dl></div>'+
   '<div class="ds-sec"><div class="ds-t">Workflow instance ID</div><div class="mono" style="font-size:12px;color:var(--ink-2)">'+d.inst+'</div></div>'+
  '</aside>';
}

var ST={
 'nhap':{l:'Draft',c:'c-draft'},'cho':{l:'Pending approval',c:'c-wait'},
 'duyet':{l:'Approved',c:'c-done'},'tuchoi':{l:'Rejected',c:'c-rej'},'thuhoi':{l:'Withdrawn',c:'c-draft'},'huy':{l:'Cancelled',c:'c-rej'}
};

var DONS=[
 {c:'TK-2026-013',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'08/09/2026 09:12',st:'cho',cur:1,
  inst:'8f21c3a7d90b4e15',ver:'v1.2',due:'09/09/2026 09:12',dueH:4,
  fi:[['Leave type','Annual leave'],['Period','14/09/2026 → 16/09/2026'],['Number of days','3 days'],
      ['Handover person','Lê Thị Mai (NV-00398)'],['Reason','Going back to my hometown to take care of family matters, as arranged with my family in advance.']],
  v:{loai:'Annual leave',tu:'14/09/2026',den:'16/09/2026',buoi:'Full day',so:'3 days',bangiao:'Lê Thị Mai (NV-00398)',
     ly:'Going back to my hometown to take care of family matters, as arranged with my family in advance.'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'08/09/2026 09:12',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',s:'cur',due:'09/09/2026 09:12'},
      {t:'HR Head approval',w:'Phạm Thu Hà',s:'pend',cond:1,note:'Applies because the leave is longer than 2 days'},
      {t:'Update timesheet',w:'HRM System',s:'pend'}],
  cm:[],at:[{n:'don-nghi-phep-ky.pdf',s:'248 KB'}]},

 {c:'TK-2026-010',t:'ot',ti:'Overtime request — Nguyễn Văn An',ct:'04/09/2026 16:40',st:'cho',cur:1,
  inst:'2c88fb1e7a334d90',
  fi:[['Overtime date','05/09/2026'],['Day type','Weekday (150%)'],['Period','18:00 → 21:00'],
      ['Number of hours','3 hours'],['Project','Q3 data closing']],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'04/09/2026 16:40',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',s:'cur'},
      {t:'HR Head approval',w:'Phạm Thu Hà',s:'pend',cond:1,note:'Applies because monthly OT exceeds 40 hours'},
      {t:'Record timesheet',w:'HRM System',s:'pend'}],
  cm:[],
  at:[]},

 {c:'TK-2026-007',t:'tang-luong',ti:'Salary increase proposal — Nguyễn Văn An',ct:'01/09/2026 10:20',st:'cho',cur:2,
  inst:'a1904ef25c6b7d38',due:'12/09/2026 10:20',dueH:52,
  fi:[['Current salary','18,000,000 VND'],['Proposed salary','21,000,000 VND'],['Increase','16.7%'],
      ['Effective from','October 2026 payroll period'],['Basis','Achieved 128% of the sales target in the first 8 months of the year and took on an additional group of customers in the Central region.']],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'01/09/2026 10:20',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'02/09/2026 14:30',s:'done',note:'Agreed. Sales results are good; recommend senior management review.'},
      {t:'Director approval',w:'Vũ Quốc Hưng',s:'cur',cond:1,due:'12/09/2026 10:20',note:'Applies because the increase exceeds the 10% threshold'},
      {t:'Update payroll',w:'HR Department',s:'pend'}],
  cm:[{w:'Trần Văn Dũng',r:'Line manager',at:'02/09/2026 14:30',x:'Agreed. Sales results are good; recommend senior management review.'}],
  at:[{n:'bao-cao-doanh-so-8T2026.xlsx',s:'96 KB'}]},

 {c:'TK-2026-004',t:'cong-tac',ti:'Business trip — Nguyễn Văn An',ct:'22/08/2026 08:15',st:'duyet',cur:3,
  inst:'77b0d4e9f1223a6c',
  fi:[['Destination','Da Nang'],['Scope','Domestic'],['Period','26/08/2026 → 29/08/2026'],
      ['Transport','Flight'],['Advance','8,000,000 VND'],['Purpose','Meet 3 major customers in the Central region and sign Q4 contract addenda.']],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'22/08/2026 08:15',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'22/08/2026 11:02',s:'done'},
      {t:'Advance accounting',w:'Accounting Department',at:'23/08/2026 15:40',s:'done',cond:1,note:'Advance of 8,000,000 VND paid by bank transfer'},
      {t:'Complete',w:'System',at:'23/08/2026 15:40',s:'done'}],
  cm:[],at:[{n:'ke-hoach-cong-tac.docx',s:'45 KB'}]},

 {c:'TK-2026-003',t:'xac-nhan-cong',ti:'Timesheet confirmation — Nguyễn Văn An',ct:'20/08/2026 09:00',st:'duyet',cur:2,
  inst:'3e55a8c0bb914f72',
  fi:[['Date','19/08/2026'],['Case','Forgot check-out'],['Actual check-in time','08:05'],['Actual check-out time','17:45'],
      ['Explanation','Meeting with a customer until 17:30 on the 12th floor; forgot to swipe the card when leaving.']],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'20/08/2026 09:00',s:'done'},
      {t:'Line manager confirmation',w:'Trần Văn Dũng',at:'20/08/2026 10:12',s:'done'},
      {t:'HR timesheet update',w:'Phạm Thu Hà',at:'20/08/2026 16:00',s:'done',note:'Timesheet for 19/08 updated to a full day'}],
  cm:[],at:[]},

 {c:'TK-2026-002',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'11/08/2026 14:22',st:'tuchoi',cur:1,
  inst:'d2f7104ac3e8590b',
  fi:[['Leave type','Annual leave'],['Period','15/08/2026'],['Number of days','1 day'],['Reason','Personal matter']],
  v:{loai:'Annual leave',tu:'15/08/2026',den:'15/08/2026',so:'1 day',ly:'Personal matter'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'11/08/2026 14:22',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'12/08/2026 09:10',s:'rej',note:'There is a customer acceptance session on 15/08; please arrange your leave for next week instead.'}],
  cm:[{w:'Trần Văn Dũng',r:'Line manager',at:'12/08/2026 09:10',x:'There is a customer acceptance session on 15/08; please arrange your leave for next week instead.'}],
  at:[]},

 {c:'TK-2026-006',t:'tam-ung',ti:'Advance / payment — Nguyễn Văn An',ct:'30/08/2026 17:05',st:'cho',cur:2,
  inst:'91ca6b03df475e28',due:'03/09/2026 17:05',dueH:-39,
  fi:[['Request type','Advance settlement payment'],['Amount','7,420,000 VND'],['Method','Bank transfer'],
      ['Content','Advance settlement for Da Nang business trip expenses 26–29/08: flight tickets, hotel, taxi.']],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'30/08/2026 17:05',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'31/08/2026 08:30',s:'done'},
      {t:'Chief Accountant approval',w:'Đỗ Thanh Bình',s:'cur',due:'03/09/2026 17:05'},
      {t:'Disburse payment',w:'Accounting Department',s:'pend'}],
  cm:[],at:[{n:'hoa-don-ve-may-bay.pdf',s:'310 KB'},{n:'hoa-don-khach-san.pdf',s:'188 KB'}]},

 {c:'TK-2026-001',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'05/08/2026 09:30',st:'thuhoi',cur:1,
  inst:'5ab3901cc7e24d6f',
  fi:[['Leave type','Annual leave'],['Period','08/08/2026 → 09/08/2026'],['Number of days','2 days'],['Reason','Family matter']],
  v:{loai:'Annual leave',tu:'08/08/2026',den:'09/08/2026',so:'2 days',ly:'Family matter'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'05/08/2026 09:30',s:'done'},
      {t:'Employee withdraws ticket',w:'Nguyễn Văn An',at:'05/08/2026 15:44',s:'rej',note:'Self-withdrawn: work has been arranged, leave is no longer needed'}],
  cm:[],at:[]},

 /* Phase-1 samples: System task failed / handled by the technical team / ticket created by the ESS backend */
 {c:'TK-2026-020',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'02/11/2026 10:00',st:'cho',cur:3,sysStarted:1,
  inst:'e41d0c9a77b25f18',
  fi:[['Leave type','Annual leave'],['Period','05/11/2026 → 06/11/2026'],['Number of days','2 days'],['Reason','Family trip']],
  v:{loai:'Annual leave',tu:'05/11/2026',den:'06/11/2026',buoi:'Full day',so:'2 days',ly:'Family trip'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'02/11/2026 10:00',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'02/11/2026 10:30',s:'done'},
      {t:'Update timesheet',w:'HRM System',s:'cur',fail:1}],
  cm:[],at:[]},

 {c:'TK-2026-021',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'30/10/2026 10:00',st:'duyet',cur:3,sysStarted:1,
  inst:'9a1f6c03b8d2e754',
  fi:[['Leave type','Annual leave'],['Period','31/10/2026'],['Number of days','1 day'],['Reason','Personal matter']],
  v:{loai:'Annual leave',tu:'31/10/2026',den:'31/10/2026',so:'1 day',ly:'Personal matter'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'30/10/2026 10:00',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'30/10/2026 11:00',s:'done'},
      {t:'Update timesheet',w:'HRM System',at:'03/11/2026 14:00',s:'done',note:'Updated manually by the technical team — 03/11/2026 14:00'}],
  cm:[],at:[]},

 /* MTK-BR-044 / AC-140: auto-cancelled when the resignation was recorded; HRM later cancelled the resignation event, ticket is not restored */
 {c:'TK-2026-040',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'27/10/2026 09:00',st:'huy',cur:2,
  inst:'6c18e0f5b2d94a37',
  fi:[['Leave type','Annual leave'],['Period','03/11/2026 → 04/11/2026'],['Number of days','2 days'],['Reason','Personal matter']],
  v:{loai:'Annual leave',tu:'03/11/2026',den:'04/11/2026',so:'2 days',ly:'Personal matter'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'27/10/2026 09:00',s:'done'},
      {t:'Cancelled automatically — the submitter left the company (last working day 31/10/2026).',w:'System',at:'01/11/2026 00:05',s:'rej'}],
  cm:[],at:[]},

 {c:'TK-2026-022',t:'nghi-phep',ti:'Leave — Nguyễn Văn An',ct:'28/10/2026 08:30',st:'huy',cur:3,sysStarted:1,
  inst:'4d90b1e63a7f2c85',
  fi:[['Leave type','Annual leave'],['Period','29/10/2026'],['Number of days','1 day'],['Reason','Personal matter']],
  v:{loai:'Annual leave',tu:'29/10/2026',den:'29/10/2026',so:'1 day',ly:'Personal matter'},
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'28/10/2026 08:30',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng',at:'28/10/2026 09:10',s:'done'},
      {t:'Update timesheet',w:'HRM System',s:'pend'},
      {t:'Cancelled by the technical team — Duplicate request',w:'Technical team',at:'03/11/2026 14:00',s:'rej'}],
  cm:[],at:[]},

 {c:'TK-2026-023',t:'profile-update',ti:'Employee Profile Update — Nguyễn Văn An',ct:'03/11/2026 09:00',st:'cho',cur:1,
  inst:'b7c1e9d2a4f03856',ver:'v1.1',
  wh:{employeeId:'NV-00412',block:'Address Information',operation:'Update',effectiveDate:{before:'01/11/2026',after:'03/11/2026'},fields:{'Ward':{before:'Phường Thảo Điền',after:'Phường An Phú'},'Address':{before:'123 Đường số 1, Thảo Điền',after:'45 Đường số 10, An Phú'}}},
  fi:[],cm:[],at:[],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'03/11/2026 09:00',s:'done'},
      {t:'HR approves profile change',w:'Phạm Thu Hà',s:'cur'}]},

 /* MTK-BR-049 (4): End = Approved reached, backend is writing to the target system: ticket stays Pending approval at "Updating profile" and cannot be withdrawn */
 {c:'TK-2026-024',t:'profile-update',ti:'Employee Profile Update — Nguyễn Văn An',ct:'04/11/2026 10:00',st:'cho',cur:2,
  inst:'a30c5e71d8b24f96',ver:'v1.1',
  wh:{employeeId:'NV-00412',block:'Contact Information',operation:'Update',fields:{'Mobile phone':{before:'0901 234 567',after:'0912 345 678'}}},
  fi:[],cm:[],at:[],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'04/11/2026 10:00',s:'done'},
      {t:'HR approves profile change',w:'Phạm Thu Hà',at:'04/11/2026 10:40',s:'done'},
      {t:'Updating profile',w:'ESS',s:'cur'}]},

 /* MTK-BR-049 (4): writing to the target system failed after retries -> Cancelled with the reason (MSG-082) */
 {c:'TK-2026-025',t:'profile-update',ti:'Employee Profile Update — Nguyễn Văn An',ct:'02/11/2026 14:00',st:'huy',cur:2,
  inst:'0f9d4b2c6e813a57',ver:'v1.1',
  wh:{employeeId:'NV-00412',block:'Bank Information',operation:'Update',fields:{'Account number':{before:'—',after:'•••• 4821'}}},
  fi:[],cm:[],at:[],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'02/11/2026 14:00',s:'done'},
      {t:'HR approves profile change',w:'Phạm Thu Hà',at:'02/11/2026 14:30',s:'done'},
      {t:'Profile could not be updated. Please submit the request again.',w:'ESS',at:'02/11/2026 15:10',s:'rej'}]}
];

var TICKETS=[
 {c:'TK-2026-017',ti:'Laptop cannot connect to the projector in meeting room A',nh:'Devices & hardware',ut:'High',st:'cho',
  ct:'09/09/2026 08:40',ng:'Lê Quang Huy (IT)',due:'09/09/2026 16:40',dueH:7,
  sp:[{t:'Create ticket',w:'Nguyễn Văn An',at:'09/09/2026 08:40',s:'done'},
      {t:'Receive & triage',w:'Support Team',at:'09/09/2026 09:05',s:'done',note:'Assigned to Lê Quang Huy, priority High'},
      {t:'In progress',w:'Lê Quang Huy',s:'cur',due:'09/09/2026 16:40'},
      {t:'Requester confirmation',w:'Nguyễn Văn An',s:'pend'}],
  fi:[['Request category','Devices & hardware'],['Priority','High — unable to work'],
      ['Description','Connected an HDMI cable to the projector in meeting room A but it receives no signal. Tried changing the cable and restarting, still not working. There is a customer demo this afternoon.']],
  cm:[{w:'Lê Quang Huy',r:'IT Technician',at:'09/09/2026 09:20',x:'I am bringing a spare cable and adapter up to meeting room A and will be there in about 15 minutes.'}],at:[]},

 {c:'TK-2026-011',ti:'Request access to regional sales reports',nh:'Accounts & permissions',ut:'Medium',st:'cho',
  ct:'06/09/2026 14:10',ng:'Awaiting assignment',due:'10/09/2026 14:10',dueH:29,
  sp:[{t:'Create ticket',w:'Nguyễn Văn An',at:'06/09/2026 14:10',s:'done'},
      {t:'Receive & triage',w:'Support Team',at:'06/09/2026 15:00',s:'done'},
      {t:'Line manager approves access',w:'Trần Văn Dũng',s:'cur',cond:1,due:'10/09/2026 14:10',note:'Access to sales data needs manager approval before it is granted'},
      {t:'IT access provisioning',w:'Support team',s:'pend'}],
  fi:[['Request group','Accounts & permissions'],['Priority','Medium — a workaround is available'],
      ['Description','Need access to the Central region sales report to prepare the Q4 plan.']],
  cm:[],at:[]},

 {c:'TK-2026-009',ti:'Meeting room B booking on 12/09, 14:00–16:00',nh:'Admin - office',ut:'Low',st:'duyet',
  ct:'02/09/2026 11:00',ng:'Ngô Thị Lan (Admin)',
  sp:[{t:'Create ticket',w:'Nguyễn Văn An',at:'02/09/2026 11:00',s:'done'},
      {t:'Admin processing',w:'Ngô Thị Lan',at:'02/09/2026 13:25',s:'done',note:'Meeting room B has been booked, calendar invite sent by email'},
      {t:'Requester confirmation',w:'Nguyễn Văn An',at:'02/09/2026 14:00',s:'done'}],
  fi:[['Request group','Admin - office'],['Priority','Low'],['Description','Book meeting room B for a product demo with the customer.']],
  cm:[],at:[]}
];

/* Tickets are also a ticket type in BPM — merged into the ticket list,
   no separate item in the sidebar any more */
function dnum(s){var p=String(s).split(' '),d=p[0].split('/');return +(d[2]+d[1]+d[0]+(p[1]||'00:00').replace(':',''))}
TICKETS.forEach(function(t){ t.t='ticket-it'; t.ti=TYPES['ticket-it'].n+' — '+ME.name; }); /* MTK-BR-034: Title = type + submitter name */
DONS=DONS.concat(TICKETS).sort(function(a,b){return dnum(b.ct)-dnum(a.ct)});
/* CR-06 — how the approver is chosen for each submitted ticket (sample) */
DONS.forEach(function(d){ d.cach='UserGroup' });
/* Phase 1 has no SLA: no due date / Due / Overdue anywhere */
DONS.forEach(function(d){ delete d.due; delete d.dueH; (d.sp||[]).forEach(function(s){ delete s.due }) });

var NOTIFS=[
 {x:'Ticket <b>TK-2026-025</b>: Profile could not be updated. Please submit the request again.',t:'02/11/2026 15:10',u:0,go:'TK-2026-025'},
 {x:'Ticket <b>TK-2026-040</b> stays cancelled because it was cancelled when your resignation was recorded. Please submit a new ticket if you still need it.',t:'05/11/2026 09:00',u:1,go:'TK-2026-040'},
 {x:'Ticket <b>TK-2026-007</b> has been approved by the Line manager, now waiting for the Director',t:'02/09/2026 14:30',u:1,go:'TK-2026-007'},
 {x:'Ticket <b>TK-2026-017</b> has been assigned to Lê Quang Huy',t:'09/09/2026 09:05',u:1,go:'TK-2026-017'},
 {x:'Ticket <b>TK-2026-004</b> is complete, the 8,000,000 VND advance has been paid out',t:'23/08/2026 15:40',u:0,go:'TK-2026-004'},
 {x:'Ticket <b>TK-2026-002</b> was rejected by the Line manager',t:'12/08/2026 09:10',u:0,go:'TK-2026-002'}
];

/* =====================================================================
   UTILITIES
   ===================================================================== */
function el(h){var d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
function chip(st){var s=ST[st];return '<span class="chip '+s.c+'">'+s.l+'</span>'}
function slaPill(){ return '' } /* Phase 1 has no SLA */
function toast(t,s){
  var e=document.getElementById('toast');
  e.innerHTML=svg('<path d="M20 6L9 17l-5-5"/>')+'<div><b>'+t+'</b>'+(s?' <span>'+s+'</span>':'')+'</div>';
  e.classList.add('on'); clearTimeout(window._tt); window._tt=setTimeout(function(){e.classList.remove('on')},3000);
}
function initials(n){var p=n.trim().split(' ');return (p[0][0]+p[p.length-1][0]).toUpperCase()}

var NAV=[
 {s:'Work'},
 {k:'tong-quan',l:'Overview',i:I.home},
 {k:'tao-don',l:'Create new ticket',i:I.plus},
 {k:'don-cua-toi',l:'My tickets',i:I.list,hide:1,c:function(){return DONS.filter(function(d){return d.st==='cho'}).length}}
];
/* Pages not in the sidebar but still reachable (notification bell on the topbar) */
var TITLES={'thong-bao':'Notifications','don-cua-toi':'My tickets'};

var page='tong-quan';
var NAVCLOSED={};
function toggleGrp(k){ NAVCLOSED[k]=!NAVCLOSED[k]; renderNav(); }
function renderNav(){
  var html='', grp=null, buf=[];
  function flush(){
    if(grp!==null){
      var off=!!NAVCLOSED[grp];
      html+='<button class="nav-grp'+(off?' closed':'')+'" aria-expanded="'+(off?'false':'true')+'"'+
            ' onclick="toggleGrp(\''+grp+'\')"><span>'+grp+'</span>'+
            '<span class="ch">'+svg('<path d="M6 9l6 6 6-6"/>')+'</span></button>';
      if(off){ buf=[]; }
    }
    html+=buf.join(''); buf=[];
  }
  NAV.forEach(function(n){
    if(n.s){ flush(); grp=n.s; return; }
    if(n.hide) return;
    var c=n.c?n.c():0;
    buf.push('<button class="nav-item'+(page===n.k?' active':'')+'" title="'+n.l+'" onclick="go(\''+n.k+'\')">'+
      svg(n.i)+'<span class="lb">'+n.l+'</span>'+(c?'<span class="cnt'+(n.hot?' hot':'')+'">'+c+'</span>':'')+'</button>');
  });
  flush();
  document.getElementById('nav').innerHTML=html;
  NAVPIP();
}
function NAVPIP(){
  var p=document.getElementById('pipCount'); if(!p) return;
  var v=(typeof navPipCount==='function')?navPipCount():0;
  if(v>0){ p.textContent=v; p.hidden=false; } else { p.hidden=true; }
}
function go(k,arg){
  page=k; renderNav();
  var t=(NAV.filter(function(n){return n.k===k})[0]||{}).l||TITLES[k]||'';
  document.getElementById('crumb').textContent=t;
  document.getElementById('view').scrollTop=0;
  window.scrollTo(0,0);
  PAGES[k](arg);
}
function goFlt(t,st){ flt={t:t,st:st,r:'This year'}; PG.page=1; go('tong-quan'); var e=document.getElementById('myDons'); if(e&&(t||st)) e.scrollIntoView({block:'start',behavior:'smooth'}) }

/* =====================================================================
   SCREENS
   ===================================================================== */
var V=function(h){document.getElementById('view').innerHTML=h};
var PAGES={};

/* ---------- 1. OVERVIEW ---------- */
PAGES['tong-quan']=function(){
  var cho=DONS.filter(function(d){return d.st==='cho'});
  var duyet=DONS.filter(function(d){return d.st==='duyet'});
  var tuchoi=DONS.filter(function(d){return d.st==='tuchoi'});

  V(
  '<div class="page-head"><div><h1>Overview</h1></div>'+
  '<div class="ph-actions"><button class="btn pri" onclick="go(\'tao-don\')">'+svg(I.plus)+'Create new ticket</button></div></div>'+

  '<div class="stats">'+
   '<div class="stat cl" onclick="goFlt(\'\',\'\')"><div class="lbl">'+svg(I.ticket)+'Total tickets</div><div class="val">'+DONS.length+'</div></div>'+
   '<div class="stat cl" onclick="goFlt(\'\',\'cho\')"><div class="lbl">'+svg(I.clock)+'Awaiting processing</div><div class="val">'+cho.length+'</div></div>'+
   '<div class="stat cl" onclick="goFlt(\'\',\'duyet\')"><div class="lbl">'+svg(I.tick)+'Approved</div><div class="val">'+duyet.length+'</div></div>'+
   '<div class="stat cl'+(tuchoi.length?' stat-alert':'')+'" onclick="goFlt(\'\',\'tuchoi\')"><div class="lbl">'+svg(I.x)+'Rejected</div><div class="val">'+tuchoi.length+'</div></div>'+
  '</div>'+

  myDonsCard('tong-quan'));
};

/* Ticket code TK-<year>-<sequence>: the sequence increases in submission order, the newest ticket has the largest number */
function tkSeq(c){ var m=String(c).match(/(\d+)$/); return m?+m[1]:0 }
var TK_LAST=0;
function tkNext(){
  var mx=Math.max(TK_LAST,23); /* SEQUENCE shared by the whole system: a code is never issued twice, even if a draft is deleted; samples go up to TK-2026-023 */
  DONS.forEach(function(d){ mx=Math.max(mx,tkSeq(d.c)) });
  mx++; TK_LAST=mx;
  var n=String(mx); while(n.length<3) n='0'+n;
  return 'TK-'+new Date().getFullYear()+'-'+n;
}
/* Pagination of the "My tickets" table */
var PG={size:10,page:1};
function myRerender(){ var e=document.getElementById('myDons'); if(e) e.replaceWith(el(myDonsCard(page))) }
function pgGo(n){ PG.page=n; myRerender() }
function pgSize(v){ PG.size=+v; PG.page=1; myRerender() }
function pgJump(v){ var n=parseInt(v,10); if(isNaN(n)) return; PG.page=n; myRerender() }
function pgFilter(k,v){ flt[k]=v; PG.page=1; PAGES[page]() }
function pgBar(total){
  var pages=Math.max(1,Math.ceil(total/PG.size)), p=Math.min(Math.max(1,PG.page),pages); PG.page=p;
  var from=total?(p-1)*PG.size+1:0, to=Math.min(total,p*PG.size);
  var nums=[], lo=Math.max(1,p-3), hi=Math.min(pages,lo+6); lo=Math.max(1,hi-6);
  for(var i=lo;i<=hi;i++) nums.push(i);
  return '<div class="pgn" role="navigation" aria-label="Pagination">'+
    '<div class="l"><span>Rows / page</span><select aria-label="Rows per page" onchange="pgSize(this.value)">'+
    [10,25,50,100].map(function(n){ return '<option value="'+n+'"'+(PG.size===n?' selected':'')+'>'+n+'</option>' }).join('')+'</select>'+
    '<span class="rng">'+from+' - '+to+' / '+total+'</span></div>'+
    '<div class="r">'+
    '<button onclick="pgGo(1)"'+(p<=1?' disabled':'')+'>First</button>'+
    '<button onclick="pgGo('+(p-1)+')" aria-label="Previous page"'+(p<=1?' disabled':'')+'>‹</button>'+
    (lo>1?'<span class="gap">…</span>':'')+
    nums.map(function(n){ return '<button class="'+(n===p?'on':'')+'" onclick="pgGo('+n+')"'+(n===p?' aria-current="page"':'')+'>'+n+'</button>' }).join('')+
    (hi<pages?'<span class="gap">…</span>':'')+
    '<button onclick="pgGo('+(p+1)+')" aria-label="Next page"'+(p>=pages?' disabled':'')+'>›</button>'+
    '<button onclick="pgGo('+pages+')"'+(p>=pages?' disabled':'')+'>Last</button>'+
    '</div></div>';
}

/* "My tickets" table — shared by Overview and the My tickets page */
function myDonsCard(pg){
  var rows=DONS.filter(function(d){ return (!flt.t||d.t===flt.t)&&(!flt.st||d.st===flt.st)&&TkRange.within(d.ct,flt.r||'This year') })
    .sort(function(a,b){ return tkSeq(b.c)-tkSeq(a.c) });
  var total=rows.length, pages=Math.max(1,Math.ceil(total/PG.size)); if(PG.page>pages) PG.page=pages; if(PG.page<1) PG.page=1;
  var view=rows.slice((PG.page-1)*PG.size,PG.page*PG.size);
  return '<div class="card" id="myDons"><div class="card-h"><h2>My tickets</h2></div>'+
    '<div class="card-b" style="border-bottom:1px solid var(--line)">'+
    '<div class="filters">'+
      '<div class="field" style="width:200px"><label>Ticket type</label><select class="inp" onchange="pgFilter(\'t\',this.value)">'+
      '<option value="">All ticket types</option>'+typeKeys(true).map(function(k){
        return '<option value="'+k+'"'+(flt.t===k?' selected':'')+'>'+TYPES[k].n+'</option>'}).join('')+'</select></div>'+
      '<div class="field" style="width:180px"><label>Status</label><select class="inp" onchange="pgFilter(\'st\',this.value)">'+
      '<option value="">All statuses</option>'+Object.keys(ST).map(function(k){
        return '<option value="'+k+'"'+(flt.st===k?' selected':'')+'>'+ST[k].l+'</option>'}).join('')+'</select></div>'+
      '<div class="field" style="width:170px"><label>Time range</label><select class="inp" onchange="pgFilter(\'r\',this.value)">'+['This month','Last 90 days','This year','All time'].map(function(r){ return '<option'+((flt.r||'This year')===r?' selected':'')+'>'+r+'</option>' }).join('')+'</select></div>'+
      '<button class="btn" onclick="flt={t:\'\',st:\'\',r:\'This year\'};PG.page=1;PAGES[page]()">Clear filters</button>'+
    '</div></div>'+
    '<div class="card-b flush">'+(rows.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr>'+
    '<th>Ticket code</th><th>Title</th><th>Submitted</th><th>Status</th><th>Current step</th><th>Current holder</th></tr></thead><tbody>'+
    view.map(function(d){
      var cur=d.sp.filter(function(s){return s.s==='cur'})[0];
      return '<tr onclick="openDon(\''+d.c+'\')">'+
      '<td class="nw"><span class="c-code">'+d.c+'</span></td>'+
      '<td><div class="c-main">'+d.ti+'</div><div class="c-sub">'+TYPES[d.t].n+'</div></td>'+
      '<td class="num nw">'+d.ct+'</td><td>'+chip(d.st)+'</td>'+
      '<td>'+(cur?esc(cur.t):'<span style="color:var(--ink-3)">Ended</span>')+'</td>'+
      '<td>'+(cur?esc(cur.w):'<span style="color:var(--ink-3)">—</span>')+'</td></tr>';
    }).join('')+'</tbody></table></div>':
    '<div class="empty">'+svg(I.doc)+'<b>No tickets match the filters</b><p>Try removing some filter conditions or create a new ticket.</p></div>')+
    (total?pgBar(total):'')+
    '</div></div>';
}

/* ---------- 2. CREATE TICKET (catalog) ---------- */
PAGES['tao-don']=function(){
  var groups={};
  typeKeys().forEach(function(k){ (groups[TYPES[k].g]=groups[TYPES[k].g]||[]).push(k) });
  Object.keys(groups).forEach(function(g){ groups[g].sort(function(a,b){ return TYPES[a].n.localeCompare(TYPES[b].n) }) });
  V('<div class="page-head"><div><h1>Create new ticket</h1></div></div>'+
    Object.keys(groups).map(function(g){
      return '<div class="sec-label">'+g+'</div><div class="cat-grid">'+groups[g].map(function(k){
        var t=TYPES[k];
        return '<button class="cat" onclick="openForm(\''+k+'\')"><div class="ci">'+svg(t.i)+'</div>'+
          '<b>'+t.n+'</b></button>';
      }).join('')+'</div>';
    }).join(''));
};

/* ---------- 3. TICKET FORM ---------- */
function openForm(k){
  page='tao-don'; renderNav();
  document.getElementById('crumb').textContent=TYPES[k].n;
  var t=TYPES[k];
  apOpen(k);
  var fieldHTML=function(f){
    var inp;
    if(f.t==='select') inp='<select class="inp" id="f_'+f.k+'"><option value="">— Select —</option>'+f.o.map(function(o){return '<option>'+o+'</option>'}).join('')+'</select>';
    else if(f.t==='area') inp='<textarea class="inp" id="f_'+f.k+'" placeholder="Enter content…"'+(f.rows?' rows="'+f.rows+'" style="min-height:0"':'')+'></textarea>';
    else if(f.t==='file') inp='<div class="upload">'+svg(I.up)+'Drag and drop files here or click to select<br><span style="font-size:11.5px">PDF, JPG, PNG, DOCX — max 10 MB per file</span></div>';
    else inp='<input class="inp" id="f_'+f.k+'" type="'+(f.t==='date'?'date':f.t==='time'?'time':'text')+'"'+(f.v?' value="'+f.v+'"':'')+(f.ro?' readonly style="background:var(--surface-alt);color:var(--ink-2)"':'')+'>';
    return '<div class="field"><label for="f_'+f.k+'">'+f.l+(f.r?'<span class="req">*</span>':'')+'</label>'+
      inp+(f.h?'<span class="hint">'+f.h+'</span>':'')+'</div>';
  };
  /* legacy fields flagged full = full row (12 columns) */
  var form=t.f.map(function(f){ if(f.full&&!f.w&&!bcFull(f)){ var c={}; for(var x in f) c[x]=f[x]; c.w=12; return c } return f });
  var fields=bcRender(form,{mode:'edit',input:fieldHTML});

  V('<div class="page-head"><div>'+
    '<button class="link" onclick="go(\'tao-don\')" style="margin-bottom:8px">&larr; Back to ticket types</button>'+
    '<h1>'+t.n+'</h1><p>'+t.d+'</p></div></div>'+
    '<div class="grid-2"><div>'+
      '<div class="card"><div class="card-h"><h2>Ticket information</h2><div class="r"><span style="font-size:12px;color:var(--ink-3)"><span style="color:var(--danger)">*</span> is required</span></div></div>'+
      '<div class="card-b">'+fields+'</div></div>'+


      '<div style="display:flex;gap:9px;margin-top:16px;flex-wrap:wrap">'+
      '<button class="btn pri" onclick="submitForm(\''+k+'\')">'+svg(I.send)+'Send ticket</button>'+
      '<button class="btn" onclick="apDraft()">'+svg(I.save)+'Save draft</button>'+
      '<button class="btn" onclick="go(\'tao-don\')">Cancel</button></div>'+

    '</div><div>'+
      '<div class="card"><div class="card-h"><h2>This ticket will go through</h2></div><div class="card-b">'+
      '<div id="apFlow"></div>'+
      '</div></div>'+

    '</div></div>');
  apAfterForm();
}
function submitForm(k){
  if(!apValidate()) return;
  var t=TYPES[k];
  var code=tkNext();
  var tg=apFirstTarget(); apSaveAfterSubmit();
  toast('Ticket '+code+' sent', tg&&tg.p?'Forwarded to '+tg.t+': '+tg.p.n+' ('+tg.p.u+')':'Forwarded to '+t.flow[0].t.toLowerCase());
  AP=null; go('don-cua-toi');
}

/* ---------- 4. MY TICKETS ---------- */
var flt={t:'',st:'',r:'This year'}; /* r = Time range (MTK-BR-041): filters by submit date; drafts by creation date */
PAGES['don-cua-toi']=function(){
  V('<div class="page-head"><div>'+
    '<button class="btn sm" style="margin-bottom:8px" onclick="go(\'tong-quan\')">'+svg('<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>')+'Back to Overview</button>'+
    '<h1>My tickets</h1>'+
    '<p>All tickets (work items) you have created. Click a row to see the workflow diagram of the ticket, which step it is at and who holds it.</p></div>'+
    '<div class="ph-actions"><button class="btn pri" onclick="go(\'tao-don\')">'+svg(I.plus)+'Create new ticket</button></div></div>'+
    myDonsCard('don-cua-toi'));
};

/* ---------- 5. NOTIFICATIONS (opened from the topbar bell) ---------- */
/* Notifications: in-app only, shown in the bell inbox panel (no separate page, MTK-BR-017) */
PAGES['thong-bao']=function(){ toggleInbox() };
function toggleInbox(){
  var old=document.getElementById('inboxPop'); if(old){ old.remove(); return }
  var pop=document.createElement('div'); pop.id='inboxPop'; pop.setAttribute('role','dialog'); pop.setAttribute('aria-label','Notifications');
  pop.style.cssText='position:fixed;top:56px;right:16px;width:380px;max-width:calc(100vw - 24px);max-height:70vh;overflow:auto;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 32px rgba(15,31,61,.18);z-index:120';
  pop.innerHTML='<div style="padding:12px 16px;font-weight:600;border-bottom:1px solid var(--line)">Notifications</div>'+
    NOTIFS.map(function(n){
      return '<div class="notif '+(n.u?'unread':'read')+'" style="cursor:pointer" onclick="inboxOpen(\''+n.go+'\')">'+
        '<div class="nd"></div><div style="flex:1"><p>'+n.x+'</p><time>'+n.t+'</time></div></div>';
    }).join('');
  document.body.appendChild(pop);
  setTimeout(function(){ document.addEventListener('click',inboxAway,true) },0);
}
function inboxAway(e){ var p=document.getElementById('inboxPop'); if(!p){ document.removeEventListener('click',inboxAway,true); return }
  if(p.contains(e.target)||(e.target.closest&&e.target.closest('#btn-bell'))) return; p.remove(); document.removeEventListener('click',inboxAway,true) }
function inboxOpen(code){ NOTIFS.forEach(function(n){ if(n.go===code) n.u=0 }); var p=document.getElementById('inboxPop'); if(p) p.remove(); openAny(code) }

/* =====================================================================
   DETAIL DRAWER
   ===================================================================== */

/* =====================================================================
   WORKFLOW DIAGRAM IN TICKET DETAIL — uses the exact drawing from the Admin portal
   (same node coordinates, node types, connectors, labels Approve / Reject / Yes / No).
   The current ticket step is highlighted; completed steps are checked.
   ===================================================================== */
var FV_DEFS={"nghi-phep":{"wf":"leave-approval-demo","n":"Leave approval","v":8,"nodes":[{"id":"n1","t":"start","x":40,"y":210,"name":"Employee submits ticket","who":"Submitter","nf":8},{"id":"n2","t":"task","x":268,"y":210,"name":"Line manager approval","who":"Line manager","nf":4},{"id":"n3","t":"gate","x":500,"y":210,"name":"Leave over threshold?","cond":"soNgay > {{NGUONG_NGAY_CAP2}}"},{"id":"n4","t":"task","x":732,"y":86,"name":"HR Head approval","who":"HR Head","nf":4},{"id":"n5","t":"sys","x":964,"y":210,"name":"Update HRM timesheet","sys":"POST /api/timesheet/leave"},{"id":"n7","t":"end","x":1196,"y":210,"name":"End — Approved","kq":"duyet"},{"id":"n8","t":"end","x":500,"y":414,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"n1","to":"n2"},{"f":"n2","to":"n3","lbl":"Approve"},{"f":"n2","to":"n8","lbl":"Reject"},{"f":"n3","to":"n4","lbl":"Yes"},{"f":"n3","to":"n5","lbl":"No"},{"f":"n4","to":"n5","lbl":"Approve"},{"f":"n4","to":"n8","lbl":"Reject"},{"f":"n5","to":"n7"}]},"tang-luong":{"wf":"salary-increase-demo","n":"Salary increase approval","v":2,"nodes":[{"id":"s1","t":"start","x":40,"y":200,"name":"Manager proposes","who":"Line manager","nf":6},{"id":"s2","t":"task","x":268,"y":200,"name":"Department head approval","who":"Head of the department","nf":2},{"id":"s3","t":"gate","x":500,"y":200,"name":"Raise over threshold %?","cond":"mucTang > {{NGUONG_PHAN_TRAM}}"},{"id":"s4","t":"task","x":732,"y":80,"name":"Director approval","who":"Director","nf":3},{"id":"s5","t":"sys","x":964,"y":200,"name":"Update payroll","sys":"POST /api/payroll/salary-change"},{"id":"s6","t":"end","x":1196,"y":200,"name":"End — Approved","kq":"duyet"},{"id":"s7","t":"end","x":500,"y":390,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"s1","to":"s2"},{"f":"s2","to":"s3","lbl":"Approve"},{"f":"s2","to":"s7","lbl":"Reject"},{"f":"s3","to":"s4","lbl":"Yes"},{"f":"s3","to":"s5","lbl":"No"},{"f":"s4","to":"s5","lbl":"Approve"},{"f":"s4","to":"s7","lbl":"Reject"},{"f":"s5","to":"s6"}]},"ot":{"wf":"ot-request","n":"Overtime request","v":3,"nodes":[{"id":"o1","t":"start","x":40,"y":200,"name":"Employee registers OT","who":"Submitter","nf":6},{"id":"o2","t":"task","x":268,"y":200,"name":"Line manager approval","who":"Line manager","nf":3},{"id":"o3","t":"gate","x":500,"y":200,"name":"Monthly OT cap exceeded?","cond":"otThang > {{TRAN_OT_THANG}}"},{"id":"o4","t":"task","x":732,"y":80,"name":"HR approval for over-cap","who":"HR Head","nf":2},{"id":"o5","t":"sys","x":964,"y":200,"name":"Record in timesheet","sys":"POST /api/timesheet/overtime"},{"id":"o6","t":"end","x":1196,"y":200,"name":"End — Approved","kq":"duyet"},{"id":"o7","t":"end","x":500,"y":380,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"o1","to":"o2"},{"f":"o2","to":"o3","lbl":"Approve"},{"f":"o2","to":"o7","lbl":"Reject"},{"f":"o3","to":"o4","lbl":"Yes"},{"f":"o3","to":"o5","lbl":"No"},{"f":"o4","to":"o5","lbl":"Approve"},{"f":"o4","to":"o7","lbl":"Reject"},{"f":"o5","to":"o6"}]}};
(function(){
  var X=function(o){ FV_DEFS[o.key]=o };
  X({key:'cong-tac',wf:'business-trip',n:'Business trip',v:2,nodes:[
    {id:'c1',t:'start',x:40,y:200,name:'Employee registers business trip',who:'Submitter',nf:7},
    {id:'c2',t:'task',x:268,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'c3',t:'gate',x:500,y:200,name:'Overseas or over 5 days?',cond:'noiDen = Overseas || soNgay > {{NGUONG_NGAY_CT}}'},
    {id:'c4',t:'task',x:732,y:80,name:'Director approval',who:'Director',nf:2},
    {id:'c5',t:'gate',x:964,y:200,name:'Advance requested?',cond:'tamUng > 0'},
    {id:'c6',t:'task',x:1196,y:80,name:'Accounting advance',who:'Accountant',nf:3},
    {id:'c7',t:'sys',x:1428,y:200,name:'Update HRM business trip calendar',sys:'POST /api/business-trip'},
    {id:'c8',t:'end',x:1660,y:200,name:'End — Approved',kq:'duyet'},
    {id:'c9',t:'end',x:732,y:390,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'c1',to:'c2'},{f:'c2',to:'c3',lbl:'Approve'},{f:'c2',to:'c9',lbl:'Reject'},{f:'c3',to:'c4',lbl:'Yes'},{f:'c3',to:'c5',lbl:'No'},
     {f:'c4',to:'c5',lbl:'Approve'},{f:'c4',to:'c9',lbl:'Reject'},{f:'c5',to:'c6',lbl:'Yes'},{f:'c5',to:'c7',lbl:'No'},{f:'c6',to:'c7'},{f:'c7',to:'c8'}]});
  X({key:'tam-ung',wf:'advance-payment',n:'Advance / payment',v:4,nodes:[
    {id:'t1',t:'start',x:40,y:200,name:'Employee requests advance',who:'Submitter',nf:6},
    {id:'t2',t:'task',x:268,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'t3',t:'task',x:500,y:200,name:'Chief Accountant approval',who:'Chief Accountant',nf:3},
    {id:'t4',t:'task',x:732,y:200,name:'Disburse payment',who:'Accounting Department',nf:2},
    {id:'t5',t:'sys',x:964,y:200,name:'Record in accounting system',sys:'POST /api/accounting/payment'},
    {id:'t6',t:'end',x:1196,y:200,name:'End — Approved',kq:'duyet'},
    {id:'t7',t:'end',x:500,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'t1',to:'t2'},{f:'t2',to:'t3',lbl:'Approve'},{f:'t2',to:'t7',lbl:'Reject'},{f:'t3',to:'t4',lbl:'Approve'},{f:'t3',to:'t7',lbl:'Reject'},{f:'t4',to:'t5'},{f:'t5',to:'t6'}]});
  X({key:'doi-ca',wf:'shift-change',n:'Shift change',v:1,nodes:[
    {id:'d1',t:'start',x:40,y:200,name:'Employee requests shift change',who:'Submitter',nf:5},
    {id:'d2',t:'task',x:268,y:200,name:'Swap partner confirms',who:'Related person',nf:1},
    {id:'d3',t:'task',x:500,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'d4',t:'sys',x:732,y:200,name:'Update work schedule',sys:'POST /api/timesheet/shift'},
    {id:'d5',t:'end',x:964,y:200,name:'End — Approved',kq:'duyet'},
    {id:'d6',t:'end',x:500,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'d1',to:'d2'},{f:'d2',to:'d3',lbl:'Approve'},{f:'d2',to:'d6',lbl:'Reject'},{f:'d3',to:'d4',lbl:'Approve'},{f:'d3',to:'d6',lbl:'Reject'},{f:'d4',to:'d5'}]});
  X({key:'xac-nhan-cong',wf:'timesheet-confirm',n:'Timesheet confirmation',v:3,nodes:[
    {id:'x1',t:'start',x:40,y:200,name:'Employee explains attendance',who:'Submitter',nf:5},
    {id:'x2',t:'task',x:268,y:200,name:'Line manager confirmation',who:'Line manager',nf:2},
    {id:'x3',t:'task',x:500,y:200,name:'HR updates timesheet',who:'HR C&B',nf:2},
    {id:'x4',t:'sys',x:732,y:200,name:'Update HRM timesheet',sys:'POST /api/timesheet/adjust'},
    {id:'x5',t:'end',x:964,y:200,name:'End — Approved',kq:'duyet'},
    {id:'x6',t:'end',x:268,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'x1',to:'x2'},{f:'x2',to:'x3',lbl:'Approve'},{f:'x2',to:'x6',lbl:'Reject'},{f:'x3',to:'x4'},{f:'x4',to:'x5'}]});
  X({key:'thoi-viec',wf:'resignation',n:'Resignation',v:2,nodes:[
    {id:'r1',t:'start',x:40,y:200,name:'Employee submits resignation ticket',who:'Submitter',nf:6},
    {id:'r2',t:'task',x:268,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'r3',t:'task',x:500,y:200,name:'HR Head approval',who:'HR Head',nf:3},
    {id:'r4',t:'task',x:732,y:200,name:'Director approval',who:'Director',nf:2},
    {id:'r5',t:'task',x:964,y:200,name:'Handover & benefits settlement',who:'HR + Accounting',nf:4},
    {id:'r6',t:'sys',x:1196,y:200,name:'Update resignation status',sys:'POST /api/employee/resign'},
    {id:'r7',t:'end',x:1428,y:200,name:'End — Approved',kq:'duyet'},
    {id:'r8',t:'end',x:500,y:390,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'r1',to:'r2'},{f:'r2',to:'r3',lbl:'Approve'},{f:'r2',to:'r8',lbl:'Reject'},{f:'r3',to:'r4',lbl:'Approve'},{f:'r3',to:'r8',lbl:'Reject'},
     {f:'r4',to:'r5',lbl:'Approve'},{f:'r4',to:'r8',lbl:'Reject'},{f:'r5',to:'r6'},{f:'r6',to:'r7'}]});
  X({key:'ticket-it',wf:'it-ticket',n:'IT / Admin request',v:5,nodes:[
    {id:'i1',t:'start',x:40,y:200,name:'Employee creates ticket',who:'Submitter',nf:6},
    {id:'i2',t:'task',x:268,y:200,name:'Receive & classify',who:'Support team',nf:3},
    {id:'i3',t:'gate',x:500,y:200,name:'Access approval needed?',cond:'nhomYeuCau = Access request'},
    {id:'i4',t:'task',x:732,y:80,name:'Line manager access approval',who:'Line manager',nf:2},
    {id:'i5',t:'task',x:964,y:200,name:'Process',who:'Assigned technician',nf:3},
    {id:'i6',t:'task',x:1196,y:200,name:'Requester confirms',who:'Submitter',nf:2},
    {id:'i7',t:'end',x:1428,y:200,name:'End — Closed',kq:'duyet'},
    {id:'i8',t:'end',x:732,y:390,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'i1',to:'i2'},{f:'i2',to:'i3'},{f:'i3',to:'i4',lbl:'Yes'},{f:'i3',to:'i5',lbl:'No'},{f:'i4',to:'i5',lbl:'Approve'},{f:'i4',to:'i8',lbl:'Reject'},
     {f:'i5',to:'i6'},{f:'i6',to:'i7'}]});
  X({key:'dat-phong-hop',wf:'fis-meeting-room',n:'Meeting room booking',v:1,nodes:[
    {id:'p1',t:'start',x:40,y:200,name:'Employee books meeting room',who:'Submitter',nf:2},
    {id:'p2',t:'task',x:268,y:200,name:'Admin processing',who:'Admin team',nf:2},
    {id:'p3',t:'task',x:500,y:200,name:'Requester confirms',who:'Submitter',nf:1},
    {id:'p4',t:'end',x:732,y:200,name:'End — Closed',kq:'duyet'},
    {id:'p5',t:'end',x:500,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'p1',to:'p2'},{f:'p2',to:'p3',lbl:'Approve'},{f:'p2',to:'p5',lbl:'Reject'},{f:'p3',to:'p4'}]});
  X({key:'profile-update',wf:'profile-update',n:'Employee Profile Update',v:1,nodes:[
    {id:'w2',t:'task',x:60,y:200,name:'HR approves profile change',who:'HR Head',nf:2},
    {id:'w3',t:'end',x:360,y:120,name:'End — Approved',kq:'duyet'},
    {id:'w4',t:'end',x:360,y:300,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'w2',to:'w3',lbl:'Approve'},{f:'w2',to:'w4',lbl:'Reject'}]});
})();
/* Ticket step name differs from node name on the drawing -> declare an alias to match */
var FV_AL={
 'nghi-phep':{n5:['Update timesheet']},
 'ot':{o4:['HR Head approval'],o5:['Record timesheet']},
 'tang-luong':{s2:['Line manager approval']},
 'cong-tac':{c7:['Completed','Complete'],c6:['Advance accounting']},
 'doi-ca':{d2:['Related person confirms','Swap partner confirmation']},
 'ticket-it':{i2:['Receive & triage'],i4:['Line manager approves access'],i5:['In progress','IT grants access','IT access provisioning','Admin processing'],i6:['Requester confirmation']},
 'xac-nhan-cong':{x3:['HR timesheet update']}
};
var FV_LO={'Employee Profile Update':'profile-update','Leave':'nghi-phep','Overtime request':'ot','Salary increase proposal':'tang-luong','Advance / payment':'tam-ung',
  'Business trip':'cong-tac','Shift change':'doi-ca','Timesheet confirmation':'xac-nhan-cong','Resignation':'thoi-viec','IT / Admin request':'ticket-it','Meeting room booking':'dat-phong-hop'};
var FVT={
 start:{sn:'Start',c:'#0f7a52',i:'<path d="M6 4l14 8-14 8z"/>',form:1},
 task:{sn:'Approval step',c:'#6b32c9',i:'<path d="M20 6L9 17l-5-5"/>',form:1},
 gate:{sn:'Condition',c:'#a3590a',i:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'},
 sys:{sn:'System',c:'#0b6aa8',i:'<path d="M9 2v6M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>'},
 end:{sn:'End',c:'#48586e',i:'<circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6" rx="1"/>'}
};
var FV_FORM='<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>';
var FVZ=null, FVCUR=null;

function fvKey(d){ return d.t&&FV_DEFS[d.t]?d.t:(FV_LO[d.lo]||'') }
/* Compute the state of each node from the ticket steps */
function fvState(d,def,key){
  var S={}, P={}, al=FV_AL[key]||{}, fin=(d.st==='duyet'||d.st==='tuchoi'||d.st==='thuhoi'||d.st==='huy');
  var byName=function(t){
    var hit=null;
    def.nodes.forEach(function(n){ if(hit||n.t==='gate'||n.t==='end') return;
      if(n.name===t||(al[n.id]||[]).indexOf(t)>=0) hit=n });
    return hit;
  };
  var rank={pend:0,done:1,ask:2,rej:3,cur:4};
  var set=function(id,st,info){ if(S[id]===undefined||rank[st]>rank[S[id]]){ S[id]=st; if(info) P[id]=info } };
  var start=def.nodes.filter(function(n){return n.t==='start'})[0], lastTask=null;
  (d.sp||[]).forEach(function(s,i){
    var n=i===0?start:byName(s.t), st=s.s==='done'?'done':s.s==='cur'?'cur':s.s==='rej'?'rej':'pend';
    if(!n&&/withdraw/i.test(s.t)){ if(st==='rej') set(start.id,'done'); return }
    if(!n) return;
    set(n.id,st,{w:s.w,at:s.at||'',st:st});
    if(n.t==='task'&&(st==='done'||st==='cur')) lastTask=n;
  });
  var succ=function(id){ return def.links.filter(function(l){return l.f===id}).map(function(l){return l.to}) };
  var pred=function(id){ return def.links.filter(function(l){return l.to===id}).map(function(l){return l.f}) };
  var byId=function(id){ return def.nodes.filter(function(n){return n.id===id})[0] };
  var reach=function(id,seen){ seen=seen||{}; var o=[]; succ(id).forEach(function(x){ if(seen[x]) return; seen[x]=1; o.push(x); o=o.concat(reach(x,seen)) }); return o };
  var live=function(st){ return st==='done'||st==='cur'||st==='ask'||st==='rej' };
  /* user / system nodes absent from the data: passed if a later step is processed (except condition branches) */
  def.nodes.forEach(function(n){
    if(S[n.id]!==undefined||n.t==='gate'||n.t==='end') return;
    var pr=pred(n.id), onlyGate=pr.length&&pr.every(function(p){return byId(p).t==='gate'});
    if(onlyGate) return;
    var later=reach(n.id).some(function(x){ var bx=byId(x); return bx.t!=='gate'&&bx.t!=='end'&&live(S[x]) });
    if(later||(n.t==='sys'&&d.st==='duyet')) set(n.id,'done');
  });
  def.nodes.forEach(function(n){
    if(n.t==='end'){ if(n.kq==='duyet'&&d.st==='duyet') S[n.id]='done'; else if(n.kq==='tuchoi'&&d.st==='tuchoi') S[n.id]='rej'; }
  });
  for(var pass=0;pass<3;pass++) def.nodes.forEach(function(n){
    if(n.t!=='gate') return;
    if(succ(n.id).some(function(x){return live(S[x])})) S[n.id]='done';
  });
  def.nodes.forEach(function(n){ if(S[n.id]===undefined||S[n.id]==='pend') S[n.id]=fin?'skip':'pend' });
  return {S:S,P:P};
}
/* ---- Workflow of this ticket v10: same-size node cards, orthogonal connectors, Diagram / Progress views ---- */
var FV_G={NW:192,NH:88,GX:52,RG:58,PX:28,PT:24,PB:28};
var FV_VIEW='diagram';
function fvPlain(w){ return String(w||'').replace(/\s*\(you\)\s*$/,'') }
/* Account directory (demo data; in production it comes from HRM / the org chart) */
var FV_ACC={'Trần Văn Dũng':'dungvt4','Phạm Thu Hà':'haptt','Vũ Quốc Hưng':'hungvq','Nguyễn Văn An':'annv','Lê Thị Mai':'mailt',
  'Hoàng Minh Tuấn':'tuanhm','Phan Thanh Sơn':'sonpt','Phạm Minh Đức':'ducpm','Nguyễn Văn Nam':'namnv','Đỗ Thanh Bình':'binhdt',
  'Ngô Thị Lan':'lannt','Lê Quang Huy':'huylq','Lê Văn Khánh':'khanhlv','Trần Thị Hoa':'hoatt'};
/* Role -> person for steps with no data on the ticket (demo org chart) */
var FV_ROLE={'Line manager':'Trần Văn Dũng','Head of the department':'Trần Văn Dũng','HR Head':'Phạm Thu Hà','Director':'Vũ Quốc Hưng','Chief Accountant':'Đỗ Thanh Bình'};
function fvWho(w){ w=fvPlain(w); return FV_ACC[w]?w+' - '+FV_ACC[w]:w }
function fvLine(n,st,p){
  /* returns [ "Full name - account", "status / time" ] for submit & approval steps (and any system actor with data) */
  if(n.t==='gate'||n.t==='end') return null;
  var w=p&&p.w?fvPlain(p.w):'';
  if(n.t==='sys'){ if(!w||st==='skip') return null; return [w,st==='done'?(p.at||''):st==='cur'?(p.fail?'Failed':'Running'):''] }
  if(!w&&n.who){ w=FV_ROLE[n.who]||(n.who==='Submitter'&&FVCUR&&FVCUR.d&&FVCUR.d.nv)||n.who }
  if(!w) return null;
  var l2='';
  if(st==='cur') l2='In progress'; 
  else if(st==='done'||st==='rej') l2=(p&&p.at)||(st==='rej'?'Rejected':'');
  else if(st==='skip') l2='Not triggered';
  return [fvWho(w),l2];
}
/* Place nodes on a clean grid: column from the authored x, row = main lane / branch lane above / rejection lane below */
function fvGeo(def){
  var st=def.nodes.filter(function(n){return n.t==='start'})[0]||def.nodes[0];
  var G={}, minR=0, maxR=0, maxC=0;
  def.nodes.forEach(function(n){
    var c=Math.max(0,Math.round((n.x-40)/232)), r=n.y<st.y-40?-1:(n.y>st.y+100?1:0);
    G[n.id]={c:c,rw:r}; minR=Math.min(minR,r); maxR=Math.max(maxR,r); maxC=Math.max(maxC,c);
  });
  def.nodes.forEach(function(n){ var g=G[n.id];
    g.x=FV_G.PX+g.c*(FV_G.NW+FV_G.GX); g.y=FV_G.PT+(g.rw-minR)*(FV_G.NH+FV_G.RG); g.cy=g.y+FV_G.NH/2; });
  return {G:G, W:FV_G.PX*2+(maxC+1)*FV_G.NW+maxC*FV_G.GX, H:FV_G.PT+(maxR-minR+1)*FV_G.NH+(maxR-minR)*FV_G.RG+FV_G.PB};
}
var FV_DOT={
  done:'<path d="M20 6L9 17l-5-5"/>', rej:'<path d="M18 6L6 18M6 6l12 12"/>',
  cur:'<circle cx="12" cy="12" r="4.5"/>', ask:'<path d="M9.1 9a3 3 0 1 1 4 2.8c-.8.3-1.1 1-1.1 1.7v.5M12 17h.01"/>',
  pend:'<circle cx="12" cy="12" r="3"/>', skip:'<path d="M6 12h12"/>'
};
function fvNode(n,st,p,g){
  var ln=fvLine(n,st,p);
  var badge=st==='cur'?'<span class="fv-now">Current step</span>':'';
  return '<div class="fvn t-'+n.t+(n.kq?' k-'+n.kq:'')+' st-'+st+'" id="fvn_'+n.id+'" style="left:'+g.x+'px;top:'+g.y+'px" title="'+esc(n.name)+'">'+badge+
    '<div class="fvn-c"><div class="fvn-h"><span class="fvn-dot"><svg viewBox="0 0 24 24">'+(FV_DOT[st]||FV_DOT.pend)+'</svg></span><b>'+esc(n.name)+'</b></div>'+
    (ln?'<span class="fvn-w">'+esc(ln[0])+'</span>'+(ln[1]?'<span class="fvn-t">'+esc(ln[1])+'</span>':''):'')+
    '</div></div>';
}
/* Progress view — vertical timeline of the ticket's steps */
function fvProg(d){
  var sp=(d&&d.sp)||[];
  if(!sp.length) return '<div class="empty"><b>No progress data</b></div>';
  return '<ul class="tl">'+sp.map(function(s){
    var cls=s.s==='done'?'done':s.s==='cur'?'cur':s.s==='rej'?'rej':'pend';
    var ic=cls==='done'?FV_DOT.done:cls==='rej'?FV_DOT.rej:'<circle cx="12" cy="12" r="3.5"/>';
    var stx=cls==='done'?(s.at?'<span class="num">'+esc(s.at)+'</span>':'Done'):
            cls==='cur'?(s.fail?'<span class="tl-rej">System task failed</span>':'<span class="tl-cur">Awaiting processing</span>'):
            cls==='rej'?'<span class="tl-rej">Rejected</span>'+(s.at?' · <span class="num">'+esc(s.at)+'</span>':''):'Not reached yet';
    return '<li class="'+cls+'"><span class="mk">'+svg(ic)+'</span><div>'+
      '<div class="ti">'+esc(s.t)+'</div>'+
      '<div class="tm">'+(cls==='pend'?fvPendTxt(s):esc(fvWho(s.w))+' · '+stx)+'</div>'+
      (s.fail?'<div class="tnote">The administrator has been notified.</div>':'')+
      (s.note?'<div class="tnote">'+esc(s.note)+'</div>':'')+'</div></li>';
  }).join('')+'</ul>';
}
function fvCard(d,title){
  var key=fvKey(d), def=FV_DEFS[key];
  if(!def) return '';
  var r=fvState(d,def,key), L=fvGeo(def); FVCUR={d:d,def:def,r:r,G:L.G,W:L.W,H:L.H};
  var dg=FV_VIEW==='diagram';
  return '<div class="card fv-card" style="box-shadow:none"><div class="card-h"><h2>'+(title||'Workflow')+'</h2>'+
    '<div class="r">'+
    '<div class="fv-tools" id="fvTools"'+(dg?'':' hidden')+'>'+
    '<div class="fv-lg"><span><i class="lg-d"></i>Done</span><span><i class="lg-c"></i>Current</span><span><i class="lg-w"></i>Waiting</span></div>'+
    '<div class="fv-zoom"><button onclick="fvZoom(-1)" title="Zoom out"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'+
    '<span id="fvZv">100%</span><button onclick="fvZoom(1)" title="Zoom in"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>'+
    '<button class="zf" onclick="fvFit()">Fit</button></div></div>'+
    '<div class="fv-seg" role="tablist" aria-label="Workflow view">'+
    '<button role="tab" data-v="diagram" class="'+(dg?'on':'')+'" aria-selected="'+dg+'" onclick="fvView(\'diagram\')">Workflow</button>'+
    '<button role="tab" data-v="progress" class="'+(dg?'':'on')+'" aria-selected="'+(!dg)+'" onclick="fvView(\'progress\')">Progress</button></div>'+
    '</div></div>'+
    '<div class="fv" id="fvBox"'+(dg?'':' hidden')+'><div class="fv-in" id="fvIn"><div class="fv-lay" id="fvLay" style="width:'+L.W+'px;height:'+L.H+'px">'+
    '<svg class="fv-svg" id="fvSvg" width="'+L.W+'" height="'+L.H+'"></svg>'+
    def.nodes.map(function(n){ return fvNode(n,r.S[n.id],r.P[n.id],L.G[n.id]) }).join('')+
    '</div></div></div>'+
    '<div class="fvp" id="fvProg"'+(dg?' hidden':'')+'>'+fvProg(d)+'</div></div>';
}
function fvView(v){
  FV_VIEW=v;
  var box=document.getElementById('fvBox'), pr=document.getElementById('fvProg'), tl=document.getElementById('fvTools');
  if(box) box.hidden=(v!=='diagram'); if(pr) pr.hidden=(v!=='progress'); if(tl) tl.hidden=(v!=='diagram');
  Array.prototype.forEach.call(document.querySelectorAll('.fv-seg button'),function(b){
    var on=b.getAttribute('data-v')===v; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false') });
  if(v==='diagram'){ fvLinks(); fvFit() }
}
/* polyline -> path with rounded corners */
function fvRound(p,r){
  var q=[p[0]]; for(var i=1;i<p.length;i++) if(p[i][0]!==q[q.length-1][0]||p[i][1]!==q[q.length-1][1]) q.push(p[i]);
  var d='M'+q[0][0]+' '+q[0][1];
  for(var j=1;j<q.length-1;j++){
    var a=q[j-1], b=q[j], c=q[j+1], l1=Math.hypot(b[0]-a[0],b[1]-a[1]), l2=Math.hypot(c[0]-b[0],c[1]-b[1]), rr=Math.min(r,l1/2,l2/2);
    d+=' L'+(b[0]-(b[0]-a[0])/l1*rr)+' '+(b[1]-(b[1]-a[1])/l1*rr)+' Q'+b[0]+' '+b[1]+' '+(b[0]+(c[0]-b[0])/l2*rr)+' '+(b[1]+(c[1]-b[1])/l2*rr);
  }
  var z=q[q.length-1]; return d+' L'+z[0]+' '+z[1];
}
function fvLinks(){
  var s=document.getElementById('fvSvg'); if(!s||!FVCUR) return;
  var S=FVCUR.r.S, G=FVCUR.G, def=FVCUR.def, NW=FV_G.NW, NH=FV_G.NH, GX=FV_G.GX, B={}, byId={}, E=[];
  var live=function(x){ return x==='done'||x==='cur'||x==='rej'||x==='ask' };
  def.nodes.forEach(function(n){ var g=G[n.id]; byId[n.id]=n;
    B[n.id]={l:g.x,r:g.x+NW,cx:g.x+NW/2,cy:g.cy,t:g.y,b:g.y+NH,col:g.c,rw:g.rw} });
  def.links.forEach(function(l){
    var A=B[l.f], Z=B[l.to], nb=byId[l.to]; if(!A||!Z) return;
    var rej=nb.t==='end'&&nb.kq==='tuchoi', pts, lp, lt='pill';
    if(rej){
      if(A.col===Z.col) pts=[[A.cx,A.b],[Z.cx,Z.t]];
      else pts=[[A.cx,A.b],[A.cx,Z.cy],[A.col<Z.col?Z.l:Z.r,Z.cy]];
      lp=[A.cx,A.b+20];
    } else if(A.rw===Z.rw){
      pts=[[A.r,A.cy],[Z.l,Z.cy]]; lt='text';
      lp=[Z.col-A.col>1?A.r+GX/2+40:(A.r+Z.l)/2,A.cy-8];
    } else { var mx=A.r+GX/2; pts=[[A.r,A.cy],[mx,A.cy],[mx,Z.cy],[Z.l,Z.cy]]; lp=[mx,(A.cy+Z.cy)/2] }
    var on=rej?(S[l.f]==='rej'&&live(S[l.to])):((S[l.f]==='done'||S[l.f]==='ask')&&live(S[l.to]));
    var k=!on?'n':rej?'r':(l.lbl==='Approve'||l.lbl==='Yes')?'g':'b';
    E.push({pts:pts,lp:lp,lt:lt,lbl:l.lbl,on:on,k:k,rej:rej});
  });
  var COL={n:['#c3cddb','#7d8ca2','#dbe2ec'],g:['#0f7a52','#0f7a52','#9fd3bb'],r:['#b3261e','#b3261e','#efb4af'],b:['#0968d2','#0968d2','#a9c9ef']};
  var parts='';
  E.sort(function(a,b){ return (a.on?1:0)-(b.on?1:0) }).forEach(function(e){
    var c=COL[e.k];
    parts+='<path d="'+fvRound(e.pts,12)+'" fill="none" stroke="'+c[0]+'" stroke-width="'+(e.on?2.2:1.6)+'" stroke-linecap="round"'+(e.rej&&!e.on?' stroke-dasharray="5 4"':'')+' marker-end="url(#fvm_'+e.k+')"/>';
  });
  E.forEach(function(e){
    if(!e.lbl) return; var c=COL[e.k], x=e.lp[0], y=e.lp[1];
    var tx='<text x="'+x+'" y="'+(y+3.6)+'" text-anchor="middle" font-size="10.5" font-weight="600" fill="'+c[1]+'" font-family="Be Vietnam Pro, Inter, sans-serif"';
    if(e.lt==='text') parts+=tx+' stroke="#f7f9fc" stroke-width="4" stroke-linejoin="round" paint-order="stroke">'+esc(e.lbl)+'</text>';
    else { var w=e.lbl.length*5.9+16;
      parts+='<g><rect x="'+(x-w/2)+'" y="'+(y-9)+'" width="'+w+'" height="18" rx="9" fill="#fff" stroke="'+c[2]+'"/>'+tx+'>'+esc(e.lbl)+'</text></g>'; }
  });
  s.innerHTML='<defs>'+['n','g','r','b'].map(function(k){
    return '<marker id="fvm_'+k+'" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 1L10 5L0 9z" fill="'+COL[k][0]+'"/></marker>' }).join('')+'</defs>'+parts;
}
function fvApply(){
  var lay=document.getElementById('fvLay'), inn=document.getElementById('fvIn'), zv=document.getElementById('fvZv'), box=document.getElementById('fvBox'); if(!lay||!FVCUR) return;
  lay.style.transform='scale('+FVZ+')'; inn.style.width=Math.ceil(FVCUR.W*FVZ)+'px'; inn.style.height=Math.ceil(FVCUR.H*FVZ)+'px';
  if(zv) zv.textContent=Math.round(FVZ*100)+'%';
  /* no inner scrollbars: the box grows with the diagram (capped; drag to pan beyond that) */
  if(box) box.style.height=Math.min(600,Math.max(150,Math.ceil(FVCUR.H*FVZ)+8))+'px';
}
function fvFit(){
  var box=document.getElementById('fvBox'); if(!box||!FVCUR||box.hidden||!box.clientWidth) return;
  FVZ=Math.max(.4,Math.min(1,(box.clientWidth-24)/FVCUR.W)); FVZ=Math.floor(FVZ*100)/100; fvApply(); box.scrollLeft=0; box.scrollTop=0;
}
/* Update the diagram and progress in place after the ticket status changes: keep zoom level, no reload */
function fvRefresh(){
  var d=dCur, lay=document.getElementById('fvLay'); if(!d||!lay||!FVCUR) return;
  var key=fvKey(d), def=FV_DEFS[key]; if(!def) return;
  var r=fvState(d,def,key); FVCUR.d=d; FVCUR.def=def; FVCUR.r=r;
  lay.innerHTML='<svg class="fv-svg" id="fvSvg" width="'+FVCUR.W+'" height="'+FVCUR.H+'"></svg>'+
    def.nodes.map(function(n){ return fvNode(n,r.S[n.id],r.P[n.id],FVCUR.G[n.id]) }).join('');
  var pr=document.getElementById('fvProg'); if(pr) pr.innerHTML=fvProg(d);
  fvLinks();
}
function fvZoom(k){ FVZ=Math.max(.4,Math.min(1.4,Math.round(((FVZ||1)+k*.1)*100)/100)); fvApply() }
/* drag the diagram to pan when zoomed in (no scrollbars) */
(function(){
  var dn=null;
  document.addEventListener('mousedown',function(e){ var b=e.target.closest&&e.target.closest('#fvBox'); if(!b||e.target.closest('button')) return; dn={b:b,x:e.clientX,y:e.clientY,l:b.scrollLeft,t:b.scrollTop}; b.classList.add('pan'); e.preventDefault() });
  document.addEventListener('mousemove',function(e){ if(!dn) return; dn.b.scrollLeft=dn.l-(e.clientX-dn.x); dn.b.scrollTop=dn.t-(e.clientY-dn.y) });
  document.addEventListener('mouseup',function(){ if(dn){ dn.b.classList.remove('pan'); dn=null } });
})();
function fvMount(){ if(!document.getElementById('fvBox')) return; fvLinks(); fvFit() }
window.addEventListener('resize',function(){ if(document.getElementById('fvBox')) fvFit(); fvPlace() });
/* Ticket detail panel spans the whole content area — from the left sidebar edge to the right edge */
function fvPlace(){
  var dr=document.getElementById('drw'), sd=document.getElementById('side'); if(!dr) return;
  var l=sd?Math.round(sd.getBoundingClientRect().right):0;
  if(window.innerWidth<780) l=0;
  dr.style.left=l+'px';
}

var dTab='tt', dCur=null;
function openDon(code){ dCur=DONS.filter(function(d){return d.c===code})[0]; dTab='tt'; drawDrawer() }
function openAny(c){ openDon(c) }
function openTicket(c){ openDon(c) }
function closeDrawer(){ document.getElementById('drw').classList.remove('on'); document.getElementById('ovl').classList.remove('on') }
function nowStr(){ var n=new Date(),p=function(x){return (x<10?'0':'')+x}; return p(n.getDate())+'/'+p(n.getMonth()+1)+'/'+n.getFullYear()+' '+p(n.getHours())+':'+p(n.getMinutes()) }
/* Click an option: open its content in block [C]; click the open option again to collapse. The diagram in block [A] is not redrawn */
function setTab(t){
  dTab=(dTab===t)?'':t;
  var c=document.getElementById('dtC'), bar=document.getElementById('dtB'); if(!c||!bar){ drawDrawer(); return }
  c.hidden=!dTab; c.className='dtC'+(dTab==='td'?' cmx':'');
  if(dTab){ c.innerHTML=drwBody(dCur); c.scrollTop=0 } else c.innerHTML='';
  Array.prototype.forEach.call(bar.querySelectorAll('.tab'),function(b){
    var on=b.getAttribute('data-t')===dTab; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false');
  });
}
/* After the user changes the ticket status: update in place, keep the detail panel open */
function drwAfterChange(){
  fvRefresh();
  var c=document.getElementById('dtC'); if(c&&dTab){ c.innerHTML=drwBody(dCur) }
  var f=document.getElementById('drwF'); if(f) f.innerHTML=drwFoot(dCur);
  renderNav(); if(PAGES[page]) PAGES[page]();
}
/* MTK-BR-015 (3): ticket can be withdrawn only while no approver has approved or rejected at any step */
function hasApproverDecision(d){
  return (d.sp||[]).some(function(s,i){
    return i>0 && (s.s==='done'||s.s==='rej') && s.kind!=='task' && !/system/i.test(s.w||'') && !/withdr/i.test(s.t||'');
  });
}
function withdrawDon(){
  var d=dCur; if(!d||d.st!=='cho') return;
  if(d.sysStarted){ toast('This ticket can no longer be withdrawn','Data was already sent to another system.'); return }
  if(hasApproverDecision(d)){ toast('This ticket can no longer be withdrawn','An approver has already approved or rejected it.'); return }
  d.sp.forEach(function(s){ if(s.s==='cur'){ s.s='pend'; delete s.due } });
  d.sp.push({t:'Employee withdrew ticket',w:ME.name,at:nowStr(),s:'rej',note:'Withdrawn by the submitter'});
  d.st='thuhoi';
  toast('Withdrew ticket '+d.c,'The workflow instance on the engine has been cancelled');
  drwAfterChange();
}

/* ---- Workflow diagram of the ticket ---- */
var WF_ARR='<svg viewBox="0 0 24 14"><path d="M1 7h19M15 2l5 5-5 5"/></svg>';
function wfDiagram(d){
  var ticks={done:'<path d="M20 6L9 17l-5-5"/>',rej:'<path d="M18 6L6 18M6 6l12 12"/>',cur:'<circle cx="12" cy="12" r="4"/>'};
  var cols=d.sp.map(function(s,i){
    var cls=s.s==='done'?'done':s.s==='cur'?'cur':s.s==='rej'?'rej':'pend';
    var sys=/System|Accounting|Support/i.test(s.w)?' sys':'';
    var isApp=i>0&&/approv|confirm/i.test(s.t);
    var ic=ticks[s.s]?svg(ticks[s.s]):String(i+1);
    var meta=s.at?s.at:(s.s==='cur'?'In progress':'Waiting');
    return '<div class="wf-col"><div class="wf-node '+cls+sys+(s.cond?' cond':'')+'">'+
      '<div class="wn-i">'+ic+'</div><b>'+esc(s.t)+'</b><em>'+esc(s.w)+'</em>'+
      '<span class="wn-t">'+esc(meta)+'</span></div>'+
      '<div class="wf-rej'+(isApp?'':' off')+'">Reject → end</div></div>';
  });
  var endCls=d.st==='duyet'?'done':(d.st==='tuchoi'||d.st==='thuhoi')?'rej':'pend';
  var endTxt=d.st==='duyet'?'End — Approved':d.st==='tuchoi'?'End — Rejected':d.st==='thuhoi'?'End — Withdrawn':'End';
  cols.push('<div class="wf-col"><div class="wf-node '+endCls+'">'+
    '<div class="wn-i">'+svg(endCls==='rej'?ticks.rej:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>')+'</div>'+
    '<b>'+endTxt+'</b><em>Update result to HRM</em></div><div class="wf-rej off">.</div></div>');

  return '<div class="wf"><div class="wf-track">'+cols.join('<div class="wf-link">'+WF_ARR+'</div>')+'</div>'+
   '<div class="wf-legend">'+
   '<span><i style="background:var(--ok-soft);border-color:var(--ok-line)"></i>Done</span>'+
   '<span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>Current step</span>'+
   '<span><i style="background:#fff;border-color:var(--line);border-style:dashed"></i>Waiting</span>'+
   '<span><i style="background:var(--danger-soft);border-color:var(--danger-line)"></i>Rejected / ended early</span>'+
   '<span>Label <b style="color:var(--warn)">Condition</b>: the step only occurs when the configured condition is met</span>'+
   '</div></div>';
}

/* Read-only ticket content: same layout as the ticket submission screen (BR-BC-09) */

/* Ticket created by the ESS backend: one ticket = one View Profile block; change data shown read-only in a single table, with data before / after the change (MTK-BR-049) */
var WH_BLK={basicInformation:'Basic Information',nationalIdInformation:'National ID Information',bankDetails:'Bank Details',pitCodeInformation:'PIT Code Information',contactInformation:'Contact Information',addressInformation:'Address Information',familyDependentInformation:'Family / Dependent Information',emergencyContact:'Emergency Contact',otherSpecialInformation:'Other Special Information'};
function whLabel(k){
  k=String(k);
  if(/\s/.test(k)||/^[A-Z]/.test(k)) return k;
  var s=k.replace(/[_-]+/g,' ').replace(/([a-z0-9])([A-Z])/g,'$1 $2').toLowerCase();
  return s.charAt(0).toUpperCase()+s.slice(1);
}
function whIsObj(v){ return !!v&&typeof v==='object'&&!Array.isArray(v) }
function whVal(v){ return Array.isArray(v)?v.map(function(x){ return (x&&typeof x==='object')?JSON.stringify(x):x }).join(', '):v }
function whPair(v){ return (whIsObj(v)&&('after' in v))?{b:v.before,a:v.after,diff:true}:{a:whVal(v)} }
function whFlat(o,out,pre){
  Object.keys(o).forEach(function(k){
    var v=o[k], lb=(pre?pre+' – ':'')+whLabel(k);
    if(whIsObj(v)&&!('after' in v)) whFlat(v,out,lb); else out.push(Object.assign({l:lb},whPair(v)));
  });
  return out;
}
function whBlank(v){ return v===null||v===undefined||String(v)==='' }
function whChanged(r){ return !!r.diff&&String(whBlank(r.b)?'':r.b)!==String(whBlank(r.a)?'':r.a) }
function whParse(body){
  var p={block:null,op:null,meta:[],rows:[],groups:[],files:[]};
  Object.keys(body).forEach(function(k){
    var v=body[k];
    if(k==='block') p.block=WH_BLK[v]||String(v);
    else if(k==='operation') p.op=String(v);
    else if(k==='employeeId') p.meta.unshift(['Employee ID',v]);
    else if(k==='effectiveDate') p.rows.unshift(Object.assign({l:'Effective Date',diff:true},whPair(v)));
    else if(k==='fields'&&whIsObj(v)) p.rows=p.rows.concat(whFlat(v,[],''));
    else if(k==='attachments'&&Array.isArray(v)) p.files=v.map(String);
    else if(whIsObj(v)) p.groups.push({t:WH_BLK[k]||whLabel(k),rows:whFlat(v,[],'')});
    else p.meta.push([whLabel(k),whVal(v)]);
  });
  /* A profile-block ticket already shows the employee in the ticket header, so the table lists only the block data */
  if(p.block) p.meta=p.meta.filter(function(m){ return m[0]!=='Employee ID' });
  return p;
}
function whTable(body){
  var p=whParse(body), all=p.rows.slice();
  p.groups.forEach(function(g){ all=all.concat(g.rows) });
  var cmp=all.some(function(r){ return r.diff }), cols=cmp?3:2;
  /* One ticket = one block: only the fields that changed are shown; unchanged fields of the block are hidden */
  if(cmp){ var keep=function(r){ return !r.diff||whChanged(r) }; p.rows=p.rows.filter(keep); p.groups.forEach(function(g){ g.rows=g.rows.filter(keep) }) }
  var td=function(v,cls,span){
    var e=whBlank(v), c=[cls||'',e?'empty':''].join(' ').trim();
    return '<td'+(span?' colspan="'+span+'"':'')+(c?' class="'+c+'"':'')+'>'+(e?'—':esc(String(v)))+'</td>';
  };
  var grp=function(t,c){ return '<tr class="tkd-g"><th colspan="'+cols+'"><div class="tkd-gh"><span>'+esc(t)+'</span>'+(c?'<span class="tkd-chip">'+c+'</span>':'')+'</div></th></tr>' };
  var fld=function(r){
    if(!cmp) return '<tr><th scope="row">'+esc(r.l)+'</th>'+td(r.a)+'</tr>';
    var ch=whChanged(r);
    return '<tr'+(ch?' class="chg"':'')+'><th scope="row">'+esc(r.l)+'</th>'+td(r.b,ch?'old chg':'old')+td(r.a,ch?'new chg':'same')+'</tr>';
  };
  var chip=function(rows){ return rows.length+(rows.length>1?' fields':' field')+(cmp&&rows.some(function(r){ return r.diff })?' changed':'') };
  var FILE_SVG='<svg viewBox="0 0 24 24"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>';
  var h='<div class="tkd-wrap"><table class="tkd-tbl'+(cmp?' cmp':'')+'"><thead>'+
    '<tr class="tkd-t"><th colspan="'+cols+'"><div class="tkd-title"><b>'+esc(p.block||'Request details')+'</b>'+(p.op?'<span class="tkd-chip">'+esc(p.op)+'</span>':'')+'</div></th></tr>'+
    '<tr class="tkd-c"><th>Field</th>'+(cmp?'<th>Before change</th><th>After change</th>':'<th>Value</th>')+'</tr></thead><tbody>';
  p.meta.forEach(function(m){ h+='<tr><th scope="row">'+esc(m[0])+'</th>'+td(m[1],'',cols-1)+'</tr>' });
  p.rows.forEach(function(r){ h+=fld(r) });
  p.groups.forEach(function(g){ h+=grp(g.t,chip(g.rows)); g.rows.forEach(function(r){ h+=fld(r) }) });
  if(cmp&&!p.rows.length&&!p.groups.length) h+='<tr><td class="empty" colspan="'+cols+'">No changed fields</td></tr>';
  if(p.files.length){
    h+='<tr><th scope="row">Attachments</th><td class="tkd-files" colspan="'+(cols-1)+'"><div class="tkd-fl">'+
      p.files.map(function(f){
        var ext=f.indexOf('.')>0?f.split('.').pop().toUpperCase():'';
        return '<span role="button" tabindex="0" class="tkd-file" data-name="'+esc(f)+'" onclick="toast(\'Opening file\',this.dataset.name)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();toast(\'Opening file\',this.dataset.name)}">'+FILE_SVG+'<span>'+esc(f)+'</span>'+(ext?'<em>'+esc(ext)+'</em>':'')+'</span>';
      }).join('')+'</div></td></tr>';
  }
  h+='</tbody></table></div>';
  return h;
}
function tkVer(d){ return d.ver||'v1.0' }
var STEP_SRC={'Line manager approval':'Report to: Level 1 manager','Line manager confirmation':'Report to: Level 1 manager','HR Head approval':'User Group: HR Head',
  'Director approval':'User Group: Directors','Chief Accountant approval':'User Group: Chief Accountant','HR timesheet update':'User Group: HR C&B',
  'HR approves profile change':'User Group: HR','Swap partner confirmation':'Named approver','Related person confirmation':'Named approver','Related person confirms':'Named approver'};
/* Step not reached yet: approver source + expected approver (MTK-BR-005, MTK-BR-048) */
function fvPendTxt(s){
  var w=fvPlain(s.w), src=STEP_SRC[s.t];
  if(!src) return /^(HRM )?System$/i.test(w)?'Automatic — Not reached yet':esc(fvWho(s.w))+' — Not reached yet';
  if(src==='Named approver') return esc(src+' — '+fvWho(s.w))+' — Not reached yet';
  return esc(src)+' — Expected: '+esc(w)+(/^User Group/.test(src)?' +1':'')+' — Not reached yet';
}
function donRO(d){
  if(d.wh) return whTable(d.wh);
  var noDays=function(f){ return !(d.t==='nghi-phep'&&f.k==='so') };
  if(d.v&&TYPES[d.t]){
    return bcRender(TYPES[d.t].f.filter(noDays),{mode:'ro',val:function(f){return d.v[f.k]},
      files:function(){return d.at||[]},fileClick:function(x){return "toast('Opening file','"+esc(x.n)+"')"}});
  }
  var pr=bcPairs(d.fi.filter(function(x){ return !(d.t==='nghi-phep'&&x[0]==='Number of days') }));
  return bcRender(pr.form,{mode:'ro',val:function(f){return pr.val[f.k]}});
}
/* Content of block [C] for the open option */
function drwBody(d){
  var body='';
  if(dTab==='tt'){
    body='<div class="card" style="box-shadow:none"><div class="card-h"><h2>Ticket details</h2></div><div class="card-b">'+donRO(d)+'</div></div>'+
      (function(){ var ap=bcApprovals(d.sp); return ap?'<div class="card" style="box-shadow:none;margin-top:14px"><div class="card-h"><h2>Approval levels completed</h2></div><div class="card-b">'+ap+'</div></div>':'' })();
  }
  else if(dTab==='td'){
    body='<div class="cm-list">'+(d.cm.length?d.cm.map(function(c){
      return '<div class="cmt"><div class="av">'+initials(c.w)+'</div><div style="flex:1">'+
      '<b>'+c.w+'</b><time>'+c.r+' · '+c.at+'</time><p>'+esc(c.x)+'</p></div></div>';
    }).join(''):'<div class="empty">'+svg(I.doc)+'<b>No discussion yet</b><p>The approver and the submitter can discuss directly here.</p></div>')+'</div>'+
    '<div class="cm-new"><div class="field"><label>Send a message</label>'+
    '<textarea class="inp" placeholder="Enter your message to the approver…"></textarea></div>'+
    '<button class="btn pri" onclick="toast(\'Sent\',\'The approver will receive a notification\')">'+svg(I.send)+'Send</button></div>';
  }
  else if(dTab==='tl'){
    var canW=(d.st==='cho');
    body=(d.at.length?d.at.map(function(a){
      return '<div class="att">'+svg(I.file)+'<div style="flex:1">'+a.n+'</div><span>'+a.s+'</span>'+
      '<button class="link" onclick="toast(\'Downloading file\',\''+a.n+'\')">Download</button></div>';
    }).join(''):'<div class="empty">'+svg(I.file)+'<b>No attachments</b><p>This ticket has no attached files.</p></div>')+
    (canW?'<div class="upload" style="margin-top:14px">'+svg(I.up)+'Add documents to the ticket</div>':'');
  }
  return body;
}
function drwFoot(d){
  var canWithdraw=(d.st==='cho'&&!d.sysStarted&&!hasApproverDecision(d));
  return (canWithdraw?'<button class="btn dgr" onclick="withdrawDon()">'+svg(I.undo)+'Withdraw ticket</button>':'')+
   '<button class="btn" style="margin-left:auto" onclick="closeDrawer()">Close</button>';
}
function drawDrawer(){
  var d=dCur; if(!d) return;
  var isTk=d.t==='ticket-it';

  var h='<div class="drw-h"><div style="flex:1">'+
   '<h2>'+d.ti+'</h2><div class="meta">'+
   '<span class="mono" style="color:var(--brand-ink);font-weight:500">'+d.c+'</span>'+
   '<span>·</span><span>'+TYPES[d.t].n+(isTk&&d.nh?' · '+d.nh:'')+'</span>'+
   '<span>·</span><span>Submitted '+d.ct+'</span><span>·</span><span>'+esc(tkVer(d))+'</span></div></div>'+
   '<button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div>'+

   '<div class="drw-b one v2"><div class="drw-main">'+
   '<div class="dtA">'+fvCard(d,'Workflow of this ticket')+'</div>'+
   '<div class="tabs dtB" id="dtB" role="tablist" aria-label="Ticket details">'+
   [['tt','Ticket details'],['td','Discussion'+(d.cm.length?' ('+d.cm.length+')':'')]]
     .map(function(t){return '<button class="tab'+(dTab===t[0]?' on':'')+'" role="tab" data-t="'+t[0]+'" aria-selected="'+(dTab===t[0]?'true':'false')+'" onclick="setTab(\''+t[0]+'\')">'+t[1]+'</button>'}).join('')+
   '</div>'+
   '<div class="dtC'+(dTab==='td'?' cmx':'')+'" id="dtC"'+(dTab?'':' hidden')+'>'+(dTab?drwBody(d):'')+'</div>'+
   '</div></div>'+

   '<div class="drw-f" id="drwF">'+drwFoot(d)+'</div>';

  fvPlace();
  document.getElementById('drw').innerHTML=h;
  document.getElementById('drw').classList.add('on');
  document.getElementById('ovl').classList.add('on');
  fvMount();
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeDrawer() });
var _q=document.getElementById('q'); if(_q) _q.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&this.value.trim()){ toast('Search: "'+this.value+'"','Go to ticket list'); go('don-cua-toi'); this.value='' }
});


/* ---------- app shell: collapse / expand sidebar ---------- */
(function(){
  var b=document.getElementById('btn-mini'), s=document.getElementById('side');
  if(!b||!s) return;
  try{ if(localStorage.getItem('bpm-mini')==='1') s.classList.add('mini'); }catch(e){}
  b.onclick=function(){
    s.classList.toggle('mini');
    var on=s.classList.contains('mini');
    b.title=on?'Expand sidebar':'Collapse sidebar';
    b.setAttribute('aria-label',b.title);
    try{localStorage.setItem('bpm-mini',on?'1':'0')}catch(e){}
  };
})();

renderNav(); go('tong-quan');
