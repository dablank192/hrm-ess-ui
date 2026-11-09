
/* =====================================================================
   SAMPLE DATA
   ===================================================================== */
var ME={name:'Trần Văn Dũng',id:'dungvt4',title:'Head of Sales',dept:'Sales Department',donvi:'fsoft'};
/* CR-01 — unit (simulated HRM) */
var UNITS={fsoft:'Fsoft',fptis:'FPT IS'};
/* CR-04 — warning cards temporarily hidden in the detail panel: UI only, QUEUE[].w data kept so they can be re-enabled quickly */
var SHOW_CANH_BAO=false;

/* =====================================================================
   APPROVAL DELEGATION
   When a step is delegated: the primary approver AND the delegate
   can both see the ticket and approve/reject it. Whoever clicks first is
   recorded in the log for that step.
   ===================================================================== */
function dgDay(off){ var d=new Date(); d.setDate(d.getDate()+off); var p=function(x){return (x<10?'0':'')+x}; return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear() }
var DELEG=[
 {of:'Trần Văn Dũng', ofr:'Head of Sales', ofa:'dungvt4',
  to:'Phạm Thu Hà',   tor:'HR Head',  toa:'haptt', tid:'NV-00301',
  from:dgDay(-3),  until:dgDay(10), scope:'All ticket types', st:'active',
  ly:'Business trip'},
 {of:'Phạm Thu Hà',  ofr:'HR Head', ofa:'haptt',
  to:'Vũ Quốc Hưng', tor:'Director', toa:'hungvq', tid:'NV-00105',
  from:dgDay(5), until:dgDay(8), scope:'Selected ticket types: Leave', st:'soon',
  ly:'Annual leave'},
 {of:'Vũ Quốc Hưng', ofr:'Director', ofa:'hungvq',
  to:'Phạm Thu Hà', tor:'HR Head', toa:'haptt', tid:'NV-00301',
  from:dgDay(-30), until:dgDay(-20), scope:'All ticket types', st:'expired',
  ly:'Overseas business trip'}
];
/* dd/mm/yyyy <-> yyyy-mm-dd */
function dmy2iso(v){var p=String(v).split('/');return p[2]+'-'+p[1]+'-'+p[0]}
function iso2dmy(v){var p=String(v).split('-');return p[2]+'/'+p[1]+'/'+p[0]}
/* Delegation status is computed by date (Vietnam time): Upcoming / Active / Expired; Cancelled is kept (MTK-BR-025) */
function delegRecalc(){
  var t=new Date(), iso=t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2);
  DELEG.forEach(function(g){ if(g.st==='cancelled') return; var f=dmy2iso(g.from), u=dmy2iso(g.until); g.st=iso<f?'soon':iso>u?'expired':'active' });
}
delegRecalc();
var DG_TYPES=['Leave','Overtime request','Business trip','Salary increase proposal','Advance / payment','Shift change','Timesheet confirmation','Resignation'];
function dgTypesPicker(){ return '<div id="dgTypes" class="dg-types" hidden role="group" aria-label="Selected ticket types">'+
  '<button id="dgTypesTrigger" type="button" class="inp dg-types-trigger" aria-label="Select ticket types" aria-expanded="false" aria-controls="dgTypesPanel" onclick="dgTypesOpen(document.getElementById(\'dgTypesPanel\').hidden)"><span id="dgTypesSummary" class="dg-types-placeholder">Select ticket types</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>'+
  '<div id="dgTypesPanel" class="dg-types-panel" hidden role="group" aria-label="Ticket type options">'+
  '<div class="dg-types-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input id="dgTypesSearch" type="search" class="inp" aria-label="Search ticket types" placeholder="Search values…" oninput="dgTypesFilter(this.value)"></div>'+
  '<div class="dg-types-meta"><span id="dgTypesCount" role="status">0 items selected</span><button id="dgTypesClear" type="button" disabled onclick="dgTypesAll(false);document.getElementById(\'dgTypesSearch\').focus()">Clear</button></div>'+
  '<label class="dg-types-all"><input id="dgTypesAll" type="checkbox" onchange="dgTypesAll(this.checked)"><span>ALL</span></label>'+
  '<div class="dg-types-list">'+DG_TYPES.map(function(t){ return '<label class="dg-type-option" data-label="'+esc(t)+'"><input type="checkbox" data-t="'+esc(t)+'" onchange="dgTypeToggle()"><span>'+esc(t)+'</span></label>' }).join('')+
  '<p id="dgTypesEmpty" class="dg-types-empty" hidden>No ticket types found.</p></div></div></div>' }
function dgTypesOpen(open,restore){
  var panel=document.getElementById('dgTypesPanel'),trigger=document.getElementById('dgTypesTrigger'); if(!panel||!trigger) return;
  open=!!open&&!document.getElementById('dgTypes').hidden; panel.hidden=!open; trigger.setAttribute('aria-expanded',String(open));
  if(open){ document.getElementById('dgTypesSearch').value=''; dgTypesFilter(''); panel.scrollIntoView({block:'nearest'}); document.getElementById('dgTypesSearch').focus({preventScroll:true}) }
  else if(restore) trigger.focus();
}
function dgTypesFilter(value){
  var query=value.trim().toLowerCase(),visible=0;
  document.querySelectorAll('#dgTypes .dg-type-option').forEach(function(row){ row.hidden=!row.getAttribute('data-label').toLowerCase().includes(query); if(!row.hidden) visible++ });
  document.getElementById('dgTypesEmpty').hidden=visible>0;
}
function dgTypeToggle(){
  var choices=[].slice.call(document.querySelectorAll('#dgTypes input[data-t]')),selected=choices.filter(function(c){ return c.checked }),labels=selected.map(function(c){ return c.getAttribute('data-t') }),all=document.getElementById('dgTypesAll'),summary=document.getElementById('dgTypesSummary');
  all.checked=selected.length===choices.length; all.indeterminate=selected.length>0&&selected.length<choices.length;
  document.getElementById('dgTypesCount').textContent=selected.length+(selected.length===1?' item selected':' items selected');
  document.getElementById('dgTypesClear').disabled=!selected.length;
  summary.textContent=labels.length?labels.join(', '):'Select ticket types'; summary.classList.toggle('dg-types-placeholder',!labels.length); summary.title=labels.join(', ');
  if(typeof mergeDelegOverview==='function') mergeDelegOverview();
}
function dgTypesAll(on){ document.querySelectorAll('#dgTypes input[data-t]').forEach(function(c){ c.checked=on }); dgTypeToggle() }
function dgScopeChange(v){ var w=document.getElementById('dgTypes'); if(w){ w.hidden=v!=='Selected ticket types'; dgTypesOpen(false) } }
function dgScopeText(){ var s=document.getElementById('dgNewScope'), v=s?s.value:'All ticket types'; if(v!=='Selected ticket types') return v;
  var sel=[].slice.call(document.querySelectorAll('#dgTypes input[data-t]')).filter(function(c){ return c.checked }).map(function(c){ return c.getAttribute('data-t') });
  return sel.length?v+': '+sel.join(', '):v }
document.addEventListener('click',function(event){ var picker=document.getElementById('dgTypes'); if(picker&&!picker.contains(event.target)) dgTypesOpen(false) });
var DELEG_EDIT=-1;
function delegEdit(i){
  var g=DELEG[i]; DELEG_EDIT=i;
  var m=document.getElementById('mdl');
  m.innerHTML='<div class="mdl" role="dialog" aria-label="Edit delegation">'+
    '<div class="mdl-h">Edit delegation</div><div class="mdl-b">'+
    '<div style="font-size:13.5px;margin-bottom:14px"><b>'+esc(g.of)+' - '+esc(g.ofa)+'</b> → <b>'+esc(g.to)+' - '+esc(g.toa)+'</b></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+
    '<div class="field"><label>From date</label><input class="inp" type="date" id="dgFrom" value="'+dmy2iso(g.from)+'" disabled></div>'+
    '<div class="field"><label>To date</label><input class="inp" type="date" id="dgUntil" value="'+dmy2iso(g.until)+'" min="'+dmy2iso(g.from)+'"></div></div>'+
    '<div class="err" id="dgErr"></div></div>'+
    '<div class="mdl-f"><button class="btn" onclick="delegEditClose()">Close</button>'+
    '<button class="btn pri" onclick="delegEditSave()">Save</button></div></div>';
  m.classList.add('on');
}
function delegEditClose(){ document.getElementById('mdl').classList.remove('on'); DELEG_EDIT=-1 }
function delegEditSave(){
  var g=DELEG[DELEG_EDIT]; if(!g) return;
  var v=document.getElementById('dgUntil').value, e=document.getElementById('dgErr');
  if(!v){ e.textContent='Please select the new To date.'; return }
  if(v<dmy2iso(g.from)){ e.textContent='To date must not be earlier than From date ('+g.from+').'; return }
  var old=g.until; g.until=iso2dmy(v);
  delegEditClose(); hvRefresh();
  toast('Delegation updated','To date '+g.until);
}
/* Strip the "(you)" suffix to match person names */
function baseName(w){ return String(w||'').replace(/\s*\(you\)\s*$/,'').trim() }
/* Return the delegation record that applies to a person, if any */
function delegFor(w){
  var n=baseName(w);
  for(var i=0;i<DELEG.length;i++) if(DELEG[i].of===n) return DELEG[i];
  return null;
}
/* Actor working on the ticket: 'chinh' or 'uq' — for the "who clicks first" demo */
var ACTOR='chinh';
function setActor(v){ ACTOR=v; drawDrawer() }
/* Actual approval log — records who clicked at which step */
var APPLOG=[];


var I={
 home:'<path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
 inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
 done:'<path d="M9 11l2.5 2.5L16 8"/><circle cx="12" cy="12" r="9"/>',
 team:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/><path d="M17 4.5a3.5 3.5 0 0 1 0 7M22 20v-1a5 5 0 0 0-3.5-4.8"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 ticket:'<path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z"/><path d="M13 5v14"/>',
 dele:'<path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M10 6H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
 warn:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 ask:'<path d="M9.1 9a3 3 0 1 1 4 2.8c-.8.3-1.1 1-1.1 1.7v.5"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/>',
 file:'<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>',
 doc:'<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 arrow:'<path d="M9 6l6 6-6 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 down:'<path d="M12 5v13M6 12l6 6 6-6"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>'
};
function svg(p,c){return '<svg viewBox="0 0 24 24" class="'+(c||'')+'">'+p+'</svg>'}

var ST={'cho':{l:'Pending approval',c:'c-wait'},
 'duyet':{l:'Approved',c:'c-done'},'tuchoi':{l:'Rejected',c:'c-rej'}};

