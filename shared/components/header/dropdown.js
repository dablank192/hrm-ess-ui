(() => {
  document.querySelectorAll('[data-tickets-dropdown]').forEach(root => {
    const trigger=root.querySelector('[data-tickets-trigger]'), panel=root.querySelector('[data-tickets-panel]');
    const links=[...panel.querySelectorAll('a')];
    let timer;
    function close(focus=false){clearTimeout(timer);panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
    function open(){clearTimeout(timer);document.querySelectorAll('[data-tickets-dropdown]').forEach(other=>{if(other!==root){other.querySelector('[data-tickets-panel]').hidden=true;other.querySelector('[data-tickets-trigger]').setAttribute('aria-expanded','false');}});panel.hidden=false;trigger.setAttribute('aria-expanded','true');}
    root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')open();});
    root.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')timer=setTimeout(()=>{if(!root.contains(document.activeElement))close();},200);});
    trigger.addEventListener('click',()=>panel.hidden?open():close());
    root.addEventListener('focusout',()=>setTimeout(()=>{if(!root.contains(document.activeElement))close();},0));
    root.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();close(true);}
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();const index=links.indexOf(document.activeElement);const next=index<0?(e.key==='ArrowDown'?0:links.length-1):(index+(e.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next].focus();}
      if(e.key==='Home'&&links.includes(document.activeElement)){e.preventDefault();links[0].focus();}
      if(e.key==='End'&&links.includes(document.activeElement)){e.preventDefault();links.at(-1).focus();}
    });
    document.addEventListener('click',e=>{if(!root.contains(e.target))close();});
  });
})();
