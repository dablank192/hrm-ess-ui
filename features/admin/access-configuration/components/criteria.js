/* Grouped membership expressions. Independent of module permission resolution. */
(function(root){
 const MAX_DEPTH=3;
 const values=rule=>[...new Set(Array.isArray(rule.values)?rule.values:rule.value?[rule.value]:[])];
 const rule=(input={})=>({type:'criterion',attribute:input.attribute||'',operator:input.operator==='Equals'?'In':input.operator||'In',values:values(input)});
 const group=(children=[],match='all')=>({type:'group',match,children});
 function normalize(node){return node?.type==='group'?group((node.children||[]).map(normalize),node.match||'all'):rule(node)}
 function fromRecord(record){return record.criteriaTree?normalize(record.criteriaTree):group((record.criteria||[]).map(rule))}
 function flatten(node){return node.type==='group'?node.children.flatMap(flatten):[node]}
 function at(tree,path='root'){return path.split('.').slice(1).reduce((node,index)=>node?.children?.[Number(index)],tree)}
 function remove(tree,path){const parts=path.split('.');if(parts.length<2)return false;const index=Number(parts.pop()),parent=at(tree,parts.join('.'));if(!parent||index<0||index>=parent.children.length)return false;parent.children.splice(index,1);return true}
 function key(node){return node.type==='group'?JSON.stringify([node.match,node.children.map(key)]):JSON.stringify([node.attribute,node.operator,[...values(node)].sort()])}
 function validate(tree,catalog){
  const errors={},leaves=flatten(tree);let index=0;
  function visit(node,path,depth){
   if(node.type!=='group')return;
   if(!['all','any'].includes(node.match))errors['criteria-group-'+path]='Choose AND or OR for this group.';
   if(!node.children.length)errors['criteria-group-'+path]='Add at least one condition to this group, or remove the group.';
   if(depth>MAX_DEPTH)errors['criteria-group-'+path]='Use no more than three group levels.';
   const seen=new Set();
   node.children.forEach((child,i)=>{
    if(child.type==='group'){visit(child,path+'.'+i,depth+1);return}
    const n=index++,v=values(child),prefix='criterion-'+n;
    if(!child.attribute||!catalog[child.attribute])errors[prefix+'-attribute']='Choose an attribute.';
    if(child.operator!=='In')errors[prefix+'-operator']='Choose a supported operator.';
    if(!v.length)errors[prefix+'-value']='Choose at least one value.';
    else if(v.some(x=>!(catalog[child.attribute]||[]).includes(x)))errors[prefix+'-value']='Choose valid values for this attribute.';
    const signature=key(child);if(seen.has(signature))errors[prefix+'-value']='This condition is already included in this group.';seen.add(signature);
   });
  }
  visit(tree,'root',1);if(!leaves.length)errors.criteriaErrors='Add at least one condition.';return errors;
 }
 function matches(tree,person,catalog){
  if(Object.keys(validate(tree,catalog)).length)return false;
  function test(node){if(node.type==='group')return node.match==='all'?node.children.every(test):node.children.some(test);const current=Array.isArray(person[node.attribute])?person[node.attribute]:[person[node.attribute]];return values(node).some(value=>current.includes(value))}
  return test(tree);
 }
 root.AccessCriteria={MAX_DEPTH,values,rule,group,fromRecord,normalize,flatten,at,remove,key,validate,matches};
})(typeof window!=='undefined'?window:globalThis);