/* Items awaiting manager approval — with business warnings computed by BPM */
/* =====================================================================
   FORM LAYOUT — 12-column grid, shared by the 3 portals (FR-BC-01/02/08, FR-BC-34)
   Field: w (3/4/6/8/9/12) · nl (start new row) · bl (left divider) · rows (3/5/8)
   Presentation elements: section (section title) · note (note) · divider (horizontal rule)
   ===================================================================== */
var BC_STEPS=[3,4,6,8,9,12];
function bcType(t){ return ({textarea:'area',readonly:'ro'})[t]||t }
function bcIsData(f){ var t=bcType(f.t); return t!=='section'&&t!=='note'&&t!=='divider' }
/* Only section titles and dividers always span the full row; every other field can span 2–12 columns */
function bcFull(f){ var t=bcType(f.t); return t==='section'||t==='divider' }
function bcDefW(f){ var t=bcType(f.t); return (bcFull(f)||t==='area'||t==='file'||t==='table'||t==='radio'||t==='check'||t==='note')?12:6 }
function bcW(f){ if(bcFull(f)) return 12; var w=Math.round(+f.w); return (w>=2&&w<=12)?w:bcDefW(f) }
/* Derive rows: max 4 fields, total width at most 12; section titles / dividers stand alone */
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
/* Values in read-only mode (FR-BC-34) */
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
/* o.mode: 'edit' | 'ro' ; o.input(f) returns input cell HTML (edit) ; o.val(f), o.files(f) (ro) */
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
/* Legacy tickets only have label–value pairs: build them into fields to render in the same read-only style */
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

/* ---- Layouts designed in the Admin portal (frozen by workflow version at ticket submission) ---- */
var LAYOUT={
 /* node n1 — Employee submits ticket (Leave approval workflow) */
 'Leave':[{k:'secTT',t:'section',l:'Leave details'},
   {k:'loaiNghi',l:'Leave type',t:'select'},{k:'tuNgay',l:'From date',t:'date',w:3},{k:'denNgay',l:'To date',t:'date',w:3},
   {k:'buoi',l:'Session',t:'select'},{k:'soNgay',l:'Number of days',t:'ro',bl:1},
   {k:'hrBG',t:'divider'},
   {k:'banGiao',l:'Handover person',t:'user'},{k:'lyDo',l:'Reason',t:'area'},{k:'tepDinhKem',l:'Attachments',t:'file'}]
};
/* node n2 — Line manager approval: approver section (the decision is chosen with the buttons at the bottom of the panel) */
var LAYOUT_ME={
 'Leave':[{k:'yKien',l:'Approver comments',t:'area',h:'Optional, up to 1,000 characters. Saved to the ticket log and visible to the employee. Enter the rejection reason in the Reject confirmation box.'}]
};
var LAYOUT_ME_DEF=[{k:'yKien',l:'Your comments',t:'area',h:'Comments are saved to the ticket log and visible to the employee.'}];
/* A. Employee ticket — read-only, same layout as the Submit ticket node */
function blockA(d){
  var body;
  if(d.wh) body=whTable(d.wh);
  else if(d.v&&LAYOUT[d.lo]) body=bcRender(LAYOUT[d.lo],{mode:'ro',val:function(f){return d.v[f.k]},
      files:function(){return d.at||[]},fileClick:function(x){return "toast('Downloading file','"+esc(x.n)+"')"}});
  else { var pr=bcPairs(d.fi); body=bcRender(pr.form,{mode:'ro',val:function(f){return pr.val[f.k]}}) }
  return '<div class="card" style="box-shadow:none"><div class="card-h"><h2>Employee ticket</h2>'+
    '</div><div class="card-b">'+body+'</div></div>';
}
/* B. Approved levels — compact, auto-hidden at the first approval step */
function blockB(d){
  var ap=bcApprovals(d.sp);
  return ap?'<div class="card" style="box-shadow:none;margin-top:14px"><div class="card-h"><h2>B. Approved levels</h2>'+
    '<span class="blk-sub">compact · read-only</span></div><div class="card-b">'+ap+'</div></div>':'';
}
/* C. Your section — layout of the current approval node, editable */
function blockC(d){
  var form=LAYOUT_ME[d.lo]||LAYOUT_ME_DEF;
  var input=function(f){
    var inp;
    if(f.k==='yKien') inp='<textarea class="inp" id="ykien" placeholder="Optional comment (up to 1,000 characters)…" maxlength="1000"></textarea>';
    else if(f.t==='user') inp='<select class="inp"><option value="">— Select a team member —</option>'+TEAM.filter(function(m){return m.n!==d.nv}).map(function(m){
      return '<option>'+esc(m.n)+' ('+m.m+')</option>'}).join('')+'</select>';
    else if(f.t==='ro') inp='<input class="inp" readonly value="'+esc((d.me&&d.me[f.k])||'—')+'" style="background:var(--surface-alt);color:var(--ink-2)">';
    else inp='<input class="inp">';
    return '<div class="field"><label'+(f.k==='yKien'?' for="ykien"':'')+'>'+esc(f.l)+'</label>'+inp+(f.h?'<span class="hint">'+esc(f.h)+'</span>':'')+'</div>';
  };
  return '<div class="card blk-c" style="box-shadow:none;margin-top:18px"><div class="card-h"><h2>Your section</h2>'+
    '</div><div class="card-b">'+
    bcRender(form,{mode:'edit',input:input})+'</div></div>';
}

var QUEUE=[
 {c:'TK-2026-013',lo:'Leave',ti:'Leave — Nguyễn Văn An',
  nv:'Nguyễn Văn An',ma:'NV-00412',cd:'Sales Specialist',ct:'08/09/2026 09:12',
  st:'cho',dueH:4,inst:'8f21c3a7d90b4e15',uu:'',
  fi:[['Leave type','Annual leave'],['Time','14/09/2026 → 16/09/2026'],['Number of days','3 days'],
      ['Handover person','Lê Thị Mai (NV-00398)'],['Reason','Going back to my hometown for family matters, as arranged in advance.']],
  v:{loaiNghi:'Annual leave',tuNgay:'14/09/2026',denNgay:'16/09/2026',buoi:'Full day',soNgay:'3 days',
     banGiao:'Lê Thị Mai (NV-00398)',lyDo:'Going back to my hometown for family matters, as arranged in advance.'},
  w:[{t:'warn',b:'Leave overlap within the team',x:'Lê Thị Mai already has approved leave on 15/09 – 16/09. If you approve this ticket, only 3/5 team members will be on duty on 15–16/09.'},
     {t:'info',b:'Sufficient leave balance',x:'Nguyễn Văn An has 8.5 days of annual leave left. After this ticket, 5.5 days will remain.'},
     {t:'info',b:'An additional approval level will be added',x:'Leave tickets over 2 days are forwarded to the HR Head after you approve.'}],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'08/09/2026 09:12',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'09/09/2026 09:12'},
      {t:'HR Head approval',w:'Phạm Thu Hà',s:'pend'},
      {t:'Update timesheet',w:'HRM System',s:'pend'}],
  cm:[{w:'Trần Văn Dũng',r:'Line manager',at:'08/09/2026 10:05',x:'Please confirm that Mai has agreed to cover your work on 15–16/09.'},
      {w:'Nguyễn Văn An',r:'Submitter',at:'08/09/2026 10:20',x:'Yes, Mai agreed and I have already handed over my open deals to her.'}],
  at:[{n:'don-nghi-phep-ky.pdf',s:'248 KB'}]},

 {c:'TK-2026-015',lo:'Overtime request',ti:'Overtime request — Hoàng Minh Tuấn',
  nv:'Hoàng Minh Tuấn',ma:'NV-00421',cd:'Sales Specialist',ct:'09/09/2026 07:55',
  st:'cho',dueH:19,inst:'b4e0129a7fd3c556',uu:'',
  fi:[['Overtime date','12/09/2026'],['Day type','Weekday (150%)'],['Time','18:00 → 22:00'],
      ['Hours','4 hours'],['Project','ERP project phase 2'],['Details','Run integration testing before the acceptance session on 13/09.']],
  w:[{t:'dgr',b:'Monthly overtime cap exceeded',x:'Total OT for this employee in September will be 42 hours, exceeding the cap of 40 hours/month. Additional approval from the HR Head and a written overtime agreement are required.'},
     {t:'info',b:'Estimated cost',x:'4 hours × 150% ≈ 620,000 VND, charged to the 09/2026 payroll period.'}],
  sp:[{t:'Submit ticket',w:'Hoàng Minh Tuấn',at:'09/09/2026 07:55',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'10/09/2026 07:55'},
      {t:'HR Head approval',w:'Phạm Thu Hà',s:'pend',note:'Added because the 40 OT hours/month cap is exceeded'},
      {t:'Record timesheet',w:'HRM System',s:'pend'}],
  cm:[],at:[]},

 {c:'TK-2026-014',lo:'Advance / payment',ti:'Advance / payment — Lê Thị Mai',
  nv:'Lê Thị Mai',ma:'NV-00398',cd:'Sales Specialist',ct:'08/09/2026 15:30',
  st:'cho',dueH:-3,inst:'6d71b8c04ae29f13',uu:'',
  fi:[['Request type','Advance'],['Amount','6,500,000 VND'],['Method','Bank transfer'],
      ['Date needed','15/09/2026'],['Details','Advance for Cần Thơ business trip expenses 16–18/09: flights, hotel, transport.']],
  w:[{t:'warn',b:'Outstanding advance',x:'The employee has 1 advance of 3,200,000 VND from 12/08 with supporting documents not yet submitted.'},
     {t:'info',b:'No matching business trip ticket',x:'No approved business trip ticket found for 16–18/09. Consider checking before approving the payment.'}],
  sp:[{t:'Submit ticket',w:'Lê Thị Mai',at:'08/09/2026 15:30',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'09/09/2026 15:30'},
      {t:'Chief Accountant approval',w:'Đỗ Thanh Bình',s:'pend'},
      {t:'Disburse payment',w:'Accounting Department',s:'pend'}],
  cm:[],at:[]},

 {c:'TK-2026-016',lo:'Timesheet confirmation',ti:'Timesheet confirmation — Phan Thanh Sơn',
  nv:'Phan Thanh Sơn',ma:'NV-00455',cd:'Sales Staff (probation)',ct:'09/09/2026 08:20',
  st:'cho',dueH:20,inst:'0ac4f9126be5d7a8',uu:'',
  fi:[['Date','08/09/2026'],['Case','Forgot check-in'],['Actual check-in time','08:10'],['Actual check-out time','17:30'],
      ['Explanation','Met a customer in the morning before arriving at the office, so did not swipe the card at start of day.']],
  w:[{t:'warn',b:'Employee on probation',x:'Phan Thanh Sơn is on probation from 01/09/2026 to 30/11/2026. Missed check-ins count toward the probation review.'},
     {t:'warn',b:'3rd time this month',x:'This is the 3rd timesheet confirmation for this employee in September.'},
     {t:'info',b:'Timesheet period not locked',x:'The September timesheet period locks on 03/10/2026; there is still time to adjust.'}],
  sp:[{t:'Submit ticket',w:'Phan Thanh Sơn',at:'09/09/2026 08:20',s:'done'},
      {t:'Line manager confirmation',w:'Trần Văn Dũng (you)',s:'cur',due:'10/09/2026 08:20'},
      {t:'HR timesheet update',w:'Phạm Thu Hà',s:'pend'}],
  cm:[],at:[]},

 {c:'TK-2026-012',lo:'Salary increase proposal',ti:'Salary increase proposal — Lê Thị Mai',
  nv:'Lê Thị Mai',ma:'NV-00398',cd:'Sales Specialist',ct:'07/09/2026 11:00',
  st:'cho',dueH:31,inst:'c3ff5a2189b04e7d',uu:'nhaycam',
  fi:[['Employee','Lê Thị Mai (NV-00398)'],['Current salary','16,000,000 VND'],['Proposed salary','17,500,000 VND'],
      ['Increase','9.4%'],['Effective from','October 2026 payroll period'],
      ['Justification','Achieved 112% of target and took on an additional group of mid-sized enterprise customers.']],
  w:[{t:'ok',b:'No additional approval level needed',x:'The increase of 9.4% is below the 10% threshold; after you approve, the ticket goes directly to HR to update payroll.'},
     {t:'dgr',b:'Salary data — access is logged',x:'Every time this ticket is opened is recorded in the access log with the time and account.'}],
  sp:[{t:'Submit ticket',w:'Trần Văn Dũng',at:'07/09/2026 11:00',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'08/09/2026 11:00'},
      {t:'Payroll update',w:'HR Department',s:'pend'}],
  cm:[],at:[{n:'ket-qua-kinh-doanh-mai.xlsx',s:'72 KB'}]},

 {c:'TK-2026-018',lo:'Shift change',ti:'Shift change — Phan Thanh Sơn',
  nv:'Phan Thanh Sơn',ma:'NV-00455',cd:'Sales Executive (probation)',ct:'09/09/2026 10:05',
  st:'cho',dueH:34,inst:'e8b27d4f0c19a365',uu:'',
  fi:[['Date to change','15/09/2026'],['Current shift','Office-hours shift (08:00–17:00)'],['Requested shift','Afternoon shift (14:00–22:00)'],
      ['Swap with','No swap, shift change only'],['Reason','Periodic health check-up scheduled in the morning under the company program.']],
  w:[{t:'ok',b:'Colleague has confirmed',x:'The related person completed the confirmation step at 09/09 10:40.'},
     {t:'info',b:'No impact on shift quota',x:'On 15/09 the afternoon shift has 2 open slots.'}],
  sp:[{t:'Submit ticket',w:'Phan Thanh Sơn',at:'09/09/2026 10:05',s:'done'},
      {t:'Related person confirmation',w:'Afternoon shift leader',at:'09/09/2026 10:40',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'10/09/2026 22:05'},
      {t:'Schedule update',w:'HRM System',s:'pend'}],
  cm:[],at:[]}
];

