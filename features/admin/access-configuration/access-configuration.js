const FIXTURE={
  "criteria": {
    "Legal Entity": [
      "FSOFT JSC",
      "FPT IS Company",
      "FPT Telecom JSC"
    ],
    "Level": [
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5"
    ],
    "Employee Group": [
      "Employee",
      "Contigent Worker",
      "Person of Interest"
    ],
    "Company": [
      "FPT Software",
      "FPT Telecom",
      "FPT IS"
    ]
  },
  "blocks": [
    {
      "code": "EP.BLOCK.01",
      "name": "Photo"
    },
    {
      "code": "EP.BLOCK.02",
      "name": "Basic Information"
    },
    {
      "code": "EP.BLOCK.03",
      "name": "Job Data Information"
    },
    {
      "code": "EP.BLOCK.04",
      "name": "Education Information"
    },
    {
      "code": "EP.BLOCK.05",
      "name": "Certificate Information"
    },
    {
      "code": "EP.BLOCK.06",
      "name": "Reward Information"
    },
    {
      "code": "EP.BLOCK.07",
      "name": "Disciplinary Information"
    },
    {
      "code": "EP.BLOCK.08",
      "name": "Bank Details"
    },
    {
      "code": "EP.BLOCK.09",
      "name": "National ID Information"
    },
    {
      "code": "EP.BLOCK.10",
      "name": "PIT Code Information"
    },
    {
      "code": "EP.BLOCK.11",
      "name": "Contact Information"
    },
    {
      "code": "EP.BLOCK.12",
      "name": "Address Information"
    },
    {
      "code": "EP.BLOCK.13",
      "name": "Work Experience"
    },
    {
      "code": "EP.BLOCK.14",
      "name": "Social Organization Information"
    },
    {
      "code": "EP.BLOCK.15",
      "name": "Family / Dependent Information"
    },
    {
      "code": "EP.BLOCK.16",
      "name": "Emergency Contact"
    },
    {
      "code": "EP.BLOCK.17",
      "name": "Other Special Information"
    }
  ],
  "groups": [
    {
      "id": "permanent",
      "name": "FSOFT Employees",
      "description": "Nhóm Employee thuộc FPT Software.",
      "criteria": [
        {
          "attribute": "Legal Entity",
          "operator": "Equals",
          "value": "FSOFT JSC"
        },
        {
          "attribute": "Employee Group",
          "operator": "Equals",
          "value": "Employee"
        }
      ],
      "status": "Active",
      "mockCount": null,
      "blocks": {
        "EP.BLOCK.01": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.02": {
          "view": true,
          "edit": true,
          "add": false
        },
        "EP.BLOCK.03": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.04": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.05": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.06": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.07": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.08": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.09": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.10": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.11": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.12": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.13": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.14": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.15": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.16": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.17": {
          "view": false,
          "edit": false,
          "add": false
        }
      },
      "updated": "01 Oct 2026"
    },
    {
      "id": "managers",
      "name": "FSOFT Managers",
      "description": "Quản lý tại FPT Software.",
      "criteria": [
        {
          "attribute": "Company",
          "operator": "Equals",
          "value": "FPT Software"
        },
        {
          "attribute": "Level",
          "operator": "Equals",
          "value": "Level 4"
        }
      ],
      "status": "Active",
      "mockCount": 214,
      "blocks": {
        "EP.BLOCK.01": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.02": {
          "view": true,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.03": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.04": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.05": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.06": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.07": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.08": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.09": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.10": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.11": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.12": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.13": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.14": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.15": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.16": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.17": {
          "view": false,
          "edit": false,
          "add": false
        }
      },
      "updated": "30 Sep 2026"
    },
    {
      "id": "hr-fsoft",
      "name": "HR FSOFT",
      "description": "Nhóm nhân sự FPT Software.",
      "criteria": [
        {
          "attribute": "Legal Entity",
          "operator": "Equals",
          "value": "FSOFT JSC"
        },
        {
          "attribute": "Company",
          "operator": "Equals",
          "value": "FPT Software"
        }
      ],
      "status": "Active",
      "mockCount": 35,
      "blocks": {
        "EP.BLOCK.01": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.02": {
          "view": true,
          "edit": true,
          "add": false
        },
        "EP.BLOCK.03": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.04": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.05": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.06": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.07": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.08": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.09": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.10": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.11": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.12": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.13": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.14": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.15": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.16": {
          "view": false,
          "edit": false,
          "add": false
        },
        "EP.BLOCK.17": {
          "view": false,
          "edit": false,
          "add": false
        }
      },
      "updated": "28 Sep 2026"
    }
  ]
};

