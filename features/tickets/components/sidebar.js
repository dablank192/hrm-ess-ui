/* Ticket-specific state; the Admin Center component supplies shared styling. */
(() => {
 const layout=document.getElementById('ticketLayout');
 const collapse=document.getElementById('ticketSidebarCollapse');
 const group=document.getElementById('ticketGroupToggle');
 const items=document.getElementById('ticketNavItems');
 const storageKey='hrm-ess-ticket-navigation-collapsed';
 let collapsed=false;
 try{collapsed=localStorage.getItem(storageKey)==='true'}catch(_){}
 function render(){
  layout.classList.toggle('is-sidebar-collapsed',collapsed);
  collapse.setAttribute('aria-expanded',String(!collapsed));
  const label=collapsed?'Expand navigation':'Collapse navigation';
  collapse.setAttribute('aria-label',label);collapse.setAttribute('title',label);
 }
 collapse.onclick=()=>{collapsed=!collapsed;render();try{localStorage.setItem(storageKey,String(collapsed))}catch(_){}};
 group.onclick=()=>{const expanded=group.getAttribute('aria-expanded')!=='true';group.setAttribute('aria-expanded',String(expanded));items.hidden=!expanded;};
 render();
})();