/* CR-01, CR-06 — ticket of an employee from another unit; the submitter chooses the approver */
QUEUE.unshift({c:'TK-2026-019',lo:'Leave',ti:'Leave — Phạm Minh Đức',
  nv:'Phạm Minh Đức',ma:'NV-20117',cd:'Solutions Specialist',pb:'Solutions Department',donvi:'fptis',ct:'01/10/2026 08:40',
  st:'cho',dueH:20,inst:'f0d93a6c2b7e4158',uu:'',
  fi:[['Leave type','Annual leave'],['Period','06/10/2026 → 08/10/2026'],['Number of days','3 days'],['Reason','Family matters, notified to the project team in advance.']],
  v:{loaiNghi:'Annual leave',tuNgay:'06/10/2026',denNgay:'08/10/2026',buoi:'Full day',soNgay:'3 days',lyDo:'Family matters, notified to the project team in advance.'},
  w:[{t:'info',b:'Employee from another unit',x:'Phạm Minh Đức belongs to FPT IS and is working on a project for the Sales Department.'}],
  sp:[{t:'Submit ticket',w:'Phạm Minh Đức',at:'01/10/2026 08:40',s:'done'},
      {t:'Line manager approval',w:'Trần Văn Dũng (you)',s:'cur',due:'02/10/2026 08:40'},
      {t:'HR Head approval',w:'Nguyễn Văn Nam',s:'pend',note:'Required because the leave is longer than 2 days'},
      {t:'Timesheet update',w:'HRM System',s:'pend'}],
  cm:[],at:[]});
/* Ticket created by the ESS backend (request sent by ESS Profile): no form, data shown as Field – Before change – After change */
QUEUE.push({c:'TK-2026-023',lo:'Employee Profile Update',ti:'Employee Profile Update — Nguyễn Văn An',
  nv:'Nguyễn Văn An',ma:'NV-00412',cd:'Sales Specialist',ct:'03/11/2026 09:00',
  st:'cho',inst:'b7c1e9d2a4f03856',uu:'',ver:'v1.1',
  wh:{employeeId:'NV-00412',block:'Address Information',operation:'Update',effectiveDate:{before:'01/11/2026',after:'03/11/2026'},fields:{'Ward':{before:'Phường Thảo Điền',after:'Phường An Phú'},'Address':{before:'123 Đường số 1, Thảo Điền',after:'45 Đường số 10, An Phú'}}},fi:[],w:[],
  sp:[{t:'Submit ticket',w:'Nguyễn Văn An',at:'03/11/2026 09:00',s:'done'},
      {t:'HR approves profile change',w:'Trần Văn Dũng (you)',s:'cur'}],
  cm:[],at:[]});
/* Phase 1: no SLA (no due date), the submitter does not choose approvers, versions are shown on the ticket */
QUEUE.forEach(function(q){ q.donvi=q.donvi||'fsoft'; q.pb=q.pb||'Sales Department'; q.cach='UserGroup'; delete q.dueH; q.sp.forEach(function(s){ delete s.due });
  if(q.c==='TK-2026-013') q.ver='v1.2';
  /* demo data for the bulk-result groups (MTK-BR-023): required field on the approval form / one technical error on the first attempt */
  if(q.c==='TK-2026-016') q.reqField=1;
  if(q.c==='TK-2026-018') q.techErr=1 });
var HV_SRC='';

