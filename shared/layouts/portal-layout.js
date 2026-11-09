(() => {
  const menu=document.getElementById('floatingMenu'),menuButton=document.getElementById('menuButton');
  const avatar=document.getElementById('avatarMenu'),avatarButton=document.getElementById('avatarButton');
  const close=(panel,button)=>{panel.hidden=true;button.setAttribute('aria-expanded','false');};
  menuButton.addEventListener('click',()=>{const open=menu.hidden;close(avatar,avatarButton);window.HrmNotifications?.close();menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));});
  avatarButton.addEventListener('click',()=>{const open=avatar.hidden;close(menu,menuButton);window.HrmNotifications?.close();avatar.hidden=!open;avatarButton.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',e=>{const action=e.target.closest('.global-header [data-open]');if(action){window.toast?.('Selected: '+action.dataset.open);close(menu,menuButton);close(avatar,avatarButton);}if(!menu.contains(e.target)&&!menuButton.contains(e.target))close(menu,menuButton);if(!avatar.contains(e.target)&&!avatarButton.contains(e.target))close(avatar,avatarButton);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){close(menu,menuButton);close(avatar,avatarButton);}});
  document.getElementById('toastClose').addEventListener('click',()=>document.getElementById('headerToast').hidden=true);
  function route(){const hash=location.hash.slice(1);const routes={'my-tickets':'don-cua-toi','create-ticket':'tao-don'};if(document.body.dataset.portal==='employee'&&routes[hash])window.go(routes[hash]);}
  window.addEventListener('hashchange',route);route();
})();
