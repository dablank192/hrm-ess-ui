/* Shared breadcrumb navigation and icon-only Admin sidebar. */
(() => {
  const icons={
    'Access Configuration':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    'Business workflows':'<rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M8 5h9a2 2 0 0 1 2 2v9M5 8v9a2 2 0 0 0 2 2h9"/>',
    'User Group':'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5"/>',
    'Approval matrix':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18M15 9v12M9 15h12"/>',
    'Shared headers':'<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
    'API management':'<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>'
  };
  function sync(){
    document.querySelectorAll('#adminCenterSidebar .ess-workflow-nav-item').forEach(item=>{
      if(item.querySelector('.ess-collapsed-icon'))return;
      const name=item.textContent.trim(),path=icons[name];if(!path)return;
      item.insertAdjacentHTML('afterbegin','<svg class="ess-collapsed-icon" viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>');
      item.setAttribute('aria-label',name);item.title=name;
    });
    const link=document.querySelector('.ess-matrix-breadcrumb [data-matrix-library]');
    if(!link||link.closest('.ess-breadcrumb-group'))return;
    const wrap=document.createElement('span');wrap.className='ess-breadcrumb-group';link.before(wrap);wrap.append(link);
    const menu=document.createElement('nav');menu.className='ess-breadcrumb-submenu';menu.setAttribute('aria-label','Ticket Management submenu');menu.hidden=true;
    const entries=[['thiet-ke','Business workflows'],['user-group','User Group'],['ma-tran','Approval matrix'],['header','Shared headers'],['field','API management']];
    entries.forEach(([key,label])=>{const child=document.createElement('a');child.href='features/admin/ticket-management/business-workflows/index.html?view='+key;child.textContent=label;
      child.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();menu.hidden=true;link.setAttribute('aria-expanded','false');workflowNavigate(key);});menu.append(child);});
    wrap.append(menu);link.setAttribute('aria-haspopup','true');link.setAttribute('aria-expanded','false');
    const open=()=>{menu.hidden=false;link.setAttribute('aria-expanded','true');};
    const close=()=>{menu.hidden=true;link.setAttribute('aria-expanded','false');};
    wrap.addEventListener('mouseenter',open);wrap.addEventListener('mouseleave',close);
    wrap.addEventListener('focusin',open);wrap.addEventListener('focusout',event=>{if(!wrap.contains(event.relatedTarget))close();});
    wrap.addEventListener('keydown',event=>{if(event.key==='Escape'){link.focus();close();event.preventDefault();}if(event.key==='ArrowDown'){open();menu.querySelector('a')?.focus();event.preventDefault();}});
  }
  new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});sync();
})();