var LICHSU=[
 {c:'TK-2026-008',lo:'Leave',ti:'Leave — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'02/09/2026 09:00',xl:'02/09/2026 09:40',st:'duyet',kq:'Approved',tg:'40 min',
  v:{loaiNghi:'Annual leave',tuNgay:'03/09/2026',denNgay:'03/09/2026',soNgay:'0.5 days'}},
 {c:'TK-2026-007',lo:'Salary increase proposal',ti:'Salary increase proposal — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'01/09/2026 10:20',xl:'02/09/2026 14:30',st:'duyet',kq:'Approved, forwarded to Director',tg:'28 hours'},
 {c:'TK-2026-010',lo:'Overtime request',ti:'Overtime request — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'04/09/2026 16:40',xl:'05/09/2026 08:05',st:'tuchoi',kq:'Rejected — work content not specified',tg:'15 hours'},
 {c:'TK-2026-006',lo:'Advance / payment',ti:'Advance / payment — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'30/08/2026 17:05',xl:'31/08/2026 08:30',st:'duyet',kq:'Approved, forwarded to Chief Accountant',tg:'15 hours'},
 {c:'TK-2026-002',lo:'Leave',ti:'Leave — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'11/08/2026 14:22',xl:'12/08/2026 09:10',st:'tuchoi',kq:'Rejected — clashes with customer acceptance schedule',tg:'19 hours'},
 {c:'TK-2026-005',lo:'Leave',ti:'Leave — Lê Thị Mai',nv:'Lê Thị Mai',ma:'NV-00398',
  ct:'28/08/2026 10:15',xl:'28/08/2026 11:00',st:'duyet',kq:'Approved',tg:'45 min'},
 {c:'TK-2026-004',lo:'Business trip',ti:'Business trip — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'22/08/2026 08:15',xl:'22/08/2026 11:02',st:'duyet',kq:'Approved',tg:'2.8 hours'},
 {c:'TK-2026-003',lo:'Timesheet confirmation',ti:'Timesheet confirmation — Nguyễn Văn An',nv:'Nguyễn Văn An',ma:'NV-00412',
  ct:'20/08/2026 09:00',xl:'20/08/2026 10:12',st:'duyet',kq:'Confirmed',tg:'1.2 hours'}
];

var TEAM=[
 {n:'Nguyễn Văn An',m:'NV-00412',cd:'Sales Specialist',vao:'02/03/2022',phep:8.5,tong:12,ot:3,mo:2,tt:'Active'},
 {n:'Lê Thị Mai',m:'NV-00398',cd:'Sales Specialist',vao:'15/07/2021',phep:4,tong:12,ot:0,mo:1,tt:'Active'},
 {n:'Hoàng Minh Tuấn',m:'NV-00421',cd:'Sales Specialist',vao:'01/09/2022',phep:11,tong:12,ot:38,mo:1,tt:'Active'},
 {n:'Phan Thanh Sơn',m:'NV-00455',cd:'Sales Executive',vao:'01/09/2026',phep:0,tong:0,ot:0,mo:2,tt:'Probation'},
 {n:'Vũ Thị Hằng',m:'NV-00402',cd:'Sales Specialist',vao:'20/04/2022',phep:6,tong:12,ot:6,mo:0,tt:'Active'}
];

/* =====================================================================
   UTILITIES
   ===================================================================== */
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
function chip(st){var s=ST[st]||{l:st,c:'c-draft'};return '<span class="chip '+s.c+'">'+s.l+'</span>'}
function slaPill(){ return '' } /* Phase 1 has no SLA */
function initials(n){var p=n.trim().split(' ');return (p[0][0]+p[p.length-1][0]).toUpperCase()}
function toast(t,s){
  var e=document.getElementById('toast');
  e.innerHTML=svg('<path d="M20 6L9 17l-5-5"/>')+'<div><b>'+t+'</b>'+(s?' <span>'+s+'</span>':'')+'</div>';
  e.classList.add('on'); clearTimeout(window._tt); window._tt=setTimeout(function(){e.classList.remove('on')},3200);
}
var NAV=[
 {s:'Approvals'},
 {k:'tong-quan',l:'Dashboard',i:I.home},
 {k:'hop-viec',l:'Inbox',i:I.inbox,c:function(){return QUEUE.length},hot:1,hide:1},
 {s:'Other'},
 {k:'uy-quyen',l:'Approval delegation',i:I.dele}
];
var page='tong-quan';
function navPipCount(){ return QUEUE.length }
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
function go(k){
  page=k; renderNav();
  var t=(NAV.filter(function(n){return n.k===k})[0]||{}).l||'';
  document.getElementById('crumb').textContent=t;
  window.scrollTo(0,0);
  PAGES[k]();
}

/* =====================================================================
   SCREENS
   ===================================================================== */
var V=function(h){document.getElementById('view').innerHTML=h};
var PAGES={};
var sel={};

/* ---------- 1. DASHBOARD (with Inbox right on the main screen) ---------- */
PAGES['tong-quan']=function(){
  var canhBao=QUEUE.filter(function(q){return q.w.some(function(w){return w.t==='dgr'||w.t==='warn'})});

  V('<div class="page-head"><div><h1>Dashboard</h1></div>'+
    '</div>'+

    '<div class="stats">'+
    '<div class="stat cl" onclick="setHv(\'cho\')"><div class="lbl">'+svg(I.inbox)+'Pending approval</div><div class="val">'+QUEUE.length+'</div></div>'+
    '<div class="stat cl'+(canhBao.length?' stat-alert':'')+'" onclick="setHv(\'cho\')"><div class="lbl">'+svg(I.warn)+'Alerts to review</div><div class="val">'+canhBao.length+'</div></div>'+
    '</div>'+

    hvBody());
};

/* ---------- 2. INBOX (Pending approval + Processed combined) ---------- */
var hvTab='cho';
/* The Inbox is rendered within the currently open page (Dashboard or Inbox page) */
function hvRefresh(){ if(PAGES[page]) PAGES[page]() }
function setHv(t){ hvTab=t; hvRefresh() }
/* Ticket code TK-<year>-<sequence>: sorted by sequence descending, newest ticket first */
function tkSeq(c){ var m=String(c).match(/(\d+)$/); return m?+m[1]:0 }
function tkSort(){
  QUEUE.sort(function(a,b){return tkSeq(b.c)-tkSeq(a.c)});
  LICHSU.sort(function(a,b){return tkSeq(b.c)-tkSeq(a.c)});
}

PAGES['hop-viec']=function(){
  V('<div class="page-head"><div><h1>Inbox</h1></div>'+
    '</div>'+
    hvBody());
};

/* Pagination of the Pending approval / Processed tables — same control as "My tickets" in the Employee portal */
var HPG={cho:{size:10,page:1},xong:{size:10,page:1}};
function hpGo(k,n){ HPG[k].page=n; hvRefresh() }
function hpSize(k,v){ HPG[k].size=+v; HPG[k].page=1; hvRefresh() }
function hpJump(k,v){ var n=parseInt(v,10); if(isNaN(n)) return; HPG[k].page=n; hvRefresh() }
function hpSlice(k,rows){ var P=HPG[k], pages=Math.max(1,Math.ceil(rows.length/P.size)); P.page=Math.min(Math.max(1,P.page),pages); return rows.slice((P.page-1)*P.size,P.page*P.size) }
function hpBar(k,total){
  var P=HPG[k], pages=Math.max(1,Math.ceil(total/P.size)), p=Math.min(Math.max(1,P.page),pages); P.page=p;
  var from=total?(p-1)*P.size+1:0, to=Math.min(total,p*P.size);
  var nums=[], lo=Math.max(1,p-3), hi=Math.min(pages,lo+6); lo=Math.max(1,hi-6);
  for(var i=lo;i<=hi;i++) nums.push(i);
  var g=function(n){ return 'hpGo(\''+k+'\','+n+')' };
  return '<div class="pgn" role="navigation" aria-label="Pagination">'+
    '<div class="l"><span>Rows / page</span><select aria-label="Rows per page" onchange="hpSize(\''+k+'\',this.value)">'+
    [10,25,50,100].map(function(n){ return '<option value="'+n+'"'+(P.size===n?' selected':'')+'>'+n+'</option>' }).join('')+'</select>'+
    '<span class="rng">'+from+' - '+to+' / '+total+'</span></div>'+
    '<div class="r">'+
    '<button onclick="'+g(1)+'"'+(p<=1?' disabled':'')+'>First</button>'+
    '<button onclick="'+g(p-1)+'" aria-label="Previous page"'+(p<=1?' disabled':'')+'>‹</button>'+
    (lo>1?'<span class="gap">…</span>':'')+
    nums.map(function(n){ return '<button class="'+(n===p?'on':'')+'" onclick="'+g(n)+'"'+(n===p?' aria-current="page"':'')+'>'+n+'</button>' }).join('')+
    (hi<pages?'<span class="gap">…</span>':'')+
    '<button onclick="'+g(p+1)+'" aria-label="Next page"'+(p>=pages?' disabled':'')+'>›</button>'+
    '<button onclick="'+g(pages)+'"'+(p>=pages?' disabled':'')+'>Last</button>'+
    '</div></div>';
}
function hvBody(){
  var ids=Object.keys(sel).filter(function(k){return sel[k]});
  var head='<div class="seg">'+
      '<button class="sg'+(hvTab==='cho'?' on':'')+'" onclick="setHv(\'cho\')">'+svg(I.inbox)+'Pending approval<span class="sgc'+(QUEUE.length?' hot':'')+'">'+QUEUE.length+'</span></button>'+
      '<button class="sg'+(hvTab==='xong'?' on':'')+'" onclick="setHv(\'xong\')">'+svg(I.done)+'Processed<span class="sgc">'+LICHSU.length+'</span></button>'+
    '</div>';

  if(hvTab==='cho'){
    return head+
    '<div class="card"><div class="card-b" style="border-bottom:1px solid var(--line)"><div class="filters">'+
    '<div class="field" style="width:190px"><label>Ticket type</label><select class="inp"><option>All ticket types</option>'+
    QUEUE.map(function(q){return q.lo}).filter(function(v,i,a){return a.indexOf(v)===i}).map(function(l){return '<option>'+l+'</option>'}).join('')+'</select></div>'+
    '</div></div>'+

    '<div class="card-b flush"><div class="tbl-wrap"><table class="tbl"><thead><tr>'+
    '<th class="cb"><input type="checkbox" onclick="toggleAll(this.checked)"></th>'+
    '<th>Ticket code</th><th>Content</th><th>Employee</th><th>Submit day</th><th></th></tr></thead><tbody>'+
    hpSlice('cho',QUEUE.filter(function(q){return !HV_SRC||q.cach===HV_SRC})).map(function(q){
      var hard=q.w.filter(function(w){return w.t==='dgr'}).length;
      var soft=q.w.filter(function(w){return w.t==='warn'}).length;
      return '<tr class="'+(sel[q.c]?'sel':'')+'" onclick="openDon(\''+q.c+'\')">'+
      '<td class="cb" onclick="event.stopPropagation()"><input type="checkbox" '+(sel[q.c]?'checked':'')+' onchange="sel[\''+q.c+'\']=this.checked;hvRefresh()"></td>'+
      '<td class="nw"><span class="c-code">'+q.c+'</span></td>'+
      '<td><div class="c-main">'+q.ti+'</div><div class="c-sub">'+q.lo+'</div></td>'+
      '<td><div class="person"><div class="av">'+initials(q.nv)+'</div><div><b>'+q.nv+'</b><span>'+q.ma+'</span></div></div></td>'+
      '<td class="num nw">'+esc(q.ct||'')+'</td>'+
      '<td class="r" onclick="event.stopPropagation()"><button class="btn sm pri" onclick="openDon(\''+q.c+'\')">View &amp; approve</button></td></tr>';
    }).join('')+'</tbody></table></div>'+
    (QUEUE.length?hpBar('cho',QUEUE.filter(function(q){return !HV_SRC||q.cach===HV_SRC}).length):'<div class="empty">'+svg(I.done)+'<b>Inbox is empty</b><p>No tickets are waiting for your approval.</p></div>')+
    '</div></div>'+

    (ids.length?'<div class="bulkbar"><b>Selected '+ids.length+(ids.length===1?' ticket':' tickets')+'</b>'+
      '<span style="font-size:12.5px;color:#adbdd2">'+ids.join(', ')+'</span>'+
      '<div class="sp">'+
      '<button class="btn ok" onclick="bulk(\'duyet\')">'+svg(I.check)+'Approve all</button>'+
      '<button class="btn dgr" onclick="bulk(\'tuchoi\')">'+svg(I.x)+'Reject all</button>'+
      '<button class="btn" onclick="sel={};hvRefresh()">Clear selection</button>'+
      '</div></div>':'');
  }
  return head+
    '<div class="card"><div class="card-b" style="border-bottom:1px solid var(--line)"><div class="filters">'+
    '<div class="field" style="width:180px"><label>Result</label><select class="inp"><option>All</option><option>Approved</option><option>Rejected</option></select></div>'+
    '<div class="field" style="width:180px"><label>Time range</label><select class="inp"><option>Last 30 days</option><option>This quarter</option><option>This year</option></select></div>'+
    '</div></div><div class="card-b flush"><div class="tbl-wrap"><table class="tbl"><thead><tr>'+
    '<th>Ticket code</th><th>Content</th><th>Employee</th><th>Processed by</th><th>Processed at</th><th>Duration</th><th>Result</th></tr></thead><tbody>'+
    hpSlice('xong',LICHSU).map(function(l){
      return '<tr onclick="openXong(\''+l.c+'\')" title="View ticket again (read-only)"><td class="c-code">'+l.c+'</td>'+
      '<td><div class="c-main">'+l.ti+'</div><div class="c-sub">'+l.lo+'</div></td>'+
      '<td>'+l.nv+'</td><td>'+logWho(l.c)+'</td><td class="num">'+l.xl+'</td>'+
      '<td class="num">'+l.tg+'</td>'+
      '<td>'+chip(l.st)+'<div class="c-sub" style="margin-top:3px">'+l.kq+'</div></td></tr>';
    }).join('')+'</tbody></table></div>'+hpBar('xong',LICHSU.length)+'</div></div>';
}
/* "Approver of this step" cell in the inbox — states clearly whether delegation applies */
function apCell(q){
  var cur=q.sp.filter(function(x){return x.s==='cur'})[0]; if(!cur) return '—';
  var dg=delegFor(cur.w);
  var main='<div class="c-main">'+esc(baseName(cur.w))+'</div><div class="c-sub">'+srcChip(q)+'</div>';
  if(dg&&dg.st==='active')
    return main+'<div class="c-sub">+ <b style="color:var(--warn)">'+esc(dg.to)+'</b> (delegated)</div>';
  return main+'<div class="c-sub">No delegation</div>';
}
/* Who actually clicked at that step — taken from the approval log */
function logWho(code){
  for(var i=APPLOG.length-1;i>=0;i--) if(APPLOG[i].don===code){
    var g=APPLOG[i];
    return '<div class="c-main">'+esc(g.nguoi)+'</div>'+
      (g.uq?'<div class="c-sub"><span class="uq-badge">DEL</span> approving on behalf of '+esc(g.thay)+'</div>':'<div class="c-sub">Primary approver</div>');
  }
  return '<div class="c-main">'+esc(ME.name)+'</div><div class="c-sub">Primary approver</div>';
}
function toggleAll(on){ var n=0; QUEUE.forEach(function(q){ if(on&&n>=100) return; sel[q.c]=on; if(on) n++ }); if(on&&QUEUE.length>100) toast('You can process up to 100 tickets at a time.'); hvRefresh() }
function bulk(kind){
  var ids=Object.keys(sel).filter(function(k){return sel[k]});
  ids.forEach(function(id){ var i=QUEUE.map(function(q){return q.c}).indexOf(id); if(i>=0) QUEUE.splice(i,1) });
  sel={}; renderNav(); hvRefresh();
  toast((kind==='duyet'?'Approved ':'Rejected ')+ids.length+(ids.length===1?' ticket':' tickets'), ids.join(', '));
}

/* ---------- 3. DELEGATION ---------- */
PAGES['uy-quyen']=function(){
  V('<div class="page-head"><div><h1>Approval delegation</h1>'+
    '</div></div>'+
    '<div class="grid-2" style="grid-template-columns:1fr"><div>'+
    '<div class="card"><div class="card-h"><h2>Delegations configured in the system</h2></div><div class="card-b flush">'+
    '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Delegator</th><th>Delegate</th><th>Scope</th><th>From date</th><th>To date</th><th>Status</th><th></th></tr></thead><tbody>'+
    DELEG.map(function(g,i){
      return '<tr style="cursor:default">'+
      '<td><div class="person"><div class="av">'+initials(g.of)+'</div><div><b style="white-space:nowrap">'+esc(g.of)+' - '+esc(g.ofa)+'</b></div></div></td>'+
      '<td><div class="person"><div class="av">'+initials(g.to)+'</div><div><b style="white-space:nowrap">'+esc(g.to)+' - '+esc(g.toa)+'</b></div></div></td>'+
      '<td>'+esc(g.scope)+'</td>'+
      '<td class="num">'+g.from+'</td><td class="num">'+g.until+'</td>'+
      '<td>'+(g.st==='active'?'<span class="chip c-done">Active</span>':g.st==='expired'?'<span class="chip c-draft">Expired</span>':'<span class="chip c-info">Upcoming</span>')+'</td>'+
      '<td class="r nw">'+(g.st==='expired'?'':'<button class="btn sm" onclick="delegEdit('+i+')">Edit</button> '+
      '<button class="btn sm dgr" onclick="toast(\'Delegation cancelled\',\''+esc(g.of)+' → '+esc(g.to)+'\')">Cancel</button>')+'</td></tr>';
    }).join('')+
    '</tbody></table></div></div></div>'+

    '</div><div>'+
    '<div class="card"><div class="card-h"><h2>Create new delegation</h2></div><div class="card-b">'+
    '<div class="field" style="margin-bottom:13px"><label>Delegate</label>'+
    '<select class="inp"><option>— Select a person —</option><option>Phạm Thu Hà - haptt</option>'+
    '<option>Vũ Quốc Hưng - hungvq</option><option>Nguyễn Văn An - annv</option></select></div>'+
    '<div class="field" style="margin-bottom:13px"><label>Delegation scope</label>'+
    '<select class="inp" onchange="dgScopeChange(this.value)"><option>All ticket types</option><option>Selected ticket types</option></select>'+dgTypesPicker()+'</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:13px">'+
    '<div class="field"><label>From date</label><input class="inp" type="date"></div>'+
    '<div class="field"><label>To date</label><input class="inp" type="date"></div></div>'+
    '<div class="field" style="margin-bottom:14px"><label>Reason</label><textarea class="inp" placeholder="e.g. overseas business trip"></textarea></div>'+
    '<button class="btn pri" onclick="toast(\'Delegation created\',\'The delegate will be notified\')">'+svg(I.plus)+'Create delegation</button>'+
    '</div></div></div></div>');
};

/* =====================================================================
   APPROVAL SCREEN (DRAWER)
   ===================================================================== */

/* =====================================================================
   WORKFLOW DIAGRAM IN TICKET DETAIL — uses the same drawing as the Admin portal
   (same node coordinates, node types, links, and Approve / Reject / Yes / No labels).
   The step the ticket is currently at is highlighted; completed steps show a check mark.
   ===================================================================== */
var FV_DEFS={"nghi-phep":{"wf":"leave-approval-demo","n":"Leave approval","v":8,"nodes":[{"id":"n1","t":"start","x":40,"y":210,"name":"Employee submits ticket","who":"Submitter","nf":8},{"id":"n2","t":"task","x":268,"y":210,"name":"Line manager approval","who":"Line manager","nf":4},{"id":"n3","t":"gate","x":500,"y":210,"name":"Leave over threshold?","cond":"soNgay > {{NGUONG_NGAY_CAP2}}"},{"id":"n4","t":"task","x":732,"y":86,"name":"HR Head approval","who":"HR Head","nf":4},{"id":"n5","t":"sys","x":964,"y":210,"name":"Update HRM timesheet","sys":"POST /api/timesheet/leave"},{"id":"n7","t":"end","x":1196,"y":210,"name":"End — Approved","kq":"duyet"},{"id":"n8","t":"end","x":500,"y":414,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"n1","to":"n2"},{"f":"n2","to":"n3","lbl":"Approve"},{"f":"n2","to":"n8","lbl":"Reject"},{"f":"n3","to":"n4","lbl":"Yes"},{"f":"n3","to":"n5","lbl":"No"},{"f":"n4","to":"n5","lbl":"Approve"},{"f":"n4","to":"n8","lbl":"Reject"},{"f":"n5","to":"n7"}]},"tang-luong":{"wf":"salary-increase-demo","n":"Salary increase approval","v":2,"nodes":[{"id":"s1","t":"start","x":40,"y":200,"name":"Manager proposes","who":"Line manager","nf":6},{"id":"s2","t":"task","x":268,"y":200,"name":"Department head approval","who":"Head of the department","nf":2},{"id":"s3","t":"gate","x":500,"y":200,"name":"Increase above % threshold?","cond":"mucTang > {{NGUONG_PHAN_TRAM}}"},{"id":"s4","t":"task","x":732,"y":80,"name":"Director approval","who":"Director","nf":3},{"id":"s5","t":"sys","x":964,"y":200,"name":"Update payroll","sys":"POST /api/payroll/salary-change"},{"id":"s6","t":"end","x":1196,"y":200,"name":"End — Approved","kq":"duyet"},{"id":"s7","t":"end","x":500,"y":390,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"s1","to":"s2"},{"f":"s2","to":"s3","lbl":"Approve"},{"f":"s2","to":"s7","lbl":"Reject"},{"f":"s3","to":"s4","lbl":"Yes"},{"f":"s3","to":"s5","lbl":"No"},{"f":"s4","to":"s5","lbl":"Approve"},{"f":"s4","to":"s7","lbl":"Reject"},{"f":"s5","to":"s6"}]},"ot":{"wf":"ot-request","n":"Overtime request","v":3,"nodes":[{"id":"o1","t":"start","x":40,"y":200,"name":"Employee submits OT request","who":"Submitter","nf":6},{"id":"o2","t":"task","x":268,"y":200,"name":"Line manager approval","who":"Line manager","nf":3},{"id":"o3","t":"gate","x":500,"y":200,"name":"Monthly OT cap exceeded?","cond":"otThang > {{TRAN_OT_THANG}}"},{"id":"o4","t":"task","x":732,"y":80,"name":"HR approval (over cap)","who":"HR Head","nf":2},{"id":"o5","t":"sys","x":964,"y":200,"name":"Record in timesheet","sys":"POST /api/timesheet/overtime"},{"id":"o6","t":"end","x":1196,"y":200,"name":"End — Approved","kq":"duyet"},{"id":"o7","t":"end","x":500,"y":380,"name":"End — Rejected","kq":"tuchoi"}],"links":[{"f":"o1","to":"o2"},{"f":"o2","to":"o3","lbl":"Approve"},{"f":"o2","to":"o7","lbl":"Reject"},{"f":"o3","to":"o4","lbl":"Yes"},{"f":"o3","to":"o5","lbl":"No"},{"f":"o4","to":"o5","lbl":"Approve"},{"f":"o4","to":"o7","lbl":"Reject"},{"f":"o5","to":"o6"}]}};
(function(){
  var X=function(o){ FV_DEFS[o.key]=o };
  X({key:'cong-tac',wf:'business-trip',n:'Business trip',v:2,nodes:[
    {id:'c1',t:'start',x:40,y:200,name:'Employee submits trip request',who:'Submitter',nf:7},
    {id:'c2',t:'task',x:268,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'c3',t:'gate',x:500,y:200,name:'Overseas or over 5 days?',cond:'noiDen = Overseas || soNgay > {{NGUONG_NGAY_CT}}'},
    {id:'c4',t:'task',x:732,y:80,name:'Director approval',who:'Director',nf:2},
    {id:'c5',t:'gate',x:964,y:200,name:'Advance requested?',cond:'tamUng > 0'},
    {id:'c6',t:'task',x:1196,y:80,name:'Accountant processes advance',who:'Accountant',nf:3},
    {id:'c7',t:'sys',x:1428,y:200,name:'Update HRM business trip schedule',sys:'POST /api/business-trip'},
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
    {id:'d2',t:'task',x:268,y:200,name:'Shift swap partner confirmation',who:'Related person',nf:1},
    {id:'d3',t:'task',x:500,y:200,name:'Line manager approval',who:'Line manager',nf:2},
    {id:'d4',t:'sys',x:732,y:200,name:'Update work schedule',sys:'POST /api/timesheet/shift'},
    {id:'d5',t:'end',x:964,y:200,name:'End — Approved',kq:'duyet'},
    {id:'d6',t:'end',x:500,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'d1',to:'d2'},{f:'d2',to:'d3',lbl:'Approve'},{f:'d2',to:'d6',lbl:'Reject'},{f:'d3',to:'d4',lbl:'Approve'},{f:'d3',to:'d6',lbl:'Reject'},{f:'d4',to:'d5'}]});
  X({key:'xac-nhan-cong',wf:'timesheet-confirm',n:'Timesheet confirmation',v:3,nodes:[
    {id:'x1',t:'start',x:40,y:200,name:'Employee explains timesheet',who:'Submitter',nf:5},
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
    {id:'i2',t:'task',x:268,y:200,name:'Receive & triage',who:'Support team',nf:3},
    {id:'i3',t:'gate',x:500,y:200,name:'Access approval needed?',cond:'nhomYeuCau = Access request'},
    {id:'i4',t:'task',x:732,y:80,name:'Line manager approves access',who:'Line manager',nf:2},
    {id:'i5',t:'task',x:964,y:200,name:'Process',who:'Assigned technician',nf:3},
    {id:'i6',t:'task',x:1196,y:200,name:'Requester confirmation',who:'Submitter',nf:2},
    {id:'i7',t:'end',x:1428,y:200,name:'End — Closed',kq:'duyet'},
    {id:'i8',t:'end',x:732,y:390,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'i1',to:'i2'},{f:'i2',to:'i3'},{f:'i3',to:'i4',lbl:'Yes'},{f:'i3',to:'i5',lbl:'No'},{f:'i4',to:'i5',lbl:'Approve'},{f:'i4',to:'i8',lbl:'Reject'},
     {f:'i5',to:'i6'},{f:'i6',to:'i7'}]});
  X({key:'dat-phong-hop',wf:'fis-meeting-room',n:'Meeting room booking',v:1,nodes:[
    {id:'p1',t:'start',x:40,y:200,name:'Employee books meeting room',who:'Submitter',nf:2},
    {id:'p2',t:'task',x:268,y:200,name:'Admin processing',who:'Admin team',nf:2},
    {id:'p3',t:'task',x:500,y:200,name:'Requester confirmation',who:'Submitter',nf:1},
    {id:'p4',t:'end',x:732,y:200,name:'End — Closed',kq:'duyet'},
    {id:'p5',t:'end',x:500,y:380,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'p1',to:'p2'},{f:'p2',to:'p3',lbl:'Approve'},{f:'p2',to:'p5',lbl:'Reject'},{f:'p3',to:'p4'}]});
  X({key:'profile-update',wf:'profile-update',n:'Employee Profile Update',v:1,nodes:[
    {id:'w2',t:'task',x:60,y:200,name:'HR approves profile change',who:'HR Head',nf:2},
    {id:'w3',t:'end',x:360,y:120,name:'End — Approved',kq:'duyet'},
    {id:'w4',t:'end',x:360,y:300,name:'End — Rejected',kq:'tuchoi'}],
   links:[{f:'w2',to:'w3',lbl:'Approve'},{f:'w2',to:'w4',lbl:'Reject'}]});
})();
/* Step names on the ticket differ from node names on the drawing → declare aliases to match */
var FV_AL={
 'nghi-phep':{n5:['Update timesheet','Timesheet update']},
 'ot':{o4:['HR Head approval'],o5:['Record timesheet']},
 'tang-luong':{s2:['Line manager approval'],s5:['Payroll update']},
 'cong-tac':{c7:['Completed']},
 'doi-ca':{d2:['Related person confirmation'],d4:['Schedule update']},
 'ticket-it':{i5:['In progress','IT grants access','Admin processing']},
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

/* previous user step of a node in the workflow (skipping condition nodes) — target of "Request more info" */
function fvPrev(def,node){
  if(!node) return null;
  var seen={}, q=[node.id];
  while(q.length){ var id=q.shift(); if(seen[id]) continue; seen[id]=1;
    var pr=def.links.filter(function(l){return l.to===id}).map(function(l){return def.nodes.filter(function(n){return n.id===l.f})[0]});
    for(var i=0;i<pr.length;i++){ var p=pr[i]; if(!p) continue; if(p.t==='task'||p.t==='start') return p; q.push(p.id) } }
  return null;
}
function fvKey(d){ return d.t&&FV_DEFS[d.t]?d.t:(FV_LO[d.lo]||'') }
/* Compute each node's state from the ticket's steps */
function fvState(d,def,key){
  var S={}, P={}, al=FV_AL[key]||{}, fin=(d.st==='duyet'||d.st==='tuchoi'||d.st==='thuhoi');
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
    if(!n&&/more info/i.test(s.t)){ n=fvPrev(def,lastTask)||start; if(st==='cur'&&lastTask) set(lastTask.id,'ask',P[lastTask.id]); }
    if(!n&&/re-approval/i.test(s.t)) return;
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
  /* user / system nodes missing from data: treated as passed if a later step is processed (except condition branches) */
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
  if(n.t==='sys'){ if(!w||st==='skip') return null; return [w,st==='done'?(p.at||''):st==='cur'?'Running':''] }
  if(!w&&n.who){ w=FV_ROLE[n.who]||(n.who==='Submitter'&&FVCUR&&FVCUR.d&&FVCUR.d.nv)||n.who }
  if(!w) return null;
  var l2='';
  if(st==='cur') l2='In progress'; else if(st==='ask') l2='Requested more info';
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
/* approver of a step: name on the ticket, otherwise the person holding the role */
function fvApprover(n,p){
  var w=p&&p.w?fvPlain(p.w):'';
  if(!w&&n.who) w=FV_ROLE[n.who]||n.who;
  return w;
}
/* delegation that applies to a step that has not finished yet (active now, or scheduled) */
function fvDeleg(n,st,p){
  if(n.t!=='task'||!(st==='cur'||st==='ask'||st==='pend')) return null;
  return delegFor(fvApprover(n,p));
}
function fvAcc(a){ return a?' - '+a:'' }
function fvDlgHTML(){
  var c=FVCUR; if(!c) return '';
  var out='';
  c.def.nodes.forEach(function(n){
    var dg=fvDeleg(n,c.r.S[n.id],c.r.P[n.id]); if(!dg) return;
    var step='<b>'+esc(n.name)+'</b>';
    var rng='<span class="num">'+esc(dg.from)+' → '+esc(dg.until)+'</span>';
    if(dg.st!=='active') return;
    out+='<div class="dlg on">'+svg(I.dele)+'<span>'+step+' is delegated to <b>'+esc(dg.to)+fvAcc(dg.toa)+'</b> ('+esc(dg.tor)+') by '+esc(dg.of)+fvAcc(dg.ofa)+' · '+rng+'</span></div>';
  });
  return out?'<div class="fv-dl">'+out+'</div>':'';
}
function fvNode(n,st,p,g){
  var ln=fvLine(n,st,p), dgn=fvDeleg(n,st,p); if(dgn&&dgn.st!=='active') dgn=null;
  var badge=st==='cur'?'<span class="fv-now">Current step</span>':st==='ask'?'<span class="fv-now ask">Awaiting more info</span>':'';
  return '<div class="fvn t-'+n.t+(n.kq?' k-'+n.kq:'')+' st-'+st+'" id="fvn_'+n.id+'" style="left:'+g.x+'px;top:'+g.y+'px" title="'+esc(n.name)+'">'+badge+
    '<div class="fvn-c"><div class="fvn-h"><span class="fvn-dot"><svg viewBox="0 0 24 24">'+(FV_DOT[st]||FV_DOT.pend)+'</svg></span><b>'+esc(n.name)+'</b></div>'+
    (ln?'<span class="fvn-w">'+esc(ln[0])+'</span>'+(dgn?'<span class="fvn-t fvn-dg" title="Delegated to '+esc(dgn.to)+' · '+esc(dgn.from)+' → '+esc(dgn.until)+'">Delegated → '+esc(dgn.to)+'</span>':(ln[1]?'<span class="fvn-t">'+esc(ln[1])+'</span>':'')):'')+
    '</div></div>';
}
/* Progress view — vertical timeline of the ticket's steps */
function fvProg(d){
  var sp=(d&&d.sp)||[];
  if(!sp.length) return '<div class="empty"><b>No progress data</b></div>';
  return '<ul class="tl">'+sp.map(function(s,si){
    var cls=s.s==='done'?'done':s.s==='cur'?'cur':s.s==='rej'?'rej':'pend';
    var ic=cls==='done'?FV_DOT.done:cls==='rej'?FV_DOT.rej:'<circle cx="12" cy="12" r="3.5"/>';
    var stx=cls==='done'?(s.at?'<span class="num">'+esc(s.at)+'</span>':'Done'):
            cls==='cur'?(s.fail?'<span class="tl-rej">System task failed</span>':'<span class="tl-cur">Awaiting processing</span>'):
            cls==='rej'?'<span class="tl-rej">Rejected</span>'+(s.at?' · <span class="num">'+esc(s.at)+'</span>':''):'Not reached yet';
    return '<li class="'+cls+'"><span class="mk">'+svg(ic)+'</span><div>'+
      '<div class="ti">'+esc(s.t)+'</div>'+
      '<div class="tm">'+(cls==='pend'?fvPendTxt(s):esc(fvWho(s.w))+' · '+stx)+'</div>'+
      (function(){ var dg=(cls==='cur'||cls==='pend')&&isApStep(s,si)?delegFor(s.w):null; if(!dg||dg.st!=='active') return '';
        return '<div class="tm fvp-dl">Delegated to '+esc(dg.to)+fvAcc(dg.toa)+' · '+esc(dg.from)+' → '+esc(dg.until)+'</div>' })()+
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
    '<div id="fvDl">'+fvDlgHTML()+'</div>'+
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
  var dl=document.getElementById('fvDl'); if(dl) dl.innerHTML=fvDlgHTML();
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
/* Ticket detail frame spans the whole content area — from the left sidebar edge to the right edge */
function fvPlace(){
  var dr=document.getElementById('drw'), sd=document.getElementById('side'); if(!dr) return;
  var l=sd?Math.round(sd.getBoundingClientRect().right):0;
  if(window.innerWidth<780) l=0;
  dr.style.left=l+'px';
}

var dTab='tt', dCur=null;
/* Processed ticket: same merged screen A + B + your part, all read-only */
function openXong(code){
  var l=LICHSU.filter(function(x){return x.c===code})[0]; if(!l) return;
  var d={lo:l.lo,v:l.v,at:[],fi:[['Ticket type',l.lo],['Content',l.ti],['Submitter',l.nv+' ('+l.ma+')'],['Submitted at',l.ct]],sp:[]};
  var kqc={duyet:'var(--ok)',tuchoi:'var(--danger)',bosung:'var(--warn)'}[l.st]||'var(--ink)';
  document.getElementById('drw').innerHTML=
   '<div class="drw-h"><div style="flex:1"><h2>'+esc(l.ti)+'</h2><div class="meta">'+
   '<span class="mono" style="color:var(--brand-ink);font-weight:500">'+l.c+'</span><span>·</span><span>'+esc(l.lo)+'</span>'+
   '<span>·</span><span>'+esc(l.nv)+' ('+l.ma+')</span></div>'+
   '<div class="meta" style="margin-top:7px">'+chip(l.st)+'<span class="chip c-draft nb">Read-only</span></div></div>'+
   '<button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div>'+
   '<div class="drw-b one"><div class="drw-main">'+blockA(d)+
   '<div class="card blk-c" style="box-shadow:none;margin-top:14px"><div class="card-h"><h2>Your part</h2></div>'+
   '<div class="card-b"><div class="bc bc-ro"><div class="bc-row">'+
   '<div class="bc-c" style="grid-column:span 6"><div class="bc-lb">Decision</div><div class="bc-v" style="color:'+kqc+'">'+esc(ST[l.st]?ST[l.st].l:l.kq)+'</div></div>'+
   '<div class="bc-c" style="grid-column:span 6"><div class="bc-lb">Processed at</div><div class="bc-v num">'+esc(l.xl)+' · took '+esc(l.tg)+'</div></div></div>'+
   '<div class="bc-row"><div class="bc-c" style="grid-column:span 12"><div class="bc-lb">Result</div><div class="bc-v">'+esc(l.kq)+'</div></div></div></div></div></div>'+
   '</div></div><div class="drw-f"><button class="btn" style="margin-left:auto" onclick="closeDrawer()">Close</button></div>';
  fvPlace();
  document.getElementById('drw').classList.add('on');
  document.getElementById('ovl').classList.add('on');
}
function openDon(code){ dCur=QUEUE.filter(function(q){return q.c===code})[0]; if(!dCur) return; dTab='tt'; drawDrawer() }
function closeDrawer(){ document.getElementById('drw').classList.remove('on'); document.getElementById('ovl').classList.remove('on') }
function nowStr(){ var n=new Date(),p=function(x){return (x<10?'0':'')+x}; return p(n.getDate())+'/'+p(n.getMonth()+1)+'/'+n.getFullYear()+' '+p(n.getHours())+':'+p(n.getMinutes()) }
/* Click a tab to show its content; click the open tab again to collapse. Both panels stay in the DOM so typed text is kept. */
function setTab(t){
  dTab=(dTab===t)?'':t;
  ['tt','td'].forEach(function(k){ var c=document.getElementById('dtC_'+k); if(c) c.hidden=(dTab!==k) });
  var bar=document.getElementById('dtB'); if(!bar) return;
  Array.prototype.forEach.call(bar.querySelectorAll('.tab'),function(b){
    var on=b.getAttribute('data-t')===dTab; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false');
  });
}
/* Discussion between the approver and the submitter */
function cmHTML(d){
  return '<div class="cm-list">'+(d.cm.length?d.cm.map(function(c){
      return '<div class="cmt"><div class="av">'+initials(c.w)+'</div><div style="flex:1">'+
      '<b>'+esc(c.w)+'</b><time>'+esc(c.r)+' · '+esc(c.at)+'</time><p>'+esc(c.x)+'</p></div></div>';
    }).join(''):'<div class="empty">'+svg(I.doc)+'<b>No discussion yet</b><p>The approver and the submitter can discuss directly here.</p></div>')+'</div>'+
    '<div class="cm-new"><div class="field"><label for="cmIn">Send a message</label>'+
    '<textarea class="inp" id="cmIn" placeholder="Enter your message to the submitter…"></textarea></div>'+
    '<button class="btn pri" onclick="sendCm()">'+svg(I.send)+'Send</button></div>';
}
function sendCm(){
  var d=dCur, t=document.getElementById('cmIn'), v=t?t.value.trim():''; if(!d) return;
  if(!v){ toast('Enter a message first'); return }
  d.cm.push({w:ME.name,r:ME.title,at:nowStr(),x:v});
  var c=document.getElementById('dtC_td'); if(c) c.innerHTML=cmHTML(d);
  var tb=document.querySelector('#dtB .tab[data-t="td"]'); if(tb) tb.textContent='Discussion ('+d.cm.length+')';
  toast('Sent','The submitter will receive a notification');
}
/* Previous step of the ticket (the step before the current one) — "Request more info" sends the ticket back there */
function prevStep(d){
  var i=-1; d.sp.forEach(function(s,k){ if(s.s==='cur') i=k });
  for(var j=i-1;j>=0;j--){ if(!/System|HRM/i.test(d.sp[j].w)) return d.sp[j] }
  return d.sp[0]||null;
}
function askOpen(){
  var d=dCur; if(!d) return;
  var cur=d.sp.filter(function(s){return s.s==='cur'})[0]||{}, pv=prevStep(d)||{t:'Submit ticket',w:d.nv};
  var yk=document.getElementById('ykien'), m=document.getElementById('mdl');
  m.innerHTML='<div class="mdl wide" role="dialog" aria-label="Request more info">'+
    '<div class="mdl-h">Request more info</div><div class="mdl-b">'+
    '<p>The ticket goes back to the <b>previous step</b> of the workflow:</p>'+
    '<div class="ask-to"><div class="av">'+initials(fvPlain(pv.w))+'</div><div><b>'+esc(pv.t)+'</b><span>'+esc(fvWho(pv.w))+'</span></div></div>'+
    '<div class="field"><label for="askTx">Information needed <span style="color:var(--danger)">*</span></label>'+
    '<textarea class="inp" id="askTx" placeholder="Describe what needs to be added or clarified…">'+esc(yk?yk.value:'')+'</textarea></div>'+
    '<div class="err" id="askErr"></div>'+
    '<p style="margin-top:6px">When that step is completed again, the ticket returns to your step (<b>'+esc(cur.t||'')+'</b>).</p></div>'+
    '<div class="mdl-f"><button class="btn" onclick="askClose()">Cancel</button>'+
    '<button class="btn pri" onclick="askSend()">'+svg(I.ask)+'Return to previous step</button></div></div>';
  m.classList.add('on'); setTimeout(function(){ var t=document.getElementById('askTx'); if(t) t.focus() },30);
}
function askClose(){ document.getElementById('mdl').classList.remove('on') }
function askSend(){
  var t=document.getElementById('askTx'), v=t?t.value.trim():'';
  if(!v){ document.getElementById('askErr').textContent='Please describe the information needed.'; return }
  askClose(); decide('bosung',v);
}
function decide(kind,reason){
  var d=dCur, c=d.c, i=QUEUE.map(function(q){return q.c}).indexOf(c);
  var who=actingPerson(d), pv=kind==='bosung'?(prevStep(d)||{t:'Submit ticket',w:d.nv}):null;
  APPLOG.push({don:c,buoc:who.step,nguoi:who.n,uq:who.uq,thay:who.of||'',hd:kind,at:'09/09/2026 11:24'});
  if(i>=0) QUEUE.splice(i,1);
  LICHSU.unshift({c:c,ti:d.ti,lo:d.lo,nv:d.nv,ct:d.ct,xl:'09/09/2026 11:24',tg:'—',
    st:(kind==='duyet'?'duyet':kind==='tuchoi'?'tuchoi':'bosung'),
    kq:(kind==='duyet'?'Moved to next step':kind==='tuchoi'?'Workflow ended':'Returned to previous step: '+pv.t+' ('+fvWho(pv.w)+')')});
  tkSort(); delete sel[c]; closeDrawer(); renderNav();
  if(PAGES[page]) PAGES[page]();
  var act={duyet:'Approved ',tuchoi:'Rejected ',bosung:'Requested more info on '}[kind];
  if(kind==='bosung'){ toast('Returned '+c+' to the previous step', pv.t+' · '+fvWho(pv.w)); return }
  var sub=who.uq
    ? 'Log recorded: '+who.n+' (approving on behalf of '+who.of+') at step "'+who.step+'"'
    : 'Log recorded: '+who.n+' at step "'+who.step+'"';
  toast(act+c, sub);
}

/* ---- CR-07 — approver source ---- */
function srcChip(q){ return '' } /* the submitter does not choose approvers */
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

function isApStep(s,i){ return i>0&&/approv|confirm/i.test(s.t)&&!/System|Department|Team/i.test(s.w) }
/* ---- CR-05 — fixed right column of the detail frame ---- */
function dSide(d){
  var cur=d.sp.filter(function(s){return s.s==='cur'})[0], ci=d.sp.indexOf(cur), dg=cur?delegFor(cur.w):null;
  var ins=SHOW_CANH_BAO&&d.w.length?'<div class="ds-sec"><div class="ds-t">Insights</div>'+d.w.map(function(w){
      return '<div class="ds-ins" title="'+esc(w.x)+'">'+svg(w.t==='info'||w.t==='ok'?I.info:I.warn)+'<span>'+esc(w.b)+'</span></div>' }).join('')+'</div>':'';
  return '<aside class="drw-side" aria-label="Pinned ticket information">'+
   '<div class="ds-sec"><div class="ds-t">Status</div><div class="ds-row">'+chip('cho')+slaPill(d.dueH)+
     (d.uu==='nhaycam'?'<span class="chip c-rej nb">Payroll data — access is logged</span>':'')+'</div></div>'+
   (cur?'<div class="ds-sec"><div class="ds-t">Current handler</div><div class="ds-p"><div class="av">'+initials(baseName(cur.w))+'</div><div><b>'+esc(baseName(cur.w))+'</b>'+
     '<span>'+esc(cur.t)+'</span>'+
     (dg&&dg.st==='active'?'<span>+ '+esc(dg.to)+' (delegate)</span>':'')+'</div></div>'+
     (isApStep(cur,ci)?'<div style="margin-top:8px">'+srcChip(d)+'</div>':'')+'</div>':'')+
   '<div class="ds-sec"><div class="ds-t">Submitter</div><div class="ds-p"><div class="av">'+initials(d.nv)+'</div><div><b>'+esc(d.nv)+'</b>'+
     '<span>'+esc(d.ma)+' · '+esc(d.cd)+'</span><span>'+esc(d.pb)+' · '+esc(UNITS[d.donvi]||d.donvi)+'</span></div></div></div>'+
   '<div class="ds-sec"><div class="ds-t">Ticket information</div><dl class="ds-kv">'+
     '<dt>Type</dt><dd>'+esc(d.lo)+'</dd><dt>Content</dt><dd>'+esc(d.ti)+'</dd><dt>Submitted at</dt><dd class="num">'+esc(d.ct)+'</dd>'+
     '<dt>Approver</dt><dd>'+(d.cach==='TuChon'?'Chosen by submitter':'By User Group')+'</dd></dl></div>'+
   ins+
   '<div class="ds-sec"><div class="ds-t">Workflow instance ID</div><div class="mono" style="font-size:12px;color:var(--ink-2)">'+d.inst+'</div></div>'+
  '</aside>';
}
/* ---- Delegation line shown under each step in Progress ---- */
function dlgLine(st){
  if(/System|HRM/i.test(st.w)) return '';
  if(!/approv|confirm/i.test(st.t)) return '';   /* skip the submit-ticket step / system steps */
  var dg=delegFor(st.w);
  if(!dg) return '<div class="dlg none">'+svg(I.dele)+'<span>No delegation — only '+esc(baseName(st.w))+' can approve this step</span></div>';
  if(dg.st!=='active') return '<div class="dlg soon">'+svg(I.dele)+'<span>Delegation to <b>'+esc(dg.to)+'</b> ('+esc(dg.tor)+') takes effect soon: '+dg.from+' → '+dg.until+'</span></div>';
  return '<div class="dlg on">'+svg(I.dele)+'<span>Delegated to <b>'+esc(dg.to)+'</b> — '+esc(dg.tor)+' · '+dg.from+' → '+dg.until+
    '<br>Both can approve; the log records the name of whoever acts first.</span></div>';
}
/* ---- Workflow diagram of the ticket ---- */
var WF_ARR='<svg viewBox="0 0 24 14"><path d="M1 7h19M15 2l5 5-5 5"/></svg>';
function wfDiagram(d){
  var ticks={done:'<path d="M20 6L9 17l-5-5"/>',rej:'<path d="M18 6L6 18M6 6l12 12"/>',cur:'<circle cx="12" cy="12" r="4"/>'};
  var cols=d.sp.map(function(s,i){
    var cls=s.s==='done'?'done':s.s==='cur'?'cur':s.s==='rej'?'rej':'pend';
    var mine=/\(you\)/.test(s.w)?' me':'';
    var sys=/System|Accounting Department|HR Department/.test(s.w)?' sys':'';
    var isApp=i>0&&/approv|confirm/i.test(s.t);
    var cond=(s.note&&/(Applies|Triggered|Arises|Required|Added) because/.test(s.note))?' cond':'';
    var ic=ticks[s.s]?svg(ticks[s.s]):String(i+1);
    var meta=s.at?s.at:(s.s==='cur'?'In progress':'Not reached yet');
    var dg=(!sys&&isApp)?delegFor(s.w):null;
    var uqTag=(dg&&dg.st==='active')?'<span class="wn-uq" title="Delegated to '+esc(dg.to)+'">DEL · '+esc(dg.to)+'</span>':'';
    return '<div class="wf-col"><div class="wf-node '+cls+sys+mine+cond+(uqTag?' uq':'')+'">'+
      '<div class="wn-i">'+ic+'</div><b>'+esc(s.t)+'</b><em>'+esc(s.w)+'</em>'+uqTag+
      '<span class="wn-t">'+esc(meta)+'</span></div>'+
      '<div class="wf-rej'+(isApp?'':' off')+'">Reject → end</div></div>';
  });
  cols.push('<div class="wf-col"><div class="wf-node pend">'+
    '<div class="wn-i">'+svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>')+'</div>'+
    '<b>End</b><em>Update result in HRM</em></div><div class="wf-rej off">.</div></div>');

  return '<div class="wf"><div class="wf-track">'+cols.join('<div class="wf-link">'+WF_ARR+'</div>')+'</div>'+
   '<div class="wf-legend">'+
   '<span><i style="background:var(--ok-soft);border-color:var(--ok-line)"></i>Done</span>'+
   '<span><i style="background:#fff;border-color:var(--brand)"></i>Your step</span>'+
   '<span><i style="background:#fff;border-color:var(--line);border-style:dashed"></i>Not reached yet</span>'+
   '<span><i style="background:var(--danger-soft);border-color:var(--danger-line)"></i>Reject branch</span>'+
   '<span><i style="background:var(--warn-soft);border-color:var(--warn)"></i>Step with active delegation (DEL tag)</span>'+
   '<span>The <b style="color:var(--warn)">Condition</b> tag: the step only occurs when the configured condition is met</span>'+
   '</div></div>';
}

/* ---- "Who can approve this step" block (including delegation) ---- */
function dlgBlock(d){
  var cur=d.sp.filter(function(s){return s.s==='cur'})[0]; if(!cur) return '';
  var dg=delegFor(cur.w);
  var rows='<div class="aprow"><div class="av">'+initials(baseName(cur.w))+'</div>'+
    '<div class="tx"><b>'+esc(baseName(cur.w))+'</b><span>'+esc(ME.title)+' · primary approver</span></div>'+
    '<span class="chip c-brand nb">Can approve</span></div>';
  if(dg&&dg.st==='active'){
    rows+='<div class="aprow"><div class="av dl">'+initials(dg.to)+'</div>'+
      '<div class="tx"><b>'+esc(dg.to)+'</b><span>'+esc(dg.tor)+' · delegated '+dg.from+' → '+dg.until+'</span></div>'+
      '<span class="chip c-brand nb">Can approve</span></div>';
  }
  var note = dg&&dg.st==='active'
    ? '<div class="alert a-info" style="margin:12px 0 0">'+svg(I.info)+'<div><b>This step is currently delegated</b>'+
      esc(dg.of)+' delegated to <b>'+esc(dg.to)+'</b> ('+esc(dg.tor)+') from '+dg.from+' to '+dg.until+
      ' — reason: '+esc(dg.ly)+'. Scope: '+esc(dg.scope)+'. Both people receive this ticket and either can approve or reject it; '+
      '<b>the log records the name of whoever acts first</b> at this step.</div></div>'
    : '<div class="alert a-warn" style="margin:12px 0 0">'+svg(I.warn)+'<div><b>No delegation set for this step</b>'+
      'If '+esc(baseName(cur.w))+' is absent, the ticket will stop here until the SLA is exceeded. Set up delegation on the <b>Approval delegation</b> screen.</div></div>';
  var pick = dg&&dg.st==='active'
    ? '<div class="actor"><span class="lb">Acting as</span>'+
      '<div class="seg">'+
      '<button class="'+(ACTOR==='chinh'?'on':'')+'" onclick="setActor(\'chinh\')">'+esc(baseName(cur.w))+' (primary)</button>'+
      '<button class="'+(ACTOR==='uq'?'on':'')+'" onclick="setActor(\'uq\')">'+esc(dg.to)+' (delegate)</button>'+
      '</div></div>' : '';
  var srcLine='<div class="mini-q" style="margin-top:12px">Source: '+(d.cach==='TuChon'?'<b>chosen by the submitter</b> when sending ticket '+esc(d.ct):'by User Group <b>'+esc(cur.t.replace(/ (approval|approves?|confirmation|confirms?)$/i,''))+'</b>')+'</div>';
  return '<div class="card" style="box-shadow:none;margin-top:14px"><div class="card-h"><h2>Who can approve this step</h2>'+
    '<div class="r"><span class="chip '+(dg&&dg.st==='active'?'c-info':'c-draft')+' nb">'+(dg&&dg.st==='active'?'Delegated':'No delegation')+'</span></div></div>'+
    '<div class="card-b">'+rows+srcLine+note+pick+'</div></div>';
}
/* ---- The person actually clicking the button ---- */
function actingPerson(d){
  var cur=d.sp.filter(function(s){return s.s==='cur'})[0]||{};
  var dg=delegFor(cur.w);
  if(ACTOR==='uq'&&dg&&dg.st==='active') return {n:dg.to,r:dg.tor,uq:1,of:baseName(cur.w),step:cur.t||''};
  return {n:baseName(cur.w),r:ME.title,uq:0,step:cur.t||''};
}
function drawDrawer(){
  var d=dCur; if(!d) return;
  var body='';
  var wIcon={dgr:I.warn,warn:I.warn,info:I.info,ok:I.check};
  var wCls={dgr:'a-dgr',warn:'a-warn',info:'a-info',ok:'a-ok'};

  body=(SHOW_CANH_BAO&&d.w.length?'<div style="margin-bottom:17px">'+d.w.map(function(w){
      return '<div class="alert '+wCls[w.t]+'">'+svg(wIcon[w.t])+'<div><b>'+w.b+'</b>'+w.x+'</div></div>';
    }).join('')+'</div>':'')+
    '<div class="dtA">'+fvCard(d,'Workflow of this ticket')+'</div>'+
    '<div class="tabs dtB" id="dtB" role="tablist" aria-label="Ticket details">'+
    [['tt','Ticket details'],['td','Discussion'+(d.cm.length?' ('+d.cm.length+')':'')]]
      .map(function(t){return '<button class="tab'+(dTab===t[0]?' on':'')+'" role="tab" data-t="'+t[0]+'" aria-selected="'+(dTab===t[0]?'true':'false')+'" onclick="setTab(\''+t[0]+'\')">'+t[1]+'</button>'}).join('')+
    '</div>'+
    '<div class="dtC" id="dtC_tt"'+(dTab==='tt'?'':' hidden')+'>'+blockA(d)+blockC(d)+'</div>'+
    '<div class="dtC" id="dtC_td"'+(dTab==='td'?'':' hidden')+'>'+cmHTML(d)+'</div>';

  var hard=d.w.filter(function(w){return w.t==='dgr'}).length;

  document.getElementById('drw').innerHTML=
   '<div class="drw-h"><div style="flex:1">'+
   '<h2>'+d.ti+'</h2><div class="meta">'+
   '<span class="mono" style="color:var(--brand-ink);font-weight:500">'+d.c+'</span><span>·</span><span>'+d.lo+'</span>'+
   '<span>·</span><span>'+d.nv+' ('+d.ma+')</span><span>·</span><span>'+esc(tkVer(d))+'</span></div>'+
   (SHOW_CANH_BAO&&hard?'<div class="meta" style="margin-top:7px"><span class="chip c-rej">'+hard+(hard===1?' critical warning':' critical warnings')+'</span></div>':'')+
   '</div><button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div>'+

   '<div class="drw-b one"><div class="drw-main">'+body+'</div></div>'+

   '<div class="drw-f">'+
   '<button class="btn ok" onclick="decide(\'duyet\')">'+svg(I.check)+'Approve</button>'+
   '<button class="btn dgr" onclick="decide(\'tuchoi\')">'+svg(I.x)+'Reject</button>'+
   '<button class="btn" style="margin-left:auto" onclick="closeDrawer()">Close</button></div>';

  fvPlace();
  document.getElementById('drw').classList.add('on');
  document.getElementById('ovl').classList.add('on');
  fvMount();
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeDrawer() });
var _q=document.getElementById('q'); if(_q) _q.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&this.value.trim()){ toast('Search: "'+this.value+'"','Going to Inbox'); go('hop-viec'); this.value='' }
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

tkSort(); renderNav(); go('tong-quan');
