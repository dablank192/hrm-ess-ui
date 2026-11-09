/* Nested array-of-object schemas; paths are editor IDs, never request parameter names. */
(() => {
  const collapsed = new Set();
  const types = ['string','number','boolean','date','datetime','time','file','array'];
  if (!FD_DT.includes('array')) FD_DT.push('array');
  const typeName = fdDtName;
  fdDtName = function (type) { return type === 'array' ? 'Array of objects' : typeName(type); };
  function field(path) {
    let list = FTE.fields, result;
    String(path).split('_').forEach(part => { result = list[Number(part)]; list = result.children || []; });
    return result;
  }
  function walk(fields, visit, prefix = '') {
    fields.forEach((item,index) => {
      const path = prefix ? prefix + '_' + index : String(index);
      visit(item,path); if (Array.isArray(item.children)) walk(item.children,visit,path);
    });
  }
  const grab = ftGrab;
  ftGrab = function () {
    grab();
    walk(FTE.fields,(item,path) => {
      for (const [key,prefix] of [['k','ftk_'],['n','ftn_'],['dt','ftd_'],['mo','ftm_']]) {
        const control = document.getElementById(prefix + path); if (control) item[key] = control.value;
      }
    });
  };
  window.apiFieldToggle = function (path) { ftGrab(); collapsed.has(path) ? collapsed.delete(path) : collapsed.add(path); drawFt(); document.querySelector('[data-schema-toggle="' + path + '"]')?.focus({preventScroll:true}); };
  window.apiFieldType = function (path,previous,value) {
    ftGrab(); const item = field(path);
    const apply = () => {
      item.dt = value;
      if (value === 'array') { if (!item.children?.length) item.children = [{k:'',n:'',dt:'',mo:''}]; collapsed.delete(path); }
      else delete item.children;
      FTE.err = {}; drawFt();
      document.getElementById(value === 'array' ? 'ftk_' + path + '_0' : 'ftd_' + path)?.focus({preventScroll:true});
    };
    if (previous === 'array' && value !== 'array' && item.children?.some(child => child.k || child.n)) {
      item.dt = previous; drawFt();
      cfmShow({title:'Change array type?',ok:'Change type',body:'<p>Changing this array to a scalar removes its child field definitions from this draft.</p>',onOk:apply});
    } else apply();
  };
  window.apiFieldAddChild = function (path) {
    ftGrab(); const item = field(path); item.children ||= [];
    item.children.push({k:'',n:'',dt:'',mo:''}); collapsed.delete(path); drawFt();
    const input = document.getElementById('ftk_' + path + '_' + (item.children.length - 1));
    window.apiRevealAddedField(input, input?.closest('tr').nextElementSibling?.querySelector('button'));
  };
  window.apiFieldRemove = function (path) {
    ftGrab(); const parts = String(path).split('_'), index = Number(parts.pop());
    const list = parts.length ? field(parts.join('_')).children : FTE.fields;
    list.splice(index,1); collapsed.clear(); FTE.err = {}; drawFt();
  };
  function render(fields,prefix = '',parentName = '',level = 0) {
    const hint = text => text ? '<span class="hint ess-api-error" role="alert">' + esc(text) + '</span>' : '';
    return fields.map((item,index) => {
      const path = prefix ? prefix + '_' + index : String(index), number = path.replace(/_/g,'.').split('.').map(v=>Number(v)+1).join('.');
      const error = FTE.err?.schema?.[path] || (!prefix && FTE.err?.f?.[index]) || {};
      const array = item.dt === 'array', name = parentName + (item.k || 'field'), expanded = !collapsed.has(path);
      const choices = ['',...types,...(item.dt && !types.includes(item.dt) ? [item.dt] : [])];
      const description = item.mo || '';
      let html = '<tr class="' + (array ? 'ess-array-row ' : '') + (level ? 'ess-child-row' : '') + '"><td class="num">' +
        (array ? '<button type="button" class="ess-schema-toggle" data-schema-toggle="' + path + '" aria-label="' + (expanded ? 'Collapse' : 'Expand') + ' child fields ' + esc(name) + '" aria-expanded="' + expanded + '" onclick="apiFieldToggle(\'' + path + '\')">' + (expanded ? '▾' : '▸') + '</button>' : '') + number + '</td>' +
        '<td style="padding-left:' + (8 + Math.min(level,3)*12) + 'px"><input class="inp mono' + (error.k?' bad':'') + '" id="ftk_' + path + '" maxlength="60" value="' + esc(item.k) + '" aria-label="Field code ' + number + '" autocomplete="off">' + hint(error.k) +
        (parentName ? '<span class="ess-schema-path" title="' + esc(name) + '">' + esc(name) + '</span>' : '') + '</td>' +
        '<td><input class="inp' + (error.n?' bad':'') + '" id="ftn_' + path + '" maxlength="80" value="' + esc(item.n) + '" aria-label="Field name ' + number + '" autocomplete="off">' + hint(error.n) + '</td>' +
        '<td><select class="inp" id="ftd_' + path + '" aria-label="Data type ' + number + '" onchange="apiFieldType(\'' + path + '\',\'' + esc(item.dt || '') + '\',this.value)">' + choices.map(type=>'<option value="' + esc(type) + '"' + (type === (item.dt||'')?' selected':'') + '>' + (type === 'array'?'Array (objects)':esc(type || 'Select type')) + '</option>').join('') + '</select>' +
        (array?'<span class="ess-schema-path">' + (item.children?.length || 0) + ' child field(s)</span>':'') + '</td>' +
        '<td><input class="inp ess-description-preview" id="ftmPreview_' + path + '" value="' + esc(description.replace(/[\r\n]+/g,' ')) + '" title="' + esc(description) + '" maxlength="2000" aria-label="Description ' + number + '" onfocus="apiDescriptionOpen(\'' + path + '\')">' +
        '<textarea class="inp ess-description-editor" id="ftm_' + path + '" hidden maxlength="2000" rows="4" aria-label="Description ' + number + '" oninput="apiDescriptionEdit(\'' + path + '\')" onblur="apiDescriptionClose(\'' + path + '\')">' + esc(description) + '</textarea>' + hint(error.mo || error.children) + '</td>' +
        '<td><button type="button" class="xb" aria-label="Delete field ' + number + '" onclick="apiFieldRemove(\'' + path + '\')">' + svg(I.trash) + '</button></td></tr>';
      if (array && expanded) {
        html += render(item.children || [],path,name + '[].',level+1);
        html += '<tr class="ess-schema-add"><td colspan="6" style="padding-left:' + (28 + Math.min(level,3)*12) + 'px"><button type="button" class="btn" aria-label="Add child field to ' + esc(name) + '" onclick="apiFieldAddChild(\'' + path + '\')">' + svg(I.plus) + 'Add child field</button><span>Object fields in ' + esc(name) + '[]</span></td></tr>';
      }
      return html;
    }).join('');
  }
  function validate(fields) {
    const errors = {};
    function check(list,prefix='') {
      const seen = new Set();
      list.forEach((item,index) => {
        const path = prefix ? prefix + '_' + index : String(index), error = {};
        if (!prefix && !item.k.trim() && !item.n.trim() && !item.mo?.trim() && item.dt !== 'array') return;
        if (!FD_KEY_RE.test(item.k.trim())) error.k = 'Enter a valid field code.';
        if (seen.has(item.k.trim().toLowerCase())) error.k = 'Duplicate code within this level.';
        seen.add(item.k.trim().toLowerCase());
        if (!item.n.trim()) error.n = 'Enter the field name.';
        if ((item.mo || '').length > 2000) error.mo = 'Maximum 2,000 characters.';
        if (item.dt === 'array') {
          if (!item.children?.length) error.children = 'Add at least one child field for each array item.';
          check(item.children || [],path);
        }
        if (Object.keys(error).length) errors[path] = error;
      });
    }
    check(fields); if (Object.keys(errors).length) collapsed.clear(); return errors;
  }
  const open = openFt;
  openFt = function () { collapsed.clear(); return open.apply(this,arguments); };
  window.ApiFieldEditor = {field,render,validate};
})();
