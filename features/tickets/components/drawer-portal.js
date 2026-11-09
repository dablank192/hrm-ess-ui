/* Move only live overlay nodes into a full-height host dialog. List frames never resize. */
function createTicketDrawerPortal({dialog,frame,onRequestClose}){
 let session=null;
 const rootIds=['drw','mdl','withdrawConfirmationLayer','toast'];
 function requestClose(){if(session)onRequestClose(session.role,session.kind)}
 dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose()});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)requestClose()});
 function close(){
  const s=session;if(!s)return;session=null;s.sourceObserver.disconnect();s.portalObserver.disconnect();
  for(const [key,value]of Object.entries(s.original))s.doc[key]=value;
  if(s.activeDescriptor)Object.defineProperty(s.doc,'activeElement',s.activeDescriptor);else delete s.doc.activeElement;
  for(const {node,parent,next}of s.moved){if(next?.parentNode===parent)parent.insertBefore(node,next);else parent.appendChild(node)}
  if(dialog.open)dialog.close();frame.hidden=true;
  s.source.focus({preventScroll:true});if(s.trigger?.isConnected)s.trigger.focus({preventScroll:true});
 }
 function open(role,kind='ticket'){
  if(session?.role===role&&session.kind===kind){session.collect();return}
  close();
  const source=frameForRole(role),win=source.contentWindow,doc=win.document;
  const original={getElementById:doc.getElementById,querySelector:doc.querySelector,querySelectorAll:doc.querySelectorAll};
  const find=id=>original.getElementById.call(doc,id),trigger=kind==='delegation'?find('createDelegationTrigger'):doc.activeElement;
  const main=find(kind==='delegation'?'delegationLayer':'drw');if(!main)return;
  frame.hidden=false;const portal=frame.contentDocument;
  portal.open();portal.write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>');portal.close();
  const base=portal.createElement('base');base.href=doc.baseURI;portal.head.appendChild(base);
  original.querySelectorAll.call(doc,'head style,head link[rel="stylesheet"]').forEach(node=>portal.head.appendChild(node.cloneNode(true)));
  portal.body.className=doc.body.className+' ticket-drawer-portal';
  const style=portal.createElement('style');style.textContent='html,body{height:100%;margin:0;overflow:hidden;background:transparent!important}body.ticket-surface.ticket-drawer-portal #drw{top:0!important;left:auto!important;right:0;height:100%!important;transition:none}body.ticket-drawer-portal .delegation-layer{background:transparent!important}';portal.head.appendChild(style);
  const moved=[],known=new Set();
  function bindHandlers(root){
   for(const element of [root,...root.querySelectorAll('*')])for(const attr of [...element.attributes])if(/^on[a-z]+$/.test(attr.name)){
    const handler=element[attr.name];if(!(handler instanceof win.Function))element[attr.name]=win.Function('event',attr.value);
   }
  }
  function move(node){if(!node||known.has(node))return;bindHandlers(node);moved.push({node,parent:node.parentNode,next:node.nextSibling});known.add(node);portal.body.appendChild(node)}
  function collect(){
   move(main);for(const id of rootIds)move(find(id));
   for(const node of known)bindHandlers(node);
  }
  const activeDescriptor=Object.getOwnPropertyDescriptor(doc,'activeElement');
  let proto=doc,activeGetter;while(proto&&!activeGetter){activeGetter=Object.getOwnPropertyDescriptor(proto,'activeElement')?.get;proto=Object.getPrototypeOf(proto)}
  doc.getElementById=function(id){return original.getElementById.call(doc,id)||portal.getElementById(id)};
  doc.querySelector=function(selector){return original.querySelector.call(doc,selector)||portal.querySelector(selector)};
  doc.querySelectorAll=function(selector){return [...original.querySelectorAll.call(doc,selector),...portal.querySelectorAll(selector)]};
  if(activeGetter)Object.defineProperty(doc,'activeElement',{configurable:true,get(){const active=portal.activeElement;return active&&active!==portal.body?active:activeGetter.call(doc)}});
  const sourceObserver=new MutationObserver(collect),portalObserver=new MutationObserver(()=>{for(const node of known)bindHandlers(node)});
  session={role,kind,source,doc,original,activeDescriptor,moved,trigger,sourceObserver,portalObserver,collect};
  collect();sourceObserver.observe(doc.body,{childList:true,subtree:true});portalObserver.observe(portal.body,{childList:true,subtree:true});
  // Existing delegated handlers stay in the source realm (including keyboard and diagram pan).
  portal.addEventListener('click',event=>{if(event.target===portal.body||event.target===portal.documentElement)requestClose()});
  for(const type of ['click','input','change','keydown','keyup','mousedown','mousemove','mouseup','pointerdown','pointermove','pointerup'])portal.addEventListener(type,event=>{
   if(!session||session.doc!==doc)return;
   const Ctor=type.startsWith('key')?win.KeyboardEvent:type.startsWith('pointer')?win.PointerEvent:/^(click|mouse)/.test(type)?win.MouseEvent:win.Event;
   const copy=new Ctor(type,{bubbles:true,cancelable:true,key:event.key,code:event.code,shiftKey:event.shiftKey,ctrlKey:event.ctrlKey,altKey:event.altKey,metaKey:event.metaKey,clientX:event.clientX,clientY:event.clientY,button:event.button,buttons:event.buttons});
   Object.defineProperty(copy,'target',{value:event.target});if(event.defaultPrevented)copy.preventDefault();doc.dispatchEvent(copy);if(copy.defaultPrevented)event.preventDefault();
  });
  dialog.dataset.drawerKind=kind;dialog.showModal();
  const focus=main.querySelector(kind==='delegation'?'select,input,button':'button');focus?.focus({preventScroll:true});
  requestAnimationFrame(()=>win.fvFit?.());
 }
 function frameForRole(role){return document.getElementById(role)}
 return {open,close,requestClose,isOwner:role=>session?.role===role};
}
