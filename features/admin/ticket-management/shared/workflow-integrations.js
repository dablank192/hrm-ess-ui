/* Functional additions from admin_ver61_EN; existing ESS shell, icons and colors are retained. */
var FD_IC='<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>';
var FD_SYS_IC='<rect x="3.5" y="4" width="17" height="7" rx="1.6"/><rect x="3.5" y="13" width="17" height="7" rx="1.6"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>';
var FD_TK_IC='<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>';
var FD_CHR='<path d="M9 6l6 6-6 6"/>', FD_CHL='<path d="M15 6l-6 6 6 6"/>';
var FD_DT=['string','number','date','datetime','time','boolean','file'];
var FD_DT_ALIAS={string:'string',text:'string',varchar:'string','chuỗi':'string','chuoi':'string',number:'number',numeric:'number',int:'number',integer:'number',decimal:'number',float:'number',double:'number','số':'number',so:'number',date:'date','ngày':'date','ngay':'date',datetime:'datetime',timestamp:'datetime','date-time':'datetime','ngày giờ':'datetime',time:'time','giờ':'time',boolean:'boolean',bool:'boolean','đúng/sai':'boolean',file:'file','tệp':'file'};
function fdDtKey(t){ t=String(t||'').trim(); if(!t) return 'string'; var k=FD_DT_ALIAS[t.toLowerCase()]; return k||t }
function fdDtName(k){ return ({string:tx('Chuỗi','String'),number:tx('Số','Number'),date:tx('Ngày','Date'),datetime:tx('Ngày giờ','Date-time'),
  time:tx('Giờ','Time'),boolean:tx('Đúng/Sai','Boolean'),file:tx('Tệp','File')})[k]||k }

