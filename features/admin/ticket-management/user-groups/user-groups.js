/* Present one employee/role membership per row; retain the existing role actions and filters. */
(() => {
  const view = document.getElementById('view');
  const render = PAGES['user-group'];
  const paging = { size: 10, page: 1, filter: '', total: 0, pages: 1 };
  PAGES['user-group'] = function () {
    render.apply(this, arguments);
    const table = view.querySelector('.ug-tbl');
    if (!table) return;
    table.querySelector('thead').innerHTML = '<tr><th scope="col">Employee</th><th scope="col">Account</th><th scope="col">Role</th><th scope="col" class="r">Action</th></tr>';
    let roleHTML = '', actionsHTML = '';
    table.querySelectorAll('tbody tr').forEach(row => {
      const role = row.querySelector('.ug-role'), actions = row.querySelector('.ug-act');
      if (role) { roleHTML = role.innerHTML; actionsHTML = actions.innerHTML; }
      if (!roleHTML) return; // Preserve the existing no-matching-records state.
      const cells = [...row.querySelectorAll('td')].filter(cell => !cell.classList.contains('ug-role') && !cell.classList.contains('ug-act'));
      const employee = cells[0].innerHTML;
      const account = cells.length > 1 ? cells[1].innerHTML : '—';
      row.className = 'ug-employee-row';
      row.innerHTML = '<td class="c-main">' + employee + '</td><td class="c-code">' + account + '</td>' +
        '<td class="ug-role">' + roleHTML + '</td><td class="r ug-act">' + actionsHTML + '</td>';
    });
    const filter = JSON.stringify([CUR_UNIT, UGV.q, UGV.role]);
    if (filter !== paging.filter) paging.page = 1;
    paging.filter = filter;
    const rows = [...table.querySelectorAll('.ug-employee-row')];
    paging.total = rows.length;
    paging.pages = Math.max(1, Math.ceil(rows.length / paging.size));
    paging.page = Math.max(1, Math.min(paging.page, paging.pages));
    rows.forEach((row, index) => { row.hidden = index < (paging.page - 1) * paging.size || index >= paging.page * paging.size; });
    const footer = document.createElement('footer');
    footer.id = 'userGroupPagination';
    footer.className = 'ess-matrix-pagination';
    footer.innerHTML = window.HrmWorkflowPagination(paging, 'userGroup', 'User Group');
    const card = table.closest('.card');
    card.classList.add('ess-table-card');
    card.appendChild(footer);
    window.HrmWorkflowLayout?.sync();
  };
  function refresh(label) {
    PAGES['user-group']();
    const next = [...view.querySelectorAll('#userGroupPagination [aria-label]')].find(el => el.getAttribute('aria-label') === label && !el.disabled);
    (next || document.getElementById('userGroupPageSize'))?.focus({ preventScroll: true });
  }
  view.addEventListener('click', event => {
    const button = event.target.closest('[data-userGroup-page]');
    if (!button || button.disabled) return;
    paging.page = Math.max(1, Math.min(Number(button.getAttribute('data-userGroup-page')), paging.pages));
    refresh(button.getAttribute('aria-label'));
  });
  view.addEventListener('change', event => {
    if (event.target.id === 'userGroupPageSize') {
      const size = Number(event.target.value);
      if (![10, 25, 50, 100].includes(size)) return;
      paging.size = size; paging.page = 1; refresh('Rows per page');
    }
  });
  if (page === 'user-group') PAGES['user-group']();
})();
