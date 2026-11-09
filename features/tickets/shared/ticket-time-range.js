/* Time range of Manage Ticket lists (FSD MTK-BR-041, Vietnam time UTC+7). Shared by the employee and manager frames. */
var TkRange=(function(){
 function vn(now){return new Date(now.getTime()+(7*60+now.getTimezoneOffset())*60000)}
 function day(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
 function parse(s){var m=String(s||'').match(/^(\d{2})\/(\d{2})\/(\d{4})/);return m?new Date(+m[3],+m[2]-1,+m[1]):null}
 function start(label,now){
  var t=day(vn(now||new Date())),y=t.getFullYear(),m=t.getMonth(),d=t.getDate();
  if(label==='This month')return new Date(y,m,1);
  if(label==='Last 90 days')return new Date(y,m,d-89);
  if(label==='Last 30 days')return new Date(y,m,d-29);
  if(label==='This quarter')return new Date(y,Math.floor(m/3)*3,1);
  if(label==='This year')return new Date(y,0,1);
  return null; /* All time */
 }
 /* dateStr = dd/mm/yyyy [hh:mm]; true when it falls from the start of the range up to today */
 function within(dateStr,label,now){
  var s=start(label,now);if(!s)return true;
  var d=parse(dateStr);if(!d)return false;
  return d>=s&&d<=day(vn(now||new Date()));
 }
 return {start:start,within:within,parse:parse};
})();
