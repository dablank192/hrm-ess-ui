/* Functional additions from admin_ver57_EN. ESS shell, original inline scripts, palette and layout are retained. */

var I_UP='<path d="M12 19V6M6 12l6-6 6 6"/>', I_DN='<path d="M12 5v13M6 12l6 6 6-6"/>';

function apMig(a){                            /* dữ liệu cũ (main + prio) → một danh sách nguồn có tick */
  var L=[], add=function(k,on,p){ if(L.some(function(x){return x.k===k})) return; var o={k:k,on:on?1:0}; if(k==='rt') o.cap=(p&&p.cap)||a.cap||1; if(k==='ug') o.code=(p&&p.code)||a.code||''; L.push(o) };
  if(a.main==='fx'){ add('fx',1); add('mt',0); add('rt',0); add('ug',0) }
  else {
    add(a.main,1,a.main==='rt'?{cap:a.cap}:a.main==='ug'?{code:a.code}:null);
    (a.prio||[]).forEach(function(p){ if(p.k===a.main) return; var code=p.code||(p.k==='ug'?a.code:''); add(p.k,p.k==='ug'?!!code:1,p) });
    ['mt','rt','ug'].forEach(function(k){ add(k,0) }); add('fx',0);
  }
  a.list=apNorm(L); return a;
}
function apX(n){ var a=apGet(n); return a.list?a:apMig(a) }
(function(){ var old=apGet; apGet=function(n){ var a=old(n); return a.list?a:apMig(a) } })();
function apNorm(L){ return L.filter(function(x){return x.on}).concat(L.filter(function(x){return !x.on})) }
function apWho(n){
  var a=apX(n), on=a.list.filter(function(x){return x.on}); if(!on.length) return tx('Chưa chọn người duyệt','No approver source');
  var f=on[0];
  if(f.k==='fx'){ var u=userBy(a.acc); return (u?u.n:(a.hoTen||tx('Chưa chỉ định','Not set')))+(a.acc?' · '+a.acc:'') }
  return apShort(f.k,f)+(on.length>1?' +'+(on.length-1):'');
}
function apErrors(n){
  var a=apX(n), e=[], on=a.list.filter(function(x){return x.on});
  if(!on.length) e.push(tx('Chưa chọn nguồn người duyệt nào','No approver source is selected'));
  on.forEach(function(p){
    if(p.k==='fx'){
      var u=userBy(a.acc);
      if(!a.acc) e.push(tx('Chưa nhập account người duyệt đích danh','Named approver account is empty'));
      else if(!u) e.push(tx('Account “'+a.acc+'” không có trong danh bạ','Account “'+a.acc+'” is not in the directory'));
      else if(uStat(u.u)==='left') e.push(tx('Người duyệt đích danh đã nghỉ việc','The named approver has left the company'));
      else if(uStat(u.u)==='locked') e.push(tx('Account người duyệt đích danh đang bị khoá','The named approver account is locked'));
    }
    if(p.k==='ug'&&!p.code) e.push(tx('User Group chưa chọn vai trò','User Group has no role selected'));
  });
  return e;
}
function apResolve(n,sub,date,wf,extra){
  var a=apX(n), final=[], used='';
  a.list.some(function(p){
    if(!p.on) return false;
    var r=p.k==='fx'?(a.acc?[a.acc]:[]):p.k==='mt'?apMt(sub,date,wf,extra).list:p.k==='rt'?apRt(p.cap||1,sub).list:apUg(p.code,sub).list;
    r=r.filter(function(x){ return !badReason(x,sub) });
    if(r.length){ final=r; used=p.k; return true } return false;
  });
  var dl=[];
  final=final.map(function(x){ var d=delegOf(x,date,wf); if(d&&!badReason(d.to,sub)){ dl.push({from:x,to:d.to}); return d.to } return x });
  return {final:final,used:used,deleg:dl,queue:!final.length};
}
function ugUsage(code){
  var out=[];
  Object.keys(DEFS).forEach(function(k){ approvalNodes(k).forEach(function(n){
    if(apX(n).list.some(function(p){ return p.on&&p.k==='ug'&&p.code===code })) out.push(DEFS[k].n+' · '+n.name) }) });
  return out;
}
function apTog(k,on){
  var n=apNode(); if(!n) return; var a=apX(n), L=a.list, it=L.filter(function(x){return x.k===k})[0]; if(!it) return;
  L.splice(L.indexOf(it),1); it.on=on?1:0;
  var nOn=L.filter(function(x){return x.on}).length;
  L.splice(on?nOn:L.length,0,it);              /* tick: xếp cuối nhóm đã chọn · bỏ tick: xuống cuối danh sách */
  a.list=apNorm(L);
  apChange(n,(on?tx('chọn nguồn ','add source '):tx('bỏ nguồn ','remove source '))+apSrcName(k));
}
function apMv(i,d){
  var n=apNode(); if(!n) return; var L=apX(n).list, j=i+d;
  if(j<0||!L[j]||!L[j].on||!L[i].on) return;
  var t=L[i]; L[i]=L[j]; L[j]=t; apChange(n,tx('thứ tự ưu tiên','priority order'));
}
function apPar(k,f,v){
  var n=apNode(); if(!n) return; var it=apX(n).list.filter(function(x){return x.k===k})[0]; if(!it) return;
  it[f]=v; apChange(n,apSrcName(k)+' · '+(k==='rt'?capName(v):posName(v)));
}
function inspTask(n){
  var a=apX(n), L=a.list, nOn=L.filter(function(x){return x.on}).length;
  var h='<div class="field"><label>'+tx('Người duyệt','Approver')+'</label><div class="apx" role="list" aria-label="'+tx('Nguồn người duyệt theo thứ tự ưu tiên','Approver sources in priority order')+'">';
  L.forEach(function(p,i){
    var on=!!p.on, body='';
    if(on&&p.k==='rt') body=apCapSel(p.cap,"apPar('rt','cap',+this.value)");
    if(on&&p.k==='ug') body=apPosSel(p.code,"apPar('ug','code',this.value)",!p.code);
    if(on&&p.k==='fx'){
      var u=userBy(a.acc), err='';
      if(a.acc&&!u) err=tx('Account không có trong danh bạ','Account is not in the directory');
      else if(u&&uStat(u.u)==='left') err=tx('Người này đã nghỉ việc','This person has left the company');
      else if(u&&uStat(u.u)==='locked') err=tx('Account đang bị khoá','Account is locked');
      body='<datalist id="apUsers">'+USERS.filter(function(x){return uStat(x.u)==='on'}).map(function(x){ return '<option value="'+esc(x.n+' · '+x.u)+'">' }).join('')+'</datalist>'+
        '<div class="ap-fxg"><div class="field"><label for="ap_nm">'+tx('Họ tên','Full name')+' <span style="color:var(--danger)">*</span></label>'+
        '<input class="inp" id="ap_nm" list="apUsers" value="'+esc(a.hoTen||'')+'" placeholder="'+tx('Gõ họ tên…','Type a name…')+'" autocomplete="off" onchange="apFixed(\'nm\',this.value)"></div>'+
        '<div class="field"><label for="ap_acc">Account <span style="color:var(--danger)">*</span></label>'+
        '<input class="inp mono'+(err?' bad':'')+'" id="ap_acc" list="apUsers" value="'+esc(a.acc||'')+'" placeholder="'+tx('Ví dụ: haptt','e.g. haptt')+'" autocomplete="off" onchange="apFixed(\'acc\',this.value)">'+
        (err?'<span class="hint" style="color:var(--danger)">'+esc(err)+'</span>':'')+'</div></div>';
    }
    h+='<div class="apx-r'+(on?' on':'')+'" role="listitem">'+
      '<label class="apx-ck"><input type="checkbox"'+(on?' checked':'')+' onchange="apTog(\''+p.k+'\',this.checked)">'+
        (on?'<span class="idx">'+(i+1)+'</span>':'')+'<b>'+apSrcName(p.k)+'</b></label>'+
      (on?'<div class="ap-btns"><button class="xb" title="'+tx('Lên','Up')+'" aria-label="'+tx('Đưa ','Move ')+apSrcName(p.k)+tx(' lên',' up')+'" onclick="apMv('+i+',-1)"'+(i===0?' disabled':'')+'>'+svg(I_UP)+'</button>'+
        '<button class="xb" title="'+tx('Xuống','Down')+'" aria-label="'+tx('Đưa ','Move ')+apSrcName(p.k)+tx(' xuống',' down')+'" onclick="apMv('+i+',1)"'+(i>=nOn-1?' disabled':'')+'>'+svg(I_DN)+'</button></div>':'')+
      (body?'<div class="apx-b">'+body+'</div>':'')+'</div>';
  });
  h+='</div>'+(nOn?'':'<span class="hint" style="color:var(--danger)">'+tx('Chọn ít nhất một nguồn người duyệt','Select at least one approver source')+'</span>')+'</div>';
  return h;
}



