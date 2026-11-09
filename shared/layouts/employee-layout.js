function showTaskNotice(message){const toast=document.getElementById('statusToast');toast.textContent=message;toast.hidden=false;clearTimeout(window.taskNoticeTimer);window.taskNoticeTimer=setTimeout(()=>toast.hidden=true,4500)}
(() => {
  const button=document.getElementById('menuButton'),menu=document.getElementById('floatingMenu');
  const close=()=>{if(menu)menu.hidden=true;if(button)button.setAttribute('aria-expanded','false')};
  if(button&&menu)button.onclick=()=>{menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden));window.HrmNotifications?.close?.()};
  document.addEventListener('click',e=>{
    const action=e.target.closest('.global-header [data-open]');
    if(action){
      if(action.classList.contains('header-avatar'))location.assign('features/employee-profile/index.html');
      else showTaskNotice(action.dataset.open+' is ready to connect to the corresponding service.');
      close();
    }else if(menu&&button&&!menu.contains(e.target)&&!button.contains(e.target))close();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.getElementById('toastClose').onclick=()=>document.getElementById('toast').hidden=true;
  document.querySelectorAll('.avatar-photo').forEach(img=>img.addEventListener('error',()=>img.hidden=true));
})();
