/* Shared ESS list affordances; original row action elements and handlers are retained. */
(() => {
  const lens = 'Search';
  let active = null, serial = 0;
  function close(restore = false) {
    if (!active) return;
    const {menu, trigger} = active;
    active = null;
    if (menu.matches(':popover-open')) menu.hidePopover();
    trigger.setAttribute('aria-expanded', 'false');
    if (restore && trigger.isConnected) trigger.focus({preventScroll:true});
  }
  function place(menu, trigger) {
    const box = trigger.getBoundingClientRect();
    menu.style.left = Math.max(8, Math.min(box.right - menu.offsetWidth, innerWidth - menu.offsetWidth - 8)) + 'px';
    menu.style.top = Math.max(8, Math.min(box.bottom + 4, innerHeight - menu.offsetHeight - 8)) + 'px';
  }
  function prepareCell(cell) {
    if (cell.dataset.essActions || cell.closest('dialog,#drw,#insp,form') || cell.querySelector('[aria-haspopup="menu"],.rm,.rm-pop')) return;
    const buttons = [...cell.querySelectorAll('button')].filter(button => !button.hidden && !button.matches('[role="switch"],[aria-pressed]'));
    if (buttons.length < 2 || cell.querySelector('input,select,textarea')) return;
    cell.dataset.essActions = 'true';
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'ess-row-more';
    const name = cell.closest('tr')?.querySelector('td')?.textContent.trim().slice(0,100) || 'record';
    trigger.setAttribute('aria-label','Actions for ' + name);
    trigger.setAttribute('aria-haspopup','menu'); trigger.setAttribute('aria-expanded','false');
    trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';
    const menu = document.createElement('div');
    menu.className = 'ess-row-action-menu'; menu.id = 'essRowActions' + (++serial);
    menu.setAttribute('popover','manual'); menu.setAttribute('role','menu');
    menu.setAttribute('aria-label','Actions for ' + name); trigger.setAttribute('aria-controls',menu.id);
    buttons.forEach(button => {
      const text = button.textContent.trim();
      const label = text || button.getAttribute('title') || button.getAttribute('aria-label') || 'Action';
      const short = /^(Edit|Delete|Cancel|View|Remove)\b/i.exec(label)?.[1] || label;
      if (!text) { const span = document.createElement('span'); span.textContent = short; button.appendChild(span); }
      button.classList.add('ess-row-menu-item'); button.setAttribute('role','menuitem');
      if (/^(Delete|Remove|Cancel)\b/i.test(short)) button.classList.add('is-destructive');
      menu.appendChild(button);
    });
    // Empty action wrappers stay in place to preserve any delegated row behavior.
    cell.append(trigger,menu);
    trigger.addEventListener('click', event => {
      event.stopPropagation(); const wasOpen = active?.trigger === trigger; close(); if (wasOpen) return;
      menu.showPopover(); active = {menu,trigger}; trigger.setAttribute('aria-expanded','true'); place(menu,trigger);
      menu.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
    });
    menu.addEventListener('click', event => {event.stopPropagation(); if (event.target.closest('button')) close();});
    menu.addEventListener('keydown', event => {
      const options = [...menu.querySelectorAll('button:not(:disabled)')];
      if (event.key === 'Escape') {event.preventDefault();event.stopPropagation();close(true);}
      else if (event.key === 'Tab') close();
      else if (['ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
        event.preventDefault(); let index = options.indexOf(document.activeElement);
        index = event.key === 'Home' ? 0 : event.key === 'End' ? options.length-1 : (index + (event.key === 'ArrowDown' ? 1 : options.length-1)) % options.length;
        options[index]?.focus();
      }
    });
  }
  function prepareRow(row) {
    if (row.dataset.essDetail || row.closest('dialog,#drw,#insp,form')) return;
    const inline = row.getAttribute('onclick') || '';
    const handler = /open|view|detail/i.test(inline) ? row.onclick : null;
    const edit = [...row.querySelectorAll('button')].find(button => /^(Edit|View)\b/i.test(button.getAttribute('title') || button.getAttribute('aria-label') || button.textContent.trim()));
    const link = row.querySelector('a[href]');
    if (!handler && !edit && !link) return;
    row.dataset.essDetail = 'true';
    if (handler) { row.onclick = null; row.removeAttribute('onclick'); }
    const open = event => {
      if (event.target !== row && event.target.closest('button,a,input,select,textarea,[role="switch"],.ess-row-action-menu')) return;
      close();
      if (handler) handler.call(row,event);
      else (edit || link).click();
    };
    row.addEventListener('dblclick',open);
    row.tabIndex = 0;
    row.setAttribute('title','Double-click to open details');
    row.addEventListener('keydown',event => {
      if (event.target === row && event.key === 'Enter') { event.preventDefault(); open(event); }
    });
  }
  function sync() {
    if (active && !active.trigger.isConnected) close();
    document.querySelectorAll('input').forEach(input => {
      const hint = [input.type === 'search' ? lens : '', input.placeholder, input.getAttribute('aria-label')].join(' ');
      if (!/\b(search|find)\b/i.test(hint) || input.closest('.gsearch,.dv-search,.admin-list-search,.ess-search-field') || input.parentElement.querySelector(':scope > svg')) return;
      input.classList.add('ess-search-field');
      if (!input.getAttribute('aria-label') && !input.labels?.length) input.setAttribute('aria-label',input.placeholder || lens);
    });
    document.querySelectorAll('table').forEach(table => {
      if (!table.querySelector('thead') || !table.querySelector('tbody') || table.closest('dialog,#drw,#insp,form') || table.matches('.ess-api-grid,[data-grid-editor]')) return;
      table.classList.add('ess-list-grid');
    });
    document.querySelectorAll('table.ess-list-grid td>.c-main,.task-table-row .title').forEach(title => {
      if (!title.hasAttribute('title')) title.setAttribute('title',title.textContent.trim());
    });
    document.querySelectorAll('table thead th').forEach(header => {
      if (!/^actions?$/i.test(header.textContent.trim())) return;
      header.setAttribute('aria-label',header.textContent.trim()); header.textContent = '';
    });
    document.querySelectorAll('td[data-label]').forEach(cell => {
      if (/^actions?$/i.test(cell.getAttribute('data-label'))) cell.setAttribute('data-label','');
    });
    document.querySelectorAll('table.ess-list-grid tbody td').forEach(cell => {
      if (cell.colSpan > 1 || cell.querySelector(':scope > .ess-grid-value') || cell.querySelector('button,input,select,textarea,[popover]') || !cell.textContent.trim()) return;
      const value = document.createElement('div'); value.className = 'ess-grid-value';
      value.title = cell.textContent.trim();
      while (cell.firstChild) value.appendChild(cell.firstChild);
      cell.appendChild(value);
    });
    document.querySelectorAll('table tbody tr > td:last-child').forEach(prepareCell);
    document.querySelectorAll('table tbody tr,.task-table-row').forEach(prepareRow);
  }
  document.addEventListener('pointerdown', event => {if(active&&!active.menu.contains(event.target)&&!active.trigger.contains(event.target))close();},true);
  document.addEventListener('keydown', event => {if(active&&event.key==='Escape'){event.preventDefault();close(true);}},true);
  document.addEventListener('scroll', event => {if(active&&!active.menu.contains(event.target))close();},true);
  window.addEventListener('resize',()=>close());
  new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});
  sync();
})();