/* ---------------- dữ liệu mẫu ---------------- */
var FDC={
  maDon:['Mã đơn','Ticket code','string','Mã ticket trên BPM, dùng làm khoá chống ghi trùng','BPM ticket code, used as the de-duplication key'],
  maNhanVien:['Mã nhân viên','Employee code','string','Mã NV của người nộp ticket','Employee code of the requester'],
  nguoiDuyet:['Người duyệt','Approver','string','Mã NV người duyệt ở cấp cuối cùng','Employee code of the final approver'],
  loaiNghi:['Loại nghỉ','Leave type','string','Mã loại nghỉ theo danh mục HRM, ví dụ AL, SL','Leave type code in the HRM list, e.g. AL, SL'],
  tuNgay:['Từ ngày','From date','date','Ngày bắt đầu','Start date'],
  denNgay:['Đến ngày','To date','date','Ngày kết thúc','End date'],
  soNgay:['Số ngày nghỉ','Leave days','number','Cho phép số lẻ 0.5 khi nghỉ nửa ngày','0.5 allowed for half a day'],
  thoiDiemDuyet:['Thời điểm duyệt','Approved at','datetime','Thời điểm duyệt xong ở cấp cuối','Time the last level approved'],
  ngayLam:['Ngày làm thêm','Overtime date','date','',''],
  loaiNgay:['Loại ngày','Day type','string','Ngày thường / Ngày nghỉ hằng tuần / Ngày lễ, tết','Weekday / Weekly day off / Public holiday'],
  soGio:['Số giờ làm thêm','Overtime hours','number','',''],
  noiCongTac:['Nơi công tác','Destination','string','',''],
  ngayCong:['Ngày công','Work date','date','',''],
  gioVao:['Giờ vào','Check-in time','time','',''],
  gioRa:['Giờ ra','Check-out time','time','',''],
  ngayDoi:['Ngày đổi ca','Swap date','date','',''],
  caMuonDoi:['Ca muốn đổi','Requested shift','string','Mã ca theo danh mục ca của HRM','Shift code in the HRM shift list'],
  nguoiDoiCung:['Người đổi cùng','Swap partner','string','Mã NV người đổi ca cùng','Employee code of the swap partner'],
  luongCu:['Lương hiện tại','Current salary','number','Lương gross trước điều chỉnh, đơn vị VND','Gross salary before the change, VND'],
  luongMoi:['Lương mới','New salary','number','Lương gross sau điều chỉnh, đơn vị VND','Gross salary after the change, VND'],
  hieuLucTu:['Hiệu lực từ','Effective from','date','Áp dụng từ kỳ lương chứa ngày này','Applies from the payroll period containing this date'],
  loaiDeNghi:['Loại đề nghị','Request type','string','Tạm ứng hoặc Thanh toán','Advance or Payment'],
  soTien:['Số tiền','Amount','number','Đơn vị VND','VND'],
  noiDung:['Nội dung','Description','string','',''],
  phongHop:['Phòng họp','Meeting room','string','Mã phòng theo danh mục phòng họp','Room code in the meeting room list'],
  ngayHop:['Ngày họp','Meeting date','date','',''],
  gioBatDau:['Giờ bắt đầu','Start time','time','',''],
  gioKetThuc:['Giờ kết thúc','End time','time','','']
};
function fdF(k){ var c=FDC[k]; return {k:k,n:tx(c[0],c[1]),dt:c[2],mo:tx(c[3],c[4])} }
function fdTkMk(id,vi,en,keys,by,t){ return {id:id,n:tx(vi,en),mo:'',by:by,t:t,fields:keys.map(fdF)} }
var LEAVE_K=['maDon','maNhanVien','loaiNghi','tuNgay','denNgay','soNgay','nguoiDuyet','thoiDiemDuyet'];
var FSYS=[
  {id:'fs-1',u:'fsoft',c:'HRM',n:tx('Quản trị nhân sự','Human resources'),mo:tx('Hồ sơ, chấm công, nghỉ phép, lịch làm việc','Profiles, timesheets, leave, work schedules'),tks:[
    fdTkMk('tk-1','Nghỉ phép','Leave',LEAVE_K,'quantm','02/10/2026 09:30'),
    fdTkMk('tk-2','Làm thêm giờ (OT)','Overtime (OT)',['maDon','maNhanVien','ngayLam','loaiNgay','soGio','nguoiDuyet'],'quantm','02/10/2026 09:41'),
    fdTkMk('tk-3','Công tác','Business trip',['maDon','maNhanVien','noiCongTac','tuNgay','denNgay'],'huongntt','28/09/2026 14:05'),
    fdTkMk('tk-4','Xác nhận công','Timesheet confirmation',['maDon','maNhanVien','ngayCong','gioVao','gioRa'],'huongntt','28/09/2026 14:20'),
    fdTkMk('tk-5','Đổi ca','Shift swap',['maDon','maNhanVien','ngayDoi','caMuonDoi','nguoiDoiCung'],'quantm','25/09/2026 10:12')]},
  {id:'fs-2',u:'fsoft',c:'PAYROLL',n:tx('Tính lương','Payroll'),mo:tx('Kỳ lương, điều chỉnh lương, phụ cấp','Payroll periods, salary changes, allowances'),tks:[
    fdTkMk('tk-6','Điều chỉnh lương','Salary change',['maDon','maNhanVien','luongCu','luongMoi','hieuLucTu','nguoiDuyet'],'quantm','20/09/2026 10:45')]},
  {id:'fs-3',u:'fsoft',c:'ERP',n:tx('Tài chính – kế toán','Finance & accounting'),mo:tx('Phiếu chi, tạm ứng, thanh toán','Payment vouchers, advances, payments'),tks:[
    fdTkMk('tk-7','Tạm ứng / thanh toán','Advance / payment',['maDon','maNhanVien','loaiDeNghi','soTien','noiDung'],'huongntt','18/09/2026 16:30')]},
  {id:'fs-4',u:'fptis',c:'HRM',n:tx('Quản trị nhân sự FIS','FIS human resources'),mo:'',tks:[
    fdTkMk('tk-8','Nghỉ phép','Leave',LEAVE_K,'namnv','05/09/2026 08:40')]},
  {id:'fs-5',u:'fptis',c:'CALENDAR',n:tx('Lịch & phòng họp','Calendar & rooms'),mo:'',tks:[
    fdTkMk('tk-9','Đặt phòng họp','Room booking',['maDon','phongHop','ngayHop','gioBatDau','gioKetThuc'],'namnv','05/09/2026 08:52')]}
];
var FD_SEQ={s:5,t:9};
(function(){   /* v61: mỗi loại ticket là một API — Method + URL */
  var A={'tk-1':['POST','https://hrm.noibo.local/api/timesheet/leave'],'tk-2':['POST','https://hrm.noibo.local/api/timesheet/overtime'],
    'tk-3':['POST','https://hrm.noibo.local/api/business-trip'],'tk-4':['POST','https://hrm.noibo.local/api/timesheet/adjust'],
    'tk-5':['POST','https://hrm.noibo.local/api/shift/swap'],'tk-6':['POST','https://hrm.noibo.local/api/payroll/salary-change'],
    'tk-7':['POST','https://erp.noibo.local/api/payment-voucher'],'tk-8':['POST','https://hrm.noibo.local/api/timesheet/leave'],
    'tk-9':['POST','https://calendar.noibo.local/api/rooms/book']};
  FSYS.forEach(function(x){ x.tks.forEach(function(t){ var a=A[t.id]||['POST','']; t.m=a[0]; t.url=a[1] }) });
})();
function fdMth(m){ m=String(m||'').toUpperCase(); return '<span class="fd-mth m-'+m.toLowerCase()+'">'+esc(m||'—')+'</span>' }
function fdApiHTML(t){ var u=String(t.url||''), m=u.match(/^https?:\/\/[^\/?#]+(.*)$/i); return '<span class="fd-api">'+fdMth(t.m)+'<span class="mono" title="'+esc(u)+'">'+esc(m?(m[1]||'/'):(u||'—'))+'</span></span>' }
(function(){   /* gắn loại ticket vào các node Tác vụ hệ thống có sẵn */
  var map={'leave-approval-demo':'tk-1','ot-request':'tk-2','business-trip':'tk-3','timesheet-confirm':'tk-4','shift-change':'tk-5',
    'salary-increase-demo':'tk-6','advance-payment':'tk-7','fis-leave-approval':'tk-8','fis-meeting-room':'tk-9'};
  Object.keys(DEFS).forEach(function(k){ if(!map[k]) return;
    DEFS[k].nodes.forEach(function(n){ if(n.t==='sys'&&n.http&&!n.http.fsrc) n.http.fsrc={t:map[k]} });
  });
})();
function fdSysOf(u){ return FSYS.filter(function(s){return s.u===u}) }
function fdSys(id){ return FSYS.filter(function(s){return s.id===id})[0]||null }
function fdFind(tid){ for(var i=0;i<FSYS.length;i++) for(var j=0;j<FSYS[i].tks.length;j++) if(FSYS[i].tks[j].id===tid) return {s:FSYS[i],t:FSYS[i].tks[j]}; return null }
function fdUses(tid){
  var out=[];
  Object.keys(DEFS).forEach(function(k){ DEFS[k].nodes.forEach(function(n){
    if(n.t==='sys'&&n.http&&n.http.fsrc&&n.http.fsrc.t===tid) out.push({wf:k,wn:DEFS[k].n,node:n.id,nn:n.name,n:n});
  }) });
  return out;
}
function fdSysUses(s){ var o=[]; s.tks.forEach(function(t){ o=o.concat(fdUses(t.id)) }); return o }
function fdWfCount(us){ var m={}; us.forEach(function(x){m[x.wf]=1}); return Object.keys(m).length }
function fdUseTxt(us){ return us.length?fdWfCount(us)+tx(' quy trình',' workflow(s)')+' · '+us.length+' node':'' }
function fdNodeNames(n){   /* Name đang dùng trong node */
  var h=n.http||{}, out=[];
  if(h.qmode==='json'){ try{ var o=JSON.parse(h.json||''); if(o&&typeof o==='object') out=Object.keys(o) }catch(e){} }
  else out=(h.params||[]).map(function(p){return String(p.name||'').trim()}).filter(Boolean);
  return out;
}
function fdChips(fs,max){
  var m=max||4;
  return '<span class="fd-chips">'+fs.slice(0,m).map(function(f){ return '<span class="fd-chip mono" title="'+esc(f.n+' · '+fdDtName(f.dt))+'">'+esc(f.k)+'</span>' }).join('')+
    (fs.length>m?'<span class="fd-more">+'+(fs.length-m)+'</span>':'')+'</span>';
}

/* Keep ESS sidebar ordering; append the new function to Ticket Management. */
NAV.push({k:'field',l:tx('Quản lý API','API management'),i:FD_IC});
if(typeof TITLES!=='undefined') TITLES.field=tx('Quản lý API','API management');

/* ---------------- màn Quản lý field ---------------- */
var FDV={sys:'',q:''};
function fdGo(k,v){ FDV[k]=v; PAGES.field(); if(k==='q'){ var e=document.getElementById('fdQ'); if(e){ e.focus(); e.setSelectionRange(e.value.length,e.value.length) } } }
function fdMatch(t,q){ return !q||gNorm(t.n+' '+(t.mo||'')+' '+(t.m||'')+' '+(t.url||'')+' '+t.fields.map(function(f){return f.k+' '+f.n}).join(' ')).indexOf(q)>=0 }
PAGES.field=function(){
  if(unitsFor().indexOf(CUR_UNIT)<0) useUnit(unitsFor()[0]);
  var u=CUR_UNIT, S=fdSysOf(u), q=gNorm((FDV.q||'').trim());
  if(!S.some(function(s){return s.id===FDV.sys})) FDV.sys=S[0]?S[0].id:'';
  var cur=fdSys(FDV.sys);
  
  var side=S.map(function(s){
    var on=s.id===FDV.sys, m=q?s.tks.filter(function(t){return fdMatch(t,q)}).length:s.tks.length;
    return '<button class="fd-si'+(on?' on':'')+'" role="tab" aria-selected="'+on+'" onclick="fdGo(\'sys\',\''+s.id+'\')">'+
      '<span class="fd-code">'+esc(s.c)+'</span><span class="fd-sn"><b>'+esc(s.n)+'</b><span>'+(q?m+tx(' kết quả',' match(es)'):s.tks.length+tx(' loại ticket',' ticket type(s)'))+'</span></span></button>';
  }).join('');
  var main='';
  if(cur){
    var L=cur.tks.filter(function(t){return fdMatch(t,q)});
    var row=function(t){
      var us=fdUses(t.id);
      return '<tr class="clk" onclick="openFt(\''+t.id+'\')"><td class="c-main"><div class="hd-nm">'+esc(t.n)+'</div>'+fdApiHTML(t)+'</td>'+
        '<td>'+fdChips(t.fields,4)+'</td><td class="num fd-cnt">'+t.fields.length+'</td>'+
        '<td class="hd-upd">'+esc(accName(t.by))+' - <span class="mono">'+esc(t.by)+'</span><div class="num">'+esc(t.t)+'</div></td>'+
        '<td class="r" onclick="event.stopPropagation()"><span class="hd-acts">'+
          '<button class="xb look" title="'+tx('Sửa','Edit')+'" aria-label="'+tx('Sửa ','Edit ')+esc(t.n)+'" onclick="openFt(\''+t.id+'\')">'+svg(I.edit)+'</button>'+
          '<button class="xb" title="'+tx('Xoá','Delete')+'" aria-label="'+tx('Xoá ','Delete ')+esc(t.n)+'" onclick="ftDelAsk(\''+t.id+'\')">'+svg(I.trash)+'</button></span></td></tr>';
    };
    main='<div class="fd-mh"><span class="fd-code lg">'+esc(cur.c)+'</span><div class="fd-mt"><h2>'+esc(cur.n)+'</h2>'+(cur.mo?'<p>'+esc(cur.mo)+'</p>':'')+'</div>'+
      '<div class="fd-ma"><button class="xb look" title="'+tx('Sửa hệ thống','Edit system')+'" aria-label="'+tx('Sửa hệ thống ','Edit system ')+esc(cur.c)+'" onclick="openFs(\''+cur.id+'\')">'+svg(I.edit)+'</button>'+
        '<button class="xb" title="'+tx('Xoá hệ thống','Delete system')+'" aria-label="'+tx('Xoá hệ thống ','Delete system ')+esc(cur.c)+'" onclick="fsDelAsk(\''+cur.id+'\')">'+svg(I.trash)+'</button></div></div>'+
      (cur.tks.length?
        '<div class="tbl-wrap"><table class="tbl hd-tbl fd-tbl"><thead><tr><th>'+tx('Loại ticket / API','Ticket type / API')+'</th><th>Field</th><th>'+tx('Số field','Fields')+'</th><th>'+tx('Cập nhật','Updated')+'</th><th></th></tr></thead><tbody>'+
        (L.length?L.map(row).join(''):'<tr><td colspan="5">'+empty(FD_TK_IC,tx('Không có loại ticket nào khớp','No ticket type matches'),tx('Đổi từ khoá tìm kiếm hoặc chọn hệ thống khác.','Change the keyword or pick another system.'))+'</td></tr>')+
        '</tbody></table></div>'
        :'<div class="empty">'+svg(FD_TK_IC)+'<b>'+tx(esc(cur.c)+' chưa có loại ticket nào',esc(cur.c)+' has no ticket type yet')+'</b><p><button class="btn pri" onclick="openFt(\'\',\''+cur.id+'\')">'+svg(I.plus)+tx('Thêm loại ticket','Add ticket type')+'</button></p></div>');
  }
  V('<div class="page-head"><div><h1>'+tx('Quản lý API','API management')+'</h1></div>'+
    '<div class="ph-actions"><button class="btn" onclick="openFs(\'\')">'+svg(I.plus)+tx('Thêm hệ thống','Add system')+'</button>'+
      '<button class="btn pri" onclick="openFt(\'\',FDV.sys)"'+(S.length?'':' disabled')+'>'+svg(I.plus)+tx('Thêm loại ticket','Add ticket type')+'</button></div></div>'+
    '<div class="pg-tools">'+unitSelHTML()+
      '<input class="inp" id="fdQ" style="max-width:320px" value="'+esc(FDV.q)+'" placeholder="'+tx('Tìm theo loại ticket, URL, mã field…','Search by ticket type, URL, field code…')+'" oninput="fdGo(\'q\',this.value)"></div>'+
    (S.length?
      '<div class="fd-wrap"><aside class="card fd-side"><div class="fd-sh"><span>'+tx('Hệ thống','Systems')+'</span><span class="qp-c">'+S.length+'</span></div><div class="fd-sl" role="tablist" aria-label="'+tx('Hệ thống','Systems')+'">'+side+'</div></aside>'+
      '<section class="card fd-main">'+main+'</section></div>'
      :'<div class="card"><div class="empty">'+svg(FD_SYS_IC)+'<b>'+tx(unitName(u)+' chưa khai báo hệ thống nào',unitName(u)+' has no system yet')+'</b><p><button class="btn pri" onclick="openFs(\'\')">'+svg(I.plus)+tx('Thêm hệ thống','Add system')+'</button></p></div></div>'));
};
(function(){   /* đổi đơn vị trên màn này */
  var pu=pickUnit; pickUnit=function(u){ if(page==='field'&&u!==CUR_UNIT){ useUnit(u); FDV.sys=''; auditLog(tx('Chuyển đơn vị','Switch unit'),unitName(u)); return go('field') } return pu.apply(this,arguments) };
})();

/* ---------------- ngăn Thêm / Sửa hệ thống ---------------- */
var FSE=null;
function openFs(id){
  var s=id?fdSys(id):null;
  FSE=s?{id:s.id,u:s.u,c:s.c,n:s.n,mo:s.mo||'',err:{}}:{id:'',u:CUR_UNIT,c:'',n:'',mo:'',err:{}};
  drawFs();
}
function fsGrab(){ var g=function(i){return document.getElementById(i)}; if(g('fs_c')) FSE.c=g('fs_c').value; if(g('fs_n')) FSE.n=g('fs_n').value; if(g('fs_mo')) FSE.mo=g('fs_mo').value }
function drawFs(){
  var ed=!!FSE.id, E=FSE.err, req=' <span style="color:var(--danger)">*</span>', s=ed?fdSys(FSE.id):null;
  var hint=function(k){ return E[k]?'<span class="hint" style="color:var(--danger)">'+esc(E[k])+'</span>':'' };
  showDrawer('<div class="drw-h"><div style="flex:1"><h2>'+(ed?tx('Sửa hệ thống','Edit system'):tx('Thêm hệ thống','Add system'))+'</h2>'+
    '<div class="meta"><span>'+tx('Đơn vị ','Unit ')+esc(unitName(FSE.u))+'</span>'+(s?'<span>'+s.tks.length+tx(' loại ticket',' ticket type(s)')+'</span>':'')+'</div></div>'+
    '<button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div><div class="drw-b">'+
    '<div class="fd-g2"><div class="field"><label for="fs_c">'+tx('Mã hệ thống','System code')+req+'</label>'+
      '<input class="inp mono'+(E.c?' bad':'')+'" id="fs_c" maxlength="20" value="'+esc(FSE.c)+'" placeholder="HRM" autocomplete="off" spellcheck="false" oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9_]/g,\'\')">'+hint('c')+'</div>'+
    '<div class="field"><label for="fs_n">'+tx('Tên hệ thống','System name')+req+'</label>'+
      '<input class="inp'+(E.n?' bad':'')+'" id="fs_n" maxlength="80" value="'+esc(FSE.n)+'" placeholder="'+tx('Ví dụ: Quản trị nhân sự','e.g. Human resources')+'" autocomplete="off">'+hint('n')+'</div></div>'+
    '<div class="field" style="margin-top:12px"><label for="fs_mo">'+tx('Mô tả','Description')+'</label>'+
      '<textarea class="inp" id="fs_mo" rows="2" maxlength="250" placeholder="'+tx('Hệ thống quản lý những dữ liệu gì','What data the system manages')+'">'+esc(FSE.mo)+'</textarea></div>'+
    '</div><div class="drw-f"><button class="btn pri" onclick="saveFs()">'+svg(I.save)+(ed?tx('Lưu','Save'):tx('Thêm hệ thống','Add system'))+'</button>'+
    (ed?'<button class="btn dgr" onclick="fsDelAsk(\''+FSE.id+'\')">'+svg(I.trash)+tx('Xoá','Delete')+'</button>':'')+
    '<button class="btn" style="margin-left:auto" onclick="closeDrawer()">'+tx('Huỷ','Cancel')+'</button></div>');
  setTimeout(function(){ var e=document.getElementById(ed?'fs_n':'fs_c'); if(e&&!ed) e.focus() },50);
}
function saveFs(){
  fsGrab(); var E={}, c=(FSE.c||'').trim().toUpperCase(), n=(FSE.n||'').trim();
  if(!c) E.c=tx('Nhập mã hệ thống','Enter the system code');
  else if(!/^[A-Z][A-Z0-9_]{1,19}$/.test(c)) E.c=tx('Mã gồm 2–20 ký tự: chữ in hoa không dấu, số, dấu gạch dưới; bắt đầu bằng chữ','2–20 characters: uppercase letters, digits, underscore; starts with a letter');
  else if(FSYS.some(function(s){ return s.u===FSE.u&&s.id!==FSE.id&&s.c===c })) E.c=tx('Đơn vị đã có hệ thống mã này','This unit already has a system with this code');
  if(!n) E.n=tx('Nhập tên hệ thống','Enter the system name');
  FSE.err=E; if(Object.keys(E).length) return drawFs();
  var s=FSE.id?fdSys(FSE.id):null, isNew=!s;
  if(s){ s.c=c; s.n=n; s.mo=(FSE.mo||'').trim(); auditLog(tx('Sửa hệ thống tích hợp','Edit integration system'),unitName(s.u)+' · '+c+' – '+n) }
  else { FD_SEQ.s++; s={id:'fs-'+FD_SEQ.s,u:FSE.u,c:c,n:n,mo:(FSE.mo||'').trim(),tks:[]}; FSYS.push(s); auditLog(tx('Thêm hệ thống tích hợp','Add integration system'),unitName(s.u)+' · '+c+' – '+n) }
  FDV.sys=s.id; FSE=null; closeDrawer(); if(page==='field') PAGES.field();
  toast(isNew?tx('Đã thêm hệ thống','System added'):tx('Đã lưu hệ thống','System saved'),esc(c+' – '+n));
}
function fdUseList(us,close){
  return '<ul class="cfm-err">'+us.map(function(x){ return '<li><div><b>'+esc(x.wn)+'</b><span>'+esc(x.nn)+'</span></div><button class="btn xs" onclick="cfmClose();'+(close?'closeDrawer();':'')+'hdOpenNode(\''+x.wf+'\',\''+x.node+'\')">'+tx('Mở node','Open node')+'</button></li>' }).join('')+'</ul>';
}
function fsDelAsk(id){
  var s=fdSys(id); if(!s) return; var us=fdSysUses(s), nf=0; s.tks.forEach(function(t){ nf+=t.fields.length });
  if(us.length){
    cfmShow({title:tx('Chưa xoá được hệ thống','Cannot delete this system'),no:tx('Đóng','Close'),
      body:'<p>'+tx('Loại ticket của <b>'+esc(s.c)+'</b> đang được '+us.length+' node chọn. Đổi API ở các node này trước khi xoá:','Ticket types of <b>'+esc(s.c)+'</b> are used by '+us.length+' node(s). Change the API of these nodes before deleting:')+'</p>'+fdUseList(us,1)});
    return;
  }
  cfmShow({title:tx('Xoá hệ thống','Delete system'),ok:tx('Xoá','Delete'),okCls:'dgr-s',onOk:function(){
      FSYS.splice(FSYS.indexOf(s),1); auditLog(tx('Xoá hệ thống tích hợp','Delete integration system'),unitName(s.u)+' · '+s.c);
      if(FDV.sys===id) FDV.sys=''; closeDrawer(); if(page==='field') PAGES.field(); toast(tx('Đã xoá hệ thống','System deleted'),esc(s.c)) },
    body:'<p>'+tx('Bạn có chắc muốn xoá hệ thống <b>'+esc(s.c+' – '+s.n)+'</b> cùng '+s.tks.length+' loại ticket và '+nf+' field?','Are you sure you want to delete system <b>'+esc(s.c+' – '+s.n)+'</b> with its '+s.tks.length+' ticket type(s) and '+nf+' field(s)?')+'</p>'});
}

/* ---------------- ngăn Thêm / Sửa loại ticket (field 4 cột) ---------------- */
function fdFieldCopy(f){
  var out={k:f.k,n:f.n,dt:f.dt,mo:f.mo||''};
  if(Array.isArray(f.children)) out.children=f.children.map(fdFieldCopy);
  return out;
}
function fdFieldSchema(f){
  var out={k:String(f.k||'').trim(),n:String(f.n||'').trim(),dt:fdDtKey(f.dt),mo:String(f.mo||'').trim()};
  if(out.dt==='array') out.children=(f.children||[]).map(fdFieldSchema);
  return out;
}
function fdSchemaShape(fields){ return fields.map(function(f){return {k:f.k,dt:f.dt,children:f.dt==='array'?fdSchemaShape(f.children||[]):undefined}}) }
var FTE=null;
function openFt(id,sid){
  var r=id?fdFind(id):null;
  if(!r&&!fdSysOf(CUR_UNIT).length) return toast(tx('Chưa có hệ thống','No system yet'),tx('Thêm hệ thống trước khi thêm loại ticket','Add a system before adding a ticket type'));
  FTE=r?{id:id,s:r.s.id,n:r.t.n,m:r.t.m||'POST',url:r.t.url||'',mo:r.t.mo||'',fields:r.t.fields.map(fdFieldCopy),err:{}}
       :{id:'',s:sid||FDV.sys||fdSysOf(CUR_UNIT)[0].id,n:'',m:'POST',url:'',mo:'',fields:[{k:'',n:'',dt:'string',mo:''}],err:{}};
  drawFt();
}
function ftGrab(){
  var g=function(i){return document.getElementById(i)};
  if(g('ft_s')) FTE.s=g('ft_s').value; if(g('ft_n')) FTE.n=g('ft_n').value; if(g('ft_mo')) FTE.mo=g('ft_mo').value; if(g('ft_m')) FTE.m=g('ft_m').value; if(g('ft_u')) FTE.url=g('ft_u').value;
  FTE.fields.forEach(function(f,i){ var a=g('ftk_'+i),b=g('ftn_'+i),c=g('ftd_'+i),d=g('ftm_'+i); if(a) f.k=a.value; if(b) f.n=b.value; if(c) f.dt=c.value; if(d) f.mo=d.value });
}
function ftAddRow(){ ftGrab(); FTE.fields.push({k:'',n:'',dt:'string',mo:''}); drawFt(); setTimeout(function(){ var e=document.getElementById('ftk_'+(FTE.fields.length-1)); if(e){ e.focus(); e.scrollIntoView({block:'nearest'}) } },30) }
function ftDelRow(i){ ftGrab(); FTE.fields.splice(i,1); if(FTE.err.f){ var o={}; Object.keys(FTE.err.f).forEach(function(k){ k=+k; if(k<i) o[k]=FTE.err.f[k]; else if(k>i) o[k-1]=FTE.err.f[k] }); FTE.err.f=o } drawFt() }
function ftMove(i,d){ ftGrab(); var j=i+d; if(j<0||j>=FTE.fields.length) return; var t=FTE.fields[i]; FTE.fields[i]=FTE.fields[j]; FTE.fields[j]=t; FTE.err.f={}; drawFt(); setTimeout(function(){ var e=document.getElementById('ftk_'+j); if(e) e.focus() },30) }
function drawFt(){
  var ed=!!FTE.id, E=FTE.err, FE=E.f||{}, req=' <span style="color:var(--danger)">*</span>', us=ed?fdUses(FTE.id):[];
  var hint=function(k){ return E[k]?'<span class="hint" style="color:var(--danger)">'+esc(E[k])+'</span>':'' };
  var fh=function(e){ return e?'<span class="hint" style="color:var(--danger)">'+esc(e)+'</span>':'' };
  var S=fdSysOf(fdSys(FTE.s)?fdSys(FTE.s).u:CUR_UNIT);
  showDrawer('<div class="drw-h"><div style="flex:1"><h2>'+(ed?tx('Sửa loại ticket','Edit ticket type'):tx('Thêm loại ticket','Add ticket type'))+'</h2>'+
    '<div class="meta"><span>'+tx('Đơn vị ','Unit ')+esc(unitName(CUR_UNIT))+'</span>'+(us.length?'<span>'+tx('Đang dùng ở ','Used in ')+fdUseTxt(us)+'</span>':'')+'</div></div>'+
    '<button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div><div class="drw-b">'+
    '<div class="fd-g2"><div class="field"><label for="ft_s">'+tx('Hệ thống','System')+req+'</label>'+
      '<select class="inp" id="ft_s">'+S.map(function(s){ return '<option value="'+s.id+'"'+(s.id===FTE.s?' selected':'')+'>'+esc(s.c+' – '+s.n)+'</option>' }).join('')+'</select></div>'+
    '<div class="field"><label for="ft_n">'+tx('Tên loại ticket','Ticket type name')+req+'</label>'+
      '<input class="inp'+(E.n?' bad':'')+'" id="ft_n" maxlength="80" value="'+esc(FTE.n)+'" placeholder="'+tx('Ví dụ: Nghỉ phép','e.g. Leave')+'" autocomplete="off">'+hint('n')+'</div></div>'+
    '<div class="fd-mu"><div class="field"><label for="ft_m">Method'+req+'</label>'+
      '<select class="inp" id="ft_m">'+HTTP_METHODS.map(function(m){ return '<option'+(FTE.m===m?' selected':'')+'>'+m+'</option>' }).join('')+'</select></div>'+
    '<div class="field"><label for="ft_u">URL'+req+'</label>'+
      '<input class="inp mono'+(E.url?' bad':'')+'" id="ft_u" maxlength="500" value="'+esc(FTE.url||'')+'" placeholder="https://hrm.noibo.local/api/…" autocomplete="off" spellcheck="false">'+hint('url')+'</div></div>'+
    '<div class="field" style="margin-top:16px"><div class="qp-h hdx-h"><b>Field</b><span class="qp-c">'+FTE.fields.length+'</span></div>'+
      (FTE.fields.length?'<div class="ftx-th" aria-hidden="true"><span></span><span>'+tx('Mã field','Field code')+'</span><span>'+tx('Tên field','Field name')+'</span><span>'+tx('Kiểu dữ liệu','Data type')+'</span><span>'+tx('Mô tả','Description')+'</span><span></span></div>':'')+
      '<div class="ftx-list">'+FTE.fields.map(function(f,i){
        var fe=FE[i]||{}, L=FTE.fields.length;
        return '<div class="ftx-r"><span class="ftx-no num">'+(i+1)+'</span>'+
          '<div><input class="inp mono'+(fe.k?' bad':'')+'" id="ftk_'+i+'" maxlength="60" value="'+esc(f.k)+'" placeholder="maNhanVien" aria-label="'+tx('Mã field ','Field code ')+(i+1)+'" autocomplete="off" spellcheck="false">'+fh(fe.k)+'</div>'+
          '<div><input class="inp'+(fe.n?' bad':'')+'" id="ftn_'+i+'" maxlength="80" value="'+esc(f.n)+'" placeholder="'+tx('Mã nhân viên','Employee code')+'" aria-label="'+tx('Tên field ','Field name ')+(i+1)+'" autocomplete="off">'+fh(fe.n)+'</div>'+
          '<div><input class="inp" id="ftd_'+i+'" maxlength="30" value="'+esc(f.dt||'')+'" placeholder="string" aria-label="'+tx('Kiểu dữ liệu ','Data type ')+(i+1)+'" autocomplete="off" spellcheck="false"></div>'+
          '<div><textarea class="inp ftm" id="ftm_'+i+'" rows="1" placeholder="'+tx('Quy ước giá trị, đơn vị…','Value rules, unit…')+'" aria-label="'+tx('Mô tả ','Description ')+(i+1)+'" spellcheck="false">'+esc(f.mo)+'</textarea></div>'+
          '<div class="ftx-a">'+
            '<button class="xb" type="button" title="'+tx('Xoá field','Delete field')+'" aria-label="'+tx('Xoá field ','Delete field ')+(i+1)+'" onclick="ftDelRow('+i+')">'+svg(I.trash)+'</button></div></div>';
      }).join('')+'</div>'+hint('fields')+
      '<button class="btn sm sys-add" onclick="ftAddRow()">'+svg(I.plus)+tx('Thêm field','Add field')+'</button></div>'+
    '</div><div class="drw-f"><button class="btn pri" onclick="saveFt()">'+svg(I.save)+(ed?tx('Lưu','Save'):tx('Thêm loại ticket','Add ticket type'))+'</button>'+
    (ed?'<button class="btn dgr" onclick="ftDelAsk(\''+FTE.id+'\')">'+svg(I.trash)+tx('Xoá','Delete')+'</button>':'')+
    '<button class="btn" style="margin-left:auto" onclick="closeDrawer()">'+tx('Huỷ','Cancel')+'</button></div>','fdw');
  setTimeout(function(){ var e=document.getElementById('ft_n'); if(e&&!ed&&!FTE.n) e.focus() },50);
  ftFit();
}
function ftFit(){ document.querySelectorAll('#drw textarea.ftm').forEach(function(t){ t.style.height='auto'; t.style.height=Math.max(38,Math.min(t.scrollHeight+2,180))+'px'; t.oninput=function(){ if(t.scrollHeight>t.clientHeight) t.style.height=Math.min(t.scrollHeight+2,180)+'px' } }) }
var FD_KEY_RE=/^[A-Za-z_][A-Za-z0-9_]*$/;
function saveFt(){
  ftGrab(); var E={}, FE={}, n=(FTE.n||'').trim(), seen={}, s=fdSys(FTE.s);
  if(!n) E.n=tx('Nhập tên loại ticket','Enter the ticket type name');
  else if(s&&s.tks.some(function(t){ return t.id!==FTE.id&&t.n.toLowerCase()===n.toLowerCase() })) E.n=tx('Đơn vị đã có loại ticket tên này','This unit already has a ticket type with this name');
  var U=String(FTE.url||'').trim();
  if(!U) E.url=tx('Nhập URL của API','Enter the API URL');
  else if(/\s/.test(U)) E.url=tx('URL không được chứa khoảng trắng','The URL cannot contain spaces');
  else if(!/^https?:\/\/[^\s\/?#]+/i.test(U)) E.url=tx('URL phải bắt đầu bằng http:// hoặc https:// kèm tên máy chủ','The URL must start with http:// or https:// followed by a host');
  var F=FTE.fields.filter(function(f){ return String(f.k||'').trim()||String(f.n||'').trim()||String(f.mo||'').trim() });
  FTE.fields=F.length?F:FTE.fields;
  if(!F.length) E.fields=tx('Thêm ít nhất một field','Add at least one field');
  F.forEach(function(f,i){
    var k=String(f.k||'').trim(), e={};
    if(!k) e.k=tx('Nhập mã field','Enter the field code');
    else if(!FD_KEY_RE.test(k)) e.k=tx('Chỉ gồm chữ không dấu, số, dấu gạch dưới; không bắt đầu bằng số','Letters, digits and underscore only; cannot start with a digit');
    else if(seen[k.toLowerCase()]) e.k=tx('Mã field bị trùng','Duplicate field code');
    if(k) seen[k.toLowerCase()]=1;
    if(!String(f.n||'').trim()) e.n=tx('Nhập tên field','Enter the field name');
    if(e.k||e.n) FE[i]=e;
  });
  if(Object.keys(FE).length) E.f=FE;
  FTE.err=E; if(Object.keys(E).length) return drawFt();
  var fields=F.map(fdFieldSchema);
  var r=FTE.id?fdFind(FTE.id):null;
  var doSave=function(){
    var t, me=ACTORS[ACT].acc, now=nowStr(), isNew=!r;
    if(r){
      t=r.t; if(r.s!==s){ r.s.tks.splice(r.s.tks.indexOf(t),1); s.tks.push(t) }
      t.n=n; t.m=FTE.m; t.url=U; t.mo=(FTE.mo||'').trim(); t.fields=fields; t.by=me; t.t=now;
      auditLog(tx('Sửa loại ticket','Edit ticket type'),n+' ('+fields.length+' field)');
    } else {
      FD_SEQ.t++; t={id:'tk-'+FD_SEQ.t,n:n,m:FTE.m,url:U,mo:(FTE.mo||'').trim(),by:me,t:now,fields:fields}; s.tks.push(t);
      auditLog(tx('Thêm loại ticket','Add ticket type'),n+' ('+fields.length+' field)');
    }
    FDV.sys=s.id; FTE=null; closeDrawer(); if(page==='field') PAGES.field();
    toast(isNew?tx('Đã thêm loại ticket','Ticket type added'):tx('Đã lưu loại ticket','Ticket type saved'),esc(n)+' · '+fields.length+' field');
  };
  /* API đang được node dùng: node tự cập nhật theo khai báo mới → báo trước những gì thay đổi */
  if(r){
    var us=fdUses(r.t.id), oldK=r.t.fields.map(function(f){return f.k}), newK=fields.map(function(f){return f.k});
    var gone=oldK.filter(function(k){return newK.indexOf(k)<0}), add=newK.filter(function(k){return oldK.indexOf(k)<0});
    var api=(r.t.m||'')!==FTE.m||(r.t.url||'')!==U;
    var shapeChanged=JSON.stringify(fdSchemaShape(r.t.fields))!==JSON.stringify(fdSchemaShape(fields));
    if(us.length&&(api||gone.length||add.length||shapeChanged)){
      var li=[];
      if(shapeChanged) li.push('<li><div><b>Field structure changed</b><span>Review array item fields and configured values before publishing.</span></div></li>');
      if(api) li.push('<li><div><b>'+tx('Đổi API','API changed')+'</b><span class="mono">'+esc((r.t.m||'')+' '+(r.t.url||''))+' → '+esc(FTE.m+' '+U)+'</span></div></li>');
      if(gone.length) li.push('<li><div><b>'+tx('Bỏ field','Removed fields')+'</b><span><span class="mono">'+esc(gone.join(', '))+'</span>'+tx(' — node thôi gửi, Value đã cấu hình ở node bị bỏ',' — nodes stop sending them; their configured Value is dropped')+'</span></div></li>');
      if(add.length) li.push('<li><div><b>'+tx('Thêm field','Added fields')+'</b><span><span class="mono">'+esc(add.join(', '))+'</span>'+tx(' — node cần chọn Value trước khi xuất bản lại',' — nodes need a Value before the workflow is published again')+'</span></div></li>');
      cfmShow({wide:1,title:tx('API đang được node sử dụng','This API is used by nodes'),ok:tx('Vẫn lưu','Save anyway'),onOk:doSave,
        body:'<p>'+tx('Các node đang gọi API này sẽ tự cập nhật theo khai báo mới:','Nodes calling this API will follow the new declaration:')+'</p><ul class="cfm-err">'+li.join('')+'</ul>'+
          '<p style="margin-top:10px">'+tx('Node bị ảnh hưởng:','Affected nodes:')+'</p>'+fdUseList(us,1)});
      return;
    }
  }
  doSave();
}
function ftDelAsk(id){
  var r=fdFind(id); if(!r) return; var us=fdUses(id);
  if(us.length){
    cfmShow({title:tx('Chưa xoá được loại ticket','Cannot delete this ticket type'),no:tx('Đóng','Close'),
      body:'<p>'+tx('Loại ticket <b>'+esc(r.t.n)+'</b> đang được '+us.length+' node chọn. Đổi API ở các node này trước khi xoá:','Ticket type <b>'+esc(r.t.n)+'</b> is used by '+us.length+' node(s). Change the API of these nodes before deleting:')+'</p>'+fdUseList(us,1)});
    return;
  }
  cfmShow({title:tx('Xoá loại ticket','Delete ticket type'),ok:tx('Xoá','Delete'),okCls:'dgr-s',onOk:function(){
      r.s.tks.splice(r.s.tks.indexOf(r.t),1); auditLog(tx('Xoá loại ticket','Delete ticket type'),r.t.n);
      closeDrawer(); if(page==='field') PAGES.field(); toast(tx('Đã xoá loại ticket','Ticket type deleted'),esc(r.t.n)) },
    body:'<p>'+tx('Bạn có chắc muốn xoá loại ticket <b>'+esc(r.t.n)+'</b> ('+r.t.fields.length+' field)?','Are you sure you want to delete ticket type <b>'+esc(r.t.n)+'</b> ('+r.t.fields.length+' field(s))?')+'</p>'});
}

/* =====================================================================
   Node Tác vụ hệ thống — "Chọn field" (hệ thống → loại ticket)
   ===================================================================== */
var FDP={open:false,s:''}, FD_EVAL_N=null;
function fdpSrc(n){ var h=sysGet(n); return h.fsrc&&h.fsrc.t?fdFind(h.fsrc.t):null }
function fdpField(r,k){ return r?r.t.fields.filter(function(f){return f.k===k})[0]||null:null }
function fdpToggle(){
  var n=nodeById(DSN.sel); if(!n) return;
  if(!FDP.open){ var r=fdpSrc(n); FDP.s=r?r.s.id:''; var S=fdSysOf(wfUnit(DSN.id)); if(!r&&S.length===1) FDP.s=S[0].id }
  FDP.open=!FDP.open; sysDraw();
  var f=document.querySelector('#fdpWrap .fdp-pop .fdp-i.on')||document.querySelector('#fdpWrap .fdp-pop button'); if(f) f.focus({preventScroll:true});
  var w=document.getElementById('fdpWrap'); if(w&&FDP.open) sysReveal(w.querySelector('.fdp-pop'));
}
function fdpSys(id){ FDP.s=id; sysDraw(); var f=document.querySelector('#fdpWrap .fdp-pop .fdp-i.on')||document.querySelector('#fdpWrap .fdp-pop button'); if(f) f.focus({preventScroll:true}) }
function fdpClose(){ if(!FDP.open) return; FDP.open=false; sysDraw() }
function fdpClear(){
  var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n); delete h.fsrc; FDP.open=false; markDirty(); sysDraw();
  toast(tx('Đã bỏ chọn loại ticket','Ticket type cleared'),tx('Các tham số đang có vẫn được giữ','Existing parameters are kept'));
}
function fdpApply(tid){
  var n=nodeById(DSN.sel), r=fdFind(tid); if(!n||!r) return;
  var h=sysGet(n), keys=r.t.fields.map(function(f){return f.k}), lbl=r.t.n, drop=[], go;
  if(h.qmode==='json'){
    var o={}; try{ var j=JSON.parse(h.json||'{}'); if(j&&typeof j==='object'&&!Array.isArray(j)) o=j }catch(e){}
    Object.keys(o).forEach(function(k){ if(keys.indexOf(k)<0) drop.push(k) });
    go=function(){ var nj={}; keys.forEach(function(k){ nj[k]=o[k]!==undefined?o[k]:'' }); h.json=JSON.stringify(nj,null,2); fin() };
  } else {
    var by={}; h.params.forEach(function(p){ var k=String(p.name||'').trim(); if(k&&!by[k]) by[k]=p; if(k&&keys.indexOf(k)<0) drop.push(k) });
    go=function(){ h.params=keys.map(function(k){ return by[k]||{name:k,value:'',vars:[]} }); fin() };
  }
  var fin=function(){
    h.fsrc={t:tid}; FDP.open=false; SYS.open=-1; SYS.focus=null; SYS.menu=null; markDirty(); renderNodes(); sysDraw();
    toast(tx('Đã chọn API ','API selected: ')+esc(lbl),keys.length+tx(' tham số — chọn biến cho Value của từng tham số',' parameter(s) — pick a variable for each Value'));
  };
  if(drop.length){
    cfmShow({title:tx('Đổi loại ticket','Change ticket type'),ok:tx('Đổi loại ticket','Change ticket type'),onOk:go,
      body:'<p>'+tx('Các tham số sau không có trong <b>'+esc(lbl)+'</b> và sẽ bị bỏ khỏi node:','These parameters are not in <b>'+esc(lbl)+'</b> and will be removed from the node:')+'</p>'+
        '<ul class="cfm-err">'+drop.map(function(k){ return '<li><div><b class="mono">'+esc(k)+'</b></div></li>' }).join('')+'</ul>'});
    return;
  }
  go();
}
function fdpName(i,v){
  var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n); if(!h.params[i]) return;
  h.params[i].name=v; SYS.focus={k:'n',i:i,j:-1}; markDirty(); sysDraw();
}
document.addEventListener('mousedown',function(e){
  if(!FDP.open) return; var w=document.getElementById('fdpWrap');
  if(!w){ FDP.open=false; return }
  if(e.target.closest&&e.target.closest('#hdpWrap,.vx,#vxPop,#drw,#cfm')) return; if(!w.contains(e.target)) fdpClose();
},true);
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&FDP.open&&document.getElementById('fdpWrap')&&!document.getElementById('cfm')){ e.preventDefault(); e.stopImmediatePropagation(); fdpClose(); var t=document.getElementById('fdpTg'); if(t) t.focus() }
},true);

