(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  var nav=document.getElementById('nav');
  if(nav)addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});

  /* switchback trail (home: Off the CV) */
  var trail=document.getElementById('trail'),notes=[],swB,swI,swLen=0;
  if(trail){
    swB=document.getElementById('swBase');swI=document.getElementById('swInk');
    notes=[].slice.call(trail.querySelectorAll('.note'));
  }
  function pt(n){var d=n.querySelector('.dot');return [n.offsetLeft+d.offsetLeft+d.offsetWidth/2,n.offsetTop+d.offsetTop+d.offsetHeight/2]}
  function buildTrail(){
    if(!trail)return;
    var t=trail.getBoundingClientRect(),d='';
    notes.forEach(function(n,i){
      var p=pt(n,t);
      if(i===0)d='M'+p[0]+' '+p[1];
      else{var q=pt(notes[i-1],t),my=(q[1]+p[1])/2;d+=' C'+q[0]+' '+my+' '+p[0]+' '+my+' '+p[0]+' '+p[1]}
    });
    swB.setAttribute('d',d);swI.setAttribute('d',d);
    try{swLen=swI.getTotalLength()}catch(e){swLen=0}
    swI.style.strokeDasharray=swLen;
  }
  function drawTrail(){
    if(!trail)return;
    var t=trail.getBoundingClientRect(),mark=innerHeight*.65;
    var p=reduce?1:Math.max(0,Math.min(1,(mark-t.top)/t.height));
    swI.style.strokeDashoffset=swLen*(1-p);
  }

  /* scroll-drawn rails with camps (home logbook, experience roles) */
  var rails=[].slice.call(document.querySelectorAll('.route-wrap')).map(function(w){
    return {w:w,ink:w.querySelector('.rail-ink'),camps:[].slice.call(w.querySelectorAll('.camp'))};
  });
  var reveals=[].slice.call(document.querySelectorAll('.reveal'));
  function tick(){
    var mark=innerHeight*.6;
    rails.forEach(function(r){
      var b=r.w.getBoundingClientRect();
      if(r.ink)r.ink.setAttribute('y2',Math.max(0,Math.min(b.height,mark-b.top)));
      r.camps.forEach(function(c,i){
        var hit=c.querySelector('.pin').getBoundingClientRect().top<mark;
        var last=i===r.camps.length-1&&r.w.hasAttribute('data-now');
        c.classList.toggle('reached',hit&&!last);
        c.classList.toggle('now',hit&&last);
        if(hit)c.classList.add('seen');
      });
    });
    notes.forEach(function(n){if(n.getBoundingClientRect().top<innerHeight*.85)n.classList.add('seen')});
    reveals.forEach(function(n){if(n.getBoundingClientRect().top<innerHeight*.85)n.classList.add('seen')});
    drawTrail();
  }
  buildTrail();
  addEventListener('resize',function(){buildTrail();tick()});
  if(reduce){
    rails.forEach(function(r){if(r.ink)r.ink.setAttribute('y2','100%');r.camps.forEach(function(c,i){c.classList.add('seen',i===r.camps.length-1&&r.w.hasAttribute('data-now')?'now':'reached')})});
    notes.concat(reveals).forEach(function(n){n.classList.add('seen')});drawTrail();
  }else{addEventListener('scroll',tick,{passive:true});tick()}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){buildTrail();tick()});

  /* count-up figures; .watch elements get .seen once in view */
  function fmt(n){return n.toLocaleString('en-US')}
  var watch=[].slice.call(document.querySelectorAll('.watch'));
  var io=('IntersectionObserver' in window)&&!reduce?new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      if(e.target.classList.contains('watch')){e.target.classList.add('seen');return}
      var el=e.target,n=+el.dataset.n,pre=el.dataset.pre||'',suf=el.dataset.suf||'',t0=null;
      function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1200),v=Math.round(n*(1-Math.pow(1-p,3)));el.textContent=pre+fmt(v)+suf;if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    })
  },{threshold:.35}):null;
  if(io){document.querySelectorAll('[data-n]').forEach(function(el){io.observe(el)});watch.forEach(function(el){io.observe(el)})}
  else watch.forEach(function(el){el.classList.add('seen')});

  /* copy email */
  var copy=document.getElementById('copy');
  if(copy)copy.addEventListener('click',function(){
    var b=this,el=document.getElementById('mail');
    function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
    function sel(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
    try{navigator.clipboard.writeText(el.textContent).then(ok,sel)}catch(e){sel()}
  });
})();
