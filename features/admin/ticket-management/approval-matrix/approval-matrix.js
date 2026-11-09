/* Approval matrix presentation. Existing data, validation and save rules remain authoritative. */
(() => {
  const view = document.getElementById('view');
  const drawer = document.getElementById('drw');
  if (!view || !drawer) return;
  const paging = { size: 10, page: 1, filter: '', total: 0, pages: 1 };
  const headerPaging = { size: 10, page: 1, filter: '', total: 0, pages: 1 };
  const modal = document.createElement('dialog');
  modal.id = 'matrixCreateDialog';
  modal.className = 'ess-matrix-dialog';
  modal.setAttribute('aria-labelledby', 'matrixCreateTitle');
  document.body.appendChild(modal);
  let opener = null;
  let drawingMatrix = false;

  function tableScroll() {
    const table = view.querySelector('.ess-table-card .tbl-wrap');
    return table ? { top: table.scrollTop, left: table.scrollLeft } : null;
  }
  function finishTable(scroll) {
    view.querySelector('.card')?.classList.add('ess-table-card');
    window.HrmWorkflowLayout?.sync();
    const table = view.querySelector('.ess-table-card .tbl-wrap');
    if (table && scroll) { table.scrollTop = scroll.top; table.scrollLeft = scroll.left; }
    window.HrmWorkflowLayout?.sync();
  }

  function restoreDrawer() {
    if (drawer.parentElement !== modal) return;
    modal.close();
    document.body.appendChild(drawer);
    drawer.innerHTML = '';
    drawer.classList.remove('ess-matrix-modal-content');
    drawer.setAttribute('role', 'dialog');
    document.body.classList.remove('matrix-create-open');
  }
  const close = closeDrawer;
  closeDrawer = function () {
    const wasModal = drawer.parentElement === modal;
    restoreDrawer();
    close.apply(this, arguments);
    if (wasModal && opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  };
  const show = showDrawer;
  showDrawer = function () {
    if (!drawingMatrix || MTE.id) restoreDrawer();
    return show.apply(this, arguments);
  };
  const draw = drawMt;
  drawMt = function () {
    const wasOpen = modal.open;
    const focusedId = wasOpen ? document.activeElement?.id : '';
    if (!MTE.id && !wasOpen) opener = document.activeElement;
    drawingMatrix = true;
    try { draw.apply(this, arguments); }
    finally { drawingMatrix = false; }
    if (MTE.id) {
      drawer.querySelector('.drw-h h2').textContent = 'Edit ' + MTE.id;
      drawer.querySelector('.drw-h .meta .mono')?.remove();
      if (!drawer.querySelector('.drw-h .meta')?.textContent.trim()) drawer.querySelector('.drw-h .meta')?.remove();
      return;
    }
    if (drawer.parentElement !== modal) modal.appendChild(drawer);
    drawer.classList.add('ess-matrix-modal-content');
    drawer.setAttribute('role', 'presentation');
    drawer.querySelector('.drw-h h2').id = 'matrixCreateTitle';
    drawer.querySelector('.x-btn').setAttribute('aria-label', 'Close Add matrix row');
    const footer = drawer.querySelector('.drw-f');
    const save = footer.querySelector('[onclick="mtSave()"]');
    const cancel = footer.querySelector('[onclick="closeDrawer()"]');
    save.textContent = 'Save';
    cancel.style.marginLeft = '0';
    footer.appendChild(cancel);
    footer.appendChild(save);
    document.getElementById('ovl').classList.remove('on');
    document.body.classList.add('matrix-create-open');
    if (!modal.open) modal.showModal();
    const next = document.getElementById(focusedId || 'mt_emp');
    next?.focus({ preventScroll: true });
  };
  modal.addEventListener('cancel', event => {
    event.preventDefault();
    closeDrawer();
  });
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDrawer();
  });

  function pagination(paging, scope, label) {
    const from = paging.total ? (paging.page - 1) * paging.size + 1 : 0;
    const to = Math.min(paging.page * paging.size, paging.total);
    const button = (pageNumber, label, ariaLabel, disabled = false) =>
      '<button type="button" data-' + scope + '-page="' + pageNumber + '" aria-label="' + ariaLabel + '"' +
      (disabled ? ' disabled' : '') + (pageNumber === paging.page && /^Page /.test(ariaLabel) ? ' aria-current="page"' : '') + '>' + label + '</button>';
    const start = Math.max(1, Math.min(paging.page - 2, paging.pages - 4));
    const end = Math.min(paging.pages, start + 4);
    let numbers = start > 1 ? button(1, '1', 'Page 1') + '<span aria-hidden="true">…</span>' : '';
    for (let number = start; number <= end; number++) numbers += button(number, number, 'Page ' + number);
    if (end < paging.pages) numbers += '<span aria-hidden="true">…</span>' + button(paging.pages, paging.pages, 'Page ' + paging.pages);
    return '<div class="ess-matrix-pagination-summary"><label for="' + scope + 'PageSize">Rows Per Page:</label>' +
      '<select id="' + scope + 'PageSize">' + [10, 25, 50, 100].map(size => '<option value="' + size + '"' + (size === paging.size ? ' selected' : '') + '>' + size + '</option>').join('') + '</select>' +
      '<span role="status" aria-live="polite">' + from + ' - ' + to + ' of ' + paging.total + '</span></div>' +
      '<nav class="ess-matrix-pagination-controls" aria-label="' + label + ' pagination">' +
      button(1, 'First', 'First page', paging.page === 1) + button(paging.page - 1, '‹', 'Previous page', paging.page === 1) + numbers +
      button(paging.page + 1, '›', 'Next page', paging.page === paging.pages) + button(paging.pages, 'Last', 'Last page', paging.page === paging.pages) +
      '</nav>';
  }
  // Use the same pagination component for employee rows in User Group.
  window.HrmWorkflowPagination = pagination;
  const render = PAGES['ma-tran'];
  PAGES['ma-tran'] = function () {
    const scroll = tableScroll();
    render.apply(this, arguments);
    view.querySelector('.mt-leg')?.remove();
    const heading = view.querySelector('.page-head');
    heading.classList.add('ess-matrix-heading');
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'ess-matrix-breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.innerHTML = '<a href="features/admin/access-configuration/index.html">Admin Center</a><span aria-hidden="true">›</span>' +
      '<a href="features/admin/ticket-management/business-workflows/index.html" data-matrix-library>Ticket Management</a><span aria-hidden="true">›</span>' +
      '<span aria-current="page">Approval matrix</span>';
    view.insertBefore(breadcrumb, heading);
    const filter = JSON.stringify([MTV.unit, MTV.q, MTV.pb, MTV.wf, MTV.st]);
    const keepScroll = filter === paging.filter && paging.page === paging.renderedPage;
    if (filter !== paging.filter) paging.page = 1;
    paging.filter = filter;
    const table = view.querySelector('table.tbl');
    const rows = [...table.querySelectorAll('tbody tr.clk')];
    rows.forEach(row => {
      [...row.querySelectorAll('td')].slice(0, 2).forEach(cell => {
        cell.querySelectorAll('.mono').forEach(account => account.remove());
      });
    });
    paging.total = rows.length;
    paging.pages = Math.max(1, Math.ceil(rows.length / paging.size));
    paging.page = Math.max(1, Math.min(paging.page, paging.pages));
    rows.forEach((row, index) => { row.hidden = index < (paging.page - 1) * paging.size || index >= paging.page * paging.size; });
    const footer = document.createElement('footer');
    footer.id = 'matrixPagination';
    footer.className = 'ess-matrix-pagination';
    footer.innerHTML = pagination(paging, 'matrix', 'Approval matrix');
    table.closest('.card').appendChild(footer);
    finishTable(keepScroll ? scroll : null);
    paging.renderedPage = paging.page;
  };

  const renderHeaders = PAGES.header;
  PAGES.header = function () {
    const scroll = tableScroll();
    renderHeaders.apply(this, arguments);
    view.querySelector('.hd-stats')?.remove();
    const headerTable = view.querySelector('table.hd-tbl');
    if (headerTable) {
      headerTable.classList.add('ess-compact-headers');
      headerTable.querySelector('thead').innerHTML = '<tr><th scope="col">Header name</th><th scope="col">Status</th><th scope="col">Modified By</th><th scope="col" class="r">Action</th></tr>';
      headerTable.querySelectorAll('tbody tr.clk').forEach(row => {
        const cells = [...row.querySelectorAll('td')];
        cells[1].remove();
        const record = HDRS.find(h => row.getAttribute('onclick') === "openHd('" + h.id + "')");
        if (record) cells[3].textContent = accName(record.by);
      });
      headerTable.querySelectorAll('tbody td[colspan]').forEach(cell => cell.colSpan = 4);
    }

    const filter = JSON.stringify([CUR_UNIT, HDV.q, HDV.st]);
    const keepScroll = filter === headerPaging.filter && headerPaging.page === headerPaging.renderedPage;
    if (filter !== headerPaging.filter) headerPaging.page = 1;
    headerPaging.filter = filter;
    const rows = [...view.querySelectorAll('table.hd-tbl tbody tr.clk')];
    headerPaging.total = rows.length;
    headerPaging.pages = Math.max(1, Math.ceil(rows.length / headerPaging.size));
    headerPaging.page = Math.max(1, Math.min(headerPaging.page, headerPaging.pages));
    rows.forEach((row, index) => { row.hidden = index < (headerPaging.page - 1) * headerPaging.size || index >= headerPaging.page * headerPaging.size; });
    const footer = document.createElement('footer');
    footer.id = 'headerPagination';
    footer.className = 'ess-matrix-pagination';
    footer.innerHTML = pagination(headerPaging, 'header', 'Shared headers');
    view.querySelector('.card').appendChild(footer);
    finishTable(keepScroll ? scroll : null);
    headerPaging.renderedPage = headerPaging.page;
  };

  function refresh(focusLabel, scope = 'matrix') {
    if (scope === 'matrix') MTV.menu = '';
    PAGES[scope === 'matrix' ? 'ma-tran' : 'header']();
    const controls = [...view.querySelectorAll('#' + scope + 'Pagination [aria-label]')];
    const next = controls.find(control => control.getAttribute('aria-label') === focusLabel && !control.disabled) || view.querySelector('#' + scope + 'Pagination [aria-current="page"]');
    next?.focus({ preventScroll: true });
  }
  view.addEventListener('click', event => {
    const library = event.target.closest('[data-matrix-library]');
    if (library) { event.preventDefault(); workflowNavigate('thiet-ke'); return; }
    const button = event.target.closest('[data-matrix-page]') || event.target.closest('[data-header-page]');
    if (!button || button.disabled) return;
    const scope = button.dataset.headerPage !== undefined ? 'header' : 'matrix';
    const state = scope === 'header' ? headerPaging : paging;
    state.page = Math.max(1, Math.min(Number(button.dataset[scope + 'Page']), state.pages));
    refresh(button.getAttribute('aria-label'), scope);
  });
  view.addEventListener('change', event => {
    const scope = event.target.id.startsWith('header') ? 'header' : 'matrix';
    const state = scope === 'header' ? headerPaging : paging;
    if (event.target.id === scope + 'PageSize') {
      const size = Number(event.target.value);
      if (![10, 25, 50, 100].includes(size)) return;
      state.size = size;
      state.page = 1;
      refresh('Rows per page', scope);
      document.getElementById(scope + 'PageSize')?.focus({ preventScroll: true });
    }
  });
  if (page === 'ma-tran') PAGES['ma-tran']();
  if (page === 'header') PAGES.header();
})();
