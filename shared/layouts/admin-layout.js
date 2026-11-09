/* Shared Admin navigation state; workflow actions retain their existing leave guard. */
(() => {
  const layout=document.querySelector('.ess-admin-layout');
  if(!layout)return;
  const collapse=document.querySelector('[data-admin-collapse]');
  const storageKey=layout.dataset.navigationStorage||'hrm-ess-admin-navigation-collapsed';
  let collapsed=false;
  try{collapsed=localStorage.getItem(storageKey)==='true'}catch(_){}
  function render(){
    layout.classList.toggle('is-sidebar-collapsed',collapsed);
    collapse.setAttribute('aria-expanded',String(!collapsed));
    const label=collapsed?'Expand navigation':'Collapse navigation';
    collapse.setAttribute('aria-label',label);
    collapse.setAttribute('title',label);
  }
  collapse.onclick=()=>{
    collapsed=!collapsed;
    render();
    try{localStorage.setItem(storageKey,String(collapsed))}catch(_){}
  };
  document.querySelectorAll('[data-admin-group-toggle]').forEach(group=>{
    const items=document.getElementById(group.getAttribute('aria-controls'));
    if(!items)return;
    group.onclick=()=>{
      const expanded=group.getAttribute('aria-expanded')!=='true';
      group.setAttribute('aria-expanded',String(expanded));
      items.hidden=!expanded;
    };
  });
  render();
  const view=new URLSearchParams(location.search||'').get('view');
  if(['thiet-ke','user-group','ma-tran'].includes(view)&&typeof workflowNavigate==='function')workflowNavigate(view);
})();