/* Access Configuration prototype: fixture data and edits are held in memory. */
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=value=>JSON.parse(JSON.stringify(value));
const MODULES=[{id:'employee-profile',name:'Employee Profile',resources:FIXTURE.blocks}];
const demoState=new URLSearchParams(location.search).get('state')||document.body.dataset.demoState||'ready';
let groups=demoState==='empty'?[]:clone(FIXTURE.groups),draft=null,draftId=null,expanded=true,errors={},search='',pendingDelete=null,menuTrigger=null,moduleError=demoState==='error';
const app=document.getElementById('adminApp'),rowMenu=document.getElementById('rowMenu'),dialog=document.getElementById('adminDeleteDialog');
let listPage=1,listPageSize=25;
let toastTimer;
function notify(message){const el=document.getElementById('adminToast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4000)}
function applyAction(settings,code,action,checked){return AccessPermissions.apply(settings,code,action,checked)}
function validateGroup(group){
 return {...(!group.name.trim()?{groupName:'Configuration Name is required.'}:{}),...AccessCriteria.validate(group.criteriaTree,FIXTURE.criteria)};
}
// Dedicated read-only drawer; it reads saved records and never initializes an edit draft.
const accessView=document.createElement('dialog');
accessView.id='accessViewDialog';accessView.className='admin-view-dialog';accessView.setAttribute('aria-labelledby','accessViewTitle');
document.body.appendChild(accessView);
let viewedAccessId='';
function closeAccessView(){location.hash='#groups';}
accessView.addEventListener('cancel',event=>{event.preventDefault();closeAccessView();});
accessView.addEventListener('click',event=>{
 if(event.target.closest('[data-close-access-view]'))closeAccessView();
 if(event.target===accessView){const r=accessView.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right)closeAccessView();}
});
accessView.addEventListener('input',event=>{
 if(event.target.id!=='accessPermissionSearch')return;
 const query=event.target.value.trim().toLocaleLowerCase();
 accessView.querySelectorAll('[data-permission-row]').forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase().includes(query);});
 accessView.querySelector('#accessPermissionEmpty').hidden=[...accessView.querySelectorAll('[data-permission-row]')].some(row=>!row.hidden);
});
function openAccessView(id){
 const record=groups.find(group=>group.id===id);if(!record)return;
 viewedAccessId=id;
 const field=(label,value)=>`<dt>${h(label)}</dt><dd>${h(value??'—')}</dd>`;
 const flag=value=>`<span class="access-permission ${value?'allowed':'denied'}" aria-label="${value?'Allowed':'Not allowed'}"><span aria-hidden="true">${value?'✓':'—'}</span></span>`;
 accessView.innerHTML=`<div class="admin-view-shell"><header class="admin-view-heading"><h2 id="accessViewTitle">Access Configuration Details</h2><button type="button" data-close-access-view aria-label="Close access configuration details">×</button></header><div class="admin-view-body"><section aria-label="General information"><dl class="access-detail-fields">${field('Configuration Name',record.name)}${field('Description',record.description||'—')}${field('Members',record.mockCount==null?'—':record.mockCount.toLocaleString('en-US'))}${field('Last Updated',record.updated)}</dl></section><section class="access-view-section" aria-labelledby="accessCriteriaTitle"><h3 id="accessCriteriaTitle">User Criteria</h3><p>Each group shows how its conditions combine. Within a condition, any selected value may match.</p>${readCriteriaGroup(AccessCriteria.fromRecord(record))}<div class="criteria-expression"><strong>Logic summary</strong><p>${h(criteriaExpression(AccessCriteria.fromRecord(record)))}</p></div></section><section class="access-view-section" aria-labelledby="accessPermissionsTitle"><h3 id="accessPermissionsTitle">Module Permissions</h3><label class="access-view-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input type="search" id="accessPermissionSearch" placeholder="Search blocks…" aria-label="Search permission blocks"></label>${MODULES.map(module=>`<details class="access-view-module" open><summary>${h(module.name)}</summary><div class="access-view-table-wrap"><table class="access-view-table permissions"><thead><tr><th>Block</th><th>View</th><th>Edit</th><th>Edit via Approval</th><th>Require Attachments</th><th>Add New</th></tr></thead><tbody>${module.resources.map(block=>`<tr data-permission-row><td>${h(block.name)}</td>${AccessPermissions.columns.map(({key:action})=>{const flags=AccessPermissions.normalize(record.blocks[block.code],block.code);return `<td>${action==='editViaApproval'?(AccessPermissions.eligible(flags)?`<span class="access-approval-mode">${flags.editViaApproval?'Required':'Direct'}</span>`:'<span aria-label="Not applicable: Edit and Add New are off">—</span>'):flag(flags[action])}</td>`}).join('')}</tr>`).join('')}</tbody></table></div></details>`).join('')}<p id="accessPermissionEmpty" hidden>No matching blocks.</p></section></div><footer class="admin-view-footer"><button type="button" class="admin-button secondary" data-close-access-view>Close</button></footer></div>`;
 if(!accessView.open)accessView.showModal();document.body.classList.add('admin-view-open');
 accessView.querySelector('[data-close-access-view]').focus({preventScroll:true});
}
function heading(title,description='',action=''){return `<div class="admin-heading"><div><h1>${h(title)}</h1>${description?`<p>${h(description)}</p>`:''}</div>${action}</div>`}
function breadcrumbs(){return '<nav class="admin-breadcrumb admin-access-breadcrumb" aria-label="Breadcrumb"><a href="features/admin/access-configuration/index.html#groups">Admin Center</a><span aria-hidden="true">›</span><a href="#groups">ESS Configuration</a><span aria-hidden="true">›</span><span aria-current="page">Access Configuration</span></nav>'}
function overview(){return `${heading('Policy Management','Manage access configurations and configure which Employee Profile blocks each group can view, edit, or add.')}<section class="admin-function-grid option-launcher"><a class="admin-function-card" href="#groups"><h2>Access Configuration</h2><p>Define group membership criteria and configure module access in one place.</p><span>View Access Configuration →</span></a></section>`}
function filteredGroups(){const term=search.trim().toLocaleLowerCase();return groups.filter(g=>(g.name+' '+g.description).toLocaleLowerCase().includes(term))}
function listPageState(){
 const records=filteredGroups(),total=records.length,pages=Math.max(1,Math.ceil(total/listPageSize));
 listPage=Math.max(1,Math.min(listPage,pages));
 const offset=(listPage-1)*listPageSize;
 return {records:records.slice(offset,offset+listPageSize),total,pages,from:total?offset+1:0,to:Math.min(offset+listPageSize,total)};
}
function tableRows(){return listPageState().records.map(g=>`<tr><td data-label="Configuration Name"><a href="#group/${encodeURIComponent(g.id)}/view">${h(g.name)}</a></td><td data-label="Members">${g.mockCount==null?'—':g.mockCount.toLocaleString('en-US')}</td><td data-label="Configured Modules"><span class="admin-pill">Employee Profile</span></td><td data-label="Last Updated">${h(g.updated)}</td><td class="group-actions" data-label="Actions"><button class="admin-overflow-toggle" type="button" data-menu-id="${h(g.id)}" aria-haspopup="menu" aria-controls="rowMenu" aria-expanded="false" aria-label="Actions for ${h(g.name)}">⋮</button></td></tr>`).join('')}
function listPagination(){
 const {total,pages,from,to}=listPageState();
 const pageButton=(page,label,aria,disabled=false)=>`<button type="button" data-list-page="${page}" aria-label="${aria}" ${page===listPage&&/^\d+$/.test(label)?'aria-current="page"':''} ${disabled?'disabled':''}>${label}</button>`;
 const start=Math.max(1,Math.min(listPage-2,pages-4)),end=Math.min(pages,start+4);
 let numbers='';
 for(let page=start;page<=end;page++)numbers+=pageButton(page,String(page),'Page '+page);
 if(end<pages)numbers+='<span class="admin-page-ellipsis" aria-hidden="true">…</span>'+pageButton(pages,String(pages),'Page '+pages);
 return `<div class="admin-pagination-summary"><label for="groupPageSize">Rows Per Page:</label><select id="groupPageSize">${[10,25,50,100].map(size=>`<option value="${size}" ${size===listPageSize?'selected':''}>${size}</option>`).join('')}</select><span role="status" aria-live="polite">${from} - ${to} of ${total}</span></div><nav class="admin-pagination-controls" aria-label="Access configurations pagination">${pageButton(1,'First','First page',listPage===1)}${pageButton(listPage-1,'‹','Previous page',listPage===1)}${numbers}${pageButton(listPage+1,'›','Next page',listPage===pages)}${pageButton(pages,'Last','Last page',listPage===pages)}</nav>`;
}
function listContent(){return `<div class="admin-table-wrap"><table class="admin-table group-list" aria-label="Access configurations"><thead><tr>${['Configuration Name','Members','Configured Modules','Last Updated','Actions'].map(n=>`<th scope="col">${n}</th>`).join('')}</tr></thead><tbody id="groupRows">${tableRows()}</tbody></table><div id="noResults" class="no-results" ${listPageState().total?'hidden':''}>${groups.length?'No matching configurations.':'<h2>No access configurations yet.</h2><p>Create an access configuration to define membership criteria and configure available module actions.</p><a class="admin-button" href="#group/new">Create Access Configuration</a>'}</div></div><footer class="admin-pagination" id="groupPagination">${listPagination()}</footer>`}
function refreshList(focusLabel){
 closeMenu();
 document.getElementById('groupRows').innerHTML=tableRows();
 document.getElementById('noResults').hidden=!!listPageState().total;
 document.getElementById('groupPagination').innerHTML=listPagination();
 if(focusLabel){const next=[...document.querySelectorAll('#groupPagination [aria-label]')].find(el=>el.getAttribute('aria-label')===focusLabel&&!el.disabled);(next||document.querySelector('#groupPagination [aria-current="page"]'))?.focus();}
}
function list(){return `${breadcrumbs()}${heading('Access Configuration','','<a class="admin-button" href="#group/new">+ Create Access Configuration</a>')}<div class="admin-toolbar admin-list-toolbar"><label class="admin-list-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input class="admin-search" type="search" id="groupSearch" value="${h(search)}" placeholder="Search configurations..." aria-label="Search access configurations"></label></div><section class="admin-panel admin-access-list" aria-label="Access Configuration list">${listContent()}</section>`}
function errorText(id){return errors[id]?`<span class="admin-error" id="${id}-error">${h(errors[id])}</span>`:''}
function errorAttrs(id){return errors[id]?`aria-invalid="true" aria-describedby="${id}-error"`:''}

