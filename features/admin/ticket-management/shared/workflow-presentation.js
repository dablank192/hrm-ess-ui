/* ESS presentation adapters for the v57 functionality. */
function grpMove(id, direction) {
  var list = grpOfUnit(), at = list.findIndex(function (g) { return g.id === id }), next = at + direction;
  if (at < 0 || next < 0 || next >= list.length) return;
  var a = WFG.indexOf(list[at]), b = WFG.indexOf(list[next]), group = WFG[a];
  WFG[a] = WFG[b]; WFG[b] = group;
  auditLog('Reorder workflow groups', unitName(CUR_UNIT) + ' · ' + group.n);
  PAGES['thiet-ke']();
}
function libGrp(id) { DSN.fg = id; PAGES['thiet-ke'](); }
(function () {
  var library = libPage;
  libPage = function () {
    var groups = grpOfUnit, all = groups();
    if (DSN.fg && !all.some(function (g) { return g.id === DSN.fg })) DSN.fg = '';
    if (DSN.fg) grpOfUnit = function () { return groups().filter(function (g) { return g.id === DSN.fg }); };
    try { library.apply(this, arguments); } finally { grpOfUnit = groups; }
    var toolbar = document.querySelector('#view .workflow-summary-toolbar .rgt');
    if (toolbar) toolbar.insertAdjacentHTML('beforeend', '<select class="inp workflow-group-filter" id="libGrpSel" aria-label="Filter by group" onchange="libGrp(this.value)"><option value="">Group: all</option>' +
      all.map(function (g) { return '<option value="' + esc(g.id) + '"' + (DSN.fg === g.id ? ' selected' : '') + '>' + esc(g.n) + '</option>'; }).join('') + '</select>');
    document.querySelectorAll('#view .wfc').forEach(function (card) {
      var match = (card.getAttribute('onclick') || '').match(/\('([^']+)'\)/), workflow = match && wfById(match[1]);
      if (workflow && workflow.ic) card.querySelector('.wfc-h b').insertAdjacentHTML('afterbegin', '<span class="workflow-custom-icon" aria-hidden="true">' + svg(gInner(workflow.ic)) + '</span>');
    });
  };
  var reset = resetWorkflowFilters;
  resetWorkflowFilters = function () { DSN.fg = ''; reset.apply(this, arguments); };
  var drawGroup = drawGrp;
  drawGrp = function () {
    drawGroup.apply(this, arguments);
    if (GRP.id) return;
    document.querySelector('#drw .drw-b').insertAdjacentHTML('beforeend', '<div class="field" style="margin-top:12px"><label>Display position</label><div class="workflow-group-position">' +
      '<label class="ck"><input type="radio" name="grpPos" value="end"' + (GRP.top ? '' : ' checked') + '><span>End of the list</span></label>' +
      '<label class="ck"><input type="radio" name="grpPos" value="top"' + (GRP.top ? ' checked' : '') + '><span>Top of the list</span></label></div></div>');
  };
  var grabGroup = grpGrab;
  grpGrab = function () { grabGroup(); var input = document.querySelector('input[name="grpPos"]:checked'); if (input) GRP.top = input.value === 'top'; };
  var saveGroup = saveGrp;
  saveGrp = function () {
    grpGrab(); var top = !GRP.id && GRP.top, count = WFG.length;
    saveGroup.apply(this, arguments);
    if (WFG.length > count) {
      DSN.fg = '';
      if (top) {
        var group = WFG[WFG.length - 1], first = WFG.findIndex(function (g) { return g !== group && g.donvi === group.donvi; });
        if (first >= 0) { WFG.pop(); WFG.splice(first, 0, group); }
      }
      PAGES['thiet-ke']();
    }
  };
})();

/* Optional workflow icons use the existing ESS icon vocabulary rather than replacing group icons with emoji. */
function workflowIconField(id, value) {
  return '<div class="field" style="margin-top:12px"><label for="' + id + '">Icon</label><select class="inp" id="' + id + '" onchange="workflowIconSet(this.id,this.value)">' +
    '<option value="">No icon</option>' + gIcons().map(function (icon) { return '<option value="' + icon[0] + '"' + (value === icon[0] ? ' selected' : '') + '>' + esc(icon[1]) + '</option>'; }).join('') + '</select></div>';
}
function workflowIconSet(id, value) { if (id === 'nwfIcon') { nwfGrab(); NWF.ic = value; } else { wiGrab(); WI.ic = value; } }
(function () {
  var drawNew = drawNewWf;
  drawNewWf = function () { drawNew.apply(this, arguments); document.querySelector('#drw .drw-b').insertAdjacentHTML('beforeend', workflowIconField('nwfIcon', NWF.ic || '')); };
  var saveNew = saveNewWf;
  saveNewWf = function () { var id = document.getElementById('nwfId').value.trim(), icon = NWF.ic || ''; saveNew.apply(this, arguments); var w = wfById(id); if (w && (!NWF || !NWF.err)) w.ic = icon; };
  var openInfo = openWfInfo;
  openWfInfo = function () { openInfo.apply(this, arguments); };
  var drawInfo = drawWfInfo;
  drawWfInfo = function () {
    if (WI.ic === undefined) WI.ic = (wfById(WI.id) || {}).ic || '';
    drawInfo.apply(this, arguments);
    document.querySelector('#drw .drw-b').insertAdjacentHTML('beforeend', workflowIconField('wiIcon', WI.ic));
  };
  var saveInfo = saveWfInfo;
  saveWfInfo = function () { var w = wfById(WI.id), icon = WI.ic || ''; saveInfo.apply(this, arguments); if (w && !WI.err) { w.ic = icon; if (DSN.view === 'lib') libPage(); } };
})();

/* Keep ESS's native confirmation layer and protect the new Header screen with the existing navigation guard. */
(function () {
  var bag = sysBagHTML;
  sysBagHTML = function () {
    return bag.apply(this, arguments).replace(/ aria-expanded="[^"]*"/g, '').replace(/ onclick="sysVD\([^\"]*"/g, '').replace(/ onkeydown="[^"]*sysVD[^"]*"/g, '').replace(/ role="button" tabindex="0"/g, '');
  };
  var renderHeader = PAGES.header;
  PAGES.header = function () {
    renderHeader();
    document.querySelectorAll('#view .hd-mo').forEach(function (description) { description.remove(); });
    var heading = document.querySelector('#view .page-head');
    if (heading) heading.classList.add('ess-management-list-heading');
    document.getElementById('hdQ')?.setAttribute('aria-label', 'Search shared headers');
  };
  var drawHeader = drawHd;
  drawHd = function () {
    drawHeader.apply(this, arguments);
    document.querySelector('#drw .x-btn')?.setAttribute('aria-label', 'Close header form');
  };
  renderNav();
  var requested = new URLSearchParams(location.search || '').get('view');
  if (requested === 'header') workflowNavigate('header');
  else if (page === 'thiet-ke' && DSN.view === 'lib') libPage();
})();
