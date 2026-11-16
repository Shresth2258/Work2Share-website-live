/* Work2Share fx.js – card spotlight, parallax, tilt, magnetic buttons, drawers, video, showcase */
(function(){
const R=document.documentElement;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const fullMotion=fine&&matchMedia('(min-width:861px)').matches&&!rm;

/* ---- card spotlight ---- */
document.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('.at,.cc,.cform');
  if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}
},{passive:true});

/* ---- parallax for photos while scrolling ---- */
const imgs=[...document.querySelectorAll('.pimg img')];
const vis=new Set();
let ticking=false;
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{const im=e.target.querySelector('img');if(!im)return;e.isIntersecting?vis.add(im):vis.delete(im)});if(!ticking){ticking=true;requestAnimationFrame(par)}},{rootMargin:'100px'});
  document.querySelectorAll('.pimg').forEach(x=>io.observe(x))}
function par(){
  ticking=false;
  for(const im of ('IntersectionObserver' in window?vis:imgs)){
    const r=im.parentElement.getBoundingClientRect();
    if(r.bottom<-100||r.top>innerHeight+100)continue;
    const k=(r.top+r.height/2-innerHeight/2)/innerHeight;
    im.style.translate='0 '+(-k*34).toFixed(1)+'px';
  }
}
if(fullMotion){addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(par)}},{passive:true});par()}

/* ---- tilt hero photo + float the green-section photos with the mouse ---- */
if(fine&&!rm){
  const hv=document.querySelector('.phv');
  if(hv){
    hv.addEventListener('pointermove',e=>{const r=hv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      hv.style.transform='perspective(900px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg)'});
    hv.addEventListener('pointerleave',()=>{hv.style.transform=''});
  }
  const gp=document.querySelector('.gd-p');
  if(gp){
    gp.addEventListener('pointermove',e=>{const r=gp.getBoundingClientRect();
      gp.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));gp.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))});
    gp.addEventListener('pointerleave',()=>{gp.style.setProperty('--px',0);gp.style.setProperty('--py',0)});
  }
  /* magnetic buttons */
  document.querySelectorAll('.btn:not(.burger)').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();
      b.style.translate=((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px'});
    b.addEventListener('pointerleave',()=>{b.style.translate=''});
  });
}
})();
/* open the matching filter on the gallery page (gallery.html#meet etc.) */
(function(){
  const h=(location.hash||'').slice(1);if(!h)return;
  const b=document.querySelector('#fl button[data-f="'+h+'"]');
  if(b){b.click();const m=document.getElementById('ms');m&&setTimeout(()=>m.scrollIntoView({behavior:'smooth',block:'start'}),300)}
})();

