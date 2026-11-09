/* Role create/edit shares the Approval matrix modal shell and original role validation. */
(() => {
  const drawer = document.getElementById('drw');
  const modal = document.createElement('dialog');
  modal.id = 'roleFormDialog'; modal.className = 'ess-matrix-dialog ess-role-dialog';
  modal.setAttribute('aria-labelledby','roleFormTitle'); document.body.appendChild(modal);
  let drawing = false, opener = null;
  function restore() {
    if (drawer.parentElement !== modal) return false;
    modal.close(); document.body.appendChild(drawer); drawer.innerHTML = '';
    drawer.classList.remove('ess-matrix-modal-content'); drawer.setAttribute('role','dialog');
    document.body.classList.remove('role-form-open'); return true;
  }
  const show = showDrawer;
  showDrawer = function () { if (!drawing) restore(); return show.apply(this,arguments); };
  const close = closeDrawer;
  closeDrawer = function () {
    const owned = restore(); close.apply(this,arguments);
    if (owned && opener?.isConnected) opener.focus({preventScroll:true}); opener = null;
  };
  const draw = ugDraw;
  ugDraw = function () {
    const wasOpen = modal.open, focus = wasOpen ? document.activeElement?.id : '';
    const scroll = drawer.querySelector('.drw-b')?.scrollTop || 0;
    if (!wasOpen) opener = document.activeElement;
    drawing = true;
    try { draw.apply(this,arguments); } finally { drawing = false; }
    const heading = drawer.querySelector('.drw-h h2');
    heading.id = 'roleFormTitle'; heading.textContent = UGE.code ? 'Edit ' + UGE.name : 'Add role';
    drawer.querySelector('.drw-h .meta')?.remove();
    drawer.querySelector('.x-btn').setAttribute('aria-label','Close role form');
    const footer = drawer.querySelector('.drw-f');
    const cancel = footer.querySelector('[onclick="closeDrawer()"]'), save = footer.querySelector('[onclick="ugSave()"]');
    cancel.style.marginLeft = '0'; save.textContent = UGE.code ? 'Save' : 'Add role';
    footer.appendChild(cancel); footer.appendChild(save);
    if (drawer.parentElement !== modal) modal.appendChild(drawer);
    drawer.classList.add('ess-matrix-modal-content'); drawer.setAttribute('role','presentation');
    document.getElementById('ovl').classList.remove('on'); document.body.classList.add('role-form-open');
    if (!modal.open) modal.showModal();
    if (wasOpen) drawer.querySelector('.drw-b').scrollTop = scroll;
    document.getElementById(focus || (UGE.code ? 'ug_add' : 'ug_name'))?.focus({preventScroll:true});
  };
  modal.addEventListener('cancel',event=>{event.preventDefault();closeDrawer();});
  modal.addEventListener('click',event=>{
    if (event.target !== modal) return;
    const box=modal.getBoundingClientRect();
    if (event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom) closeDrawer();
  });
})();

// Edit titles identify the record rather than repeating the generic form name.
(() => {
  const draw = drawHd;
  drawHd = function () {
    draw.apply(this,arguments);
    if (HDE.id) document.querySelector('#drw .drw-h h2').textContent = 'Edit ' + HDE.n;
  };
})();
