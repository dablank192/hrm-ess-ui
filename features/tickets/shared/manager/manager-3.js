/* Task Q261106-1715 (11/2026) — FSD ManageTicket 0.23. Loaded after manager-2.js; wraps functions of manager.js / manager-2.js.
   Badge Approval (MTK-BR-045), Approval filters (MTK-BR-041, MTK-EVT-039), delegation validation (MTK-BR-026, BR-027, BR-043). */

/*MT-PURE-START*/
var MT_MSG={m024:'Select a delegate and both dates.',m025:'To date must not be earlier than From date.',m052:'To date must not be earlier than today.',
 m050:'Select at least one ticket type.',m051:'This person cannot be selected as a delegate.',m054:'Maximum 1,000 characters.',
 m048:'A delegation already exists for these ticket types in this period. Change the scope or the dates.'};
function mtBadge(n){return n>99?'99+':String(n)}
function mtD2I(v){var p=String(v).split('/');return p[2]+'-'+p[1]+'-'+p[0]}
/* 'All ticket types' -> null (every type); 'Selected ticket types: A, B' -> ['A','B'] */
function mtScopeSet(scope){if(!scope||scope==='All ticket types')return null;var i=scope.indexOf(':');return(i<0?'':scope.slice(i+1)).split(',').map(function(s){return s.trim()}).filter(Boolean)}
function mtScopesOverlap(a,b){var x=mtScopeSet(a),y=mtScopeSet(b);if(!x||!y)return true;return x.some(function(t){return y.indexOf(t)>=0})}
/* Two delegations of one delegator overlap when scopes intersect and the date ranges intersect, both boundary days included (BR-043 ④) */
function mtDelegOverlap(list,owner,scope,fromIso,untilIso,skip){
 return list.some(function(g){return g!==skip&&g.of===owner&&(g.st==='soon'||g.st==='active')&&mtScopesOverlap(g.scope,scope)&&mtD2I(g.from)<=untilIso&&fromIso<=mtD2I(g.until)});
}
/* Validation of Create (BR-026) and Edit (BR-027). o = {edit,delegate,account,fromIso,untilIso,scope,scopeMissing,reason,todayIso,meId,allowed,blocked,list,owner,skip}. Returns '' when valid. */
function mtDelegCheck(o){
 if(!o.edit&&(!o.delegate||!o.fromIso||!o.untilIso))return MT_MSG.m024;
 if(o.edit&&!o.untilIso)return MT_MSG.m024;
 if(o.untilIso<o.fromIso)return MT_MSG.m025;
 if(o.untilIso<o.todayIso)return MT_MSG.m052;
 if(!o.edit){
  if(o.scopeMissing)return MT_MSG.m050;
  if(!o.account||o.account===o.meId||o.allowed.indexOf(o.account)<0||o.blocked.indexOf(o.account)>=0)return MT_MSG.m051;
  if((o.reason||'').length>1000)return MT_MSG.m054;
 }
 if(mtDelegOverlap(o.list,o.owner,o.scope,o.fromIso,o.untilIso,o.skip))return MT_MSG.m048;
 return '';
}
/*MT-PURE-END*/

var MT_DELEG_BLOCKED=[]; /* accounts locked in PX: the Delegate list comes from PX and already excludes them; kept to enforce MSG-051 when the API receives one */
function mtTodayIso(){var t=new Date(Date.now()+(7*60+new Date().getTimezoneOffset())*60000);return t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2)}

/* ---- Badge Approval: always the number of tickets waiting for this user, never the filtered / searched count ---- */
mergeCount=function(){mergeSend('count',{total:mergeAllQueue.length})};
window.addEventListener('message',function(e){if(e.source===parent&&e.data&&e.data.merge&&e.data.type==='recount')mergeCount()});
(function(){
 var d0=decide;decide=function(){var r=d0.apply(this,arguments);mergeCount();return r};
 var b0=mergeBulkResult;mergeBulkResult=function(){var r=b0.apply(this,arguments);mergeCount();return r};
 var c0=closeDrawer;closeDrawer=function(){var r=c0.apply(this,arguments);mergeCount();return r};
})();

/* ---- Sample Processed dates are fixed in the source (Aug/Sep 2026); move them so the newest is yesterday and the default "Last 30 days" shows data ---- */
(function(){
 function p2(n){return(n<10?'0':'')+n}
 var max=null;LICHSU.forEach(function(l){var d=TkRange.parse(l.xl);if(d&&(!max||d>max))max=d});
 if(!max)return;var y=new Date();y=new Date(y.getFullYear(),y.getMonth(),y.getDate()-1);var off=Math.round((y-max)/86400000);if(off<=0)return;
 function shift(s){var d=TkRange.parse(s);if(!d)return s;d=new Date(d.getFullYear(),d.getMonth(),d.getDate()+off);return p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+d.getFullYear()+String(s).slice(10)}
 LICHSU.forEach(function(l){l.xl=shift(l.xl);l.ct=shift(l.ct)});
})();

