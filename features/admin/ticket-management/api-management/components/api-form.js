/* API fields use an editable grid in the same native modal shell as Approval matrix. */
(() => {
  const drawer = document.getElementById('drw');
  const modal = document.createElement('dialog');
  modal.id = 'apiFormDialog';
  modal.className = 'ess-matrix-dialog ess-api-dialog';
  modal.setAttribute('aria-labelledby', 'apiFormTitle');
  document.body.appendChild(modal);
  let drawing = false, opener = null;
  function restore() {
    if (drawer.parentElement !== modal) return false;
    modal.close(); document.body.appendChild(drawer);
    drawer.classList.remove('ess-matrix-modal-content');
    drawer.setAttribute('role', 'dialog'); drawer.innerHTML = '';
    document.body.classList.remove('api-form-open');
    return true;
  }
  const show = showDrawer;
  showDrawer = function () { if (!drawing) restore(); return show.apply(this, arguments); };
  const close = closeDrawer;
  closeDrawer = function () {
    const wasModal = restore(); close.apply(this, arguments);
    if (wasModal && opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  };
  modal.addEventListener('cancel', event => { event.preventDefault(); closeDrawer(); });
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDrawer();
  });
  window.apiDescriptionOpen = function (index) {
    const preview = document.getElementById('ftmPreview_' + index), editor = document.getElementById('ftm_' + index);
    preview.hidden = true; editor.hidden = false;
    editor.style.height = Math.max(96, editor.scrollHeight + 2) + 'px';
    editor.focus({ preventScroll: true });
  };
  window.apiDescriptionEdit = function (index) {
    const editor = document.getElementById('ftm_' + index), preview = document.getElementById('ftmPreview_' + index);
    (window.ApiFieldEditor ? window.ApiFieldEditor.field(index) : FTE.fields[index]).mo = editor.value;
    preview.value = editor.value.replace(/[\r\n]+/g, ' '); preview.title = editor.value;
    editor.style.height = 'auto'; editor.style.height = Math.max(96, editor.scrollHeight + 2) + 'px';
  };
  window.apiDescriptionClose = function (index) {
    window.apiDescriptionEdit(index);
    document.getElementById('ftm_' + index).hidden = true;
    document.getElementById('ftmPreview_' + index).hidden = false;
  };
  drawFt = function () {
    const wasOpen = modal.open, scroll = drawer.querySelector('.drw-b')?.scrollTop || 0;
    if (!wasOpen) opener = document.activeElement;
    const edit = !!FTE.id, errors = FTE.err || {}, rowErrors = errors.f || {}, uses = edit ? fdUses(FTE.id) : [];
    const hint = message => message ? '<span class="hint ess-api-error" role="alert">' + esc(message) + '</span>' : '';
    const required = '<span class="req"> *</span>';
    const rows = window.ApiFieldEditor ? window.ApiFieldEditor.render(FTE.fields) : FTE.fields.map((field, index) => {
      const error = rowErrors[index] || {};
      const description = field.mo || '';
      return '<tr><td class="num">' + (index + 1) + '</td>' +
        '<td><input class="inp mono' + (error.k ? ' bad' : '') + '" id="ftk_' + index + '" maxlength="60" value="' + esc(field.k) + '" aria-label="Field code ' + (index + 1) + '" autocomplete="off">' + hint(error.k) + '</td>' +
        '<td><input class="inp' + (error.n ? ' bad' : '') + '" id="ftn_' + index + '" maxlength="80" value="' + esc(field.n) + '" aria-label="Field name ' + (index + 1) + '" autocomplete="off">' + hint(error.n) + '</td>' +
        '<td><input class="inp" id="ftd_' + index + '" maxlength="30" value="' + esc(field.dt || '') + '" aria-label="Data type ' + (index + 1) + '" autocomplete="off"></td>' +
        '<td><input type="text" class="inp ess-description-preview" id="ftmPreview_' + index + '" value="' + esc(description.replace(/[\r\n]+/g, ' ')) + '" title="' + esc(description) + '" maxlength="2000" aria-label="Description ' + (index + 1) + '" onfocus="apiDescriptionOpen(' + index + ')">' +
        '<textarea class="inp ess-description-editor" id="ftm_' + index + '" hidden maxlength="2000" rows="4" aria-label="Description ' + (index + 1) + '" oninput="apiDescriptionEdit(' + index + ')" onblur="apiDescriptionClose(' + index + ')">' + esc(description) + '</textarea>' + hint(error.mo) + '</td>' +
        '<td><button type="button" class="xb" aria-label="Delete field ' + (index + 1) + '" onclick="ftDelRow(' + index + ')">' + svg(I.trash) + '</button></td></tr>';
    }).join('');
    drawing = true;
    try {
      showDrawer('<div class="drw-h"><h2 id="apiFormTitle">' + (edit ? 'Edit ' + esc(FTE.n) : 'Add ticket type') + '</h2><button type="button" class="x-btn" aria-label="Close API form" onclick="closeDrawer()">' + svg(I.x) + '</button></div>' +
        '<div class="drw-b"><div class="meta">Unit ' + esc(unitName(CUR_UNIT)) + (uses.length ? ' · Used in ' + fdUseTxt(uses) : '') + '</div>' +
        '<div class="field"><label for="ft_n">Ticket type name' + required + '</label><input class="inp' + (errors.n ? ' bad' : '') + '" id="ft_n" maxlength="80" value="' + esc(FTE.n) + '" autocomplete="off">' + hint(errors.n) + '</div>' +
        '<div class="fd-mu"><div class="field"><label for="ft_m">Method' + required + '</label><select class="inp" id="ft_m">' + HTTP_METHODS.map(method => '<option' + (method === FTE.m ? ' selected' : '') + '>' + method + '</option>').join('') + '</select></div>' +
        '<div class="field"><label for="ft_u">URL' + required + '</label><input class="inp mono' + (errors.url ? ' bad' : '') + '" id="ft_u" maxlength="500" value="' + esc(FTE.url || '') + '" autocomplete="off" spellcheck="false">' + hint(errors.url) + '</div></div>' +
        '<section class="ess-api-fields" aria-label="Field editor"><h3>Fields</h3><div class="ess-api-grid-wrap"><table class="ess-api-grid"><thead><tr><th scope="col">#</th><th scope="col">Field code' + required + '</th><th scope="col">Field name' + required + '</th><th scope="col">Data type</th><th scope="col">Description</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' + hint(errors.fields) +
        '<button type="button" class="btn ess-api-add-row" onclick="ftAddRow()">' + svg(I.plus) + 'Add row</button></section></div>' +
        '<div class="drw-f ess-api-form-footer"><button type="button" class="btn" onclick="closeDrawer()">Cancel</button><div>' +
        (edit ? '<button type="button" class="btn dgr" onclick="ftDelAsk(\'' + FTE.id + '\')">Delete</button>' : '') +
        '<button type="button" class="btn pri" onclick="saveFt()">Save</button></div></div>', 'fdw');
    } finally { drawing = false; }
    if (drawer.parentElement !== modal) modal.appendChild(drawer);
    drawer.classList.add('ess-matrix-modal-content'); drawer.setAttribute('role', 'presentation');
    document.getElementById('ovl').classList.remove('on'); document.body.classList.add('api-form-open');
    if (!modal.open) modal.showModal();
    if (wasOpen) drawer.querySelector('.drw-b').scrollTop = scroll;
    else document.getElementById('ft_n')?.focus({ preventScroll: true });
  };
  // Reveal the new row together with its Add action; focus must not scroll the page.
  window.apiRevealAddedField = function (input, addButton) {
    if (!input) return;
    input.focus({ preventScroll: true });
    const body = input.closest('.drw-b'), grid = input.closest('.ess-api-grid-wrap');
    if (grid) grid.scrollLeft = 0;
    if (!body) return;
    const viewport = body.getBoundingClientRect(), row = input.closest('tr').getBoundingClientRect();
    const action = (addButton || input).getBoundingClientRect();
    const bottom = Math.max(row.bottom, action.bottom) + 16;
    const top = Math.min(row.top, action.top) - 16;
    if (bottom - top <= body.clientHeight) {
      if (bottom > viewport.bottom) body.scrollTop += bottom - viewport.bottom;
      else if (top < viewport.top) body.scrollTop -= viewport.top - top;
    } else {
      // On extremely short viewports, keep the focused control visible.
      const control = input.getBoundingClientRect();
      if (control.bottom > viewport.bottom - 16) body.scrollTop += control.bottom - viewport.bottom + 16;
      else if (control.top < viewport.top + 16) body.scrollTop -= viewport.top + 16 - control.top;
    }
  };
  ftAddRow = function () {
    ftGrab(); FTE.fields.push({ k: '', n: '', dt: '', mo: '' }); drawFt();
    window.apiRevealAddedField(document.getElementById('ftk_' + (FTE.fields.length - 1)), drawer.querySelector('.ess-api-add-row'));
  };
  const save = saveFt;
  saveFt = function () {
    ftGrab(); const invalid = {};
    if (window.ApiFieldEditor) {
      const schemaErrors = window.ApiFieldEditor.validate(FTE.fields);
      if (Object.keys(schemaErrors).length) { FTE.err = { schema: schemaErrors }; drawFt(); return; }
    }
    FTE.fields.forEach((field, index) => { if ((field.mo || '').length > 2000) invalid[index] = { mo: 'Maximum 2,000 characters.' }; });
    if (Object.keys(invalid).length) { FTE.err = { f: invalid }; drawFt(); return; }
    return save.apply(this, arguments);
  };
})();
