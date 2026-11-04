const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// progress + header
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';$('#hd').classList.toggle('s',scrollY>40);
 const wd=$$('.w'),r=$('#words').getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(innerHeight*.6)));wd.forEach((w,i)=>w.classList.toggle('on',i/wd.length<p));
 const g=$('#gs');if(g)g.style.translate='0 '+Math.min(scrollY*.08,60)+'px';},{passive:true});
$('#bg').onclick=()=>$('#pl').classList.toggle('o');$$('#pl a').forEach(a=>a.onclick=()=>$('#pl').classList.remove('o'));
$('#th').onclick=()=>document.documentElement.classList.toggle('dk');
// word reveal
(function(){const h=$('#words');const o=[];h.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent.split(/\s+/).filter(Boolean).forEach(t=>{const s=document.createElement('span');s.className='w';s.textContent=t;o.push(s)});else{const s=document.createElement('span');s.className='w';s.append(n.cloneNode(true));o.push(s)}});h.textContent='';o.forEach(s=>h.append(s,' '))})();
// reveals
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.2});
$$('.rv,.dicebar,.half').forEach(e=>io.observe(e));window.__rvDone=true;
// counters
new IntersectionObserver((e,o)=>e.forEach(x=>{if(!x.isIntersecting)return;o.unobserve(x.target);$$('[data-n]').forEach(b=>{const n=+b.dataset.n,d=+b.dataset.d,sx=b.dataset.s,t=performance.now();(function f(now){const k=Math.min(1,(now-t)/1800);b.textContent=(n*(1-Math.pow(1-k,3))).toFixed(d)+sx;if(k<1)requestAnimationFrame(f)})(t)})}),{threshold:.3}).observe($('#sg'));
// birds
for(let i=0;i<7;i++){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 26 12');s.classList.add('bird');s.innerHTML='<path class="flap" d="M0 8Q6 0 13 8Q20 0 26 8Q20 5 13 12Q6 5 0 8z"/>';s.style.cssText=`top:${12+i*9}%;animation-duration:${14+i*3}s;animation-delay:${-i*4}s;width:${18+i*3}px;position:absolute;z-index:1;pointer-events:none;opacity:.7`;$('.hero').append(s)}
// hero rotating headline
let hi=0;
const dts=$$('#hd2 b');function setH(i){hi=i;dts.forEach((d,k)=>d.classList.toggle('a',k===i));$$('.sl,.art').forEach(e=>{const k=+e.dataset.i;e.classList.toggle('on',k===i);e.classList.toggle('out',k===(i+2)%3)})}setTimeout(()=>setH(0),100);
dts.forEach((d,i)=>d.onclick=()=>setH(i));setInterval(()=>setH((hi+1)%3),5500);
// mouse parallax on hero
$('#stage').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('#win').style.transform=`translate(${500+x*30}px,${40+y*30}px)`;e.currentTarget.querySelector('.disc').style.translate=`${x*-20}px ${y*-20}px`});
// office tour
(function(){
 const slides=$$('.ts'),th=$$('.tour-thumbs button'),nm=slides.map(x=>x.dataset.name),bar=$('#tbar'),arch=$('#arch');let si=0,tm;
 function room(i){si=(i+slides.length)%slides.length;slides.forEach((c,k)=>c.classList.toggle('on',k===si));th.forEach((c,k)=>{c.classList.toggle('on',k===si);c.setAttribute('aria-pressed',k===si)});
  $('#rn').textContent=nm[si];
  bar.classList.remove('go');void bar.offsetWidth;bar.classList.add('go');clearTimeout(tm);tm=setTimeout(()=>room(si+1),5500)}
 arch.onclick=()=>room(si+1);arch.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();room(si+1)}};
 th.forEach((b,k)=>b.onclick=()=>room(k));
 room(0);
 const aw=$('#aw');aw.addEventListener('pointermove',e=>{const r=aw.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;arch.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*7}deg)`});
 aw.addEventListener('pointerleave',()=>arch.style.transform='');
})();
// testimonials
const T=[['Northwind Media','We started with a single hot desk and moved to a private cabin within months. The community made growing feel easy.','Asha Verma','Founder'],['Helio Energy','The virtual office gave us a professional address from day one, and mail handling just works. No rent, no fuss.','Nikhil Rao','Director'],['Futura Capital','We use the meeting rooms for every client pitch. They are well equipped and always ready when we walk in.','Rohan Mehta','Partner'],['Aqualume','Fast Wi-Fi, power backup and a calm space. My remote team finally has a place it enjoys coming to.','Elena Costa','Team Lead'],['Brightpath Labs','Flexible plans meant we paid only for what we needed while small, and scaled up when we were ready.','Dev Malhotra','Co-Founder'],['Orbit Legal','Our clients see a proper business address and a smooth reception. It lifted how we look to them.','Priya Nair','Managing Partner'],['Kinfolk Studio','I met my best collaborators over coffee in the pantry. The community is the real perk.','Sam Dsouza','Designer'],['Tessera Health','Housekeeping, security and a helpful front desk are all handled, so we just walk in and work.','Dr. Kavya Iyer','Consultant']];
const bw=$('#bars');for(let k=0;k<14;k++)bw.insertAdjacentHTML('beforeend','<i style="--k:'+k+'"></i>');const dk=$('#deck'),dd=$('#dd'),br=$$('.bars i');let ti=0;const LC=['#c8102e','#0a3d62','#e3262e','#2a7de1','#6b3fa0','#222','#d98a00','#0a8e80'],HB=[96,94,90,88,92,96,99];T.forEach((t,i)=>{dk.insertAdjacentHTML('beforeend',`<div class="tc"><div><div class="lg" style="background:${LC[i]}">${t[0]}</div><q>${t[1]}</q></div><div><strong>${t[2]}</strong><small>${t[3]}</small></div></div>`);dd.insertAdjacentHTML('beforeend','<b></b>')});
const cs=$$('.tc'),ds=$$('#dd b');
function show(i){ti=(i+T.length)%T.length;cs.forEach((c,k)=>{c.style.transform=`translateX(${(ti-k)*106}%)`;c.style.opacity=(k===ti||k===ti-1)?1:0});ds.forEach((x,k)=>x.classList.toggle('a',k===ti));br.forEach((b,k)=>b.style.height=(86+k*.9-((ti+k)%3))+'%');bw.classList.remove('fl');void bw.offsetWidth;bw.classList.add('fl')}
$('#pv').onclick=()=>show(ti-1);$('#nx').onclick=()=>show(ti+1);ds.forEach((d,i)=>d.onclick=()=>show(i));show(0);setInterval(()=>show(ti+1),6000);