(function(){
  /* kiểu dữ liệu: biến trong túi biến → field */
  var dtOk=function(fd,vd){ if(fd==='string'||FD_DT.indexOf(fd)<0) return true; if(fd===vd) return true; if(fd==='datetime'&&vd==='date') return true; return false };
  var se=sysEval;
  sysEval=function(n){
    var was=FD_EVAL_N; FD_EVAL_N=n;
    try{ var st=se.apply(this,arguments) } finally { FD_EVAL_N=was }
    var h=sysGet(n), fd={err:[],warn:[]};
    st.fd=fd;
    if(h.fsrc&&h.fsrc.t){
      var r=fdFind(h.fsrc.t);
      if(!r) fd.err.push(tx('API đã chọn không còn ở màn Quản lý API — chọn lại','The selected API no longer exists in API management — pick again'));
      else {
        var have=fdNodeNames(n), miss=r.t.fields.filter(function(f){ return have.indexOf(f.k)<0 });
        if(miss.length) fd.warn.push(tx('Chưa gửi '+miss.length+' field của '+r.t.n+': ','Not sending '+miss.length+' field(s) of '+r.t.n+': ')+miss.map(function(f){return f.k}).join(', '));
        if(h.qmode==='json') fdNodeNames(n).forEach(function(k){ if(!fdpField(r,k)) fd.err.push(tx('"'+k+'" không có trong '+r.t.n,'"'+k+'" is not in '+r.t.n)) });
      }
      st.errs+=fd.err.length; st.warns+=fd.warn.length;
    }
    return st;
  };
  var re=sysRowEval;
  sysRowEval=function(p,i,all,paths,vi){
    var R=re.apply(this,arguments), n=FD_EVAL_N||nodeById(DSN.sel), r=n&&n.t==='sys'&&fdpSrc(n), name=String(p.name||'').trim();
    if(!r||!name) return R;
    var f=fdpField(r,name);
    if(!f){ R.err.unshift({f:'n',m:tx('"'+name+'" không có trong loại ticket '+r.t.n+' — chọn lại field','"'+name+'" is not in ticket type '+r.t.n+' — pick the field again')}); return R }
    [p.value].concat(p.vars||[]).forEach(function(s,k){
      s=String(s||'').trim(); if(!s) return; var who=k?'Variable value '+k:'Value', fk=k?'w'+(k-1):'v';
      var m=s.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
      if(m){ var v=vi[m[1].trim()]; if(v&&!dtOk(f.dt,v.dt)) R.warn.push({f:fk,m:tx(who+': field '+f.k+' kiểu '+fdDtName(f.dt)+' nhưng biến {{'+v.v+'}} kiểu '+fdDtName(v.dt),who+': field '+f.k+' is '+fdDtName(f.dt)+' but {{'+v.v+'}} is '+fdDtName(v.dt))}) }
      else if(!/\{\{/.test(s)&&f.dt==='number'&&isNaN(Number(s.replace(',','.')))) R.warn.push({f:fk,m:tx(who+': field '+f.k+' kiểu Số nhưng giá trị không phải số',who+': field '+f.k+' is a Number but the value is not numeric')});
    });
    return R;
  };
  /* chèn "Chọn field" ngay dưới Specify Query Parameters */
  var is=inspSys;
  inspSys=function(n){
    var o=is.apply(this,arguments), k=o.indexOf('<div id="sysGen">');
    if(k<0) return o;
    return o.slice(0,k)+fdpHTML(n,sysEval(n))+o.slice(k);
  };
  /* Name: chọn từ field của loại ticket */
  var ph=sysParamHTML;
  sysParamHTML=function(p,i,st){
    var o=ph.apply(this,arguments), n=nodeById(DSN.sel), r=n&&fdpSrc(n);
    if(!r||SYS.open!==i) return o;
    var h=sysGet(n), name=String(p.name||'').trim(), f=fdpField(r,name);
    var used={}; h.params.forEach(function(q,j){ if(j!==i) used[String(q.name||'').trim()]=1 });
    var sel='<select class="inp fd-nsel" id="sysN_'+i+'" aria-label="Name '+(i+1)+'" onfocus="SYS.focus={k:\'n\',i:'+i+',j:-1}" onchange="fdpName('+i+',this.value)">'+
      (f?'':'<option value="'+esc(name)+'" selected>'+(name?esc(name)+tx(' — không có trong loại ticket',' — not in the ticket type'):tx('— Chọn field —','— Choose a field —'))+'</option>')+
      r.t.fields.map(function(x){ return '<option value="'+esc(x.k)+'"'+(x.k===name?' selected':'')+(used[x.k]&&x.k!==name?' disabled':'')+'>'+esc(x.k)+' — '+esc(x.n)+'</option>' }).join('')+'</select>';
    var info=f?'<span class="hint fd-hint"><span class="fd-dt">'+fdDtName(f.dt)+'</span>'+esc(f.n)+(f.mo?' · '+esc(f.mo):'')+'</span>':'';
    o=o.replace(new RegExp('<input class="inp mono" id="sysN_'+i+'"[^>]*>'),function(){return sel});
    o=o.replace(new RegExp('<span class="hint">[^<]*</span>(<div id="qpF_'+i+'_n">)'),function(_,a){ return info+a });
    return o;
  };
  /* Add Parameter: lấy field kế tiếp chưa dùng */
  var ap=sysAddParam;
  sysAddParam=function(){
    var n=nodeById(DSN.sel), r=n&&fdpSrc(n); if(!r) return ap.apply(this,arguments);
    var h=sysGet(n), have={}; h.params.forEach(function(p){ have[String(p.name||'').trim()]=1 });
    var f=r.t.fields.filter(function(x){return !have[x.k]})[0];
    if(!f) return toast(tx('Đã dùng hết field','All fields are in use'),tx('Mọi field của '+r.t.n+' đều đã có trong tham số','Every field of '+r.t.n+' is already a parameter'));
    h.params.push({name:f.k,value:'',vars:[]}); markDirty(); sysOpen(h.params.length-1);
  };
  /* sysOpen: Name có thể là select (không có setSelectionRange) */
  sysOpen=function(i){
    SYS.open=i; SYS.menu=null;
    if(i>=0){ SYS.focus={k:'n',i:i,j:-1}; SYS.caret=null } else SYS.focus=null;
    sysDraw();
    if(i>=0){ var box=document.getElementById('qp_'+i); sysReveal(box); var el=sysEl(SYS.focus);
      if(el){ el.focus({preventScroll:true}); if(el.tagName==='INPUT'){ var L=el.value.length; try{ el.setSelectionRange(L,L) }catch(e){} } sysCaret(el) } }
  };
  /* đổi chế độ Fields/JSON giữ loại ticket; mở node khác thì đóng danh sách */
  var sn=selectNode; selectNode=function(){ FDP.open=false; return sn.apply(this,arguments) };
})();


var VX_IC_BAG='<path d="M6 7h12l-1 13H7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>';
var VX_CHEV='<path d="M6 9l6 6 6-6"/>';
SYS.bag=1;   /* không còn Túi biến: tránh tự cuộn khi vào ô Value lần đầu */

/* ---------- 1. Node lấy Method/URL/Query Parameters theo API đã chọn ---------- */
(function(){
  var sg=sysGet;
  sysGet=function(n){
    var h=sg(n), r=h.fsrc&&h.fsrc.t?fdFind(h.fsrc.t):null;
    if(r){
      h.method=r.t.m||h.method; h.url=r.t.url||'';
      if(h.qmode!=='json'){
        var ks=r.t.fields.map(function(f){return f.k}), cur=h.params.map(function(p){return String(p.name||'').trim()});
        if(ks.join('\n')!==cur.join('\n')){
          var by={}; h.params.forEach(function(p){ var k=String(p.name||'').trim(); if(k&&!by[k]) by[k]=p });
          h.params=ks.map(function(k){ var p=by[k]||{name:k,value:'',vars:[]}; p.name=k; if(!p.vars) p.vars=[]; return p });
        }
      }
    }
    return h;
  };
  /* đánh giá: không có API → 1 lỗi duy nhất; bỏ gợi ý "bấm Add Parameter" */
  var se=sysEval;
  sysEval=function(n){
    var st=se.apply(this,arguments), h=sysGet(n), has=h.fsrc&&h.fsrc.t, r=has?fdFind(h.fsrc.t):null;
    st.gen=st.gen.filter(function(g){ return !/Add Parameter/.test(g.m) });
    if(!r){
      st.url.err=has?[]:[tx('Chưa chọn API — chọn hệ thống và loại ticket cần gọi','No API selected — choose an API to call')];
      st.url.warn=[];
      if(h.qmode!=='json') st.rows=[];
    }
    var fd=st.fd||{err:[],warn:[]};
    st.errs=st.url.err.length+st.json.err.length+fd.err.length+st.rows.reduce(function(a,R){return a+(R.err.length?1:0)},0);
    st.warns=st.url.warn.length+st.json.warn.length+st.gen.length+fd.warn.length+st.rows.reduce(function(a,R){return a+(!R.err.length&&R.warn.length?1:0)},0);
    return st;
  };
})();

/* ---------- 2. Header: chỉ chọn header, gửi đủ mọi parameter đã khai báo ---------- */
function hdSel(ref){
  var o=hdById(ref.ref); if(!o) return {o:null,keys:[],gone:[]};
  return {o:o,keys:o.params.map(function(p){return p.k}),gone:[]};
}
function sysHdrFieldHTML(n,h){
  var ref=h.headers.filter(function(x){return x.ref})[0], o=ref?hdById(ref.ref):null;
  var bad=ref&&!o?tx('Header đã bị xoá khỏi danh mục Header dùng chung — chọn lại','The header was deleted from Shared headers — pick again'):o&&!o.on?tx('Header đã ngưng sử dụng — chọn header khác','The header is inactive — pick another one'):'';
  return '<div class="field hxf'+(bad?' bad':'')+'"><label for="hdpSel">Header</label>'+
    '<div class="hx-h" id="hdpWrap">'+
      '<button type="button" id="hdpSel" class="hx-sel'+(HDP.open?' open':'')+(ref?'':' empty')+'" aria-haspopup="listbox" aria-expanded="'+(HDP.open?'true':'false')+'" onclick="hdpOpen()">'+
        '<span class="hx-ic">'+svg(I.plug)+'</span>'+
        (ref?'<span class="hx-t"><b>'+esc(o?o.n:ref.ref)+'</b>'+(o?'<em>'+o.params.length+' parameter</em>':'')+'</span>'
            :'<span class="hx-t"><span class="ph">'+tx('Chọn header…','Choose a header…')+'</span></span>')+
        svg(VX_CHEV)+'</button>'+
      (ref?'<button type="button" class="xb hx-x" title="'+tx('Bỏ header','Remove header')+'" aria-label="'+tx('Bỏ header','Remove header')+'" onclick="hdpClear()">'+svg(I.x)+'</button>':'')+
      (HDP.open?'<div class="hdp-pop" role="listbox" aria-label="'+tx('Chọn header','Choose a header')+'">'+
        '<div class="hdp-s">'+svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')+'<input class="inp" id="hdpQ" value="'+esc(HDP.q)+'" placeholder="'+tx('Tìm theo tên hoặc key…','Search by name or key…')+'" autocomplete="off" oninput="hdpFind(this.value)"></div>'+
        '<div class="hdp-l" id="hdpList">'+hdpListHTML(n)+'</div>'+
        '<div class="hdp-f"><button class="link" onclick="hdpNew()">'+svg(I.plus)+tx('Khai báo header mới','Declare a new header')+'</button></div></div>':'')+
    '</div>'+(bad?'<div class="sys-m bad">'+svg(I.warn)+'<span>'+bad+'</span></div>':'')+'</div>';
}

/* ---------- 3. "Chọn API" ---------- */
function fdpHTML(n,st){
  var r=fdpSrc(n), h=sysGet(n), lost=h.fsrc&&h.fsrc.t&&!r, E=(st&&st.fd)||{err:[],warn:[]}, U=(st&&st.url)||{err:[],warn:[]};
  return '<div class="field fdp" id="fdpWrap"><label for="fdpTg">'+tx('Chọn API','Choose API')+'<span class="req">*</span></label>'+
    '<div class="fdp-row"><button type="button" class="fdp-tg api'+(FDP.open?' open':'')+(lost||(!r&&U.err.length)?' bad':'')+'" id="fdpTg" aria-haspopup="listbox" aria-expanded="'+FDP.open+'" onclick="fdpToggle()">'+
      (r?'<span class="fd-code">'+esc(r.s.c)+'</span><span class="fdp-sep">›</span><b>'+esc(r.t.n)+'</b>'+fdApiHTML(r.t)
        :'<span class="fdp-pl">'+(lost?tx('API đã bị xoá — chọn lại','The API was deleted — pick again'):tx('Chọn hệ thống và loại ticket…','Choose a system and ticket type…'))+'</span>')+
      '<span class="fdp-cv">'+svg(VX_CHEV)+'</span></button>'+
      (h.fsrc?'<button type="button" class="xb look" title="'+tx('Bỏ chọn','Clear')+'" aria-label="'+tx('Bỏ chọn API','Clear the API')+'" onclick="fdpClear()">'+svg(I.x)+'</button>':'')+'</div>'+
    (FDP.open?fdpPopHTML(n):'')+
    '<div id="fdpMsg">'+sysMsgs(E.err.concat(U.err),'bad')+sysMsgs(E.warn.concat(U.warn),'warn')+'</div></div>';
}
function fdpPopHTML(n){
  var u=wfUnit(DSN.id), S=fdSysOf(u), r=fdpSrc(n), cur=r?r.t.id:'';
  var s=FDP.s?fdSys(FDP.s):null;
  if(!s){
    return '<div class="fdp-pop" role="listbox" aria-label="'+tx('Hệ thống','Systems')+'"><div class="fdp-ph">'+tx('Hệ thống','Systems')+'</div>'+
      (S.length?S.map(function(x){
        var on=r&&r.s.id===x.id;
        return '<button type="button" class="fdp-i'+(on?' on':'')+'" onclick="fdpSys(\''+x.id+'\')"><span class="fd-code">'+esc(x.c)+'</span>'+
          '<span class="fdp-t"><b>'+esc(x.n)+'</b><span>'+x.tks.length+' API</span></span><span class="fdp-ch">'+svg(FD_CHR)+'</span></button>';
      }).join(''):'<div class="fdp-empty">'+tx(esc(unitName(u))+' chưa khai báo hệ thống nào ở màn Quản lý API.',esc(unitName(u))+' has no system in API management yet.')+'</div>')+'</div>';
  }
  return '<div class="fdp-pop" role="listbox" aria-label="'+esc(s.c)+'"><button type="button" class="fdp-back" onclick="fdpSys(\'\')">'+svg(FD_CHL)+'<span class="fd-code">'+esc(s.c)+'</span><b>'+esc(s.n)+'</b></button>'+
    (s.tks.length?s.tks.map(function(t){
      var on=t.id===cur;
      return '<button type="button" class="fdp-i tk'+(on?' on':'')+'" role="option" aria-selected="'+on+'" onclick="fdpApply(\''+t.id+'\')">'+
        '<span class="fdp-t"><b>'+esc(t.n)+'</b>'+fdApiHTML(t)+'</span>'+
        '<span class="fdp-n">'+t.fields.length+' field</span>'+(on?'<span class="fdp-ok">'+svg(I.check)+'</span>':'')+'</button>';
    }).join(''):'<div class="fdp-empty">'+tx('Hệ thống chưa khai báo API nào.','This system has no API yet.')+'</div>')+'</div>';
}
(function(){
  fdpClear=function(){
    var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n); delete h.fsrc; FDP.open=false; SYS.open=-1; markDirty(); renderNodes(); sysDraw();
    toast(tx('Đã bỏ chọn API','API cleared'),tx('Node chưa gọi được cho tới khi chọn lại API','The node cannot call anything until an API is chosen'));
  };
})();

/* ---------- 4. Panel cấu hình node ---------- */
function sysBagHTML(){ return '' }
inspSys=function(n){
  var h=sysGet(n), st=sysEval(n), X=DSN.exp, r=fdpSrc(n);
  var nm='<div class="field"><label for="sysNm">'+tx('Tên bước','Step name')+'</label><input class="inp" id="sysNm" value="'+esc(n.name)+'" oninput="setNodeName(this.value)"></div>';
  var o=X?'<div class="sys-g2h">'+nm+sysHdrFieldHTML(n,h)+'</div>':nm+sysHdrFieldHTML(n,h);
  o+='<div class="sys-sep"></div>'+
    '<div class="sys-sw"><div><b>Send Query Parameters</b><span>'+tx('Các tham số được nối vào URL dưới dạng query string','Parameters are appended to the URL as a query string')+'</span></div></div>'+
    '<div class="field"><label for="sysMode">Specify Query Parameters</label>'+
      '<select class="inp" id="sysMode" onchange="sysSetMode(this.value)">'+
      '<option value="fields"'+(h.qmode!=='json'?' selected':'')+'>Using Fields Below</option>'+
      '<option value="json"'+(h.qmode==='json'?' selected':'')+'>Using JSON</option></select>'+
      '<span class="hint">'+(h.qmode==='json'?tx('Khai toàn bộ tham số trong một JSON object','Declare every parameter in one JSON object'):tx('Mỗi field của API là một tham số, chọn Value cho từng tham số','Each API field is one parameter; choose a Value for each'))+
      tx('. Chỉ cách đang chọn được gửi đi.','. Only the selected way is sent.')+'</span></div>'+
    fdpHTML(n,st)+
    '<div id="sysGen">'+sysMsgs(st.gen.map(function(g){return g.m}),'warn')+'</div>';
  if(h.qmode==='json') o+=vxJsonHTML(sysJsonHTML(h,st));
  else if(!r) o+='<div class="qp-h"><b>Query Parameters</b></div><div class="qp-empty qp-api">'+svg(FD_IC)+
      '<span>'+tx('Chọn API ở trên — Query Parameters lấy đúng các field đã khai báo của API ở màn Quản lý API.','Choose an API above — Query Parameters follow the fields declared for the API in API management.')+'</span></div>';
  else o+='<div class="qp-h"><b>Query Parameters</b><span class="qp-c">'+h.params.length+'</span>'+
      '<button class="link" onclick="sysOpenAll()">'+(SYS.open===-1?tx('Bấm một dòng để chọn Value','Click a row to set its Value'):tx('Thu gọn','Collapse'))+'</button></div>'+
    (X&&h.params.length?'<div class="qp-th" aria-hidden="true"><span>Name</span><span>Value</span><span>Variable value</span><span></span></div>':'')+
    '<div class="qp-list">'+h.params.map(function(p,i){ return sysParamHTML(p,i,st) }).join('')+'</div>';
  o+='<div style="border-top:1px solid var(--line);padding-top:11px;margin-top:3px">'+
     '<button class="btn sm dgr" onclick="delNode()">'+svg(I.x)+tx('Xoá node này','Delete this node')+'</button></div>';
  return o;
};
function vxJsonHTML(s){
  return s.replace('oninput="sysIn(\'json\',-1,-1,this)"','data-k="json" data-i="-1" data-j="-1" oninput="sysIn(\'json\',-1,-1,this);vxInput(this)" onkeydown="vxKey(event,this)" onblur="vxBlur(this)"')
    .replace(/Giá trị dùng hằng số hoặc biến \{\{…\}\} từ Túi biến\./,'Giá trị dùng hằng số hoặc biến — gõ {{ để chọn biến.')
    .replace(/(Values?[^<]*?)(from the )?Variable bag\.?/,'$1— type {{ to pick a variable.');
}
sysParamHTML=function(p,i,st){
  var R=st.rows[i]||{err:[],warn:[],pick:[],entries:[]}, n=nodeById(DSN.sel), r=n&&fdpSrc(n);
  var nm=String(p.name||'').trim(), vl=String(p.value||'').trim(), f=r?fdpField(r,nm):null;
  if(SYS.open!==i){
    var first=R.err[0]||R.warn[0];
    return '<div class="qp'+sysRowCls(R)+'" id="qp_'+i+'"><button class="qp-row" onclick="sysOpen('+i+')" aria-expanded="false" aria-label="'+tx('Mở tham số ','Open parameter ')+esc(nm||(i+1))+'">'+
      (DSN.exp
        ?'<span class="qp-n mono" title="'+esc(nm+(f?' · '+f.n:''))+'">'+esc(nm)+'</span>'+
         '<span class="qp-v mono" title="'+esc(vl)+'">'+(vl?esc(vl):'<em>'+tx('(trống)','(empty)')+'</em>')+'</span>'+
         '<span class="qp-v2 mono" title="'+esc(p.vars.join(' → '))+'">'+(p.vars.length?esc(p.vars[0])+(p.vars.length>1?' +'+(p.vars.length-1):''):'<em>—</em>')+'</span>'+
         '<span class="qp-stc">'+sysIc(R,p)+'<span class="qp-chev">'+svg(SYS_IC.down)+'</span></span></button>'
        :'<span class="qp-n mono" title="'+esc(nm+(f?' · '+f.n:''))+'">'+esc(nm)+'</span><span class="qp-eq">=</span>'+
         '<span class="qp-v mono" title="'+esc(vl)+'">'+(vl?esc(vl):'<em>'+tx('(trống)','(empty)')+'</em>')+'</span>'+
         (p.vars.length?'<span class="qp-more" title="Variable value">+'+p.vars.length+'</span>':'')+sysIc(R,p)+
         '<span class="qp-chev">'+svg(SYS_IC.down)+'</span></button>')+
      '<div id="qpMsg_'+i+'">'+(first?sysMsgs([first],R.err.length?'bad':'warn'):'')+'</div></div>';
  }
  var fmsg=function(k){ return sysMsgs(R.err.filter(function(x){return x.f===k}),'bad')+sysMsgs(R.warn.filter(function(x){return x.f===k}),'warn') };
  return '<div class="qp open'+sysRowCls(R)+'" id="qp_'+i+'">'+
    '<div class="qp-ch"><button class="qp-tg" onclick="sysOpen(-1)" aria-expanded="true">'+svg(SYS_IC.up)+'<b class="mono">'+esc(nm)+'</b>'+
      (f?'<span class="fd-dt">'+esc(fdDtName(f.dt))+'</span><span class="qp-fn">'+esc(f.n)+'</span>':'')+'</button></div>'+
    '<div class="qp-b">'+(f&&f.mo?'<div class="qp-desc">'+esc(f.mo)+'</div>':'')+
    '<div id="qpF_'+i+'_n">'+fmsg('n')+'</div>'+
    '<div class="field"><label for="sysV_'+i+'">Value</label>'+
      vxInpHTML('sysV_'+i,p.value,'v',i,-1,tx('Chọn biến hoặc nhập giá trị cố định…','Pick a variable or type a fixed value…'),'Value '+tx('của ','of ')+nm)+
      '<div id="qpF_'+i+'_v">'+fmsg('v')+'</div></div>'+
    p.vars.map(function(w,j){
      return '<div class="field qp-vv"><label for="sysW_'+i+'_'+j+'">Variable value '+(j+1)+'</label>'+
        '<div class="qp-vvin">'+vxInpHTML('sysW_'+i+'_'+j,w,'w',i,j,tx('Giá trị dự phòng — chọn biến của cấp duyệt khác','Fallback value — pick a variable of another approval level'),'Variable value '+(j+1)+' '+tx('của ','of ')+nm)+
        '<button class="xb look" title="'+tx('Xoá Variable value ','Delete Variable value ')+(j+1)+'" aria-label="'+tx('Xoá Variable value ','Delete Variable value ')+(j+1)+'" onclick="sysDelVar('+i+','+j+')">'+svg(I.x)+'</button></div>'+
        '<div id="qpF_'+i+'_w'+j+'">'+fmsg('w'+j)+'</div></div>';
    }).join('')+
    '<div id="qpPaths_'+i+'">'+sysPathsHTML(R,st)+'</div>'+
    '<div class="qp-opt"><button class="btn xs" id="qpOpt_'+i+'" aria-haspopup="menu" aria-expanded="'+(SYS.menu===i)+'" onclick="event.stopPropagation();sysMenu('+i+')">'+svg(I.plus)+'Add option</button>'+
      (SYS.menu===i?'<div class="qp-menu" role="menu" onclick="event.stopPropagation()">'+
        '<button role="menuitem" id="qpMenu_'+i+'" onclick="sysAddVar('+i+')"><b>Variable value</b><span>'+tx('Giá trị dự phòng khi các giá trị phía trên rỗng — dùng cho biến chỉ có ở một số nhánh (mỗi cấp duyệt một dòng)','Fallback used when the values above are empty — for variables that exist only on some branches (one row per approval level)')+'</span></button></div>':'')+
    '</div></div></div>';
};
/* mở một dòng: đưa con trỏ vào ô Value (không tự bật danh sách) */
sysOpen=function(i){
  SYS.open=i; SYS.menu=null;
  if(i>=0){ SYS.focus={k:'v',i:i,j:-1}; SYS.caret=null } else SYS.focus=null;
  sysDraw();
  if(i>=0){ var box=document.getElementById('qp_'+i); sysReveal(box); var el=document.getElementById('sysV_'+i);
    if(el){ VX.quiet=1; el.focus({preventScroll:true}); VX.quiet=0; var L=el.value.length; try{ el.setSelectionRange(L,L) }catch(e){} sysCaret(el) } }
};
sysAddParam=function(){};
(function(){ var sd=sysDraw; sysDraw=function(){ vxClose(); return sd.apply(this,arguments) } })();

/* ---------- 5. Ô chọn biến (combobox) cho Value / Variable value / JSON ---------- */
var VX={el:null,items:[],act:-1,quiet:0};
function vxInpHTML(id,val,k,i,j,ph,aria){
  return '<div class="vx"><input class="inp mono vx-in" id="'+id+'" value="'+esc(val||'')+'" placeholder="'+esc(ph)+'" aria-label="'+esc(aria)+'" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="vxPop" autocomplete="off" spellcheck="false" '+
    'data-k="'+k+'" data-i="'+i+'" data-j="'+j+'" onfocus="sysFocus(\''+k+'\','+i+','+j+',this)" oninput="sysIn(\''+k+'\','+i+','+j+',this);vxInput(this)" onkeydown="vxKey(event,this)" onkeyup="sysCaret(this)" onclick="sysCaret(this);vxShow(this,1)" onblur="vxBlur(this)">'+
    '<button type="button" class="vx-tg" tabindex="-1" aria-label="'+tx('Mở danh sách biến','Open the variable list')+'" onmousedown="event.preventDefault()" onclick="vxTog(\''+id+'\')">'+svg(VX_CHEV)+'</button></div>';
}
function vxCtx(el){
  var v=el.value, c=(el.selectionStart===null||el.selectionStart===undefined)?v.length:el.selectionStart, pre=v.slice(0,c), a=pre.lastIndexOf('{{'), z=pre.lastIndexOf('}}');
  if(a>z){ var m=v.slice(c).match(/^[^{}\n]*?\}\}/); return {inb:1,q:pre.slice(a+2).trim(),s:a,e:c+(m?m[0].length:0)} }
  if(el.tagName!=='TEXTAREA'&&/^\s*\{\{[^{}]+\}\}\s*$/.test(v)) return {inb:0,whole:1,q:'',s:0,e:v.length,cur:v.trim().slice(2,-2).trim()};
  var b=z>=0?z+2:0; return {inb:0,plain:1,q:pre.slice(b).trim(),s:b,e:c};
}
function vxFieldDt(el){
  if(el.dataset.k!=='v'&&el.dataset.k!=='w') return '';
  var n=nodeById(DSN.sel), r=n&&fdpSrc(n), p=n&&sysGet(n).params[+el.dataset.i], f=r&&p?fdpField(r,String(p.name||'').trim()):null;
  return f?f.dt:'';
}
function vxDtOk(fd,vd){ if(!fd||fd==='string'||FD_DT.indexOf(fd)<0) return true; return fd===vd||(fd==='datetime'&&vd==='date') }
function vxShow(el,force){
  var n=nodeById(DSN.sel); if(!n||!el) return vxClose();
  var c=vxCtx(el), isTa=el.tagName==='TEXTAREA';
  if(isTa&&!c.inb&&!force) return vxClose();
  var q=gNorm(c.q), all=varsAt(n.id);
  var L=all.filter(function(v){ return !q||gNorm(v.v+' '+v.lbl).indexOf(q)>=0 });
  if(!L.length&&c.plain&&!force) return vxClose();
  VX.el=el; VX.items=L; VX.ctx=c;
  if(VX.act>=L.length||VX.act<0) VX.act=L.length?0:-1;
  if(c.whole&&!q){ var ci=L.map(function(v){return v.v}).indexOf(c.cur); if(ci>=0&&!VX.moved) VX.act=ci }
  var fdt=vxFieldDt(el), qq=c.q.toLowerCase();
  var mk=function(s){ if(!qq) return esc(s); var i=s.toLowerCase().indexOf(qq); return i<0?esc(s):esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+qq.length))+'</mark>'+esc(s.slice(i+qq.length)) };
  var groups=[], by={};
  L.forEach(function(v,k){ if(!by[v.g]){ by[v.g]=[]; groups.push(v.g) } by[v.g].push(k) });
  var body=groups.map(function(g){
    var x=L[by[g][0]];
    return '<div class="vx-g'+(x.always?'':' br')+'" role="presentation"><span>'+esc(x.gl)+'</span><em>'+(x.always?tx('luôn có','always'):svg(I.warn)+esc(x.cond))+'</em></div>'+
      by[g].map(function(k){ var v=L[k], cur=c.whole&&c.cur===v.v, ok=vxDtOk(fdt,v.dt);
        return '<div class="vx-i'+(k===VX.act?' on':'')+(cur?' cur':'')+(ok?'':' off')+'" role="option" id="vxo_'+k+'" aria-selected="'+(k===VX.act)+'"'+(ok?'':' title="'+tx('Khác kiểu dữ liệu của field','Differs from the field data type')+' ('+esc(fdDtName(fdt))+')"')+' onmousedown="event.preventDefault()" onmousemove="vxHover('+k+')" onclick="vxPick('+k+')">'+
          '<span class="vx-v mono">{{'+mk(v.v)+'}}</span><span class="prm-t">'+esc(DT[v.dt]||v.dt)+'</span>'+
          
          '<span class="vx-lb">'+esc(v.lbl)+'</span><span class="vx-mau mono">'+esc(v.mau)+'</span>'+
          (cur?'<span class="vx-ok">'+svg(I.check)+'</span>':'')+'</div>';
      }).join('');
  }).join('');
  var p=document.getElementById('vxPop');
  if(!p){ p=document.createElement('div'); p.id='vxPop'; p.className='vx-pop'; p.setAttribute('role','listbox'); document.body.appendChild(p) }
  p.innerHTML='<div class="vx-h">'+svg(VX_IC_BAG)+'<b>'+tx('Biến','Variables')+'</b><span class="qp-c">'+L.length+(q?'/'+all.length:'')+'</span>'+
      (fdt&&fdt!=='string'&&FD_DT.indexOf(fdt)>=0?'<span class="vx-ft">'+tx('Field kiểu ','Field type ')+'<b>'+esc(fdDtName(fdt))+'</b></span>':'')+'<em>'+(c.inb||c.plain&&q?tx('Đang tìm: ','Searching: ')+'<span class="mono">'+esc(c.q||'{{')+'</span>':tx('Gõ để tìm theo tên hoặc mô tả','Type to search by name or description'))+'</em></div>'+
    '<div class="vx-l" id="vxL">'+(body||'<div class="vx-empty">'+tx('Không có biến khớp ','No variable matches ')+'<b class="mono">'+esc(c.q)+'</b>'+(c.inb?'':tx(' — giá trị sẽ được gửi nguyên văn',' — the value is sent as typed'))+'</div>')+'</div>'+
    '<div class="vx-f"><span><kbd>↑</kbd><kbd>↓</kbd> '+tx('chọn','move')+'</span><span><kbd>Enter</kbd> '+tx('chèn','insert')+'</span><span><kbd>Esc</kbd> '+tx('đóng','close')+'</span></div>';
  el.setAttribute('aria-expanded','true'); el.closest('.vx')&&el.closest('.vx').classList.add('open');
  vxPlace(); vxScrollAct();
}
function vxPlace(){
  var p=document.getElementById('vxPop'), el=VX.el; if(!p||!el) return;
  if(!document.body.contains(el)) return vxClose();
  var r=el.getBoundingClientRect(), W=Math.min(Math.max(r.width,460),innerWidth-16), x=Math.min(r.left,innerWidth-W-8);
  p.style.width=W+'px'; p.style.left=Math.max(8,x)+'px';
  var h=p.offsetHeight, below=innerHeight-r.bottom-8, above=r.top-8;
  if(h>below&&above>below){ p.style.top=Math.max(8,r.top-4-Math.min(h,above))+'px'; p.classList.add('up') } else { p.style.top=(r.bottom+4)+'px'; p.classList.remove('up') }
  p.style.maxHeight=Math.max(180,Math.min(380,Math.max(below,above)))+'px';
}
function vxScrollAct(){ var o=document.getElementById('vxo_'+VX.act), l=document.getElementById('vxL'); if(o&&l){ var a=o.offsetTop-l.offsetTop, b=a+o.offsetHeight; if(a<l.scrollTop+28) l.scrollTop=Math.max(0,a-28); else if(b>l.scrollTop+l.clientHeight) l.scrollTop=b-l.clientHeight } }
function vxHover(k){ if(k===VX.act) return; var a=document.getElementById('vxo_'+VX.act), b=document.getElementById('vxo_'+k); if(a){ a.classList.remove('on'); a.setAttribute('aria-selected','false') } if(b){ b.classList.add('on'); b.setAttribute('aria-selected','true') } VX.act=k; VX.moved=1 }
function vxClose(){
  var p=document.getElementById('vxPop'); if(p) p.parentNode.removeChild(p);
  if(VX.el){ VX.el.setAttribute('aria-expanded','false'); var w=VX.el.closest&&VX.el.closest('.vx'); if(w) w.classList.remove('open') }
  VX.el=null; VX.items=[]; VX.act=-1; VX.moved=0;
}
function vxOpen(){ return !!document.getElementById('vxPop') }
function vxInput(el){ VX.moved=0; VX.act=0; vxShow(el,0) }
function vxTog(id){ var el=document.getElementById(id); if(!el) return; if(vxOpen()&&VX.el===el){ vxClose(); return } el.focus({preventScroll:true}); VX.moved=0; vxShow(el,1) }
function vxBlur(el){ setTimeout(function(){ if(VX.el===el&&document.activeElement!==el) vxClose() },150) }
function vxKey(e,el){
  var open=vxOpen()&&VX.el===el;
  if(!open){
    if((e.key==='ArrowDown'&&el.tagName!=='TEXTAREA')||(e.key===' '&&e.ctrlKey)){ e.preventDefault(); VX.moved=0; vxShow(el,1) }
    return;
  }
  var N=VX.items.length;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(!N) return; var k=VX.act<0?0:(VX.act+(e.key==='ArrowDown'?1:-1)+N)%N; vxHover(k); vxScrollAct() }
  else if(e.key==='Enter'){ if(VX.act>=0&&N){ e.preventDefault(); vxPick(VX.act) } }
  else if(e.key==='Tab') vxClose();
}
function vxPick(k){
  var v=VX.items[k], el=VX.el; if(!v||!el) return;
  var c=vxCtx(el), t='{{'+v.v+'}}', val=el.value;
  el.value=val.slice(0,c.s)+t+val.slice(c.e);
  var at=c.s+t.length; try{ el.setSelectionRange(at,at) }catch(e){}
  sysIn(el.dataset.k,+el.dataset.i,+el.dataset.j,el);
  vxClose(); el.focus({preventScroll:true}); try{ el.setSelectionRange(at,at) }catch(e){} sysCaret(el);
}
/* Esc đóng danh sách trước, không thu gọn chế độ Mở rộng */
window.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  if(vxOpen()){ e.preventDefault(); e.stopImmediatePropagation(); var el=VX.el; vxClose(); if(el) el.focus({preventScroll:true}); return }
  if(typeof HDP!=='undefined'&&HDP.open&&document.getElementById('hdpWrap')&&!document.getElementById('cfm')){ e.preventDefault(); e.stopImmediatePropagation(); hdpOpen(false); var b=document.getElementById('hdpSel'); if(b) b.focus(); return }
  if(typeof FDP!=='undefined'&&FDP.open&&document.getElementById('fdpWrap')&&!document.getElementById('cfm')){ e.preventDefault(); e.stopImmediatePropagation(); fdpClose(); var t=document.getElementById('fdpTg'); if(t) t.focus() }
},true);
document.addEventListener('scroll',function(){ if(vxOpen()) vxPlace() },true);
window.addEventListener('resize',function(){ if(vxOpen()) vxPlace() });
(function(){ var sn=selectNode; selectNode=function(){ vxClose(); return sn.apply(this,arguments) } })();

