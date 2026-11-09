/* Reuse ESS navigation, dialogs and designer geometry for the new API functionality. */
(() => {
  const view = document.getElementById('view');
  const render = PAGES.field;
  PAGES.field = function () {
    render.apply(this, arguments);
    view.querySelector('.page-head')?.classList.add('ess-management-list-heading');
    document.getElementById('fdQ')?.setAttribute('aria-label', 'Search APIs');
    window.HrmWorkflowLayout?.sync();
  };
  for (const name of ['drawFs', 'drawFt']) {
    const draw = window[name];
    window[name] = function () {
      const result = draw.apply(this, arguments);
      document.querySelector('#drw .x-btn')?.setAttribute('aria-label', 'Close ' + (name === 'drawFs' ? 'system' : 'API') + ' form');
      return result;
    };
  }
  const close = closeDrawer;
  closeDrawer = function () { vxClose(); return close.apply(this, arguments); };
  const navigate = workflowNavigate;
  workflowNavigate = function () { vxClose(); return navigate.apply(this, arguments); };
  const toggleAPI = fdpToggle;
  fdpToggle = function () { HDP.open = false; HDP.po = false; HDP.q = ''; vxClose(); return toggleAPI.apply(this, arguments); };
  const toggleHeader = hdpOpen;
  hdpOpen = function () { FDP.open = false; vxClose(); return toggleHeader.apply(this, arguments); };
  // Dismiss after the click completes, without replacing the clicked input.
  window.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('#drw,#cfm')) return;
    if (HDP.open && !target.closest('#hdpWrap')) {
      HDP.open = false; HDP.q = ''; HDP.po = false;
      document.querySelector('#hdpWrap .hdp-pop')?.remove();
      const trigger = document.getElementById('hdpSel');
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.classList.remove('open');
    }
    if (FDP.open && !target.closest('#fdpWrap')) {
      FDP.open = false;
      document.querySelector('#fdpWrap .fdp-pop')?.remove();
      const trigger = document.getElementById('fdpTg');
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.classList.remove('open');
    }
    if (VX.el && !target.closest('.vx,#vxPop')) vxClose();
    if (VX.el) vxPlace();
  });
  renderNav();
  if (new URLSearchParams(location.search || '').get('view') === 'field') workflowNavigate('field');
})();