/* ---- Approval filters ---- */
var mtF={type:'',result:'',range:'Last 30 days'};
function mtSet(k,v){mtF[k]=v;HPG.cho.page=1;HPG.xong.page=1;hvRefresh()}
function mtOpt(value,label,sel){return'<option value="'+esc(value)+'"'+(sel?' selected':'')+'>'+esc(label)+'</option>'}
function mtSelect(label,key,items){
 return'<select class="inp" aria-label="'+label+'" onchange="mtSet(\''+key+'\',this.value)">'+items.map(function(i){return mtOpt(i[0],label+': '+i[1],mtF[key]===i[0])}).join('')+'</select>';
}
var mtBodyPrev=hvBody;
hvBody=function(){
 var q0=QUEUE,l0=LICHSU,html;
 if(hvTab==='cho'&&mtF.type&&!mergeAllQueue.some(function(q){return q.lo===mtF.type}))mtF.type='';
 try{
  if(hvTab==='cho'&&mtF.type)QUEUE=q0.filter(function(q){return q.lo===mtF.type});
  if(hvTab==='xong')LICHSU=l0.filter(function(l){return(!mtF.result||l.st===mtF.result)&&TkRange.within(l.xl,mtF.range)});
  html=mtBodyPrev();
 }finally{QUEUE=q0;LICHSU=l0}
 /* the numbers in "Pending approval (n)" / "Processed (n)" do not depend on the filters */
 html=html.replace(/Pending approval \(\d+\)/g,'Pending approval ('+mergeAllQueue.length+')').replace(/Processed \(\d+\)/g,'Processed ('+l0.length+')');
 html=html.replace(/<select class="inp" aria-label="(Ticket type|Result|Time range)">[\s\S]*?<\/select>/g,function(m,label){
  if(label==='Ticket type'){
   var types=mergeAllQueue.map(function(q){return q.lo}).filter(function(v,i,a){return a.indexOf(v)===i}).sort(function(a,b){return a.localeCompare(b)});
   return mtSelect('Ticket type','type',[['','All']].concat(types.map(function(t){return[t,t]})));
  }
  if(label==='Result')return mtSelect('Result','result',[['','All'],['duyet','Approved'],['tuchoi','Rejected']]);
  return mtSelect('Time range','range',['Last 30 days','This quarter','This year'].map(function(r){return[r,r]}));
 });
 return html;
};

/* ---- Delegation validation (Create + Edit) ---- */
mergeDelegSave=function(){
 var g=function(id){return document.getElementById(id)},to=g('dgNewTo').value,scope=dgScopeText(),from=g('dgNewFrom').value,until=g('dgNewUntil').value,ly=g('dgNewReason').value.trim(),err=g('dgNewErr');
 var parts=to.indexOf('Select')>=0?['','']:to.split(' - '),allowed=Array.prototype.map.call(g('dgNewTo').options,function(o){return(o.value.split(' - ')[1]||'')}).filter(Boolean);
 var msg=mtDelegCheck({edit:false,delegate:parts[0],account:parts[1],fromIso:from,untilIso:until,scope:scope,
  scopeMissing:g('dgNewScope').value==='Selected ticket types'&&scope==='Selected ticket types',reason:ly,todayIso:mtTodayIso(),meId:ME.id,
  allowed:allowed,blocked:MT_DELEG_BLOCKED,list:DELEG,owner:ME.name});
 if(msg){err.textContent=msg;return}
 err.textContent='';
 DELEG.push({of:ME.name,ofr:ME.title,ofa:ME.id,to:parts[0],toa:parts[1],tor:'',from:iso2dmy(from),until:iso2dmy(until),scope:scope,st:'active',ly:ly});
 delegRecalc();mergeDelegClose(false);go('uy-quyen');document.getElementById('createDelegationTrigger')?.focus();toast('Delegation created');
};
mergeDelegEditResult=function(data){
 var pending=mergeDelegEditPending;if(!pending||data.requestId!==pending.requestId)return;
 mergeDelegEditPending=null;
 if(!data.save){pending.trigger?.focus();return}
 var record=DELEG[pending.index];if(record!==pending.record||record.st==='cancelled'){toast('Delegation is no longer editable');return}
 var msg=mtDelegCheck({edit:true,fromIso:dmy2iso(record.from),untilIso:data.until,scope:record.scope,todayIso:mtTodayIso(),list:DELEG,owner:record.of,skip:record});
 if(msg){toast('Delegation not updated',msg);return}
 record.until=iso2dmy(data.until);delegRecalc();go('uy-quyen');
 document.querySelectorAll('#view tbody tr')[pending.index]?.querySelector('button')?.focus();toast('Delegation updated','To date '+record.until);
};
