/* Feature entry points share the original application engines and their state.
 * No page reload is introduced when navigating inside an active workspace.
 */
(function(){
  'use strict';
  var feature=document.documentElement.dataset.essFeature;
  var ticketRoot='features/tickets/';
  var workflowRoot='features/admin/ticket-management/';
  var ticketModes={'my-tickets':'mine','approvals':'approval','approval-delegation':'delegation','create-ticket':'catalog'};
  var workflowPages={'business-workflows':'thiet-ke','user-groups':'user-group','approval-matrix':'ma-tran','shared-headers':'header','api-management':'field','workflow-designer':'thiet-ke'};
  function replacePath(path,query,hash){
    if(typeof HrmEnvironment!=='undefined'&&HrmEnvironment.local&&Object.prototype.hasOwnProperty.call(ticketModes,feature)){
      hash=path.includes('/approvals/')?'#approvals':path.includes('/approval-delegation/')?'#delegation':path.includes('/create-ticket/')?'#create-ticket':'#my-tickets';
    }
    var next=path+(query===undefined?location.search:query)+(hash===undefined?location.hash:hash);
    if(next!==location.pathname+location.search+location.hash){
      if(typeof HrmEnvironment!=='undefined')HrmEnvironment.replaceState(history.state,'',next);
      else history.replaceState(history.state,'','/'+next);
    }
  }
  if(Object.prototype.hasOwnProperty.call(ticketModes,feature)&&typeof route==='function'){
    var originalRoute=route;
    route=function(mode){
      var result=originalRoute.apply(this,arguments);
      var entry=mode==='approval'?'approvals':mode==='delegation'?'approval-delegation':mode==='catalog'||mode==='form'?'create-ticket':'my-tickets';
      var bookmark=/^#(?:my-tickets|approvals|delegation|create-ticket)$/.test(location.hash)?'':location.hash;
      replacePath(ticketRoot+entry+'/index.html',undefined,bookmark);
      return result;
    };
    if(typeof window!=='undefined')window.addEventListener('message',function(event){
      if(event.source!==document.getElementById('employee').contentWindow||!event.data?.merge||event.data.type!=='route')return;
      if(event.data.data.k==='don-cua-toi'&&mode==='mine')replacePath(ticketRoot+'my-tickets/index.html');
      if(event.data.data.k==='form')replacePath(ticketRoot+'create-ticket/index.html');
    });
    // Existing bookmark hashes and dashboard query links take precedence.
    if(!location.hash)route(ticketModes[feature]);
    // The embedded employee app announces its initial list before ready. Reapply
    // the create entry after that handshake, while preserving dashboard form links.
    if(feature==='create-ticket'&&!new URLSearchParams(location.search).get('ticketType')&&typeof ready!=='undefined'&&!ready.employee){
      var entryReady=function(event){
        if(event.source!==document.getElementById('employee').contentWindow||!event.data?.merge||event.data.type!=='ready')return;
        window.removeEventListener('message',entryReady);
        route('catalog');
      };
      window.addEventListener('message',entryReady);
    }
    return;
  }
  if(!Object.prototype.hasOwnProperty.call(workflowPages,feature)||typeof go!=='function')return;
  var names={'thiet-ke':'business-workflows','user-group':'user-groups','ma-tran':'approval-matrix','header':'shared-headers','field':'api-management'};
  var originalGo=go;
  go=function(key){
    var result=originalGo.apply(this,arguments);
    var entry=names[key];
    if(entry){
      var params=new URLSearchParams(location.search);
      params.delete('view');params.delete('workflow');
      if(key==='thiet-ke'&&DSN.view!=='lib'){
        entry='workflow-designer';params.set('workflow',DSN.id);
      }else if(typeof HrmEnvironment!=='undefined'&&HrmEnvironment.local){
        params.set('view',key);
      }
      replacePath(workflowRoot+entry+'/index.html',params.toString()?'?'+params.toString():'');
    }
    return result;
  };
  var query=new URLSearchParams(location.search),requested=query.get('view');
  var target=requested&&PAGES[requested]?requested:workflowPages[feature];
  if((feature==='workflow-designer'||(typeof HrmEnvironment!=='undefined'&&HrmEnvironment.local&&query.has('workflow')))&&!requested){
    var id=query.get('workflow');
    if(id&&typeof DEFS!=='undefined'&&DEFS[id]){
      var wf=typeof wfById==='function'?wfById(id):null;
      if(wf&&wf.donvi!==CUR_UNIT)setUnit(wf.donvi);
      openWf(id);
    }else{
      // A direct designer URL needs a workflow; keep the library as the selection screen.
      openLib();
    }
  }else workflowNavigate(target);
})();
