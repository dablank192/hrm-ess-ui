(() => {
  const button=document.getElementById('menuButton'),menu=document.getElementById('floatingMenu');
  function close(){menu.hidden=true;button.setAttribute('aria-expanded','false')}
  button.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;button.setAttribute('aria-expanded',String(open));const pop=document.getElementById('notificationPopover');pop.hidden=true;document.getElementById('notificationButton').setAttribute('aria-expanded','false')});
  document.addEventListener('click',e=>{const action=e.target.closest('.global-header [data-open]');if(action){toast(action.dataset.open);close()}else if(!menu.contains(e.target)&&!button.contains(e.target))close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.getElementById('toastClose').addEventListener('click',()=>document.getElementById('headerToast').hidden=true);
  document.addEventListener('prototype-notification',e=>toast(e.detail));
  document.querySelectorAll('.avatar-photo').forEach(img=>img.addEventListener('error',()=>img.hidden=true));
})();
