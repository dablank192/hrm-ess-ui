/* Keep the designer frame in the viewport; long node content uses its shared scroll. */
(() => {
  const view=document.getElementById('view');
  if(!view)return;
  let lastPane=null,lastSelection='';
  function sync(){
    const pane=view.querySelector('.dsn'),heading=view.querySelector(':scope > .page-head');
    const title=heading?.querySelector('h1')?.textContent.trim();
    const managementList=!pane&&['Business workflows','User Group','Approval matrix','Shared headers','API management'].includes(title);
    if(heading){
      heading.classList.toggle('ess-management-list-heading',managementList);
      heading.classList.toggle('ess-matrix-heading',managementList);
    }
    if(managementList&&!view.querySelector('.ess-matrix-breadcrumb')){
      const breadcrumb=document.createElement('nav');
      breadcrumb.className='ess-matrix-breadcrumb';
      breadcrumb.setAttribute('aria-label','Breadcrumb');
      breadcrumb.innerHTML='<a href="features/admin/access-configuration/index.html">Admin Center</a><span aria-hidden="true">›</span>'+
        '<a href="features/admin/ticket-management/business-workflows/index.html" data-matrix-library>Ticket Management</a><span aria-hidden="true">›</span>'+
        '<span aria-current="page">'+title+'</span>';
      view.insertBefore(breadcrumb,heading);
    }
    const tableList=managementList&&['Approval matrix','Shared headers','User Group','API management'].includes(title);
    view.classList.toggle('ess-table-list',tableList);
    if(tableList){
      const card=view.querySelector('.card'),scroller=card?.querySelector('.tbl-wrap');
      card?.classList.add('ess-table-card');
      if(scroller){
        scroller.setAttribute('tabindex','0');
        scroller.setAttribute('role','region');
        scroller.setAttribute('aria-label',title+' table');
        const menu=scroller.querySelector('.rm-pop');
        if(menu){
          const trigger=menu.closest('.rm').querySelector('button').getBoundingClientRect();
          const box=menu.getBoundingClientRect(),bounds=scroller.getBoundingClientRect();
          menu.style.setProperty('--ess-menu-top',Math.max(bounds.top,Math.min(trigger.bottom+4,bounds.bottom-box.height))+'px');
          menu.style.setProperty('--ess-menu-left',Math.max(bounds.left,Math.min(trigger.right-box.width,bounds.right-box.width))+'px');
        }
      }
    }
    if(!pane){lastPane=null;lastSelection='';return}
    const available=Math.max(0,(window.innerHeight||document.documentElement.clientHeight)-pane.getBoundingClientRect().top-24);
    pane.style.setProperty('--ess-designer-height',available+'px');
    pane.style.setProperty('--ess-designer-inner-height',Math.max(0,available-2)+'px');
    const selection=[DSN.id,DSN.sel,DSN.tab,DSN.exp].join('|');
    if(pane!==lastPane||selection!==lastSelection){pane.scrollTop=0;pane.scrollLeft=0}
    lastPane=pane;lastSelection=selection;
  }
  new MutationObserver(sync).observe(view,{childList:true,subtree:true});
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(sync).observe(view);
  window.addEventListener('resize',sync);
  view.addEventListener('scroll',sync,true);
  window.HrmWorkflowLayout={sync};
  sync();
})();
