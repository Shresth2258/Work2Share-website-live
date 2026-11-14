(function(){
const card=document.getElementById('aqc');if(!card)return;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const rnd=(a,b)=>a+Math.random()*(b-a);
function fill(el,n,cls){if(!el)return;for(let i=0;i<n;i++){const s=document.createElement('span'),z=rnd(3,7);
s.style.cssText=`left:${rnd(4,92)}%;top:${rnd(16,90)}%;width:${z}px;height:${z}px;--dx:${rnd(-22,22)}px;--dy:${rnd(-18,18)}px;animation-duration:${rnd(4,9)}s;animation-delay:${-rnd(0,9)}s`;
if(cls)s.className=cls;el.appendChild(s)}}
fill(card.querySelector('.aq-out'),44);
fill(card.querySelector('.aq-in'),16,'cl');

const nums=[...card.querySelectorAll('.aq-n')];
function count(){nums.forEach(b=>{const n=+b.dataset.n;if(rm){b.textContent=n;return}
const t=performance.now();(function f(now){const k=Math.min(1,(now-t)/1600),e=1-Math.pow(1-k,3);b.textContent=Math.round(n*e);if(k<1)requestAnimationFrame(f)})(t)})}
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();card.classList.add('in');count()}},{threshold:.25});io.observe(card)}
else{card.classList.add('in');count()}

const rows=[...card.querySelectorAll('.aq-r')];rows.forEach(r=>r.classList.toggle('hl',r.dataset.k==='nat'));
})();