function criterionValues(c){return [...new Set(Array.isArray(c.values)?c.values:c.value?[c.value]:[])]}
function normalizeCriterion(c){return {attribute:c.attribute||'',operator:'In',values:criterionValues(c)}}
function criterionKey(c){return JSON.stringify([c.attribute,c.operator,[...criterionValues(c)].sort()])}
function valueSummary(c){const values=criterionValues(c),options=FIXTURE.criteria[c.attribute]||[];if(!values.length)return 'Select value';if(options.length&&values.length===options.length&&options.every(v=>values.includes(v)))return 'ALL';return values.length===1?values[0]:values[0]+' +'+(values.length-1)}

function selectedValueChips(c,i){const values=criterionValues(c);if(!values.length)return '<span class="criteria-value-placeholder">Select value</span>';const first=values[0],rest=values.slice(1);return `<span class="criteria-selected-chip"><span class="criteria-chip-name" title="${h(first)}">${h(first)}</span><button type="button" class="criteria-chip-remove" data-chip-remove="${h(first)}" data-chip-row="${i}" aria-label="Remove ${h(first)}">×</button></span>${rest.length?`<span class="criteria-more-wrap"><button type="button" class="criteria-more-count" aria-describedby="criterion-${i}-selected-tooltip" aria-label="${rest.length} more selected values. Open value list." data-value-picker="${i}">+${rest.length}</button><span class="criteria-selected-tooltip" id="criterion-${i}-selected-tooltip" role="tooltip"><ul>${rest.map(v=>`<li>${h(v)}</li>`).join('')}</ul></span></span>`:''}`}
function updateSelectedValueChips(i){updateCriteriaExpression();const c=draft?.criteria[i],trigger=document.getElementById('criterion-'+i+'-value');if(!c||!trigger)return;const field=trigger.closest('.criteria-value-field');field.querySelector('.criteria-value-summary').innerHTML=selectedValueChips(c,i);field.classList.toggle('has-values',criterionValues(c).length>0);field.querySelector('[data-chip-clear]').hidden=!criterionValues(c).length;trigger.setAttribute('aria-label','Select values for '+c.attribute+'; '+criterionValues(c).length+' selected')}
function criteriaExpression(node){
 if(node.type!=='group')return (node.attribute||'[Attribute]')+' is any of {'+(criterionValues(node).join(', ')||'[Value]')+'}';
 return '('+(node.children.length?node.children.map(criteriaExpression).join(node.match==='any'?' OR ':' AND '):'[Empty group]')+')';
}
function updateCriteriaExpression(){const preview=document.getElementById('criteriaExpression');if(preview&&draft?.criteriaTree)preview.textContent=criteriaExpression(draft.criteriaTree)}
function criterionPath(node,target,path='root'){if(node===target)return path;if(node.type==='group')for(let i=0;i<node.children.length;i++){const found=criterionPath(node.children[i],target,path+'.'+i);if(found)return found}return null}
function criteriaGroupLabel(tree,path){if(path==='root')return 'Conditions';let node=tree;const numbers=[];for(const part of path.split('.').slice(1)){const index=Number(part);numbers.push(node.children.slice(0,index+1).filter(child=>child.type==='group').length);node=node.children[index]}return 'Condition group '+numbers.join('.')}
function criteriaGroup(node,path='root',depth=1){
 const label=criteriaGroupLabel(draft.criteriaTree,path);
 const connector=node.match==='any'?'OR':'AND';
 return `<section class="criteria-group ${path==='root'?'criteria-root':''}" aria-label="${label}" data-criteria-path="${path}"><div class="criteria-group-header"><div class="criteria-group-title"><strong>${label}</strong><span>${node.match==='any'?'Match at least one':'Match all'}</span></div><div class="criteria-match-switch" role="group" aria-label="Combine ${label.toLowerCase()}">${[['all','AND'],['any','OR']].map(([value,text])=>`<button type="button" id="criteria-group-${path}-${value}" data-criteria-group="${path}" data-criteria-match="${value}" aria-pressed="${node.match===value}">${text}</button>`).join('')}</div>${path==='root'?'':`<button type="button" class="criteria-group-remove" id="criteria-group-${path}-remove" data-criteria-remove-group="${path}" aria-label="Remove ${label.toLowerCase()}">×</button>`}</div><div class="criteria-group-children">${node.children.map((child,i)=>`${i?`<div class="criteria-connector"><span>${connector}</span></div>`:''}${child.type==='group'?criteriaGroup(child,path+'.'+i,depth+1):criterionRow(child,draft.criteria.indexOf(child))}`).join('')||'<p class="criteria-group-empty">No conditions yet. Add a condition or a group.</p>'}</div><div class="criteria-group-actions"><button type="button" class="admin-button secondary" id="criteria-group-${path}-add" data-criteria-add="${path}">+ Add condition</button><button type="button" class="admin-button tertiary" data-criteria-add-group="${path}" ${depth>=AccessCriteria.MAX_DEPTH?'disabled title="Maximum three group levels"':''}>+ Add group</button>${depth>=AccessCriteria.MAX_DEPTH?'<span class="criteria-depth-note">Maximum group depth reached</span>':''}</div><div id="criteria-group-${path}" class="criteria-group-error" tabindex="-1">${errorText('criteria-group-'+path)}</div></section>`;
}
function readCriteriaGroup(node,path='root'){
 if(node.type!=='group')return `<div class="criteria-read-condition"><strong>${h(node.attribute)}</strong><span>is any of</span><span>${criterionValues(node).map(h).join(', ')||'—'}</span></div>`;
 const connector=node.match==='any'?'OR':'AND';
 return `<section class="criteria-group criteria-read-group"><div class="criteria-group-header"><strong>${path==='root'?'Conditions':'Condition group'}</strong><span class="criteria-read-match">${connector} · ${node.match==='any'?'Match at least one':'Match all'}</span></div><div class="criteria-group-children">${node.children.map((child,i)=>`${i?`<div class="criteria-connector"><span>${connector}</span></div>`:''}${readCriteriaGroup(child,path+'.'+i)}`).join('')||'<p>No conditions configured.</p>'}</div></section>`;
}
const criteriaDeleteDialog=document.createElement('dialog');criteriaDeleteDialog.className='admin-delete-dialog criteria-delete-dialog';criteriaDeleteDialog.setAttribute('aria-labelledby','criteriaDeleteTitle');document.body.append(criteriaDeleteDialog);let pendingCriteriaGroup='';
function askRemoveCriteriaGroup(path){pendingCriteriaGroup=path;const count=AccessCriteria.flatten(AccessCriteria.at(draft.criteriaTree,path)).length;criteriaDeleteDialog.innerHTML=`<h2 id="criteriaDeleteTitle">Remove condition group?</h2><p>This removes the group and its ${count} condition${count===1?'':'s'} from this draft. The saved configuration changes only when you save.</p><div class="admin-actions"><button type="button" class="admin-button secondary" data-cancel-criteria-delete>Cancel</button><button type="button" class="admin-button danger" data-confirm-criteria-delete>Remove group</button></div>`;criteriaDeleteDialog.showModal();criteriaDeleteDialog.querySelector('[data-cancel-criteria-delete]').focus()}
criteriaDeleteDialog.addEventListener('cancel',()=>document.getElementById('criteria-group-'+pendingCriteriaGroup+'-remove')?.focus());
function criterionRow(c,i){const attributes=Object.keys(FIXTURE.criteria);return `<div class="admin-criteria-row" data-row="${i}"><div class="admin-field"><label class="criteria-field-label" for="criterion-${i}-attribute">Attribute</label><select class="admin-select" id="criterion-${i}-attribute" data-criterion="${i}" data-part="attribute" ${errorAttrs('criterion-'+i+'-attribute')}><option value="">Select attribute</option>${attributes.map(a=>`<option ${c.attribute===a?'selected':''}>${h(a)}</option>`).join('')}</select>${errorText('criterion-'+i+'-attribute')}</div><span class="criteria-equals" role="img" aria-label="Equals any selected value">=</span><div class="admin-field"><label class="criteria-field-label" for="criterion-${i}-value">Value</label><div class="admin-select criteria-value-field ${criterionValues(c).length?'has-values':''} ${c.attribute?'':'is-disabled'}" data-value-picker="${i}"><button type="button" class="criteria-value-open" id="criterion-${i}-value" data-value-picker="${i}" aria-haspopup="dialog" aria-expanded="false" aria-controls="criteriaValuePopup" aria-label="Select values for ${h(c.attribute||'attribute')}; ${criterionValues(c).length} selected" ${c.attribute?'':'disabled'} ${errorAttrs('criterion-'+i+'-value')}></button><span class="criteria-value-summary">${selectedValueChips(c,i)}</span><button type="button" class="criteria-value-clear-all" data-chip-clear="${i}" aria-label="Clear all ${h(c.attribute||'attribute')} values" ${criterionValues(c).length?'':'hidden'}>×</button></div>${errorText('criterion-'+i+'-value')}</div><button type="button" class="criterion-remove" data-remove="${i}" aria-label="Remove criterion ${i+1}">×</button></div>`}

