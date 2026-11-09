/* Permission dependencies and bulk state, independent of the form renderer. */
(function(root){
 const columns=[{key:'view',label:'View'},{key:'edit',label:'Edit'},{key:'editViaApproval',label:'Edit via Approval'},{key:'requireAttachments',label:'Require Attachments'},{key:'add',label:'Add New'}];
 const viewOnly=new Set(['EP.BLOCK.03','EP.BLOCK.10']);
 const supported=(code,action)=>columns.some(c=>c.key===action)&&(!viewOnly.has(code)||action==='view');
 const eligible=flags=>!!(flags.edit||flags.add);
 function normalize(input={},code){const flags={...input,view:!!input.view,edit:!!input.edit,add:!!input.add};if(viewOnly.has(code)){flags.edit=false;flags.add=false}flags.view=flags.view||flags.edit||flags.add;flags.editViaApproval=eligible(flags)?(input.editViaApproval==null?true:!!input.editViaApproval):false;flags.requireAttachments=flags.editViaApproval&&!!input.requireAttachments;return flags}
 function apply(settings,code,action,checked){
  const flags=normalize(settings[code],code);
  if(!supported(code,action)){if(viewOnly.has(code))settings[code]=flags;return flags;}
  if(action==='editViaApproval'&&!eligible(flags)||action==='requireAttachments'&&!flags.editViaApproval)return flags;
  if((action==='edit'||action==='add')&&checked&&!eligible(flags))flags.editViaApproval=true;
  flags[action]=!!checked;
  if(checked&&(action==='edit'||action==='add'))flags.view=true;
  if(action==='view'&&!checked){flags.edit=false;flags.add=false;flags.editViaApproval=false}
  if(!eligible(flags))flags.editViaApproval=false;
  if(!flags.editViaApproval)flags.requireAttachments=false;
  settings[code]=flags;return flags;
 }
 function available(settings,code,action){return supported(code,action)&&(action!=='editViaApproval'||eligible(normalize(settings[code],code)))&&(action!=='requireAttachments'||normalize(settings[code],code).editViaApproval)}
 function bulkState(settings,codes,action){const targets=codes.filter(code=>available(settings,code,action));const count=targets.filter(code=>normalize(settings[code],code)[action]).length;return {checked:targets.length>0&&count===targets.length,indeterminate:count>0&&count<targets.length,disabled:targets.length===0,total:targets.length,count}}
 function bulkApply(settings,codes,action,checked){for(const code of codes)if(available(settings,code,action))apply(settings,code,action,checked);return bulkState(settings,codes,action)}
 root.AccessPermissions={columns,supported,available,eligible,normalize,apply,bulkState,bulkApply};
})(typeof window!=='undefined'?window:globalThis);
