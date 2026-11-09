/* Keep the profile context while reusing the existing request form and record store. */
(()=>{
 let layer=null,frame=null,trigger=null,background=[];
 const expanded=new Set(['nguoi-than','trinh-do-hoc-van','chung-chi','kinh-nghiem-lam-viec','to-chuc-xa-hoi','khen-thuong','ky-luat']);
 function requestClose(){frame?.contentWindow?.requestProfileFormClose?.()}
 function close(submitted){
  layer?.remove();layer=null;frame=null;
  for(const [element,inert] of background)element.inert=inert;
  background=[];trigger?.focus();
  if(submitted){
   sessionStorage.setItem('profile-form-return',JSON.stringify({hash:location.hash,panes:[...document.querySelectorAll('.profile-scroll')].map(el=>el.scrollTop),expanded:[...document.querySelectorAll('[data-block-toggle][aria-expanded=true]')].map(el=>el.dataset.blockToggle)}));
   location.reload();
  }
 }
 window.HrmProfileForm={open(block,operation,record){
  if(layer)return;trigger=document.activeElement;
  layer=document.createElement('div');layer.className='profile-editor-layer';
  const dialog=document.createElement('section');dialog.className='profile-editor-dialog'+(expanded.has(block)?' is-expanded':'');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label',operation==='add'?'Thêm mới thông tin hồ sơ':'Cập nhật thông tin hồ sơ');
  frame=document.createElement('iframe');frame.title=dialog.getAttribute('aria-label');
  const search='?'+new URLSearchParams({block,operation,embed:'1',...(record?{record}:{})});
  if(HrmEnvironment.local)frame.srcdoc=HrmEnvironment.embed(window.essEmbeddedPages.profileForm,search);
  else frame.src=HrmEnvironment.url('features/employee-profile/forms/index.html')+search;
  dialog.append(frame);layer.append(dialog);
  background=[...document.body.children].map(el=>[el,el.inert]);for(const [element] of background)element.inert=true;
  document.body.append(layer);frame.addEventListener('load',()=>frame.contentWindow.focus());
  layer.addEventListener('click',event=>{if(event.target===layer)requestClose()});
 }};
 window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame?.contentWindow)return;if(event.data?.type==='profile-form-close')close(event.data.submitted===true);else if(event.data?.type==='profile-form-size'&&!layer.querySelector('.is-expanded')&&Number.isFinite(event.data.height)){layer.querySelector('.profile-editor-dialog').style.height='min('+Math.max(260,event.data.height)+'px, calc(100dvh - 64px))'}});
 document.addEventListener('keydown',event=>{if(layer&&event.key==='Escape'){event.preventDefault();requestClose()}});
 const saved=sessionStorage.getItem('profile-form-return');if(saved){sessionStorage.removeItem('profile-form-return');try{const state=JSON.parse(saved);requestAnimationFrame(()=>{document.querySelectorAll('[data-block-toggle]').forEach(button=>{if((button.getAttribute('aria-expanded')==='true')!==state.expanded.includes(button.dataset.blockToggle))button.click()});document.querySelectorAll('.profile-scroll').forEach((el,i)=>el.scrollTop=state.panes[i]||0)})}catch{}}
})();