let valuePickerIndex=null,valuePickerTrigger=null,valuePickerQuery='';
const valuePopup=document.createElement('div');valuePopup.id='criteriaValuePopup';valuePopup.className='criteria-value-popup';valuePopup.setAttribute('role','dialog');valuePopup.setAttribute('aria-label','Select attribute values');valuePopup.hidden=true;document.body.append(valuePopup);
function closeValuePicker(restore=false){valuePopup.hidden=true;valuePickerTrigger?.setAttribute('aria-expanded','false');if(restore)valuePickerTrigger?.focus();valuePickerIndex=null;valuePickerTrigger=null;valuePickerQuery=''}
function positionValuePicker(){if(valuePopup.hidden||!valuePickerTrigger?.isConnected)return;const box=valuePickerTrigger.getBoundingClientRect();const width=Math.min(Math.max(280,box.width),innerWidth-24);valuePopup.style.width=width+'px';valuePopup.style.left=Math.max(12,Math.min(box.left,innerWidth-width-12))+'px';const roomBelow=innerHeight-box.bottom-16,roomAbove=box.top-16,up=roomBelow<220&&roomAbove>roomBelow;const height=Math.min(400,up?roomAbove:roomBelow);valuePopup.style.maxHeight=Math.max(140,height)+'px';valuePopup.style.top=up?Math.max(12,box.top-valuePopup.getBoundingClientRect().height-4)+'px':box.bottom+4+'px'}
function paintValueOptions(){if(valuePickerIndex===null||!draft?.criteria[valuePickerIndex])return;const c=draft.criteria[valuePickerIndex],values=criterionValues(c),options=FIXTURE.criteria[c.attribute]||[],term=valuePickerQuery.trim().toLocaleLowerCase(),filtered=options.filter(v=>v.toLocaleLowerCase().includes(term));const all=valuePopup.querySelector('[data-value-all]');all.checked=options.length>0&&options.every(v=>values.includes(v));all.indeterminate=values.length>0&&!all.checked;all.disabled=!options.length;valuePopup.querySelector('[data-value-count]').textContent=values.length+' item'+(values.length===1?'':'s')+' selected';valuePopup.querySelector('[data-value-clear]').disabled=!values.length;valuePopup.querySelector('.criteria-value-options').innerHTML=filtered.length?filtered.map(v=>`<label class="criteria-value-option"><input type="checkbox" data-value-option value="${h(v)}" ${values.includes(v)?'checked':''}><span>${h(v)}</span></label>`).join(''):'<p class="criteria-value-no-results">No matching values.</p>';updateSelectedValueChips(valuePickerIndex)}
function openValuePicker(index,trigger){if(valuePickerIndex===index&&!valuePopup.hidden){closeValuePicker();return}closeValuePicker();closeMenu();valuePickerIndex=index;valuePickerTrigger=trigger;valuePickerQuery='';valuePopup.innerHTML=`<div class="criteria-value-search"><span aria-hidden="true">⌕</span><input type="search" id="criteriaValueSearch" class="admin-search" placeholder="Search values..." aria-label="Search ${h(draft.criteria[index].attribute)} values"></div><div class="criteria-value-toolbar"><span data-value-count role="status" aria-live="polite"></span><button type="button" data-value-clear>Clear</button></div><label class="criteria-value-option criteria-value-all"><input type="checkbox" data-value-all><span>ALL</span></label><div class="criteria-value-options"></div>`;valuePopup.setAttribute('aria-label','Select '+draft.criteria[index].attribute+' values');valuePopup.hidden=false;trigger.setAttribute('aria-expanded','true');paintValueOptions();positionValuePicker();valuePopup.querySelector('input[type="search"]').focus()}
function selectCriterionValues(c,options,selection){const allowed=new Set(options);c.values=[...new Set(selection)].filter(v=>allowed.has(v));delete c.value;c.operator='In'}
document.addEventListener('click',e=>{const remove=e.target.closest('[data-chip-remove]'),clear=e.target.closest('[data-chip-clear]');if(remove||clear){const i=+(remove?remove.dataset.chipRow:clear.dataset.chipClear);if(!draft?.criteria[i])return;const c=draft.criteria[i];selectCriterionValues(c,FIXTURE.criteria[c.attribute]||[],remove?criterionValues(c).filter(v=>v!==remove.dataset.chipRemove):[]);closeValuePicker();updateSelectedValueChips(i);document.getElementById('criterion-'+i+'-value')?.focus();return}const trigger=e.target.closest('[data-value-picker]');if(trigger){const i=+trigger.dataset.valuePicker;const control=document.getElementById('criterion-'+i+'-value');if(!control||control.disabled)return;openValuePicker(i,control);return}if(e.target.closest('[data-value-clear]')&&valuePickerIndex!==null){selectCriterionValues(draft.criteria[valuePickerIndex],FIXTURE.criteria[draft.criteria[valuePickerIndex].attribute]||[],[]);paintValueOptions();valuePopup.querySelector('#criteriaValueSearch').focus();return}if(!valuePopup.hidden&&!valuePopup.contains(e.target))closeValuePicker()});
document.addEventListener('input',e=>{if(e.target.id==='criteriaValueSearch'){valuePickerQuery=e.target.value;paintValueOptions()}});
document.addEventListener('change',e=>{const el=e.target;if(valuePickerIndex===null||!draft?.criteria[valuePickerIndex])return;const c=draft.criteria[valuePickerIndex],options=FIXTURE.criteria[c.attribute]||[];if(el.hasAttribute('data-value-all')){selectCriterionValues(c,options,el.checked?options:[]);paintValueOptions()}else if(el.hasAttribute('data-value-option')){const selected=new Set(criterionValues(c));el.checked?selected.add(el.value):selected.delete(el.value);selectCriterionValues(c,options,[...selected]);const focusValue=el.value;paintValueOptions();[...valuePopup.querySelectorAll('[data-value-option]')].find(x=>x.value===focusValue)?.focus()}});
document.addEventListener('keydown',e=>{if(valuePopup.hidden)return;if(e.key==='Escape'){e.preventDefault();closeValuePicker(true)}else if(valuePopup.contains(e.target)&&['ArrowDown','ArrowUp'].includes(e.key)){const controls=[...valuePopup.querySelectorAll('input,button')].filter(x=>!x.disabled);const i=controls.indexOf(document.activeElement),next=(i+(e.key==='ArrowDown'?1:controls.length-1))%controls.length;e.preventDefault();controls[next]?.focus()}});
document.addEventListener('focusin',e=>{if(!valuePopup.hidden&&!valuePopup.contains(e.target)&&e.target!==valuePickerTrigger)closeValuePicker()});
window.addEventListener('resize',()=>closeValuePicker());window.addEventListener('scroll',()=>closeValuePicker(),{passive:true});
function permissionCheckbox(block,column){const flags=AccessPermissions.normalize(draft.blocks[block.code],block.code),disabled=!AccessPermissions.available(draft.blocks,block.code,column.key),reason=!AccessPermissions.supported(block.code,column.key)?'This block supports View only':column.key==='requireAttachments'?'Enable Edit via Approval first':'Enable Edit or Add New first';return `<span role="cell"><label class="admin-block-check ${disabled?'is-disabled':''}" ${disabled?`title="${reason}"`:''}><input type="checkbox" data-block="${block.code}" data-action="${column.key}" aria-label="${column.label} ${h(block.name)}" ${flags[column.key]?'checked':''} ${disabled?'disabled':''}><span>${column.label}</span></label></span>`}
function syncPermissionControls(){
 if(!draft)return;
 document.querySelectorAll('[data-block][data-action]').forEach(input=>{const flags=AccessPermissions.normalize(draft.blocks[input.dataset.block],input.dataset.block);input.checked=flags[input.dataset.action];input.disabled=!AccessPermissions.available(draft.blocks,input.dataset.block,input.dataset.action);input.closest('label').classList.toggle('is-disabled',input.disabled);input.closest('label').title=input.disabled?(!AccessPermissions.supported(input.dataset.block,input.dataset.action)?'This block supports View only':input.dataset.action==='requireAttachments'?'Enable Edit via Approval first':'Enable Edit or Add New first'):''});
 document.querySelectorAll('[data-permission-all]').forEach(input=>{const module=MODULES.find(m=>m.id===input.dataset.permissionModule);if(!module)return;const state=AccessPermissions.bulkState(draft.blocks,module.resources.map(b=>b.code),input.dataset.permissionAll);input.checked=state.checked;input.indeterminate=state.indeterminate;input.disabled=state.disabled;input.closest('label').classList.toggle('is-disabled',state.disabled);input.title=state.disabled?(input.dataset.permissionAll==='requireAttachments'?'Enable Edit via Approval on at least one block first':'Enable Edit or Add New on at least one block first'):`${state.count} of ${state.total} eligible blocks selected`});
}
function moduleCard(module){return `<section class="module-card" aria-labelledby="module-title"><h3 class="module-title" id="module-title"><button class="module-toggle" type="button" aria-expanded="${expanded}" aria-controls="module-body" id="moduleToggle"><span id="moduleChevron" class="module-chevron" aria-hidden="true">${expanded?'⌄':'›'}</span><span><strong>${h(module.name)}</strong></span><span class="module-count">${module.resources.length} blocks</span></button></h3><div class="module-body" id="module-body" ${expanded?'':'hidden'}>${moduleError?'<div class="module-load-error" role="alert"><p>Unable to load module configuration.</p><button type="button" class="admin-button secondary" id="retryModule">Retry</button></div>':`<div class="admin-block-table permission-settings" role="table" aria-label="Employee Profile actions and approval settings"><div class="admin-block-head" role="row"><span role="columnheader">Block</span>${AccessPermissions.columns.map(column=>`<span role="columnheader"><label class="permission-column-all"><span>${column.label}</span><input type="checkbox" data-permission-all="${column.key}" data-permission-module="${module.id}" aria-label="Select all ${column.label}"></label></span>`).join('')}</div>${module.resources.map(block=>`<div class="admin-block-row" role="row"><span role="cell">${h(block.name)}</span>${AccessPermissions.columns.map(column=>permissionCheckbox(block,column)).join('')}</div>`).join('')}</div><p class="permission-settings-note">Require Attachments applies to Edit and Add New via approval. When selected, at least one supporting document is required. Turning off Edit via Approval clears this setting.</p>`}</div></section>`}
function editor(id){
 if(draftId!==id||!draft){const item=groups.find(g=>g.id===id);if(id!=='new'&&!item)return `${heading('Access configuration not found')}<a class="admin-button secondary" href="#groups">Back to Access Configuration</a>`;draft= item?clone(item):{id:null,name:'',description:'',criteria:[{attribute:'',operator:'In',values:[]}],blocks:{},mockCount:null};for(const module of MODULES)for(const block of module.resources)draft.blocks[block.code]=AccessPermissions.normalize(draft.blocks[block.code],block.code);draft.criteriaTree=AccessCriteria.fromRecord(draft);draft.criteria=AccessCriteria.flatten(draft.criteriaTree);draftId=id;expanded=document.body.dataset.moduleCollapsed!=='true';errors={};}
 return `<form id="groupForm" novalidate><section class="admin-panel" aria-labelledby="infoHeading"><h2 id="infoHeading">General Information</h2><div class="admin-form-grid"><div class="admin-field full"><label for="groupName">Configuration Name <span aria-hidden="true">*</span></label><input class="admin-input" id="groupName" required value="${h(draft.name)}" ${errorAttrs('groupName')}>${errorText('groupName')}</div><div class="admin-field full"><label for="groupDescription">Description</label><textarea class="admin-textarea" id="groupDescription">${h(draft.description)}</textarea></div></div></section><section class="admin-panel" aria-labelledby="criteriaHeading"><h2 id="criteriaHeading">User Criteria</h2><div id="criteriaRows">${criteriaGroup(draft.criteriaTree)}</div><div id="criteriaErrors" role="alert" tabindex="-1">${errorText('criteriaErrors')}</div><div class="criteria-expression"><strong>Logic summary</strong><p id="criteriaExpression" aria-live="polite">${h(criteriaExpression(draft.criteriaTree))}</p></div></section><section class="admin-panel option-module-panel" aria-labelledby="configHeading"><h2 id="configHeading">Module Permissions</h2><p class="admin-panel-subtitle">Configure actions available to members of this access configuration.</p>${MODULES.map(moduleCard).join('')}</section><div class="admin-actions"><a class="admin-button tertiary" href="#groups">Cancel</a><button class="admin-button" type="submit" ${moduleError?'disabled':''}>Save</button></div></form>`;
}
const createDialog=document.getElementById('accessCreateDialog'),createBody=document.getElementById('accessCreateBody'),createFooter=document.getElementById('accessCreateFooter');
function paintCreateEditor(id=draftId||'new'){
 closeValuePicker();createBody.innerHTML=editor(id);createFooter.innerHTML='';
 document.getElementById('accessCreateTitle').textContent=id==='new'?'Create Access Configuration':'Edit Access Configuration';
 document.getElementById('closeAccessCreate').setAttribute('aria-label',id==='new'?'Close create access configuration':'Close edit access configuration');
 const actions=createBody.querySelector('.admin-actions');createFooter.appendChild(actions);actions.querySelector('button[type=submit]').setAttribute('form','groupForm');
 createDialog.appendChild(valuePopup);syncPermissionControls();document.body.classList.add('admin-create-open');if(!createDialog.open)createDialog.showModal();
}
function repaintGroupEditor(){paintCreateEditor(draftId)}
function dismissCreateEditor(){closeValuePicker();location.hash='#groups'}
createDialog.addEventListener('cancel',e=>{e.preventDefault();dismissCreateEditor()});
createDialog.addEventListener('click',e=>{if(e.target!==createDialog)return;const r=createDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismissCreateEditor()});
createBody.addEventListener('scroll',()=>closeValuePicker(),{passive:true});
document.getElementById('closeAccessCreate').onclick=dismissCreateEditor;
function render(){
 closeValuePicker();closeMenu();const parts=(location.hash.slice(1)||document.body.dataset.initialRoute||'groups').split('/'),id=decodeURIComponent(parts[1]||'new');
 const isView=parts[0]==='group'&&parts[2]==='view',isEditor=parts[0]==='group'&&!isView,wasCreate=createDialog.open,wasView=accessView.open,previousDraftId=draftId;
 if(!isView){accessView.close();document.body.classList.remove('admin-view-open');}
 if(!isEditor){createDialog.close();document.body.appendChild(valuePopup);createBody.innerHTML='';createFooter.innerHTML='';document.body.classList.remove('admin-create-open')}
 if(!isEditor){draft=null;draftId=null;errors={}}
 document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===(parts[0]==='overview'?'overview':'groups'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 app.innerHTML=parts[0]==='overview'?overview():list();
 if(isView){if(groups.some(g=>g.id===id))openAccessView(id);else location.hash='#groups';}
 else if(isEditor){if(id!=='new'&&!groups.some(g=>g.id===id)){location.hash='#groups';return}paintCreateEditor(id);document.getElementById('groupName').focus({preventScroll:true})}
 else if(wasView)(app.querySelector('a[href="#group/'+encodeURIComponent(viewedAccessId)+'/view"]')||app).focus({preventScroll:true});
 else if(wasCreate)(previousDraftId==='new'?app.querySelector('[href="#group/new"]'):[...app.querySelectorAll('[data-menu-id]')].find(el=>el.dataset.menuId===previousDraftId)||app).focus({preventScroll:true});else app.focus({preventScroll:true});
}
function closeMenu(restore=false){rowMenu.hidden=true;menuTrigger?.setAttribute('aria-expanded','false');if(restore)menuTrigger?.focus();}
function openMenu(trigger){const item=groups.find(g=>g.id===trigger.dataset.menuId);if(!item)return;const wasOpen=!rowMenu.hidden&&menuTrigger===trigger;closeMenu();if(wasOpen)return;menuTrigger=trigger;rowMenu.innerHTML=`<a role="menuitem" href="#group/${encodeURIComponent(item.id)}/edit">Edit</a><button type="button" role="menuitem" class="destructive" data-delete="${h(item.id)}">Delete</button>`;rowMenu.hidden=false;trigger.setAttribute('aria-expanded','true');const box=trigger.getBoundingClientRect();rowMenu.style.left=Math.max(8,Math.min(box.right-150,innerWidth-158))+'px';rowMenu.style.top=Math.max(8,Math.min(box.bottom+4,innerHeight-100))+'px';rowMenu.querySelector('[role="menuitem"]').focus();}
function openDelete(id){const item=groups.find(g=>g.id===id);if(!item)return;pendingDelete=id;closeMenu();dialog.innerHTML=`<h2 id="adminDeleteTitle">Delete access configuration?</h2><div id="adminDeleteCopy"><p>Deleting “${h(item.name)}” will also remove its membership criteria and module configuration from the active configuration list.</p><p>This action cannot be undone.</p></div><div class="admin-actions"><button type="button" class="admin-button tertiary" id="cancelDelete" autofocus>Cancel</button><button type="button" class="admin-button danger" id="confirmDelete">Delete Configuration</button></div>`;dialog.showModal();document.getElementById('cancelDelete').focus();}
function commitDraft(){const existing=groups.find(g=>g.id===draft.id);if(existing&&AccessCriteria.key(AccessCriteria.fromRecord(existing))!==AccessCriteria.key(draft.criteriaTree))draft.mockCount=null;draft.name=draft.name.trim();draft.description=draft.description.trim();if(!draft.id)draft.id='option-b-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);draft.updated=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});const index=groups.findIndex(g=>g.id===draft.id);if(index<0)groups.push(clone(draft));else groups[index]=clone(draft);}
function refreshCriteria(focusId){closeValuePicker();draft.criteria=AccessCriteria.flatten(draft.criteriaTree);document.getElementById('criteriaRows').innerHTML=criteriaGroup(draft.criteriaTree);document.getElementById('criteriaErrors').innerHTML=errorText('criteriaErrors');updateCriteriaExpression();if(focusId)document.getElementById(focusId)?.focus();}
document.addEventListener('input',e=>{if(e.target.id==='groupName')draft.name=e.target.value;if(e.target.id==='groupDescription')draft.description=e.target.value;if(e.target.id==='groupSearch'){search=e.target.value;listPage=1;refreshList();}});
document.addEventListener('change',e=>{
 const el=e.target;if(el.id==='groupPageSize'){const size=Number(el.value);if([10,25,50,100].includes(size)){listPageSize=size;listPage=1;refreshList();document.getElementById('groupPageSize').focus();}return;}
 if(el.dataset.criterion!=null){const i=+el.dataset.criterion;draft.criteria[i][el.dataset.part]=el.value;if(el.dataset.part==='attribute'){draft.criteria[i].values=[];delete draft.criteria[i].value;refreshCriteria(el.id);}return;}
 if(el.dataset.permissionAll){const module=MODULES.find(m=>m.id===el.dataset.permissionModule);if(module){const action=el.dataset.permissionAll;AccessPermissions.bulkApply(draft.blocks,module.resources.map(b=>b.code),action,el.checked);syncPermissionControls();document.getElementById('dependencyStatus').textContent=`${AccessPermissions.columns.find(c=>c.key===action).label} ${el.checked?'enabled':'disabled'} for all eligible blocks.`}return;}
 if(el.dataset.block){applyAction(draft.blocks,el.dataset.block,el.dataset.action,el.checked);syncPermissionControls();document.getElementById('dependencyStatus').textContent=el.dataset.action==='view'&&!el.checked?'View, Edit, Edit via Approval, Require Attachments, and Add New cleared.':(el.dataset.action==='edit'||el.dataset.action==='add')?'Permission updated. Approval is available when Edit or Add New is enabled.':el.dataset.action==='editViaApproval'?(el.checked?'Changes require approval.':'Direct changes enabled. Require Attachments cleared.'):el.dataset.action==='requireAttachments'?(el.checked?'Supporting documents are required for approval requests.':'Supporting documents are not required.'):'Permission updated.';}

});
document.addEventListener('click',e=>{
 const pageButton=e.target.closest('[data-list-page]');if(pageButton){if(pageButton.disabled)return;const next=Number(pageButton.dataset.listPage);if(Number.isInteger(next)&&next>=1&&next<=listPageState().pages){listPage=next;refreshList(pageButton.getAttribute('aria-label'));}return;}
 const menu=e.target.closest('[data-menu-id]');if(menu){openMenu(menu);return;}
 const del=e.target.closest('[data-delete]');if(del){openDelete(del.dataset.delete);return;}
 if(e.target.closest('#cancelDelete')){dialog.close();pendingDelete=null;menuTrigger?.focus();return;}
 if(e.target.closest('#confirmDelete')){groups=groups.filter(g=>g.id!==pendingDelete);dialog.close();pendingDelete=null;render();notify('Access configuration deleted.');return;}
 if(e.target.closest('#moduleToggle')){expanded=!expanded;document.getElementById('moduleToggle').setAttribute('aria-expanded',String(expanded));document.getElementById('module-body').hidden=!expanded;document.getElementById('moduleChevron').textContent=expanded?'⌄':'›';return;}
 const groupAdd=e.target.closest('[data-criteria-add]');if(groupAdd){const group=AccessCriteria.at(draft.criteriaTree,groupAdd.dataset.criteriaAdd);const node=AccessCriteria.rule();group.children.push(node);errors={};refreshCriteria('criterion-'+AccessCriteria.flatten(draft.criteriaTree).indexOf(node)+'-attribute');return;}
 const nestedAdd=e.target.closest('[data-criteria-add-group]');if(nestedAdd){const path=nestedAdd.dataset.criteriaAddGroup;if(path.split('.').length>=AccessCriteria.MAX_DEPTH)return;const group=AccessCriteria.at(draft.criteriaTree,path);group.children.push(AccessCriteria.group([AccessCriteria.rule()]));errors={};const next=path+'.'+(group.children.length-1);refreshCriteria('criteria-group-'+next+'-all');return;}
 const match=e.target.closest('[data-criteria-match]');if(match){const path=match.dataset.criteriaGroup;AccessCriteria.at(draft.criteriaTree,path).match=match.dataset.criteriaMatch;errors={};refreshCriteria('criteria-group-'+path+'-'+match.dataset.criteriaMatch);return;}
 const removeGroup=e.target.closest('[data-criteria-remove-group]');if(removeGroup){askRemoveCriteriaGroup(removeGroup.dataset.criteriaRemoveGroup);return;}
 if(e.target.closest('[data-cancel-criteria-delete]')){criteriaDeleteDialog.close();document.getElementById('criteria-group-'+pendingCriteriaGroup+'-remove')?.focus();return;}
 if(e.target.closest('[data-confirm-criteria-delete]')){const parent=pendingCriteriaGroup.split('.').slice(0,-1).join('.');AccessCriteria.remove(draft.criteriaTree,pendingCriteriaGroup);criteriaDeleteDialog.close();errors={};refreshCriteria('criteria-group-'+parent+'-add');return;}
 const remove=e.target.closest('[data-remove]');if(remove){const path=criterionPath(draft.criteriaTree,draft.criteria[+remove.dataset.remove]);const parent=path.split('.').slice(0,-1).join('.');AccessCriteria.remove(draft.criteriaTree,path);errors={};refreshCriteria('criteria-group-'+parent+'-add');return;}
 if(e.target.closest('#retryModule')){moduleError=false;repaintGroupEditor();document.getElementById('moduleToggle').focus();return;}
 if(!rowMenu.hidden&&!rowMenu.contains(e.target))closeMenu();
});
document.addEventListener('submit',e=>{if(e.target.id!=='groupForm')return;e.preventDefault();closeValuePicker();errors=validateGroup(draft);if(Object.keys(errors).length){repaintGroupEditor();document.getElementById(Object.keys(errors)[0])?.focus();return;}if(moduleError)return;const created=!draft.id;commitDraft();location.hash='#groups';notify(created?'Access configuration created successfully.':'Access configuration updated successfully.');});
document.addEventListener('keydown',e=>{if(rowMenu.hidden)return;if(e.key==='Escape'){closeMenu(true);e.preventDefault();}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){const options=[...rowMenu.querySelectorAll('[role="menuitem"]')];let i=options.indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:options.length-1))%options.length;options[i].focus();e.preventDefault();}else if(e.key==='Tab')closeMenu();});
dialog.addEventListener('cancel',()=>{pendingDelete=null;menuTrigger?.focus()});
window.addEventListener('hashchange',render);window.addEventListener('resize',()=>closeMenu());window.addEventListener('scroll',()=>closeMenu(),{passive:true});render();

if(document.body.dataset.deletePreview)openDelete(document.body.dataset.deletePreview);
