/* Shared by all inner pages: header, theme, counters, gallery filters, FAQ search, contact form */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
window.__rvDone=false;
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';$('#hd').classList.toggle('s',scrollY>40)},{passive:true});
$('#bg').onclick=()=>$('#pl').classList.toggle('o');
$$('#pl a').forEach(a=>a.addEventListener('click',()=>$('#pl').classList.remove('o')));
$('#th').onclick=()=>document.documentElement.classList.toggle('dk');

// gallery filters
$$('#fl button').forEach(b=>b.onclick=()=>{
 $$('#fl button').forEach(x=>x.classList.toggle('on',x===b));
 const f=b.dataset.f;
 $$('#ms .gt').forEach((t,i)=>{const show=f==='all'||t.dataset.cat===f;t.classList.remove('pop');t.hidden=!show;if(show){t.classList.add('in');void t.offsetWidth;t.style.setProperty('--d',(i%4)*.06+'s');t.classList.add('pop')}});
});

// stat counters
const cn=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;cn.unobserve(x.target);const b=x.target,n=+b.dataset.n,d=+b.dataset.d,sx=b.dataset.s,t=performance.now();(function f(now){const k=Math.min(1,(now-t)/1800);b.textContent=(n*(1-Math.pow(1-k,3))).toFixed(d)+sx;if(k<1)requestAnimationFrame(f)})(t)}),{threshold:.5});
$$('[data-n]').forEach(b=>cn.observe(b));

// FAQ search + category filter
const fq=$('#fq');
if(fq){let cat='all';
 const run=()=>{const q=fq.value.trim().toLowerCase();let n=0;$$('#fl2 details').forEach(d=>{const ok=(cat==='all'||d.dataset.cat===cat)&&(!q||d.textContent.toLowerCase().includes(q));d.hidden=!ok;d.classList.add('in');if(ok)n++});$('#nores').hidden=n>0};
 fq.addEventListener('input',run);
 $$('#fcat button').forEach(b=>b.onclick=()=>{cat=b.dataset.f;$$('#fcat button').forEach(x=>x.classList.toggle('on',x===b));run()});
}

// contact form -> WhatsApp / email
const cf=$('#cf');
if(cf){
 const text=()=>{const f=new FormData(cf);return `Hi Work2Share, I'm ${f.get('n')||''} (${f.get('p')||''}). I'm interested in: ${f.get('t')}.${f.get('m')?' '+f.get('m'):''}`};
 const ok=()=>{const f=new FormData(cf);if(!f.get('n').trim()||!f.get('p').trim()){$('#fmsg').textContent='Please add your name and phone number.';(f.get('n').trim()?cf.p:cf.n).focus();return false}$('#fmsg').textContent='';return true};
 cf.addEventListener('submit',e=>{e.preventDefault();if(ok()){open('https://wa.me/918383963820?text='+encodeURIComponent(text()),'_blank','noopener');$('#fmsg').textContent='Opening WhatsApp with your message.'}});
 $('#cmail').onclick=()=>{if(ok())location.href='mailto:sales@work2share.in?subject='+encodeURIComponent('Enquiry from website')+'&body='+encodeURIComponent(text())};
}
})();
