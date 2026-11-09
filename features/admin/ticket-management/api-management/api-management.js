/* Flat API catalog per unit. Keep record IDs and node references intact. */
(() => {
  // The existing API/node helpers use this storage shape; the unit owns one catalog.
  const catalogs = new Map();
  FSYS.forEach(source => {
    let catalog = catalogs.get(source.u);
    if (!catalog) {
      catalog = { id: source.id, u: source.u, c: '', n: '', mo: '', tks: [] };
      catalogs.set(source.u, catalog);
    }
    catalog.tks.push(...source.tks);
  });
  FSYS = [...catalogs.values()];
  FDV.sys = '';
  function catalogFor(unit) {
    let catalog = fdSysOf(unit)[0];
    if (!catalog) {
      catalog = { id: 'api-' + unit, u: unit, c: '', n: '', mo: '', tks: [] };
      FSYS.push(catalog);
    }
    return catalog;
  }
  const open = openFt;
  openFt = function (id) { return open(id, catalogFor(CUR_UNIT).id); };
  const draw = drawFt;
  drawFt = function () {
    draw.apply(this, arguments);
    document.getElementById('ft_s')?.closest('.field').remove();
    document.querySelector('#drw .fd-g2')?.classList.add('ess-api-name');
    document.querySelector('#drw .x-btn')?.setAttribute('aria-label', 'Close API form');
  };
  const paging = {size:10,page:1,filter:'',total:0,pages:1};
  PAGES.field = function () {
    if (!unitsFor().includes(CUR_UNIT)) useUnit(unitsFor()[0]);
    const query = gNorm(FDV.q || '');
    const list = fdSysOf(CUR_UNIT).flatMap(catalog => catalog.tks).filter(ticket =>
      !query || gNorm([ticket.n, ticket.m, ticket.url, accName(ticket.by), ticket.by].join(' ')).includes(query));
    const filter = JSON.stringify([CUR_UNIT,FDV.q]);
    if (filter !== paging.filter) paging.page = 1;
    paging.filter = filter; paging.total = list.length;
    paging.pages = Math.max(1,Math.ceil(list.length / paging.size));
    paging.page = Math.max(1,Math.min(paging.page,paging.pages));
    const rows = list.slice((paging.page-1)*paging.size,paging.page*paging.size).map(ticket => '<tr class="clk" onclick="openFt(\'' + ticket.id + '\')">' +
      '<td class="c-main">' + esc(ticket.n) + '</td><td>' + fdMth(ticket.m) + '</td>' +
      '<td class="ess-api-url" title="' + esc(ticket.url || '') + '">' + esc(ticket.url || '—') + '</td>' +
      '<td>' + esc(accName(ticket.by)) + '</td>' +
      '<td class="r" onclick="event.stopPropagation()"><span class="hd-acts">' +
      '<button class="xb look" title="Edit" aria-label="Edit ' + esc(ticket.n) + '" onclick="openFt(\'' + ticket.id + '\')">' + svg(I.edit) + '</button>' +
      '<button class="xb" title="Delete" aria-label="Delete ' + esc(ticket.n) + '" onclick="ftDelAsk(\'' + ticket.id + '\')">' + svg(I.trash) + '</button></span></td></tr>').join('');
    V('<div class="page-head"><div><h1>API management</h1></div><div class="ph-actions">' +
      '<button class="btn pri" onclick="openFt(\'\')">' + svg(I.plus) + 'Add ticket type</button></div></div>' +
      '<div class="pg-tools">' + unitSelHTML() + '<input class="inp" id="fdQ" style="max-width:300px" aria-label="Search APIs" placeholder="Search by ticket name, method, URL…" value="' + esc(FDV.q) + '" oninput="fdGo(\'q\',this.value)"></div>' +
      '<section class="card ess-api-card ess-table-card"><div class="card-b flush"><div class="tbl-wrap" tabindex="0" role="region" aria-label="API management table"><table class="tbl ess-api-table"><thead><tr>' +
      '<th scope="col">Ticket Name</th><th scope="col">Method</th><th scope="col">URL</th><th scope="col">Modified By</th><th scope="col" class="r">Action</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="5">' + empty(FD_TK_IC, 'No matching APIs', 'Add a ticket type or change the search.') + '</td></tr>') +
      '</tbody></table></div></div><footer id="apiPagination" class="ess-matrix-pagination">' + window.HrmWorkflowPagination(paging,'api','API management') + '</footer></section>');
    window.HrmWorkflowLayout?.sync();
  };
  document.getElementById('view').addEventListener('click',event=>{
    const button=event.target.closest('[data-api-page]'); if(!button||button.disabled)return;
    paging.page=Math.max(1,Math.min(Number(button.dataset.apiPage),paging.pages)); PAGES.field();
    document.querySelector('#apiPagination [aria-current="page"]')?.focus({preventScroll:true});
  });
  document.getElementById('view').addEventListener('change',event=>{
    if(event.target.id!=='apiPageSize')return;
    const size=Number(event.target.value);if(![10,25,50,100].includes(size))return;
    paging.size=size;paging.page=1;PAGES.field();document.getElementById('apiPageSize')?.focus({preventScroll:true});
  });
  // Node configuration also selects directly from the unit catalog, with no System step.
  fdpHTML = function (node, state) {
    const record = fdpSrc(node), http = sysGet(node), lost = http.fsrc?.t && !record;
    const errors = state?.fd || { err: [], warn: [] }, url = state?.url || { err: [], warn: [] };
    return '<div class="field fdp" id="fdpWrap"><label for="fdpTg">Choose API<span class="req">*</span></label><div class="fdp-row">' +
      '<button type="button" class="fdp-tg api' + (FDP.open ? ' open' : '') + (lost || (!record && url.err.length) ? ' bad' : '') + '" id="fdpTg" aria-haspopup="listbox" aria-expanded="' + FDP.open + '" onclick="fdpToggle()">' +
      (record ? '<b>' + esc(record.t.n) + '</b>' + fdApiHTML(record.t) : '<span class="fdp-pl">' + (lost ? 'The API was deleted — pick again' : 'Choose an API…') + '</span>') +
      '<span class="fdp-cv">' + svg(VX_CHEV) + '</span></button>' +
      (http.fsrc ? '<button type="button" class="xb look" aria-label="Clear the API" onclick="fdpClear()">' + svg(I.x) + '</button>' : '') + '</div>' +
      (FDP.open ? fdpPopHTML(node) : '') + '<div id="fdpMsg">' + sysMsgs(errors.err.concat(url.err), 'bad') + sysMsgs(errors.warn.concat(url.warn), 'warn') + '</div></div>';
  };
  fdpPopHTML = function (node) {
    const current = fdpSrc(node)?.t.id;
    const tickets = fdSysOf(wfUnit(DSN.id)).flatMap(catalog => catalog.tks);
    return '<div class="fdp-pop" role="listbox" aria-label="APIs">' + (tickets.length ? tickets.map(ticket => {
      const selected = ticket.id === current;
      return '<button type="button" class="fdp-i tk' + (selected ? ' on' : '') + '" role="option" aria-selected="' + selected + '" onclick="fdpApply(\'' + ticket.id + '\')">' +
        '<span class="fdp-t"><b>' + esc(ticket.n) + '</b>' + fdApiHTML(ticket) + '</span>' +
        (selected ? '<span class="fdp-ok">' + svg(I.check) + '</span>' : '') + '</button>';
    }).join('') : '<div class="fdp-empty">This unit has no API yet. Add one in API management.</div>') + '</div>';
  };
  if (page === 'field') PAGES.field();
})();
