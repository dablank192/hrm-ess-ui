/* Shared Header v2 notification prototype. Only fixture IDs/read state are kept per tab. */
(() => {
  const bell = document.getElementById('notificationButton');
  if (!bell) return;
  const popover = document.getElementById('notificationPopover');
  const list = document.getElementById('notificationList');
  const badge = document.getElementById('notificationBadge');
  const markAll = document.getElementById('markAllRead');
  const toast = document.getElementById('toast');
  const toastUndo = document.getElementById('toastUndo');
  const storageKey = 'hrm-ess-notification-fixture-v2';
  const english = document.documentElement.lang === 'en' || bell.closest('header')?.lang === 'en';
  const copy = english ? {
    heading:'Notifications',unread:'unread',delete:'Delete notification',options:'Notification options',
    empty:'No notifications yet',emptyDetail:'New notifications will appear here.',deleted:'Notification deleted'
  } : {
    heading:'Thông báo',unread:'chưa đọc',delete:'Xóa thông báo',options:'Tùy chọn thông báo',
    empty:'Chưa có thông báo',emptyDetail:'Thông báo mới sẽ xuất hiện tại đây.',deleted:'Đã xóa thông báo'
  };
  const fixture = english ? [
    {id:1,title:'Complete Identification Information',description:'Add the missing identification details to your employee profile.',time:'Just now',unread:true,destination:'features/employee-profile/index.html'},
    {id:2,title:'Confirm September 2026 Timesheet',description:'Review and confirm your September timesheet before the timesheet lock date.',time:'1 hour ago',unread:true},
    {id:3,title:'Internal Policy Assessment',description:'Due 22/09/2026',time:'Yesterday',unread:false},
    {id:4,title:'TK-2026-013 (Leave) is waiting for your approval',description:'Manage Ticket · Approval',time:'10 minutes ago',unread:true,destination:'features/tickets/my-tickets/index.html#approvals'},
    {id:5,title:'TK-2026-021 was approved at Line manager approval',description:'Manage Ticket · My Ticket',time:'2 hours ago',unread:true,destination:'features/tickets/my-tickets/index.html'},
    {id:6,title:'TK-2026-002 was rejected',description:'Manage Ticket · My Ticket',time:'Yesterday',unread:false,destination:'features/tickets/my-tickets/index.html'},
    {id:7,title:'New message on TK-2026-010',description:'Manage Ticket · My Ticket',time:'3 hours ago',unread:true,destination:'features/tickets/my-tickets/index.html'}
  ] : [
    {id:1,title:'Hoàn thiện thông tin định danh',description:'Bổ sung thông tin giấy tờ còn thiếu trong hồ sơ nhân viên',time:'Vừa xong',unread:true,destination:'features/employee-profile/index.html'},
    {id:2,title:'Xác nhận bảng công tháng 09/2026',description:'Kiểm tra và xác nhận bảng công tháng 09 trước ngày khóa công',time:'1 giờ trước',unread:true},
    {id:3,title:'Kiểm tra Quy định nội bộ',description:'Hạn 22/09/2026',time:'Hôm qua',unread:false},
    {id:4,title:'TK-2026-013 (Leave) đang chờ bạn duyệt',description:'Manage Ticket · Approval',time:'10 phút trước',unread:true,destination:'features/tickets/my-tickets/index.html#approvals'},
    {id:5,title:'TK-2026-021 đã được duyệt ở bước Line manager approval',description:'Manage Ticket · My Ticket',time:'2 giờ trước',unread:true,destination:'features/tickets/my-tickets/index.html'},
    {id:6,title:'TK-2026-002 đã bị từ chối',description:'Manage Ticket · My Ticket',time:'Hôm qua',unread:false,destination:'features/tickets/my-tickets/index.html'},
    {id:7,title:'Có tin nhắn mới ở TK-2026-010',description:'Manage Ticket · My Ticket',time:'3 giờ trước',unread:true,destination:'features/tickets/my-tickets/index.html'}
  ];
  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function loadItems() {
    try {
      const state = JSON.parse(sessionStorage.getItem(storageKey));
      if (state && Array.isArray(state.ids) && Array.isArray(state.readIds)) {
        return state.ids.map(id => fixture.find(item => item.id === id)).filter(Boolean).map(item => ({...item,unread:!state.readIds.includes(item.id)}));
      }
    } catch (_) { /* Storage can be unavailable; the fixture still works in memory. */ }
    return fixture.map(item => ({...item}));
  }
  const items = loadItems();
  let deleted = null;
  let undoTimer;
  function save() {
    try { sessionStorage.setItem(storageKey,JSON.stringify({ids:items.map(item=>item.id),readIds:items.filter(item=>!item.unread).map(item=>item.id)})); }
    catch (_) { /* No backend or mandatory storage for this prototype. */ }
  }
  function render() {
    const unread = items.filter(item => item.unread).length;
    badge.hidden = unread === 0;
    badge.textContent = unread > 9 ? '9+' : String(unread);
    bell.setAttribute('aria-label',unread ? `${copy.heading}, ${unread} ${copy.unread}` : copy.heading);
    markAll.hidden = unread === 0;
    list.innerHTML = items.length ? items.map(item => `<div class="notification-entry${item.unread?' unread':''}" role="listitem" data-notification-id="${item.id}">
      <button class="notification-row" type="button" aria-label="${escapeHtml(item.title)}${item.unread?`, ${copy.unread}`:''}">${item.unread?'<span class="notification-dot" aria-hidden="true"></span>':''}<span class="notification-copy"><span class="notification-title">${escapeHtml(item.title)}</span><span class="notification-description">${escapeHtml(item.description)}</span><span class="notification-time">${escapeHtml(item.time)}</span></span></button>
      <button class="notification-delete" type="button" aria-label="${copy.delete}: ${escapeHtml(item.title)}" title="${copy.delete}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 6h12M8 4h4m-6 2 .6 10h6.8L14 6M8.5 9v4m3-4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button class="notification-more" type="button" aria-label="${copy.options}: ${escapeHtml(item.title)}" aria-expanded="false" aria-controls="notification-actions-${item.id}"><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg></button>
      <div class="notification-overflow-menu" id="notification-actions-${item.id}" hidden><button type="button" class="notification-delete-mobile">${copy.delete}</button></div>
    </div>`).join('') : `<div class="notification-empty" role="listitem"><strong>${copy.empty}</strong><p>${copy.emptyDetail}</p></div>`;
  }
  function close() {popover.hidden=true;bell.setAttribute('aria-expanded','false')}
  function dismissUndo() {deleted=null;clearTimeout(undoTimer);toastUndo.hidden=true}
  function deleteItem(id) {
    const index = items.findIndex(item => item.id === id);
    if (index < 0) return;
    deleted = {item:items[index],index};
    items.splice(index,1);
    save();render();bell.focus();
    document.getElementById('toastMessage').textContent=copy.deleted;
    toastUndo.hidden=false;toast.hidden=false;
    clearTimeout(undoTimer);
    undoTimer=setTimeout(()=>{toast.hidden=true;dismissUndo()},6500);
  }
  bell.addEventListener('click',() => {
    const opening=popover.hidden;
    for (const [panelId,triggerId] of [['floatingMenu','menuButton'],['avatarMenu','avatarButton']]) {
      const panel=document.getElementById(panelId),trigger=document.getElementById(triggerId);
      if(panel){panel.hidden=true;trigger?.setAttribute('aria-expanded','false')}
    }
    popover.hidden=!opening;bell.setAttribute('aria-expanded',String(opening));
  });
  markAll.addEventListener('click',() => {items.forEach(item=>{item.unread=false});save();render();bell.focus()});
  list.addEventListener('click',event => {
    const entry=event.target.closest('[data-notification-id]');
    if(!entry)return;
    // Rendering replaces a clicked row, so keep its event from closing the popover.
    event.stopPropagation();
    const id=Number(entry.dataset.notificationId);
    if(event.target.closest('.notification-delete,.notification-delete-mobile')){deleteItem(id);return}
    if(event.target.closest('.notification-more')){
      const menu=entry.querySelector('.notification-overflow-menu');
      const opening=menu.hidden;
      list.querySelectorAll('.notification-overflow-menu').forEach(other=>{other.hidden=true;other.parentElement.querySelector('.notification-more').setAttribute('aria-expanded','false')});
      menu.hidden=!opening;entry.querySelector('.notification-more').setAttribute('aria-expanded',String(opening));return;
    }
    if(event.target.closest('.notification-row')){
      const item=items.find(candidate=>candidate.id===id);
      item.unread=false;save();render();
      if(item.destination){location.assign(item.destination);return}
      list.querySelector(`[data-notification-id="${id}"] .notification-row`)?.focus();
    }
  });
  toastUndo.addEventListener('click',() => {
    if(!deleted)return;
    const restoredId=deleted.item.id;
    items.splice(deleted.index,0,deleted.item);
    dismissUndo();save();render();toast.hidden=true;
    if(!popover.hidden)list.querySelector(`[data-notification-id="${restoredId}"] .notification-row`)?.focus();
  });
  document.getElementById('toastClose')?.addEventListener('click',dismissUndo);
  document.addEventListener('click',event=>{if(!popover.hidden&&!popover.contains(event.target)&&!bell.contains(event.target))close()});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!popover.hidden){close();bell.focus();event.stopImmediatePropagation()}
  });
  window.HrmNotifications={close,dismissUndo};
  render();
})();
