// Start node (optional) and workflow without Start — FSD Workflow Management v0.8.14+ (TKM-BR-010, TKM-BR-014, TKM-BR-089).
// The Webhook node and the Trigger node chooser were removed from phase 1 (BA NamDH76, 05/11/2026).
/* =====================================================================
   First node of a workflow: the Start node if present; otherwise the only node without an incoming link (TKM-BR-089)
   ===================================================================== */
function isTrigger(n){ return n.t==='start' }
function startNodeId(){
  var d=def(); if(!d) return null;
  var s=d.nodes.filter(function(n){return n.t==='start'})[0]; if(s) return s.id;
  var first=d.nodes.filter(function(n){ return !d.links.some(function(l){return l.to===n.id}) });
  return first.length===1?first[0].id:null;
}

/* TKM-BR-014 / TKM-BR-089: without a Start node exactly one node may have no incoming link; more than one blocks publishing */
(function(){
  var fe=flowErrors;
  flowErrors=function(){
    var r=fe.apply(this,arguments), d=def(), N=d.nodes;
    if(!N.length||N.some(function(n){return n.t==='start'})) return r;
    var noIn=N.filter(function(n){ return !d.links.some(function(l){return l.to===n.id}) });
    r=r.filter(function(e){ return !(/incoming/i.test(e.m)&&noIn.indexOf(e.n)>=0) });
    if(noIn.length>1) noIn.forEach(function(n){ r.push({n:n,m:tx('Quy trình có nhiều hơn một node không có đường vào','More than one node has no incoming link'),flow:1}) });
    return r;
  };
})();

/* ---- v62b: nút thùng rác trên node (hover), giống n8n, chỉ một nút ---- */
(function(){
  var nh2=nodeHTML;
  nodeHTML=function(n){
    var h=nh2.apply(this,arguments);
    return h.slice(0,-6)+'<div class="nd-tb" onmousedown="event.stopPropagation()" ondblclick="event.stopPropagation()"><button type="button" title="'+tx('Xoá node','Delete node')+'" aria-label="'+tx('Xoá node','Delete node')+'" onclick="event.stopPropagation();DSN.sel=\''+n.id+'\';delNode()">'+svg(I.trash)+'</button></div></div>';
  };
  if(typeof renderNodes==='function'){ try{ renderNodes() }catch(e){} }
})();

/* =====================================================================
   Sample workflow "Employee Profile Update": no Start node, begins at the Approval step.
   The ticket is created by the ESS backend when ESS Profile sends a change request (TKM-BR-089, MTK-BR-049).
   ===================================================================== */
(function(){
  var id='profile-update';
  if(DEFS[id]||WFS.some(function(w){return w.id===id})) return;
  WFS.push({id:id,n:'Employee Profile Update',v:1,pub:1,st:'run',own:'BA HR',luot:0,upd:'30/10/2026 18:00',run:0,don:'Profile Update',g:'nhan-su',donvi:'fsoft',phamVi:['fsoft'],
    note:'No Start node: the ESS backend creates the ticket when ESS Profile sends a change request. HR approves; the backend then writes the data to the target system',
    vers:[{v:1,t:'30/10/2026 18:00',w:'admin',s:'pub',note:'First version (sample)'}]});
  var form=[{k:'quyetDinh',l:tx('Quyết định','Decision'),t:'radio',r:1,o:tx('Duyệt\nTừ chối','Approve\nReject')},
            {k:'yKien',l:tx('Ý kiến của người duyệt','Approver comment'),t:'area',h:tx('Bắt buộc khi Từ chối','Required when rejecting')}];
  var task={id:'p2',t:'task',x:60,y:200,name:tx('HR duyệt thay đổi hồ sơ','HR approves profile change'),sla:24,bosung:0,multi:'any',auto:1,
    form:form,_lo:['quyetDinh','yKien'],
    ap:{acc:'',hoTen:'',main:'ug',cap:1,code:'CAN_BO_NS',prio:[{k:'ug',code:'CAN_BO_NS'}]}};
  if(typeof apSync==='function') apSync(task);
  DEFS[id]={n:'Employee Profile Update',v:1,pub:1,
    nodes:[
      task,
      {id:'p4',t:'end',x:360,y:120,name:tx('Kết thúc — Đã duyệt','End — Approved'),kq:'duyet'},
      {id:'p5',t:'end',x:360,y:300,name:tx('Kết thúc — Từ chối','End — Rejected'),kq:'tuchoi'}],
    links:[{f:'p2',to:'p4',lbl:tx('Duyệt','Approve')},{f:'p2',to:'p5',lbl:tx('Từ chối','Reject')}]};
  var _lv=wfById('leave-approval-demo'); if(_lv) _lv.sysStarted=2;  /* demo: 2 in-progress tickets already sent data to another system */
  var _pw=wfById(id); if(_pw) _pw.updProf=1;                          /* demo: 1 ticket at "Updating profile" is kept when publishing with the Cancel option */
  try{ renderNodes() }catch(e){}
})();