/* ---------------- 6. Import Excel: tệp mẫu .xlsx + đọc .xlsx ---------------- */
var XL={crc:null};
function xlCrc(u8){
  if(!XL.crc){ XL.crc=new Uint32Array(256); for(var n=0;n<256;n++){ var c=n; for(var k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; XL.crc[n]=c>>>0 } }
  var c=0xFFFFFFFF; for(var i=0;i<u8.length;i++) c=XL.crc[(c^u8[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0;
}
function xlZip(files){   /* files: [[tên, chuỗi]] → Blob .xlsx (zip, không nén) */
  var enc=new TextEncoder(), parts=[], cen=[], off=0;
  var u16=function(v){ return [v&255,(v>>8)&255] }, u32=function(v){ return [v&255,(v>>8)&255,(v>>16)&255,(v>>>24)&255] };
  files.forEach(function(f){
    var nm=enc.encode(f[0]), d=enc.encode(f[1]), crc=xlCrc(d);
    var lh=new Uint8Array([].concat([0x50,0x4b,3,4],u16(20),u16(0x0800),u16(0),u16(0),u16(0x21),u32(crc),u32(d.length),u32(d.length),u16(nm.length),u16(0)));
    parts.push(lh,nm,d);
    cen.push(new Uint8Array([].concat([0x50,0x4b,1,2],u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(0x21),u32(crc),u32(d.length),u32(d.length),u16(nm.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(off))),nm);
    off+=lh.length+nm.length+d.length;
  });
  var cs=0; cen.forEach(function(x){ cs+=x.length });
  var end=new Uint8Array([].concat([0x50,0x4b,5,6],u16(0),u16(0),u16(files.length),u16(files.length),u32(cs),u32(off),u16(0)));
  return new Blob(parts.concat(cen,[end]),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function xlX(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function xlCol(i){ var s=''; i++; while(i>0){ var m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26) } return s }
/* sheets: [{name, rows:[[...]], widths:[...], head:[chỉ số dòng tiêu đề], textCols:true, freeze:true}] */
function xlBuild(sheets){
  var NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main', R='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  var files=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+
      sheets.map(function(s,i){ return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' }).join('')+'</Types>'],
    ['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="'+R+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="'+NS+'" xmlns:r="'+R+'"><sheets>'+sheets.map(function(s,i){ return '<sheet name="'+xlX(s.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>' }).join('')+'</sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
      sheets.map(function(s,i){ return '<Relationship Id="rId'+(i+1)+'" Type="'+R+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>' }).join('')+
      '<Relationship Id="rId'+(sheets.length+1)+'" Type="'+R+'/styles" Target="styles.xml"/></Relationships>'],
    ['xl/styles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="'+NS+'">'+
      '<fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="12"/><color rgb="FF101828"/><name val="Arial"/></font></fonts>'+
      '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0968D2"/><bgColor indexed="64"/></patternFill></fill></fills>'+
      '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFC4CCD5"/></left><right style="thin"><color rgb="FFC4CCD5"/></right><top style="thin"><color rgb="FFC4CCD5"/></top><bottom style="thin"><color rgb="FFC4CCD5"/></bottom><diagonal/></border></borders>'+
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
      '<cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'+
      '<xf numFmtId="49" fontId="1" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>'+
      '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'+
      '<xf numFmtId="49" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'+
      '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>'+
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>']];
  sheets.forEach(function(s,i){
    var cols=(s.widths||[]).map(function(w,c){ return '<col min="'+(c+1)+'" max="'+(c+1)+'" width="'+w+'" customWidth="1"'+(s.textCols?' style="2"':'')+'/>' }).join('');
    var rows=s.rows.map(function(r,ri){
      var st=(s.head||[]).indexOf(ri)>=0?1:(s.title||[]).indexOf(ri)>=0?4:(s.box&&ri>=s.box[0]&&ri<=s.box[1]?3:2);
      return '<row r="'+(ri+1)+'"'+(st===1?' ht="22" customHeight="1"':'')+'>'+r.map(function(v,ci){
        if(v===''||v==null) return st===3||st===1?'<c r="'+xlCol(ci)+(ri+1)+'" s="'+st+'"/>':'';
        return '<c r="'+xlCol(ci)+(ri+1)+'" s="'+st+'" t="inlineStr"><is><t xml:space="preserve">'+xlX(v)+'</t></is></c>' }).join('')+'</row>';
    }).join('');
    files.push(['xl/worksheets/sheet'+(i+1)+'.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="'+NS+'">'+
      (s.freeze?'<sheetViews><sheetView workbookViewId="0"'+(i===0?' tabSelected="1"':'')+'><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>':'<sheetViews><sheetView workbookViewId="0"/></sheetViews>')+
      (cols?'<cols>'+cols+'</cols>':'')+'<sheetData>'+rows+'</sheetData></worksheet>']);
  });
  return xlZip(files);
}
function xlSave(name,blob){
  try{ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove() },800) }catch(e){}
}
/* đọc .xlsx (zip) → mảng dòng của trang tính đầu tiên */
function xlRead(buf){
  var dv=new DataView(buf), u8=new Uint8Array(buf), dec=new TextDecoder('utf-8');
  var e=-1; for(var i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){ if(dv.getUint32(i,true)===0x06054b50){ e=i; break } }
  if(e<0) return Promise.reject(new Error('zip'));
  var cnt=dv.getUint16(e+10,true), p=dv.getUint32(e+16,true), ent={};
  for(var k=0;k<cnt;k++){
    if(dv.getUint32(p,true)!==0x02014b50) break;
    var meth=dv.getUint16(p+10,true), cs=dv.getUint32(p+20,true), nl=dv.getUint16(p+28,true), xl=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), lo=dv.getUint32(p+42,true);
    var nm=dec.decode(u8.subarray(p+46,p+46+nl));
    var ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);
    ent[nm]={m:meth,d:u8.subarray(ds,ds+cs)};
    p+=46+nl+xl+cl;
  }
  var get=function(n){
    var x=ent[n]; if(!x) return Promise.resolve('');
    if(x.m===0) return Promise.resolve(dec.decode(x.d));
    if(typeof DecompressionStream==='undefined') return Promise.reject(new Error('inflate'));
    return new Response(new Blob([x.d]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer().then(function(b){ return dec.decode(b) });
  };
  var P=new DOMParser(), xml=function(t){ return P.parseFromString(t||'<x/>','application/xml') };
  return Promise.all([get('xl/workbook.xml'),get('xl/_rels/workbook.xml.rels'),get('xl/sharedStrings.xml')]).then(function(r){
    var wb=xml(r[0]), rel=xml(r[1]), sh=wb.getElementsByTagName('sheet')[0], target='worksheets/sheet1.xml';
    if(sh){ var id=sh.getAttribute('r:id')||sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
      [].slice.call(rel.getElementsByTagName('Relationship')).forEach(function(x){ if(x.getAttribute('Id')===id) target=x.getAttribute('Target') }) }
    var path=target.charAt(0)==='/'?target.slice(1):'xl/'+target.replace(/^\.\//,'');
    var ss=[].slice.call(xml(r[2]).getElementsByTagName('si')).map(function(si){ return [].slice.call(si.getElementsByTagName('t')).map(function(t){return t.textContent}).join('') });
    return get(path).then(function(t){
      var out=[];
      [].slice.call(xml(t).getElementsByTagName('row')).forEach(function(row){
        var ri=(+row.getAttribute('r')||out.length+1)-1, a=[];
        [].slice.call(row.getElementsByTagName('c')).forEach(function(c){
          var ref=c.getAttribute('r')||'', col=0, m=ref.match(/^[A-Z]+/);
          if(m) for(var j=0;j<m[0].length;j++) col=col*26+(m[0].charCodeAt(j)-64);
          col=m?col-1:a.length;
          var ty=c.getAttribute('t'), v=c.getElementsByTagName('v')[0], val='';
          if(ty==='s') val=v?(ss[+v.textContent]||''):'';
          else if(ty==='inlineStr') val=[].slice.call(c.getElementsByTagName('t')).map(function(x){return x.textContent}).join('');
          else val=v?v.textContent:'';
          a[col]=String(val).trim();
        });
        for(var z=0;z<a.length;z++) if(a[z]==null) a[z]='';
        out[ri]=a;
      });
      return out.filter(function(r){ return r&&r.some(function(x){return x}) });
    });
  });
}
/* ô ngày Excel dạng số → dd/MM/yyyy */
function xlDate(v){
  if(!/^\d+(\.\d+)?$/.test(String(v||''))) return v;
  var n=Math.floor(+v); if(n<20000||n>80000) return v;
  var d=new Date(Date.UTC(1899,11,30)+n*86400000), p=function(x){return (x<10?'0':'')+x};
  return p(d.getUTCDate())+'/'+p(d.getUTCMonth()+1)+'/'+d.getUTCFullYear();
}
(function(){ var pc=parseCsv; parseCsv=function(t){ return Array.isArray(t)?t:pc(t) } })();
function xlPick(inp,onRows,onErr){
  var f=inp.files&&inp.files[0]; if(!f) return;
  if(/\.xlsx$/i.test(f.name)){
    var rd=new FileReader();
    rd.onload=function(){ xlRead(rd.result).then(function(rows){ onRows(rows,f.name) },function(){ onErr(tx('Không đọc được tệp Excel. Hãy dùng tệp mẫu tải từ màn này.','Could not read the Excel file. Please use the template downloaded here.')) }) };
    rd.readAsArrayBuffer(f);
  } else if(/\.csv$/i.test(f.name)){
    var r2=new FileReader(); r2.onload=function(){ onRows(String(r2.result),f.name) }; r2.readAsText(f,'utf-8');
  } else onErr(tx('Chỉ nhận tệp Excel (.xlsx) hoặc .csv','Only Excel (.xlsx) or .csv files are accepted'));
}
function impFile(inp){
  xlPick(inp,function(rows,name){
    if(Array.isArray(rows)) rows=rows.map(function(r){ var c=r.slice(); c[3]=xlDate(c[3]); c[4]=xlDate(c[4]); return c });
    MTI.msg=''; impRun(rows,name);
  },function(m){ MTI.msg=m; drawImp() });
}
function ugImpFile(inp){ xlPick(inp,function(rows,name){ ugImpRun(rows,name) },function(m){ UGI.msg=m; ugDrawImp() }) }
function mtTpl(){
  var U=MTV.unit, codes=[];
  TT_UNITS.forEach(function(u){ ttList(u).forEach(function(t){ codes.push([unitName(u),t.code,t.n]) }) });
  var ex=ttList(U).slice(0,2).map(function(t){return t.code}).join(';')||'NGHI_PHEP';
  var guide=[[tx('HƯỚNG DẪN ĐIỀN TỆP IMPORT MA TRẬN PHÊ DUYỆT','APPROVAL MATRIX IMPORT — HOW TO FILL IN')],[''],
    [tx('Cột','Column'),tx('Bắt buộc','Required'),tx('Cách điền','How to fill in'),tx('Ví dụ','Example')],
    [CSV_HEAD[0],tx('Có','Yes'),tx('Account của nhân viên được duyệt, thuộc đơn vị '+unitName(U),'Account of the employee being approved, in '+unitName(U)),'annv'],
    [CSV_HEAD[1],tx('Có','Yes'),tx('Account của người duyệt. Không trùng nhân viên, không phải người đã nghỉ việc hoặc bị khoá','Approver account. Not the employee, not left or locked'),'hoatt'],
    [CSV_HEAD[2],tx('Không','No'),tx('Mã loại ticket ở bảng bên dưới, nhiều mã cách nhau bằng dấu chấm phẩy. Để trống = mọi loại ticket','Ticket type codes from the table below, separated by semicolons. Blank = all ticket types'),ex],
    [CSV_HEAD[3],tx('Có','Yes'),tx('Định dạng dd/MM/yyyy','Format dd/MM/yyyy'),'01/11/2026'],
    [CSV_HEAD[4],tx('Có','Yes'),tx('Định dạng dd/MM/yyyy, sau Từ ngày','Format dd/MM/yyyy, after the start date'),'31/12/2026'],
    [''],[tx('MÃ LOẠI TICKET','TICKET TYPE CODES')],[tx('Đơn vị','Unit'),tx('Mã loại ticket','Ticket type code'),tx('Tên loại ticket','Ticket type name')]].concat(codes);
  xlSave('mau-import-ma-tran-phe-duyet-'+U+'.xlsx',xlBuild([
    {name:tx('Ma trận phê duyệt','Approval matrix'),rows:[CSV_HEAD.slice()],widths:[24,24,34,16,16],head:[0],textCols:true,freeze:true},
    {name:tx('Hướng dẫn','Guide'),rows:guide,widths:[26,12,70,26],title:[0,9],head:[2,10],box:[3,7]}]));
  auditLog(tx('Tải tệp mẫu import ma trận','Download matrix import template'),unitName(U));
}
function ugTpl(){
  var U=UGV.unit, roles=ugRoles(U).map(function(r){ return [r.code,posName(r.code)] });
  var guide=[[tx('HƯỚNG DẪN ĐIỀN TỆP IMPORT USER GROUP','USER GROUP IMPORT — HOW TO FILL IN')],[''],
    [tx('Cột','Column'),tx('Bắt buộc','Required'),tx('Cách điền','How to fill in'),tx('Ví dụ','Example')],
    [UG_HEAD[0],tx('Có','Yes'),tx('Tên vai trò. Trùng tên vai trò đang có thì thêm người vào vai trò đó','Role name. If it matches an existing role, the person is added to that role'),tx('Trưởng phòng Nhân sự','HR Manager')],
    [UG_HEAD[1],tx('Không','No'),tx('Chữ in hoa không dấu, số, dấu gạch dưới. Để trống thì hệ thống tự sinh từ tên','Uppercase letters, digits, underscores. Blank = generated from the name'),'TRUONG_PHONG_NS'],
    [UG_HEAD[2],tx('Có','Yes'),tx('Họ tên người giữ vai trò','Full name of the person'),'Phạm Thu Hà'],
    [UG_HEAD[3],tx('Có','Yes'),tx('Account của người giữ vai trò, mỗi dòng một người','Account of the person, one person per row'),'haptt'],
    [''],[tx('VAI TRÒ ĐANG CÓ Ở ','EXISTING ROLES IN ')+unitName(U).toUpperCase()],[tx('Mã vai trò','Role code'),tx('Tên vai trò','Role name')]].concat(roles);
  xlSave('mau-import-user-group-'+U+'.xlsx',xlBuild([
    {name:'User Group',rows:[UG_HEAD.slice()],widths:[30,24,28,20],head:[0],textCols:true,freeze:true},
    {name:tx('Hướng dẫn','Guide'),rows:guide,widths:[22,12,70,26],title:[0,8],head:[2,9],box:[3,6]}]));
  auditLog(tx('Tải tệp mẫu import User Group','Download User Group import template'),unitName(U));
}
function impStep1(msg,title,tplFn,inpId,onch){
  return (msg?'<div class="alert a-dgr" style="margin-bottom:12px">'+svg(I.warn)+'<div><b>'+tx('Chưa đọc được tệp','Could not read the file')+'</b>'+esc(msg)+'</div></div>':'')+
    '<div class="tpl"><span class="tpl-ic">'+svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 12l6 6M15 12l-6 6"/>')+'</span>'+
      '<div class="tpl-t"><b>'+title+'</b><span>Excel (.xlsx)</span></div>'+
      '<button class="btn" onclick="'+tplFn+'()">'+svg(I.down)+tx('Tải tệp mẫu','Download template')+'</button></div>'+
    '<div class="field" style="margin-top:16px"><label for="'+inpId+'">'+tx('Tệp import','Import file')+'</label>'+
      '<div class="fpick"><label class="btn" for="'+inpId+'">'+svg(I.up)+tx('Chọn tệp','Choose file')+'</label><span class="fp-n">'+tx('Chưa chọn tệp · .xlsx hoặc .csv','No file chosen · .xlsx or .csv')+'</span>'+
      '<input type="file" id="'+inpId+'" accept=".xlsx,.csv" hidden onchange="'+onch+'(this)"></div></div>';
}
(function(){
  var di=drawImp;
  drawImp=function(){ di.apply(this,arguments); if(MTI.step!==1) return; var b=document.querySelector('#drw .drw-b'); if(b) b.innerHTML=impStep1(MTI.msg,tx('Tệp mẫu import ma trận phê duyệt','Approval matrix import template'),'mtTpl','imp_f','impFile') };
  var ud=ugDrawImp;
  ugDrawImp=function(){ ud.apply(this,arguments); if(UGI.step!==1) return; var b=document.querySelector('#drw .drw-b'); if(b) b.innerHTML=impStep1(UGI.msg,tx('Tệp mẫu import User Group','User Group import template'),'ugTpl','ugi_f','ugImpFile') };
})();



function inspSys(n){
  var h=sysGet(n), st=sysEval(n);
  var o=''+
    (DSN.exp?'<div class="sys-g3">':'')+
    '<div class="field"><label>Step name</label><input class="inp" value="'+esc(n.name)+'" oninput="setNodeName(this.value)"></div>'+
    '<div class="field"><label for="sysMethod">Method<span class="req">*</span></label>'+
      '<select class="inp" id="sysMethod" onchange="sysSet(\'method\',this.value)">'+
      HTTP_METHODS.map(function(m){ return '<option'+(h.method===m?' selected':'')+'>'+m+'</option>' }).join('')+'</select>'+
      '<span class="hint">HTTP method of the request: read, create, update or delete data</span></div>'+
    '<div class="field"><label for="sysUrl">URL<span class="req">*</span></label>'+
      '<input class="inp mono" id="sysUrl" value="'+esc(h.url||'')+'" placeholder="http://example.com/index.html" autocomplete="off" spellcheck="false" '+
      'onfocus="sysFocus(\'url\',-1,-1,this)" oninput="sysIn(\'url\',-1,-1,this)" onkeyup="sysCaret(this)" onclick="sysCaret(this)">'+
      '<span class="hint">Endpoint address that receives the request, e.g. https://api.example.com/users</span>'+
      '<div id="sysUrlMsg">'+sysMsgs(st.url.err,'bad')+sysMsgs(st.url.warn,'warn')+'</div></div>'+
    (DSN.exp?'</div>':
    '<div class="sys-sep"></div>'+
    '<div class="sys-sw"><div><b>Send Query Parameters</b><span>Parameters are appended to the URL as a query string</span></div></div>');
  if(h.sendQuery){
    o+='<div class="field"><label for="sysMode">Specify Query Parameters</label>'+
      '<select class="inp" id="sysMode" onchange="sysSetMode(this.value)">'+
      '<option value="fields"'+(h.qmode!=='json'?' selected':'')+'>Using Fields Below</option>'+
      '<option value="json"'+(h.qmode==='json'?' selected':'')+'>Using JSON</option></select>'+
      '<span class="hint">'+(h.qmode==='json'?'Declare all parameters in one JSON object — suitable for many parameters':'Declare each parameter with a Name and Value — suitable for few parameters and visual configuration')+
      '. Only the selected method is sent.</span></div>'+
      '<div id="sysGen">'+sysMsgs(st.gen.map(function(g){return g.m}),'warn')+'</div>';
    if(h.qmode==='json') o+=sysJsonHTML(h,st);
    else o+='<div class="qp-h"><b>Query Parameters</b><span class="qp-c">'+h.params.length+'</span>'+
        (h.params.length?'<button class="link" onclick="sysOpenAll()">'+(SYS.open===-1?'Click a row to edit':'Collapse')+'</button>':'')+'</div>'+
      (DSN.exp&&h.params.length?'<div class="qp-th" aria-hidden="true"><span>Name</span><span>Value</span><span>Variable value</span><span></span></div>':'')+
      '<div class="qp-list">'+(h.params.length?h.params.map(function(p,i){ return sysParamHTML(p,i,st) }).join(''):
        '<div class="qp-empty">No parameters yet.</div>')+'</div>'+
      '<button class="btn sm sys-add" onclick="sysAddParam()">'+svg(I.plus)+'Add Parameter</button>';
  } else {
    o+='<div class="insp-note">No parameters sent — the request only has Method and URL.'+
      (h.params.length||String(h.json||'').trim()?' Declared parameters are kept; turn it back on to send them.':'')+'</div>';
  }
  o+='<div style="border-top:1px solid var(--line);padding-top:11px;margin-top:3px">'+
     '<button class="btn sm dgr" onclick="delNode()">'+svg(I.x)+'Delete this node</button></div>';
  return o;
}


/* ---------------- 7. Tác vụ hệ thống: Headers ---------------- */
(function(){
  var sg=sysGet; sysGet=function(n){ var h=sg(n); if(!h.headers) h.headers=[]; return h };
  var is=inspSys;
  inspSys=function(n){
    var o=is(n), h=sysGet(n), mk='<div style="border-top:1px solid var(--line);padding-top:11px;margin-top:3px">', at=o.lastIndexOf(mk);
    var H=(typeof sysHdrHTML==='function')?sysHdrHTML(n,h):'<div class="sys-sep"></div><div class="qp-h"><b>Headers</b><span class="qp-c">'+h.headers.length+'</span></div>'+
      (h.headers.length&&DSN.exp?'<div class="hd-th" aria-hidden="true"><span>Key</span><span>Value</span><span></span></div>':'')+
      '<div class="hd-list">'+(h.headers.length?h.headers.map(function(x,i){
        var bad=!String(x.k||'').trim()&&String(x.v||'').trim();
        return '<div class="hd-r"><input class="inp mono'+(bad?' bad':'')+'" id="hdK_'+i+'" value="'+esc(x.k||'')+'" placeholder="Key" aria-label="Key '+(i+1)+'" autocomplete="off" spellcheck="false" oninput="hdIn(\'k\','+i+',this)">'+
          '<input class="inp mono" id="hdV_'+i+'" value="'+esc(x.v||'')+'" placeholder="Value" aria-label="Value '+(i+1)+'" autocomplete="off" spellcheck="false" onfocus="sysFocus(\'hv\','+i+',-1,this)" oninput="hdIn(\'v\','+i+',this)" onkeyup="sysCaret(this)" onclick="sysCaret(this)">'+
          '<button class="xb" title="'+tx('Xoá header','Delete header')+'" aria-label="'+tx('Xoá header ','Delete header ')+(i+1)+'" onclick="hdDel('+i+')">'+svg(I.trash)+'</button></div>';
      }).join(''):'<div class="qp-empty">'+tx('Chưa có header nào.','No header yet.')+'</div>')+'</div>'+
      '<button class="btn sm sys-add" onclick="hdAdd()">'+svg(I.plus)+'Add Header</button>';
    /* v54: khối Headers nằm NGAY TRÊN "Specify Query Parameters" (sau URL) */
    var m1='<div class="sys-sep"></div><div class="sys-sw">', m2='<div class="field"><label for="sysMode">', m3='<div class="insp-note">', k1=o.indexOf(m1), k2=o.indexOf(m2), k3=o.indexOf(m3);
    if(k1>=0) return o.slice(0,k1)+H+o.slice(k1);
    var q=k2>=0?k2:k3;
    if(q>=0) return o.slice(0,q)+H+'<div class="sys-sep"></div>'+o.slice(q);
    return at>=0?o.slice(0,at)+H+o.slice(at):o+H;
  };
  var sf=sysFocus;
  sysFocus=function(k,i,j,el){
    if(k!=='hv') return sf.apply(this,arguments);
    var was=SYS.focus, ch=!was||was.k!==k||was.i!==i; SYS.focus={k:k,i:i,j:j}; sysCaret(el);
    if(ch&&!SYS.bag){ SYS.bag=1; sysBagOnly(); sysReveal(el) } else if(ch) sysBagOnly();
  };
  var fnm=sysFocusName;
  sysFocusName=function(n,f){ if(f&&f.k==='hv'){ var x=sysGet(n).headers[f.i]; return 'Value '+tx('của header ','of header ')+((x&&String(x.k||'').trim())||(f.i+1)) } return fnm.apply(this,arguments) };
  var si=sysIns;
  sysIns=function(v){
    var f=SYS.focus; if(!f||f.k!=='hv') return si.apply(this,arguments);
    var n=nodeById(DSN.sel), el=document.getElementById('hdV_'+f.i); if(!n||!el) return;
    var t='{{'+v+'}}', a=SYS.caret?SYS.caret[0]:el.value.length, b=SYS.caret?SYS.caret[1]:el.value.length;
    el.value=el.value.slice(0,a)+t+el.value.slice(b); SYS.caret=[a+t.length,a+t.length];
    hdIn('v',f.i,el); el.focus({preventScroll:true}); try{ el.setSelectionRange(SYS.caret[0],SYS.caret[1]) }catch(e){}
  };
})();
function hdIn(k,i,el){
  var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n); if(!h.headers[i]) return;
  h.headers[i][k]=el.value; if(k==='v'){ SYS.focus={k:'hv',i:i,j:-1}; sysCaret(el) }
  var kk=document.getElementById('hdK_'+i); if(kk) kk.classList.toggle('bad',!String(h.headers[i].k||'').trim()&&!!String(h.headers[i].v||'').trim());
  markDirty();
}
function hdAdd(){ var n=nodeById(DSN.sel); if(!n) return; sysGet(n).headers.push({k:'',v:''}); markDirty(); sysDraw(); setTimeout(function(){ var e=document.getElementById('hdK_'+(sysGet(n).headers.length-1)); if(e) e.focus() },30) }
function hdDel(i){ var n=nodeById(DSN.sel); if(!n) return; sysGet(n).headers.splice(i,1); if(SYS.focus&&SYS.focus.k==='hv') SYS.focus=null; markDirty(); sysDraw() }
/* header có Value mà thiếu Key → chặn xuất bản */
(function(){
  var pe=publishErrors;
  publishErrors=function(){
    var e=pe.apply(this,arguments);
    def().nodes.forEach(function(n){ if(n.t!=='sys') return;
      var bad=sysGet(n).headers.filter(function(x){ return !String(x.k||'').trim()&&String(x.v||'').trim() }).length;
      if(bad) e.push({n:n,m:tx('Còn '+bad+' header chưa nhập Key',bad+' header(s) without a Key'),sys:1}) });
    return e;
  };
})();
/* Túi biến: không mở phần chi tiết khi bấm vào biến */
function sysVD(){}
function sysVDHTML(){ return '' }



/* ---------------- 8. Xuất bản phiên bản mới: cách xử lý ticket đang chạy ---------------- */
var PUB={th:1};
function wfWasPub(w){ return !!w&&(!!w.pub||(w.vers||[]).some(function(v){ return v.s&&v.s!=='draft' })) }
function pubNext(w){ var n=(w.vers||[]).length; return 'v'+(w.v||1)+'.'+(n+1) }
function pubTH(w){
  var o=wfVer(w), nv=pubNext(w), k=w.run||0, kt=k+tx(' ticket',' ticket(s)'), ks=Math.min((w.sysStarted||0)+(w.updProf||0),k);
  /* TKM-MSG-035: ticket có System task đã bắt đầu gửi dữ liệu sang hệ thống khác thì không huỷ được */
  var keep=ks>0?'<br><small style="color:var(--ink-3)">'+ks+' of them will be kept on '+o+' because data was already sent to another system.</small>':'';
  return [
    {id:1,t:tx('Giữ ticket đang xử lý ở phiên bản cũ','Keep in-progress tickets on the current version'),rec:1,
      d:tx(kt+' đang xử lý tiếp tục chạy theo '+o+' cho đến khi hoàn tất. Ticket nộp từ thời điểm xuất bản chạy theo '+nv+'.',kt+' in progress continue on '+o+' until they finish. Tickets submitted after publishing run on '+nv+'.')},
    {id:2,t:tx('Chuyển ticket đang xử lý sang phiên bản mới','Move in-progress tickets to the new version'),
      d:tx(kt+' đang xử lý được chuyển sang '+nv+' và tiếp tục tại bước tương ứng. Ticket đang ở bước đã bị xoá trong '+nv+' được đưa về bước liền trước còn tồn tại, giữ nguyên kết quả đã xử lý ở bước đó, rồi đi tiếp theo luồng của '+nv+'.',kt+' in progress move to '+nv+' and continue at the matching step. Tickets at a step removed in '+nv+' go back to the nearest previous step that still exists, keep the result already given there, and continue along the '+nv+' flow.')},
    {id:3,t:tx('Huỷ ticket đang xử lý và yêu cầu nộp lại','Cancel in-progress tickets and ask to resubmit'),warn:1,
      d:tx(kt+' đang xử lý theo '+o+' bị huỷ. Người nộp nhận thông báo có phiên bản mới và cần tạo lại ticket. Ticket đã hoàn tất không bị ảnh hưởng.',kt+' in progress on '+o+' are cancelled. Submitters are notified of the new version and must create a new ticket. Completed tickets are not affected.')+keep}];
}
function pubPick(i){ PUB.th=i; document.querySelectorAll('.pth').forEach(function(x){ x.classList.toggle('on',+x.getAttribute('data-th')===i) }) }
(function(){
  var prev=publishDef;
  publishDef=function(){
    var w=wfById(DSN.id);
    if(publishErrors().length||!wfWasPub(w)) return prev.apply(this,arguments);
    PUB={th:1,w:w};
    var L=pubTH(w);
    cfmShow({wide:1,title:tx('Xuất bản phiên bản mới','Publish a new version'),ok:tx('Tiếp tục','Continue'),onOk:pubStep2,
      body:'<p>'+tx('Quy trình <b>'+esc(w.n)+'</b> · '+wfVer(w)+' → <b>'+pubNext(w)+'</b> · đang có <b>'+(w.run||0)+' ticket</b> xử lý theo phiên bản hiện tại. Chọn cách xử lý các ticket này:','Workflow <b>'+esc(w.n)+'</b> · '+wfVer(w)+' → <b>'+pubNext(w)+'</b> · <b>'+(w.run||0)+' ticket(s)</b> are in progress on the current version. Choose how to handle them:')+'</p>'+
        '<div class="pths" role="radiogroup">'+L.map(function(o){
          return '<label class="pth'+(o.id===1?' on':'')+(o.warn?' warn':'')+'" data-th="'+o.id+'"><input type="radio" name="pth" value="'+o.id+'"'+(o.id===1?' checked':'')+' onchange="pubPick('+o.id+')">'+
            '<span class="pth-t"><b>'+o.t+(o.rec?' <span class="chip nb c-done">'+tx('Khuyến nghị','Recommended')+'</span>':'')+'</b><span>'+o.d+'</span></span></label>';
        }).join('')+'</div>'+(typeof hookUrlWarn==='function'?hookUrlWarn():'')});
  };
})();
function pubStep2(){
  var o=pubTH(PUB.w)[PUB.th-1];
  cfmShow({title:tx('Xác thực xuất bản (1/2)','Confirm publishing (1/2)'),ok:tx('Tiếp tục','Continue'),onOk:pubStep3,
    body:'<p>'+tx('Bạn đã chọn: <b>'+o.t+'</b>.','You chose: <b>'+o.t+'</b>.')+'</p><p class="cfm-sub">'+tx('Gõ <b>Confirm</b> vào ô dưới đây để tiếp tục.','Type <b>Confirm</b> below to continue.')+'</p>'+
      '<input class="inp cfm-in" id="pubCfm" autocomplete="off" spellcheck="false" placeholder="Confirm" oninput="var b=document.getElementById(\'cfmOk\');if(b)b.disabled=this.value!==\'Confirm\'" onkeydown="if(event.key===\'Enter\'&&this.value===\'Confirm\'){event.preventDefault();document.getElementById(\'cfmOk\').click()}">'});
  var b=document.getElementById('cfmOk'); if(b) b.disabled=true;
  setTimeout(function(){ var i=document.getElementById('pubCfm'); if(i) i.focus() },30);
}
function pubStep3(){
  var w=PUB.w, o=pubTH(w)[PUB.th-1];
  cfmShow({title:tx('Xác thực xuất bản (2/2)','Confirm publishing (2/2)'),ok:tx('Có','Yes'),no:tx('Không','No'),okCls:PUB.th===3?'dgr-s':'pri',onOk:pubGo,
    body:'<p>'+tx('Xuất bản <b>'+esc(w.n)+' '+pubNext(w)+'</b> và <b>'+o.t.charAt(0).toLowerCase()+o.t.slice(1)+'</b>?','Publish <b>'+esc(w.n)+' '+pubNext(w)+'</b> and <b>'+o.t.charAt(0).toLowerCase()+o.t.slice(1)+'</b>?')+'</p>'});
}
function pubGo(){
  var w=PUB.w, th=PUB.th, k=w.run||0, old=wfVer(w), nv=pubNext(w);
  publishGo();
  var v=(w.vers||[])[0]; if(v){ v.th=th; v.cnt=k; v.from=old }
  var ks=Math.min((w.sysStarted||0)+(w.updProf||0),k);
  if(th===3) w.run=ks;
  var lb=pubTH(w)[th-1].t;
  auditLog(tx('Xuất bản phiên bản mới','Publish a new version'),w.id+' '+old+' → '+nv+' · '+lb+' · '+k+' ticket');
  toast(tx('Đã xuất bản ','Published ')+nv,
    th===1?tx(k+' ticket đang xử lý tiếp tục theo '+old,k+' in-progress ticket(s) continue on '+old)
    :th===2?tx(k+' ticket đã chuyển sang '+nv,k+' ticket(s) moved to '+nv)
    :tx((k-ks)+' ticket đã huỷ'+(ks>0?', '+ks+' ticket giữ ở '+old:'')+', người nộp được thông báo tạo lại',(k-ks)+' ticket(s) cancelled'+(ks>0?', '+ks+' kept on '+old:'')+', submitters notified'));
}
function wfVerRows(w){
  var V=w.vers||[], n=V.length;
  return V.map(function(v,i){
    var nw=i>0?V[i-1]:null, st;
    if(i===0) st=w.st==='run'?[tx('Đang áp dụng','In use'),'c-done']:w.st==='huy'?[tx('Đã vô hiệu hoá','Disabled'),'c-rej']:[tx('Nháp','Draft'),'c-draft'];
    else if(i===1&&nw&&nw.th===1&&nw.cnt) st=[tx('Xử lý nốt '+nw.cnt+' ticket','Finishing '+nw.cnt+' ticket(s)'),'c-wait'];
    else if(nw&&nw.th===2&&nw.cnt) st=[tx('Đã chuyển '+nw.cnt+' ticket sang v'+w.v+'.'+(n-i+1),'Moved '+nw.cnt+' ticket(s) to v'+w.v+'.'+(n-i+1)),'c-draft'];
    else if(nw&&nw.th===3&&nw.cnt) st=[tx('Đã huỷ '+nw.cnt+' ticket','Cancelled '+nw.cnt+' ticket(s)'),'c-rej'];
    else st=[tx('Phiên bản cũ','Previous version'),'c-draft'];
    return '<tr><td class="num c-main">v'+w.v+'.'+(n-i)+'</td><td class="num">'+esc(v.t||'—')+'</td><td>'+esc(accName(v.w||''))+'<div class="mono" style="font-size:11px;color:var(--ink-3)">'+esc(v.w||'')+'</div></td><td><span class="chip nb '+st[1]+'">'+st[0]+'</span></td></tr>';
  }).join('');
}



function ifParamsHTML(n){
  var c=ifGet(n), e=ifErrors(n);
  var h='';   /* v49: bỏ chế độ JavaScript — chỉ còn viết theo Điều kiện */
  if(c.mode==='js') c.mode='rules';
  if(c.mode==='js'){
    var lines=String(c.js||'').split('\n').length, se=ifJsSyntax(c.js||'');
    h+='<div class="ifx-sec"><div class="ifx-st">JavaScript</div>'+
      '<div class="sys-ed ifx-ed"><div class="sys-gut" id="ifGut" aria-hidden="true">'+sysGutter(lines)+'</div>'+
      '<textarea class="mono" id="ifJs" spellcheck="false" aria-label="JavaScript" oninput="ifJsIn(this)" onscroll="var g=document.getElementById(\'ifGut\');if(g)g.scrollTop=this.scrollTop" onkeydown="ifTab(event,this)">'+esc(c.js||'')+'</textarea></div>'+
      '<div id="ifJsMsg">'+ifJsMsg(se)+'</div></div>';
    return h;
  }
  h+='<div class="ifx-sec"><div class="ifx-st">'+tx('Điều kiện','Conditions')+'</div><div class="if-rules">';
  c.rules.forEach(function(r,i){
    var o=ifOp(r.t,r.op), un=ifUnary(r.t,r.op), ve=ifValErr(r);
    if(i) h+='<div class="if-comb"><select class="inp" aria-label="'+'AND / OR'+'" onchange="ifComb(this.value)"><option value="and"'+(c.comb!=='or'?' selected':'')+'>'+'AND'+'</option><option value="or"'+(c.comb==='or'?' selected':'')+'>'+'OR'+'</option></select></div>';
    h+='<div class="if-row'+(un?' un':'')+'">'+
      ifCell(i,'l',r.l,tx('Giá trị 1','value1'),r.t)+
      '<div class="if-opc"><button class="if-opb'+(IFN.menu===i?' on':'')+'" aria-haspopup="menu" aria-expanded="'+(IFN.menu===i)+'" onclick="event.stopPropagation();ifMenu('+i+')">'+ifTypeIc(r.t)+'<span class="if-opl">'+esc(ifOpLabel(o))+'</span>'+svg(IF_IC.chev)+'</button>'+
        (IFN.menu===i?ifMenuHTML(i,r):'')+'</div>'+
      (un?'<div class="if-cell if-na"></div>':ifCell(i,'r',r.r,r.t==='number'?tx('Nhập số','Number'):r.t==='dateTime'?'dd/mm/yyyy':r.t==='boolean'?'true / false':tx('Giá trị 2','value2'),r.t,ve))+
      '<button class="xb if-del" title="'+tx('Xoá điều kiện','Remove condition')+'" aria-label="'+tx('Xoá điều kiện ','Remove condition ')+(i+1)+'" onclick="ifDel('+i+')">'+svg(I.trash)+'</button></div>';
  });
  h+='</div><button class="btn if-add" onclick="ifAdd()">'+svg(I.plus)+tx('Thêm điều kiện','Add condition')+'</button></div>';
  h+='<div id="ifErrs">'+ifErrsHTML(e)+'</div>';
  return h;
}


var HDRS=[
  {id:'hd-1',u:'fsoft',n:tx('HRM – Xác thực API','HRM – API authentication'),on:1,mo:tx('Gọi API HRM của Fsoft. Token đổi định kỳ 90 ngày','For the Fsoft HRM API. Token rotated every 90 days'),by:'quantm',t:'01/10/2026 09:12',
    params:[{k:'Authorization',v:'Bearer DEMO_TOKEN'},{k:'X-Api-Key',v:'DEMO_API_KEY'},{k:'Content-Type',v:'application/json'},{k:'X-Request-Source',v:'BPM-Fsoft'}]},
  {id:'hd-2',u:'fsoft',n:tx('Payroll – Xác thực API','Payroll – API authentication'),on:1,mo:tx('Gọi hệ thống tính lương','For the payroll system'),by:'quantm',t:'20/09/2026 10:40',
    params:[{k:'Authorization',v:'Bearer DEMO_TOKEN'},{k:'Content-Type',v:'application/json'},{k:'X-Request-Source',v:'BPM-Fsoft'}]},
  {id:'hd-3',u:'fsoft',n:tx('HRM – Chỉ đọc dữ liệu','HRM – Read only'),on:1,mo:tx('Tra cứu dữ liệu HRM, không ghi','Look up HRM data, no writes'),by:'huongntt',t:'12/09/2026 14:02',
    params:[{k:'Authorization',v:'Bearer DEMO_TOKEN'},{k:'Accept',v:'application/json'}]},
  {id:'hd-4',u:'fsoft',n:tx('HRM – Xác thực API (2025)','HRM – API authentication (2025)'),on:0,mo:tx('Bộ cũ, đã thay bằng HRM – Xác thực API','Old set, replaced by HRM – API authentication'),by:'quantm',t:'01/10/2026 09:20',
    params:[{k:'Authorization',v:'Bearer DEMO_TOKEN'},{k:'Content-Type',v:'application/json'}]},
  {id:'hd-5',u:'fptis',n:tx('HRM FIS – Xác thực API','HRM FIS – API authentication'),on:1,mo:'',by:'namnv',t:'05/09/2026 08:30',
    params:[{k:'Authorization',v:'Bearer DEMO_TOKEN'},{k:'Content-Type',v:'application/json'}]}
];
var HD_SEQ=5;
/* gắn header mẫu (1 header / node) vào các node Tác vụ hệ thống có sẵn */
(function(){
  var map={'salary-increase-demo':'hd-2','advance-payment':'hd-2'};
  Object.keys(DEFS).forEach(function(k){
    var u=wfUnit(k);
    DEFS[k].nodes.forEach(function(n){
      if(n.t!=='sys'||!n.http) return;
      if(!n.http.headers||!n.http.headers.length) n.http.headers=[{ref:map[k]||(u==='fptis'?'hd-5':'hd-1')}];
    });
  });
})();
function hdById(id){ return HDRS.filter(function(h){return h.id===id})[0]||null }
function hdUses(id){
  var out=[];
  Object.keys(DEFS).forEach(function(k){ DEFS[k].nodes.forEach(function(n){
    if(n.t==='sys'&&n.http&&(n.http.headers||[]).some(function(x){return x.ref===id})) out.push({wf:k,wn:DEFS[k].n,node:n.id,nn:n.name});
  }) });
  return out;
}
function hdWfCount(id){ var s={}; hdUses(id).forEach(function(x){ s[x.wf]=1 }); return Object.keys(s).length }
function hdKeysHTML(h,max){
  var P=h.params||[], m=max||3;
  return '<span class="hd-keys">'+P.slice(0,m).map(function(p){ return '<span class="hd-key mono">'+esc(p.k)+'</span>' }).join('')+
    (P.length>m?'<span class="hd-more">+'+(P.length-m)+'</span>':'')+'</span>';
}

/* ---------------- menu + màn hình ---------------- */
NAV.push({s:tx('Tích hợp','Integration')},{k:'header',l:tx('Header dùng chung','Shared headers'),i:I.plug});
if(typeof TITLES!=='undefined') TITLES.header=tx('Header dùng chung','Shared headers');
var HDV={q:'',st:''};
function hdGo(k,v){ HDV[k]=v; PAGES.header(); if(k==='q'){ var e=document.getElementById('hdQ'); if(e){ e.focus(); e.setSelectionRange(e.value.length,e.value.length) } } }
PAGES.header=function(){
  if(unitsFor().indexOf(CUR_UNIT)<0) useUnit(unitsFor()[0]);
  var u=CUR_UNIT, q=gNorm((HDV.q||'').trim()), all=HDRS.filter(function(h){return h.u===u});
  var list=all.filter(function(h){
    if(HDV.st==='on'&&!h.on) return false; if(HDV.st==='off'&&h.on) return false;
    if(q&&gNorm(h.n+' '+(h.mo||'')+' '+h.params.map(function(p){return p.k}).join(' ')).indexOf(q)<0) return false;
    return true;
  });
  var nOn=all.filter(function(h){return h.on}).length, nUsed=all.filter(function(h){return hdUses(h.id).length}).length;
  var row=function(h){
    var uses=hdUses(h.id), wc=hdWfCount(h.id);
    return '<tr class="clk" onclick="openHd(\''+h.id+'\')">'+
      '<td class="c-main"><div class="hd-nm">'+esc(h.n)+'</div>'+(h.mo?'<div class="hd-mo">'+esc(h.mo)+'</div>':'')+'</td>'+
      '<td>'+(uses.length?'<span class="hd-use" title="'+esc(uses.map(function(x){return x.wn+' · '+x.nn}).join('\n'))+'">'+wc+tx(' quy trình',' workflow(s)')+' · '+uses.length+' node</span>':'<span class="hd-none">'+tx('Chưa dùng','Not used')+'</span>')+'</td>'+
      '<td onclick="event.stopPropagation()"><span class="hd-st"><button type="button" class="sw'+(h.on?' on':'')+'" role="switch" aria-checked="'+(h.on?'true':'false')+'" aria-label="'+tx('Trạng thái header ','Status of header ')+esc(h.n)+'" title="'+(h.on?tx('Đang dùng — bấm để ngưng','Active — click to deactivate'):tx('Đang ngưng — bấm để dùng','Inactive — click to activate'))+'" onclick="hdTog(\''+h.id+'\')"><i></i></button>'+
        '<span class="'+(h.on?'on':'')+'">'+(h.on?tx('Đang dùng','Active'):tx('Ngưng','Inactive'))+'</span></span></td>'+
      '<td class="hd-upd">'+esc(accName(h.by))+' - <span class="mono">'+esc(h.by)+'</span><div class="num">'+esc(h.t)+'</div></td>'+
      '<td class="r" onclick="event.stopPropagation()"><span class="hd-acts">'+
        '<button class="xb look" title="'+tx('Sửa','Edit')+'" aria-label="'+tx('Sửa ','Edit ')+esc(h.n)+'" onclick="openHd(\''+h.id+'\')">'+svg(I.edit)+'</button>'+
        '<button class="xb" title="'+tx('Xoá','Delete')+'" aria-label="'+tx('Xoá ','Delete ')+esc(h.n)+'" onclick="hdDelAsk(\''+h.id+'\')">'+svg(I.trash)+'</button></span></td></tr>';
  };
  V('<div class="page-head"><div><h1>'+tx('Header dùng chung','Shared headers')+'</h1></div>'+
    '<div class="ph-actions"><button class="btn pri" onclick="openHd(\'\')">'+svg(I.plus)+tx('Thêm header','Add header')+'</button></div></div>'+
    '<div class="stats hd-stats">'+
      '<div class="stat"><div class="lbl">'+svg(I.plug)+tx('Tổng số header','Total headers')+'</div><div class="val">'+all.length+'</div></div>'+
      '<div class="stat"><div class="lbl">'+svg(I.check)+tx('Đang dùng','Active')+'</div><div class="val">'+nOn+'</div></div>'+
      '<div class="stat"><div class="lbl">'+svg(I.flow)+tx('Được node chọn','Used by nodes')+'</div><div class="val">'+nUsed+'</div></div></div>'+
    '<div class="pg-tools">'+unitSelHTML()+
      '<input class="inp" id="hdQ" style="max-width:300px" value="'+esc(HDV.q)+'" placeholder="'+tx('Tìm theo tên, key, mô tả…','Search by name, key, description…')+'" oninput="hdGo(\'q\',this.value)">'+
      '<select class="inp" style="max-width:190px" aria-label="'+tx('Trạng thái','Status')+'" onchange="hdGo(\'st\',this.value)">'+
        [['',tx('Trạng thái: tất cả','Status: all')],['on',tx('Đang dùng','Active')],['off',tx('Ngưng','Inactive')]].map(function(o){ return '<option value="'+o[0]+'"'+(HDV.st===o[0]?' selected':'')+'>'+o[1]+'</option>' }).join('')+'</select></div>'+
    (all.length?
      '<div class="card"><div class="card-b flush"><div class="tbl-wrap"><table class="tbl hd-tbl"><thead><tr><th>'+tx('Tên header','Header name')+'</th><th>'+tx('Đang dùng ở','Used in')+'</th><th>'+tx('Trạng thái','Status')+'</th><th>'+tx('Cập nhật','Updated')+'</th><th></th></tr></thead><tbody>'+
      (list.length?list.map(row).join(''):'<tr><td colspan="5">'+empty(I.plug,tx('Không có header nào khớp','No header matches'),tx('Đổi từ khoá tìm kiếm hoặc bộ lọc trạng thái.','Change the keyword or the status filter.'))+'</td></tr>')+
      '</tbody></table></div></div></div>'
      :'<div class="card"><div class="empty">'+svg(I.plug)+'<b>'+tx(unitName(u)+' chưa khai báo header nào',unitName(u)+' has no header yet')+'</b><p><button class="btn pri" onclick="openHd(\'\')">'+svg(I.plus)+tx('Thêm header','Add header')+'</button></p></div></div>'));
};

/* ---------------- ngăn Thêm / Sửa header (nhiều Parameter) ---------------- */
var HDE=null;
var HD_KEYS=['Authorization','Content-Type','Accept','Accept-Language','X-Api-Key','X-Request-Source','X-Correlation-Id','X-Tenant-Id','Cache-Control'];
function openHd(id,forNode){
  var h=id?hdById(id):null;
  HDE=h?{id:h.id,u:h.u,n:h.n,on:h.on,mo:h.mo||'',params:h.params.map(function(p){ return {k:p.k,v:p.v} }),err:{},forNode:null}
       :{id:'',u:forNode?forNode.u:CUR_UNIT,n:'',on:1,mo:'',params:[{k:'',v:''}],err:{},forNode:forNode||null};
  drawHd();
}
function hdGrab(){
  var g=function(i){ return document.getElementById(i) };
  if(g('hd_n')) HDE.n=g('hd_n').value; if(g('hd_mo')) HDE.mo=g('hd_mo').value;
  HDE.params.forEach(function(p,i){ var k=g('hdpk_'+i), v=g('hdpv_'+i); if(k) p.k=k.value; if(v) p.v=v.value });
}
function hdpAddRow(){ hdGrab(); HDE.params.push({k:'',v:''}); drawHd(); setTimeout(function(){ var e=document.getElementById('hdpk_'+(HDE.params.length-1)); if(e) e.focus() },30) }
function hdpDelRow(i){ hdGrab(); HDE.params.splice(i,1); if(HDE.err.p) delete HDE.err.p[i]; drawHd() }
function hdSensitiveKey(key){ return String(key||'').trim().toLowerCase()==='x-api-key' }
function hdMaskValue(index,key){
  var input=document.getElementById('hdpv_'+index);if(!input)return;
  input.type=hdSensitiveKey(key)?'password':'text';
  input.autocomplete=hdSensitiveKey(key)?'new-password':'off';
}
function drawHd(){
  var ed=!!HDE.id, E=HDE.err, PE=E.p||{}, req=' <span style="color:var(--danger)">*</span>';
  var hint=function(k){ return E[k]?'<span class="hint" style="color:var(--danger)">'+esc(E[k])+'</span>':'' };
  showDrawer('<div class="drw-h"><div style="flex:1"><h2>'+(ed?tx('Sửa header','Edit header'):tx('Thêm header','Add header'))+'</h2>'+
    '<div class="meta"><span>'+tx('Đơn vị ','Unit ')+esc(unitName(HDE.u))+'</span></div></div>'+
    '<button class="x-btn" onclick="closeDrawer()">'+svg(I.x)+'</button></div><div class="drw-b">'+
    '<div class="field"><label for="hd_n">'+tx('Tên header','Header name')+req+'</label>'+
      '<input class="inp'+(E.n?' bad':'')+'" id="hd_n" maxlength="80" value="'+esc(HDE.n)+'" placeholder="'+tx('Ví dụ: HRM – Xác thực API','e.g. HRM – API authentication')+'" autocomplete="off">'+hint('n')+'</div>'+
    '<div class="field" style="margin-top:12px"><label for="hd_mo">'+tx('Mô tả','Description')+'</label>'+
      '<textarea class="inp" id="hd_mo" rows="2" maxlength="250" placeholder="'+tx('Header dùng cho hệ thống nào, ai cấp, khi nào đổi','Which system it is for, who issued it, when it changes')+'">'+esc(HDE.mo)+'</textarea></div>'+
    '<div class="field" style="margin-top:14px"><div class="qp-h hdx-h"><b>Parameters</b><span class="qp-c">'+HDE.params.length+'</span></div>'+
      '<datalist id="hdKeyList">'+HD_KEYS.map(function(k){ return '<option value="'+k+'">' }).join('')+'</datalist>'+
      (HDE.params.length?'<div class="hdx-th" aria-hidden="true"><span>Key</span><span>Value</span><span></span></div>':'')+
      '<div class="hdx-list">'+HDE.params.map(function(p,i){
        var pe=PE[i]||{};
        return '<div class="hdx-r"><div><input class="inp mono'+(pe.k?' bad':'')+'" id="hdpk_'+i+'" list="hdKeyList" oninput="hdMaskValue('+i+',this.value)" onchange="hdMaskValue('+i+',this.value)" maxlength="80" value="'+esc(p.k)+'" placeholder="Key" aria-label="Key '+(i+1)+'" autocomplete="off" spellcheck="false">'+(pe.k?'<span class="hint" style="color:var(--danger)">'+esc(pe.k)+'</span>':'')+'</div>'+
          '<div><div class="hd-vin"><input class="inp mono'+(pe.v?' bad':'')+'" id="hdpv_'+i+'" type="'+(hdSensitiveKey(p.k)?'password':'text')+'" maxlength="2000" value="'+esc(p.v)+'" placeholder="Value" aria-label="Value '+(i+1)+'" autocomplete="off" spellcheck="false">'+'</div>'+(pe.v?'<span class="hint" style="color:var(--danger)">'+esc(pe.v)+'</span>':'')+'</div>'+
          '<div class="hdx-a">'+
            '<button class="xb" type="button" title="'+tx('Xoá parameter','Delete parameter')+'" aria-label="'+tx('Xoá parameter ','Delete parameter ')+(i+1)+'" onclick="hdpDelRow('+i+')">'+svg(I.trash)+'</button></div></div>';
      }).join('')+'</div>'+hint('params')+
      '<button class="btn sm sys-add" onclick="hdpAddRow()">'+svg(I.plus)+'Add Parameter</button></div>'+
    '</div><div class="drw-f"><button class="btn pri" onclick="saveHd()">'+svg(I.save)+(ed?tx('Lưu','Save'):tx('Thêm header','Add header'))+'</button>'+
    (ed?'<button class="btn dgr" onclick="hdDelAsk(\''+HDE.id+'\')">'+svg(I.trash)+tx('Xoá','Delete')+'</button>':'')+
    '<button class="btn" style="margin-left:auto" onclick="closeDrawer()">'+tx('Huỷ','Cancel')+'</button></div>');
  setTimeout(function(){ var e=document.getElementById('hd_n'); if(e&&!ed&&!HDE.n) e.focus() },50);
}
function saveHd(){
  hdGrab(); var E={}, PE={}, n=(HDE.n||'').trim(), seen={};
  if(!n) E.n=tx('Nhập tên header','Enter the header name');
  else if(HDRS.some(function(h){ return h.u===HDE.u&&h.id!==HDE.id&&h.n.toLowerCase()===n.toLowerCase() })) E.n=tx('Đơn vị đã có header tên này','This unit already has a header with this name');
  var P=HDE.params.filter(function(p){ return String(p.k||'').trim()||String(p.v||'').trim() });
  HDE.params=P.length?P:HDE.params;
  if(!P.length) E.params=tx('Thêm ít nhất một parameter','Add at least one parameter');
  P.forEach(function(p,i){
    var k=String(p.k||'').trim(), v=String(p.v||'').trim(), e={};
    if(!k) e.k=tx('Nhập Key','Enter the Key');
    else if(!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(k)) e.k=tx('Key chỉ gồm chữ không dấu, số và - _ . (không khoảng trắng)','Letters, digits and - _ . only (no spaces)');
    else if(seen[k.toLowerCase()]) e.k=tx('Key bị trùng trong header này','Duplicate Key in this header');
    if(k) seen[k.toLowerCase()]=1;
    if(!v) e.v=tx('Nhập Value','Enter the Value'); else if(/[\r\n]/.test(v)) e.v=tx('Value không được xuống dòng','No line breaks');
    if(e.k||e.v) PE[i]=e;
  });
  if(Object.keys(PE).length) E.p=PE;
  var h=HDE.id?hdById(HDE.id):null;
  HDE.err=E; if(Object.keys(E).length) return drawHd();
  var t=nowStr(), me=ACTORS[ACT].acc, isNew=!h, params=P.map(function(p){ return {k:String(p.k).trim(),v:String(p.v).trim()} });
  if(h){
    var chg=[]; if(h.n!==n) chg.push(tx('tên','name')); if(JSON.stringify(h.params)!==JSON.stringify(params)) chg.push('parameters'); 
    h.n=n; h.params=params; h.mo=(HDE.mo||'').trim(); h.by=me; h.t=t;
    auditLog(tx('Sửa header dùng chung','Edit shared header'),unitName(h.u)+' · '+n+' ('+params.map(function(p){return p.k}).join(', ')+')'+(chg.length?' · '+chg.join(', '):''));
  } else {
    HD_SEQ++; h={id:'hd-'+HD_SEQ,u:HDE.u,n:n,on:HDE.on,mo:(HDE.mo||'').trim(),by:me,t:t,params:params}; HDRS.push(h);
    auditLog(tx('Thêm header dùng chung','Add shared header'),unitName(h.u)+' · '+n+' ('+params.map(function(p){return p.k}).join(', ')+')');
  }
  var fn=HDE.forNode; HDE=null; closeDrawer();
  if(fn){ var node=nodeById(fn.node); if(node&&isNew&&h.on){ sysGet(node).headers=[{ref:h.id,keys:h.params.map(function(p){return p.k})}]; markDirty() } HDP.open=false; HDP.q=''; sysDraw() }
  else if(page==='header') PAGES.header();
  toast(isNew?tx('Đã thêm header','Header added'):tx('Đã lưu header','Header saved'),esc(n)+' · '+params.length+' parameter');
}
function hdTog(id){
  var h=hdById(id); if(!h) return;
  if(h.on){
    var us=hdUses(id);
    if(us.length){
      cfmShow({title:tx('Chưa ngưng được header','Cannot deactivate this header'),no:tx('Đóng','Close'),
        body:'<p>'+tx('Header <b>'+esc(h.n)+'</b> đang được '+us.length+' node sử dụng. Bỏ chọn header ở các node này trước khi ngưng:','Header <b>'+esc(h.n)+'</b> is used by '+us.length+' node(s). Remove it from these nodes before deactivating:')+'</p>'+
          '<ul class="cfm-err">'+us.map(function(x){ return '<li><div><b>'+esc(x.wn)+'</b><span>'+esc(x.nn)+'</span></div><button class="btn xs" onclick="cfmClose();hdOpenNode(\''+x.wf+'\',\''+x.node+'\')">'+tx('Mở node','Open node')+'</button></li>' }).join('')+'</ul>'});
      return;
    }
  }
  h.on=h.on?0:1; h.by=ACTORS[ACT].acc; h.t=nowStr();
  auditLog(h.on?tx('Kích hoạt header dùng chung','Activate shared header'):tx('Ngưng header dùng chung','Deactivate shared header'),unitName(h.u)+' · '+h.n);
  if(page==='header') PAGES.header();
  toast(h.on?tx('Đã chuyển sang Đang dùng','Set to Active'):tx('Đã ngưng header','Header deactivated'),esc(h.n));
}
function hdDelAsk(id){
  var h=hdById(id); if(!h) return; var us=hdUses(id);
  if(us.length){
    cfmShow({title:tx('Chưa xoá được header','Cannot delete this header'),no:tx('Đóng','Close'),
      body:'<p>'+tx('Header <b>'+esc(h.n)+'</b> đang được '+us.length+' node sử dụng. Bỏ chọn header ở các node này trước khi xoá:','Header <b>'+esc(h.n)+'</b> is used by '+us.length+' node(s). Remove it from these nodes before deleting:')+'</p>'+
        '<ul class="cfm-err">'+us.map(function(x){ return '<li><div><b>'+esc(x.wn)+'</b><span>'+esc(x.nn)+'</span></div><button class="btn xs" onclick="cfmClose();closeDrawer();hdOpenNode(\''+x.wf+'\',\''+x.node+'\')">'+tx('Mở node','Open node')+'</button></li>' }).join('')+'</ul>'});
    return;
  }
  cfmShow({title:tx('Xoá header','Delete header'),ok:tx('Xoá','Delete'),okCls:'dgr-s',onOk:function(){ doDelHd(id) },
    body:'<p>'+tx('Bạn có chắc muốn xoá header <b>'+esc(h.n)+'</b> ('+h.params.length+' parameter)?','Are you sure you want to delete header <b>'+esc(h.n)+'</b> ('+h.params.length+' parameter(s))?')+'</p>'});
}
function doDelHd(id){
  var h=hdById(id); if(!h||hdUses(id).length) return;
  HDRS.splice(HDRS.indexOf(h),1);
  auditLog(tx('Xoá header dùng chung','Delete shared header'),unitName(h.u)+' · '+h.n);
  closeDrawer(); if(page==='header') PAGES.header();
  toast(tx('Đã xoá header','Header deleted'),esc(h.n));
}
function hdOpenNode(wf,node){
  closeDrawer(); useUnit(wfUnit(wf)); openWf(wf);
  setTimeout(function(){ DSN.inspOn=true; DSN.sel=node; DSN.tab='cf'; renderNodes(); renderInsp(); if(typeof sysJump==='function') try{ sysJump() }catch(e){} },60);
}

/* ---------------- node Tác vụ hệ thống: chọn 1 header, rồi chọn 1 / vài / tất cả Parameters ---------------- */
var HDP={open:false,q:'',po:false};
function hdpItems(){
  var u=wfUnit(DSN.id), q=gNorm(HDP.q||'');
  return HDRS.filter(function(h){ return h.u===u&&h.on&&(!q||gNorm(h.n+' '+h.params.map(function(p){return p.k}).join(' ')).indexOf(q)>=0) });
}
function hdpRef(n){ return sysGet(n).headers.filter(function(x){return x.ref})[0]||null }
function hdpCur(n){ var r=hdpRef(n); return r?r.ref:'' }
/* các key đang chọn (đã đối chiếu với header hiện tại) + key đã bị xoá khỏi header */
function hdSel(ref){
  var o=hdById(ref.ref); if(!o) return {o:null,keys:[],gone:[]};
  var all=o.params.map(function(p){return p.k}), ks=ref.keys||all;
  return {o:o,keys:all.filter(function(k){ return ks.indexOf(k)>=0 }),gone:ks.filter(function(k){ return all.indexOf(k)<0 })};
}
/* header mẫu / dữ liệu cũ chưa có keys → mặc định chọn tất cả */
(function(){ Object.keys(DEFS).forEach(function(k){ DEFS[k].nodes.forEach(function(n){
  if(n.t!=='sys'||!n.http) return;
  (n.http.headers||[]).forEach(function(x){ if(x.ref&&!x.keys){ var o=hdById(x.ref); if(o) x.keys=o.params.map(function(p){return p.k}) } });
}) }) })();
function hdpListHTML(n){
  var it=hdpItems(), cur=hdpCur(n);
  if(!it.length) return '<div class="hdp-empty">'+(HDP.q?tx('Không có header khớp từ khoá','No header matches'):tx('Đơn vị chưa có header đang dùng','This unit has no active header'))+'</div>';
  return it.map(function(h){ var on=h.id===cur;
    return '<button type="button" role="option" aria-selected="'+on+'" class="hdp-i'+(on?' on':'')+'" onclick="hdpPick(\''+h.id+'\')">'+
      '<span class="hdp-rd" aria-hidden="true"></span>'+
      '<span class="hdp-tx"><b>'+esc(h.n)+'</b>'+hdKeysHTML(h,4)+'</span></button>' }).join('');
}
function hdpMsHTML(o,S){
  var N=o.params.length, c=S.keys.length, all=c===N&&N>0;
  var chips=S.keys.map(function(k){ var i=o.params.map(function(p){return p.k}).indexOf(k);
    return '<span class="hx-chip mono">'+esc(k)+'<button type="button" aria-label="'+tx('Bỏ ','Remove ')+esc(k)+'" onclick="event.stopPropagation();hdpParTog('+i+')">'+svg(I.x)+'</button></span>' }).join('');
  var pop=HDP.po?'<div class="hdp-pop hdp-pp" role="listbox" aria-multiselectable="true" aria-label="'+tx('Chọn parameter','Choose parameters')+'">'+
      '<button type="button" role="option" aria-selected="'+all+'" class="hdp-i hdp-all'+(all?' on':'')+'" onclick="hdpParAll()"><span class="hdp-cb'+(all?'':(c?' part':''))+'" aria-hidden="true">'+(all?svg(I.check):c?'<i></i>':'')+'</span><span class="hdp-tx"><b>'+tx('Chọn tất cả','Select all')+'</b></span><span class="hdp-n">'+c+'/'+N+'</span></button>'+
      '<div class="hdp-l">'+o.params.map(function(p,i){ var on=S.keys.indexOf(p.k)>=0;
        return '<button type="button" role="option" aria-selected="'+on+'" class="hdp-i'+(on?' on':'')+'" onclick="hdpParTog('+i+')"><span class="hdp-cb" aria-hidden="true">'+(on?svg(I.check):'')+'</span>'+
          '<span class="hdp-tx"><b class="mono">'+esc(p.k)+'</b><span class="mono">'+esc(p.v)+'</span></span></button>' }).join('')+'</div></div>':'';
  return '<div class="hx-p" id="hdpPW"><div class="hx-pl"><span>Parameters</span><em>'+c+'/'+N+'</em></div>'+
    '<div class="hx-box'+(HDP.po?' open':'')+'" id="hdpPS" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="'+(HDP.po?'true':'false')+'" aria-label="Parameters" onclick="hdpParOpen()" onkeydown="if(event.key===\'Enter\'||event.key===\' \'||event.key===\'ArrowDown\'){event.preventDefault();hdpParOpen(true)}">'+
      '<span class="hx-chips">'+(chips||'<span class="ph">'+tx('Chọn parameter…','Choose parameters…')+'</span>')+'</span>'+svg('<path d="M6 9l6 6 6-6"/>')+'</div>'+pop+'</div>';
}
function sysHdrHTML(n,hh){
  var L=hh.headers, legacy=L.filter(function(x){return !x.ref}), ref=L.filter(function(x){return x.ref})[0], S=ref?hdSel(ref):null, o=S?S.o:null;
  var bad=ref&&!o?tx('Header đã bị xoá khỏi danh mục','The header was deleted'):o&&!o.on?tx('Header đã ngưng sử dụng','The header is inactive'):'';
  var msgs=(bad?'<div class="hx-m">'+svg(I.warn)+'<span>'+bad+'</span></div>':'')+
    (S&&S.gone.length?'<div class="hx-m">'+svg(I.warn)+'<span>'+tx('Parameter đã bị xoá khỏi header: ','Parameter removed from the header: ')+'<b class="mono">'+esc(S.gone.join(', '))+'</b></span></div>':'')+
    (o&&!S.keys.length?'<div class="hx-m">'+svg(I.warn)+'<span>'+tx('Chưa chọn parameter nào — node sẽ không gửi header','No parameter selected — the node sends no header')+'</span></div>':'');
  var leg=legacy.map(function(x){ var i=L.indexOf(x);
    return '<div class="hdp-r legacy"><div class="hdp-t"><b>'+esc(x.k||'—')+'</b><span class="mono">'+esc(x.v||'')+'</span></div><span class="chip nb c-draft">'+tx('Nhập tay','Manual')+'</span>'+
      '<button class="xb" title="'+tx('Bỏ','Remove')+'" aria-label="'+tx('Bỏ','Remove')+'" onclick="hdpRm('+i+')">'+svg(I.x)+'</button></div>' }).join('');
  var sel='<div class="hx-h" id="hdpWrap">'+
      '<button type="button" class="hx-sel'+(HDP.open?' open':'')+(ref?'':' empty')+'" aria-haspopup="listbox" aria-expanded="'+(HDP.open?'true':'false')+'" aria-label="Header" onclick="hdpOpen()">'+
        '<span class="hx-ic">'+svg(I.plug)+'</span>'+
        (ref?'<span class="hx-t"><b>'+esc(o?o.n:ref.ref)+'</b>'+(o?'<em>'+o.params.length+' parameter</em>':'')+'</span>':'<span class="hx-t"><span class="ph">'+tx('Chọn header…','Choose a header…')+'</span></span>')+
        svg('<path d="M6 9l6 6 6-6"/>')+'</button>'+
      (ref?'<button type="button" class="xb hx-x" title="'+tx('Bỏ header','Remove header')+'" aria-label="'+tx('Bỏ header','Remove header')+'" onclick="hdpClear()">'+svg(I.x)+'</button>':'')+
      (HDP.open?'<div class="hdp-pop" role="listbox" aria-label="'+tx('Chọn header','Choose a header')+'">'+
        '<div class="hdp-s">'+svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')+'<input class="inp" id="hdpQ" value="'+esc(HDP.q)+'" placeholder="'+tx('Tìm theo tên hoặc key…','Search by name or key…')+'" autocomplete="off" oninput="hdpFind(this.value)"></div>'+
        '<div class="hdp-l" id="hdpList">'+hdpListHTML(n)+'</div>'+
        '<div class="hdp-f"><button class="link" onclick="hdpNew()">'+svg(I.plus)+tx('Khai báo header mới','Declare a new header')+'</button></div></div>':'')+
    '</div>';
  return '<div class="sys-sep"></div><div class="qp-h"><b>Headers</b></div>'+
    '<div class="hx'+(bad?' bad':'')+'">'+sel+(o?hdpMsHTML(o,S):'')+msgs+'</div>'+leg;
}
function hdpOpen(v){ HDP.po=false; HDP.open=v===undefined?!HDP.open:!!v; if(!HDP.open) HDP.q=''; sysDraw(); if(HDP.open) setTimeout(function(){ var p=document.querySelector('.hdp-pop'), q=document.getElementById('hdpQ'); if(p) p.scrollIntoView({block:'nearest'}); if(q) q.focus({preventScroll:true}) },20) }
function hdpFind(v){ HDP.q=v; var n=nodeById(DSN.sel), l=document.getElementById('hdpList'); if(n&&l) l.innerHTML=hdpListHTML(n) }
function hdpPick(id){
  var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n), o=hdById(id), old=hdpRef(n);
  h.headers=h.headers.filter(function(x){return !x.ref}).concat([{ref:id,keys:(old&&old.ref===id&&old.keys)?old.keys:o.params.map(function(p){return p.k})}]);
  HDP.open=false; HDP.q=''; HDP.po=false; markDirty(); sysDraw();
}
function hdpParOpen(v){ HDP.open=false; HDP.q=''; HDP.po=v===undefined?!HDP.po:!!v; sysDraw(); if(HDP.po) setTimeout(function(){ var p=document.querySelector('.hdp-pp'); if(p) p.scrollIntoView({block:'nearest'}) },20) }
function hdpParTog(i){
  var n=nodeById(DSN.sel); if(!n) return; var r=hdpRef(n), S=r&&hdSel(r); if(!S||!S.o) return; var k=S.o.params[i].k;
  var ks=S.keys.slice(), at=ks.indexOf(k); if(at>=0) ks.splice(at,1); else ks.push(k);
  r.keys=S.o.params.map(function(p){return p.k}).filter(function(x){ return ks.indexOf(x)>=0 }); markDirty(); sysDraw();
}
function hdpParAll(){
  var n=nodeById(DSN.sel); if(!n) return; var r=hdpRef(n), S=r&&hdSel(r); if(!S||!S.o) return;
  r.keys=S.keys.length===S.o.params.length?[]:S.o.params.map(function(p){return p.k}); markDirty(); sysDraw();
}
function hdpClear(){ var n=nodeById(DSN.sel); if(!n) return; var h=sysGet(n); h.headers=h.headers.filter(function(x){return !x.ref}); HDP.po=false; markDirty(); sysDraw() }
function hdpRm(i){ var n=nodeById(DSN.sel); if(!n) return; sysGet(n).headers.splice(i,1); markDirty(); sysDraw() }
function hdpNew(){ HDP.open=false; openHd('',{u:wfUnit(DSN.id),node:DSN.sel}) }
document.addEventListener('mousedown',function(e){
  if(!HDP.open&&!HDP.po) return; var w=document.getElementById('hdpWrap'), w2=document.getElementById('hdpPW'), t=e.target;
  if(t.closest&&t.closest('#drw,.cfm-bg,#hdpPS,.hx-sel,#fdpWrap,.vx,#vxPop')) return;
  var inW=w&&w.contains(t), inW2=w2&&w2.contains(t);
  if((HDP.open&&!inW)||(HDP.po&&!inW2)){ if(!inW) { HDP.open=false; HDP.q='' } if(!inW2) HDP.po=false; sysDraw() }
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&(HDP.open||HDP.po)&&(document.getElementById('hdpWrap')||document.getElementById('hdpPW'))){ e.stopImmediatePropagation(); if(HDP.po){ HDP.po=false; sysDraw(); var b=document.getElementById('hdpPS'); if(b) b.focus() } else hdpOpen(false) } },true);
(function(){ var si=selectNode; selectNode=function(){ HDP.open=false; HDP.q=''; HDP.po=false; return si.apply(this,arguments) } })();
/* xuất bản: header tham chiếu đã xoá / đã ngưng */
(function(){
  var pe=publishErrors;
  publishErrors=function(){
    var e=pe.apply(this,arguments);
    def().nodes.forEach(function(n){ if(n.t!=='sys') return;
      sysGet(n).headers.forEach(function(x){ if(!x.ref) return; var o=hdById(x.ref);
        if(!o) e.push({n:n,m:tx('Header đã chọn không còn trong danh mục Header dùng chung','The selected header no longer exists in Shared headers'),sys:1});
        else if(!o.on) e.push({n:n,m:tx('Header “'+o.n+'” đã ngưng sử dụng','Header “'+o.n+'” is inactive'),sys:1});
        else { var S=hdSel(x);
          if(!S.keys.length) e.push({n:n,m:tx('Chưa chọn parameter nào của header “'+o.n+'”','No parameter selected from header “'+o.n+'”'),sys:1});
          if(S.gone.length) e.push({n:n,m:tx('Parameter '+S.gone.join(', ')+' không còn trong header “'+o.n+'”','Parameter '+S.gone.join(', ')+' no longer exists in header “'+o.n+'”'),sys:1}) }
      });
    });
    return e;
  };
})();

