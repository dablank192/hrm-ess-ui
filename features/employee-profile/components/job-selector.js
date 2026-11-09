// Profile-only demo context. Job Data is the explicitly mapped job-scoped block.
(() => {
 const base=window.profileMockFixtures['thong-tin-cong-viec'];
 const alternate=(values)=>Object.assign(Object.fromEntries(Object.keys(base).map(key=>[key,null])),values);
 const jobs=[
  {id:'job-fsoft-ai',primary:true,legal:'FPT Software JSC',values:{...base}},
  {id:'job-fis-consulting',legal:'FPT Information System Corporation',values:alternate({Job:'Associate Director — Consulting',Company:'FPT Information System Corporation',Department:'Consulting','Business Unit':'Digital Transformation',Location:'Hà Nội','Emp Level':'Level 5','Effective Date':'01/06/2026','Contract Type':'Hợp đồng không xác định thời hạn','Full/Part':'Toàn thời gian'})},
  {id:'job-fsoft-science',legal:'FPT Software JSC',values:alternate({Job:'AI Scientist 2',Company:'FPT Software JSC',Department:'AI Research','Business Unit':'AI Center',Location:'Hà Nội','Emp Level':'Level 4','Effective Date':'01/09/2026','Full/Part':'Bán thời gian'})},
  {id:'job-retail',legal:'FPT Digital Retail JSC',values:alternate({Job:'Bác sỹ',Company:'FPT Retail',Department:'Bảo Hồng',Location:'Hà Nội','Effective Date':'01/10/2026','Full/Part':'Bán thời gian'})}
 ];
 const trigger=document.getElementById('profileJobTrigger');
 if(!trigger)return;
 const panel=document.createElement('div');panel.id='profileJobList';panel.className='profile-job-list';panel.role='listbox';panel.setAttribute('aria-label','Select job');panel.hidden=true;document.body.append(panel);
 const live=document.createElement('p');live.className='profile-job-live';live.setAttribute('role','status');document.body.append(live);
 let selected=jobs[0];try{selected=jobs.find(job=>job.id===sessionStorage.getItem('ess-profile-job'))||selected}catch{}
 const options=()=>Array.from(panel.querySelectorAll('[role=option]'));
 function renderOptions(){panel.innerHTML=jobs.map(job=>`<button type="button" role="option" tabindex="-1" aria-selected="${job.id===selected.id}" data-job="${safe(job.id)}"><span><strong>${safe(job.values.Job)}</strong><small>${safe(job.values.Department||'—')} — ${safe(job.values.Company)}</small><small>Legal: ${safe(job.legal)}</small></span><span class="profile-job-check" aria-hidden="true">${job.id===selected.id?'✓':''}</span></button>`).join('')}
 function position(){const r=trigger.getBoundingClientRect(),width=Math.min(380,innerWidth-24);panel.style.width=width+'px';panel.style.left=Math.max(12,Math.min(r.left,innerWidth-width-12))+'px';const below=innerHeight-r.bottom-12,above=r.top-12;const up=below<160&&above>below;panel.style.maxHeight=Math.max(80,Math.min(320,up?above:below))+'px';panel.style.top=(up?Math.max(12,r.top-panel.offsetHeight-4):r.bottom+4)+'px'}
 function close(restore=false){panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(restore)trigger.focus({preventScroll:true})}
 function open(last=false){renderOptions();panel.hidden=false;trigger.setAttribute('aria-expanded','true');position();const list=options();(last?list.at(-1):list.find(item=>item.getAttribute('aria-selected')==='true')||list[0])?.focus({preventScroll:true})}
 function apply(job,announce=false){selected=job;const v=job.values;document.querySelector('[data-summary=job]').textContent=v.Job;document.querySelector('[data-summary=company]').textContent=v.Company;document.querySelector('[data-summary=department]').textContent=v.Department||'—';trigger.setAttribute('aria-label',`Select job: ${v.Job} — ${v.Department||'—'} — ${v.Company}`);const pane=document.querySelector('#workView .profile-scroll'),scroll=pane.scrollTop;const currentBlock=document.getElementById(workSection.id);if(currentBlock){if(currentBlock.classList.contains('open'))overviewExpanded.add(workSection.id);else overviewExpanded.delete(workSection.id)}const animation=overviewAnimations.get(workSection.id);if(animation){animation.cancel();overviewAnimations.delete(workSection.id)}if(currentBlock)currentBlock.outerHTML=renderCard(buildSection(workSection.id,workSection.title,workSection.actions,v));pane.scrollTop=scroll;scheduleOverviewScroll();try{sessionStorage.setItem('ess-profile-job',job.id)}catch{}if(announce)live.textContent=`Job selected: ${v.Job} — ${v.Department||'—'} — ${v.Company}. Job Data Information updated.`}
 trigger.addEventListener('click',()=>panel.hidden?open():close());
 trigger.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();open(event.key==='ArrowUp')}});
 panel.addEventListener('click',event=>{const option=event.target.closest('[data-job]');if(!option)return;const job=jobs.find(item=>item.id===option.dataset.job);if(job){apply(job,true);close(true)}});
 panel.addEventListener('keydown',event=>{const list=options(),index=list.indexOf(document.activeElement);let next;if(event.key==='ArrowDown')next=(index+1)%list.length;else if(event.key==='ArrowUp')next=(index-1+list.length)%list.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=list.length-1;else if(event.key==='Escape'){event.preventDefault();close(true)}else if(event.key==='Tab'){close();trigger.focus({preventScroll:true})}if(next!==undefined){event.preventDefault();list[next].focus()}});
 document.addEventListener('click',event=>{if(!trigger.contains(event.target)&&!panel.contains(event.target))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)close(true)});
 window.addEventListener('resize',()=>{if(!panel.hidden)position()});
 window.addEventListener('scroll',event=>{if(!panel.hidden&&!panel.contains(event.target))close()},true);
 apply(selected);
})();
