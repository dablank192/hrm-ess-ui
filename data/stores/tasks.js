/* Device-local prototype task records shared by Dashboard and My Tasks. No external integration. */
(() => {
const today=new Date();today.setHours(0,0,0,0);function relative(n){const d=new Date(today);d.setDate(d.getDate()+n);return d}
const seeds=[
{id:'TSK-0001',type:'manual',title:'Review employee contact information',desc:'Review the contact information for the October onboarding group.\n\nCheck company email, personal phone number, and emergency contact details. Record missing information in the review notes and share the findings with the HR team.',due:relative(-2),creator:'Trần Minh Anh',created:'02 Oct 2026, 09:15',status:'In Progress',file:{name:'Contact-review-instructions.txt',text:'Demo attachment — Contact information review\nCheck email, phone number and emergency contact details.\nThese are sample instructions, not employee data.'}},
{id:'TSK-0003',type:'approval',title:'Review Nguyễn Hải An’s leave request',desc:'Nguyễn Hải An has requested one day of annual leave on 08 October 2026.\n\nOpen the request to review its details and make an approval decision.',due:relative(0),creator:'System · Approval',created:'03 Oct 2026, 10:20',status:'To Do',ticket:'USV-2026-001248'},
{id:'TSK-0004',type:'manual',title:'Prepare notes for the weekly team meeting',desc:'Summarize completed work, outstanding issues, and questions for the weekly meeting.',due:relative(5),creator:'Nguyễn Quang',created:'03 Oct 2026, 14:30',status:'To Do'},
{id:'TSK-0006',type:'manual',title:'Read the updated employee handbook',desc:'Read the employee handbook and note any questions for HR.',due:null,creator:'Lê Thu Hà',created:'01 Oct 2026, 16:00',status:'To Do'}];

const dashboardSeeds=[
{id:'TSK-0102',type:'manual',creator:'Nguyễn Minh Châu',title:'Confirm September 2026 Timesheet',desc:'Review and confirm your September timesheet before the timesheet lock date.',due:new Date(2026,8,18)},
{id:'TSK-0103',type:'manual',creator:'Phạm Thanh Hương',title:'Complete Security Awareness Assessment',desc:'Complete the mandatory information security assessment.',due:new Date(2026,8,12)},
{id:'TSK-0104',type:'manual',creator:'Đỗ Tuấn Anh',title:'Confirm Next Week Work Schedule',desc:'Review and confirm your upcoming work schedule before it is finalized.',due:relative(3)},
{id:'TSK-0105',type:'manual',creator:'Lê Ngọc Mai',title:'Review Emergency Contact Details',desc:'Check that your emergency contact information is still up to date.',due:relative(8)}
].map(t=>({...t,created:'01 Oct 2026, 08:00',status:'To Do'}));
// Additional System/HR approval tasks. Stable seed keys make the rollout additive.
const approvalSeeds=[
{id:'TSK-0201',seedKey:'approval-demo-20261009-leave',type:'approval',title:'Approve Nguyễn Văn An’s annual leave ticket',desc:'System has assigned you the approval step for ticket TK-2026-013.\n\nReview Nguyễn Văn An’s request for 3 days of annual leave (14–16 September), the handover details and any workflow warnings, then make an approval decision.',ticket:'TK-2026-013',due:relative(-1),creator:'System · Approval'},
{id:'TSK-0202',seedKey:'approval-demo-20261009-overtime',type:'approval',title:'Approve Hoàng Minh Tuấn’s overtime ticket',desc:'HR has assigned you the approval step for ticket TK-2026-015.\n\nReview Hoàng Minh Tuấn’s request for 4 hours of overtime on 12 September, including the reason and expected work, then make an approval decision.',ticket:'TK-2026-015',due:relative(2),creator:'System · HR'},
{id:'TSK-0203',seedKey:'approval-demo-20261009-advance',type:'approval',title:'Approve Lê Thị Mai’s business trip advance ticket',desc:'HR has assigned you the approval step for ticket TK-2026-014.\n\nReview Lê Thị Mai’s business trip advance for Cần Thơ (6,500,000 VND), including the supporting information, then make an approval decision.',ticket:'TK-2026-014',due:relative(9),creator:'System · HR'}
].map(t=>({...t,assignee:'quang',created:'09 Oct 2026, 16:47',createdAt:'2026-10-09T09:47:00.000Z',status:'To Do'}));
const key='hrm-ess:tasks:v1:01138569';

function validDate(value){if(!value)return null;const d=value instanceof Date?new Date(value):new Date(/^\d{4}-\d{2}-\d{2}$/.test(value)?value+'T00:00:00':value);return Number.isFinite(d.getTime())?d:null}
function legacyStart(t){
let d=validDate(t.createdAt);if(!d){const m=String(t.created||'').match(/^(\d{2}) ([A-Za-z]{3}) (\d{4})(?:,|$)/),months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];if(m&&months.includes(m[2])){const candidate=new Date(Number(m[3]),months.indexOf(m[2]),Number(m[1]));if(candidate.getDate()===Number(m[1])&&candidate.getMonth()===months.indexOf(m[2]))d=candidate}}
if(d)d.setHours(0,0,0,0);return d;
}
function revive(rows){return rows.map(t=>({...t,creator:t.type==='manual'&&/^System\s*(?:[·-]\s*)?HR$/i.test(String(t.creator))?(dashboardSeeds.find(seed=>seed.id===t.id)?.creator||'Trần Minh Anh'):t.creator,due:validDate(t.due),...(t.type==='manual'?{start:validDate(t.start)||legacyStart(t)}:{})}))}
function startKey(d){return d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:null}

let records=revive([...dashboardSeeds,...seeds]);
try{const raw=JSON.parse(localStorage.getItem(key));if(Array.isArray(raw)&&raw.every(t=>typeof t.id==='string'&&typeof t.title==='string'&&['To Do','In Progress','Complete','Cancel'].includes(t.status)))records=revive(raw)}catch{}
let addedApprovals=false;
for(const seed of approvalSeeds){
 if(records.some(t=>t.seedKey===seed.seedKey))continue;
 let id=seed.id;
 if(records.some(t=>t.id===id)){const max=Math.max(0,...records.map(t=>Number(t.id.replace(/^TSK-/,''))).filter(Number.isFinite));id='TSK-'+String(max+1).padStart(4,'0')}
 records.push(...revive([{...seed,id}]));addedApprovals=true;
}
const dbPromise=new Promise(resolve=>{if(!window.indexedDB){resolve(null);return}const req=indexedDB.open('hrm-ess-task-attachments',1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null)});
async function readFile(id){const db=await dbPromise;if(!db)return null;return new Promise(resolve=>{const req=db.transaction('files').objectStore('files').get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)})}
async function writeFile(id,blob){const db=await dbPromise;if(!db)throw Error('Attachment storage is unavailable.');return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(blob,id);tx.oncomplete=resolve;tx.onerror=()=>reject(Error('Could not save attachments.'))})}
const ready=Promise.all(records.flatMap(t=>(t.attachments||[]).map(async f=>{if(f.key)f.blob=await readFile(f.key)}))).then(async()=>{if(addedApprovals){try{await save()}catch{console.warn('Approval sample tasks could not be persisted; existing task data was retained.')}}});
async function save(){for(const t of records)for(const [i,f]of(t.attachments||[]).entries())if(f.blob&&!f.key){f.key=t.id+':'+i;await writeFile(f.key,f.blob)}
const serialized=records.map(t=>({...t,...(t.type==='manual'?{start:startKey(t.start)}:{}),attachments:(t.attachments||[]).map(({blob,...f})=>f)}));
localStorage.setItem(key,JSON.stringify(serialized));window.dispatchEvent(new Event('hrm-tasks-changed'));
}
// Ticket-submission tasks are outside the current My Tasks scope.
// Retain legacy stored records, but never expose them as actionable tasks.
function inScope(t){return ['manual','approval'].includes(t.type)}
function actionable(t){const day=new Date();day.setHours(0,0,0,0);return inScope(t)&&(!t.assignee||t.assignee==='quang')&&!['Complete','Cancel'].includes(t.status)&&(t.type!=='manual'||t.status==='In Progress'||!t.start||t.start<=day)}
window.HrmTaskStore={inScope,actionable,get records(){return records},ready,save,mine:t=>t.type==='manual'&&(!t.assignee||t.assignee==='quang')};
})();
