/* Adapt the shared v61 picker to ESS forms and retain stored legacy icons. */
(() => {
  var IC_EMO={users:'👥',wallet:'💰',clock:'⏰',calendar:'📅',help:'🎧',cap:'🎓',receipt:'🧾',plane:'✈️',userplus:'🙋',building:'🏢',monitor:'💻',box:'📦',
  award:'🏆',scale:'⚖️',shield:'🛡️',briefcase:'💼',heart:'❤️',gift:'🎁',truck:'🚚',car:'🚗',phone:'📱',mail:'✉️',file:'📄',chart:'📊',pie:'📈',settings:'⚙️',
  lock:'🔒',key:'🔑',star:'⭐',flag:'🚩',target:'🎯',home:'🏠',globe:'🌐',tool:'🔧',book:'📚',coffee:'☕',bell:'🔔',camera:'📷',bank:'🏦',baby:'👶',folder:'📁'};
function icEmo(k){ if(!k) return 'e:📁'; if(k.indexOf('e:')===0) return k; return 'e:'+(IC_EMO[k]||'📁') }

  WFG.forEach(function(group){ if(group.ic!=="fpt") group.ic=icEmo(group.ic); });
  // v61 card metadata: three visible rows, account inline with the updater.
  wfKV = function(workflow){
    const last=wfLast(workflow);
    return '<dl class="wfc-kv"><dt>Version</dt><dd>'+wfVer(workflow)+'</dd><dt>Updated by</dt><dd>'+
      (last.acc?esc(accName(last.acc))+' - <span class="mono">'+esc(last.acc)+'</span>':'—')+
      '</dd><dt>Updated at</dt><dd>'+(last.t?'<span class="num">'+esc(last.t)+'</span>':'—')+'</dd></dl>';
  };
  workflowIconField = function () { return ''; };
  const openGroup = openGrp;
  openGrp = function () { EP.tgt = null; return openGroup.apply(this, arguments); };
  // Keep the source layout: Unit, Group name, Display position. Icon lives in the heading.
  const library = libPage;
  libPage = function () {
    WFS.forEach(workflow => {
      if (!workflow.ic || workflow.ic === 'fpt') {
        const name=workflow.n.toLowerCase();
        workflow.ic='e:' + (/leave/.test(name)?'🏖️':/salary|pay|advance/.test(name)?'💰':/overtime/.test(name)?'⏱️':/trip/.test(name)?'✈️':/shift|attendance/.test(name)?'📅':/resign/.test(name)?'📤':'📋');
      }
    });
    const result = library.apply(this, arguments);
    document.querySelectorAll('#view .wfg').forEach(section => {
      const match = section.querySelector('.wfg-h button[onclick^="openGrp("]')?.getAttribute('onclick').match(/openGrp\('([^']+)'\)/);
      const group = match && wfgBy(match[1]);
      if (group) section.querySelector('.wfg-ic').innerHTML = gIconHTML(group.ic);
    });
    document.querySelectorAll('#view .wfc').forEach(card => {
      const match = (card.getAttribute('onclick') || '').match(/\('([^']+)'\)/);
      const workflow = match && wfById(match[1]);
      const icon = card.querySelector('.workflow-custom-icon');
      if (workflow?.ic && icon) icon.innerHTML = gIconHTML(workflow.ic);
    });
    return result;
  };
  const drawNew = drawNewWf;
  drawNewWf = function () { if (!NWF.ic || NWF.ic === 'fpt') NWF.ic='e:📋'; return drawNew.apply(this,arguments); };
  // The popup belongs to the current form and must not survive a different drawer.
  const show = showDrawer;
  showDrawer = function () { if (EP.open) epClose(false); return show.apply(this, arguments); };
  document.addEventListener('scroll', () => { if (EP.open) icPlace(); }, true);
  const head = icHead;
  icHead = function () {
    head.apply(this, arguments);
    document.querySelector('#drw .x-btn')?.setAttribute('aria-label', 'Close form');
  };
  if (page === 'thiet-ke' && DSN.view === 'lib') libPage();
})();