/* ---------- amenity side panel ---------- */
(function(){
  const IC={
   'Fast Wi-Fi':'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
   '24/7 access':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
   'Pantry & coffee':'<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3"/>',
   'Meeting & conference rooms':'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
   'Mail handling':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
   'Power backup':'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
   'Security & housekeeping':'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
   'Community':'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>'};
  const D={
   'Fast Wi-Fi':{img:35,lead:'Reliable internet that keeps up with video calls, cloud tools and big uploads, so a slow connection never decides how your day goes.',pts:['Stable enough for client calls and online meetings','Made for long work days, not just quick check-ins','Have specific needs? Ask the team before you visit']},
   '24/7 access':{img:50,lead:'Members can come in on their own schedule. Start early, stay late or catch up on a weekend, the space works around you.',pts:['Round-the-clock access for members','Controlled entry at the gate','Reception and visitor timings can differ, so check with the team']},
   'Pantry & coffee':{img:43,lead:'A friendly corner to reset between meetings. Grab a coffee, sit down away from your desk and take a proper break.',pts:['A relaxed place to recharge during the day','Easy, casual conversations with other members','Great for a quick informal catch-up']},
   'Meeting & conference rooms':{img:42,lead:'A meeting room for client calls and small teams, and a conference room for presentations and workshops. Book either by the hour and pay only for the time you use.',pts:['A meeting room and a conference room to choose from','Book by the hour, no long commitments','Suits client meetings, interviews and presentations']},
   'Mail handling':{img:40,lead:'Your business mail is received and looked after at the front desk, so your company always has a proper place to receive post.',pts:['Mail received and looked after for you','Works together with a virtual office plan','A professional address for your business']},
   'Power backup':{img:41,lead:'Stay online even when the grid is not. Backup power means fewer dropped calls and fewer missed deadlines.',pts:['Keeps work running through power cuts','Fewer interrupted meetings and calls','Ask the team what is covered for your desk']},
   'Security & housekeeping':{img:33,lead:'A safe, clean space handled for you, so you can focus on your work instead of the building.',pts:['Controlled entry and a staffed front desk','Housekeeping looked after for you','Plants and common areas kept fresh every day']},
   'Community':{img:39,lead:'Meet founders, freelancers and teams under one roof. Some of the best ideas and clients start with a conversation in the lounge.',pts:['Lounge areas made for talking and collaborating','Meet people from many industries','Find collaborators, clients and friends nearby']}};
  const cards=[...document.querySelectorAll('.at')].filter(c=>{const h=c.querySelector('h3');return h&&D[h.textContent.trim()]});
  if(!cards.length)return;
  const keys=[...new Set(cards.map(c=>c.querySelector('h3').textContent.trim()))];
  const ov=document.createElement('div');ov.className='dr-ov';
  const dr=document.createElement('aside');dr.className='drawer';dr.setAttribute('role','dialog');dr.setAttribute('aria-modal','true');dr.setAttribute('aria-labelledby','dr-t');
  dr.innerHTML='<button class="dr-x" aria-label="Close">✕</button><div class="dr-hero"><img alt=""><span class="dr-ic"><svg viewBox="0 0 24 24"></svg></span></div><div class="dr-body"><span class="dr-tag"></span><h3 id="dr-t"></h3><p class="dr-lead"></p><ul class="dr-pts"></ul><div class="dr-act"></div><div class="dr-nav"><button type="button" data-d="-1">← Previous</button><span></span><button type="button" data-d="1">Next →</button></div></div>';
  document.body.append(ov,dr);
  const q=s=>dr.querySelector(s);let cur=0,opener=null;
  const arrow='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 8h13M9 3l5 5-5 5"/></svg>';
  cards.forEach(c=>{
    const k=c.querySelector('h3').textContent.trim();c.dataset.am=k;c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label',k+' – learn more');
    c.insertAdjacentHTML('beforeend','<span class="at-more">Learn more '+arrow+'</span>');
    c.addEventListener('click',()=>open(k,c));
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(k,c)}});
  });
  function fill(i){
    cur=(i+keys.length)%keys.length;const k=keys[cur],d=D[k];
    q('.dr-hero img').src='assets/gallery/'+d.img+'.jpg';q('.dr-ic svg').innerHTML=IC[k];
    q('.dr-tag').textContent='AMENITY '+String(cur+1).padStart(2,'0')+' / '+String(keys.length).padStart(2,'0');
    q('h3').textContent=k;q('.dr-lead').textContent=d.lead;
    q('.dr-pts').innerHTML=d.pts.map(p=>'<li>'+p+'</li>').join('');
    const msg=encodeURIComponent('Hi Work2Share, I would like to know more about: '+k);
    q('.dr-act').innerHTML='<a class="btn wa-b" href="https://wa.me/918383963820?text='+msg+'" target="_blank" rel="noopener"><span>Ask on WhatsApp</span></a><a class="btn ghost2" href="contact.html"><span>Book a tour</span></a>';
    q('.dr-nav span').textContent=keys[(cur+1)%keys.length];
    [...q('.dr-body').children].forEach((el,n)=>el.style.setProperty('--i',n));
  }
  function open(k,c){
    opener=c||opener;fill(keys.indexOf(k));
    dr.scrollTop=0;ov.classList.add('open');dr.classList.add('open');document.body.style.overflow='hidden';q('.dr-x').focus({preventScroll:true});
  }
  function close(){ov.classList.remove('open');dr.classList.remove('open');document.body.style.overflow='';opener&&opener.focus({preventScroll:true})}
  function go(n){ // switch amenity with a quick re-animation
    dr.classList.remove('open');void dr.offsetWidth;fill(cur+n);dr.scrollTop=0;requestAnimationFrame(()=>dr.classList.add('open'))}
  q('.dr-x').onclick=close;ov.onclick=close;
  dr.querySelectorAll('.dr-nav button').forEach(b=>b.onclick=()=>go(+b.dataset.d));
  addEventListener('keydown',e=>{if(!dr.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
})();

/* ---------- who it's for: accordion ---------- */
(function(){
  const cs=[...document.querySelectorAll('.ac')];if(!cs.length)return;
  const set=c=>cs.forEach(x=>x.classList.toggle('on',x===c));
  const fine=matchMedia('(hover:hover)').matches;
  cs.forEach(c=>{
    if(fine)c.addEventListener('pointerenter',()=>set(c));
    c.addEventListener('click',e=>{if(!e.target.closest('a'))set(c)});
    c.addEventListener('focusin',()=>set(c));
  });

/* ---- home video: starts by itself with sound as soon as the section is reached ----
   Browsers allow sound only after the visitor has clicked / tapped / pressed a key once on the page.
   Until that first interaction the video plays muted, and the very first interaction switches the sound on. */
(function(){
  const v=document.getElementById('vtVideo');if(!v)return;
  v.controls=false;v.loop=true;v.playsInline=true;v.addEventListener('contextmenu',e=>e.preventDefault());
  let visible=false;
  const mutedPlay=()=>{v.muted=true;const p=v.play();if(p)p.catch(()=>{})};
  const soundPlay=()=>{
    v.muted=false;v.volume=1;
    const p=v.play();
    if(p&&p.catch)p.catch(mutedPlay);
    /* some browsers pause the video instead of rejecting when sound is blocked */
    setTimeout(()=>{if(visible&&v.paused)mutedPlay()},250);
  };
  const gest=()=>{if(visible&&v.muted)soundPlay()};
  ['pointerdown','mousedown','touchend','keydown','click'].forEach(t=>addEventListener(t,gest,{passive:true,capture:true}));
  new IntersectionObserver(en=>{
    visible=en[0].isIntersecting;
    if(visible)soundPlay();else v.pause();
  },{threshold:.3}).observe(v);
})();

/* ---- find your fit: auto-rotating showcase ---- */
(function(){
  const root=document.querySelector('.px');if(!root)return;
  const its=[...root.querySelectorAll('.px-it')],sl=[...root.querySelectorAll('.px-s')],frame=root.querySelector('.px-frame');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const autoPlay=matchMedia('(pointer:fine)').matches&&matchMedia('(min-width:861px)').matches&&!reduce;
  let cur=0;
  const go=i=>{
    cur=(i+its.length)%its.length;
    its.forEach((x,n)=>x.classList.toggle('on',n===cur));
    sl.forEach((x,n)=>x.classList.toggle('on',n===cur));
    const nn=root.querySelector('#pxN');if(nn)nn.textContent=String(cur+1).padStart(2,'0');
    root.querySelectorAll('.px-dots i').forEach((x,n)=>x.classList.toggle('on',n===cur));
    /* restart the progress bar */
    root.classList.remove('run');
    if(autoPlay){void root.offsetWidth;root.classList.add('run')}
  };
  its.forEach((x,n)=>{
    x.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches&&n!==cur)go(n)});
    x.addEventListener('click',e=>{if(!e.target.closest('a')&&n!==cur)go(n)});
    x.addEventListener('focusin',()=>{if(n!==cur)go(n)});
  });
  root.addEventListener('animationend',e=>{if(e.target.closest('.px-bar'))go(cur+1)});
  /* pause while the pointer is on the picture, or when off screen */
  const stage=root.querySelector('.px-stage');
  stage.addEventListener('mouseenter',()=>root.classList.add('hold'));
  stage.addEventListener('mouseleave',()=>root.classList.remove('hold'));
  new IntersectionObserver(en=>{
    if(en[0].isIntersecting){root.classList.remove('hold');if(autoPlay)root.classList.add('run')}
    else{root.classList.add('hold')}
  },{threshold:.3}).observe(root);
  /* soft 3D tilt */
  if(!reduce&&matchMedia('(hover:hover)').matches){
    stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;frame.style.transform='rotateY('+(x*10).toFixed(2)+'deg) rotateX('+(-y*8).toFixed(2)+'deg)'});
    stage.addEventListener('mouseleave',()=>{frame.style.transform=''});
  }
})();

/* ---- photo reel: constant gliding speed whatever the number of photos ---- */
(function(){
  const t=document.getElementById('reelTrack');if(!t)return;
  const set=()=>{const half=t.scrollWidth/2;if(half>0)t.style.animationDuration=(half/70).toFixed(1)+'s'};
  set();addEventListener('load',set);addEventListener('resize',()=>{clearTimeout(set.t);set.t=setTimeout(set,200)});
})();
})();
/* ---- pause animations in sections that are off screen ---- */
(function(){
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('pz',!e.isIntersecting)),{rootMargin:'150px 0px'});
  document.querySelectorAll('main > section, main > div, footer').forEach(x=>io.observe(x));
})();
