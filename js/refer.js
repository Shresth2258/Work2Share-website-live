/* Refer a friend: both get 7% off.
   Every person gets their own code, made from their mobile number (see w2scode.js).
   The team checks any code on verify.html: a genuine code shows the number it belongs to, a made-up one shows FAKE. */
(function(){
const PCT=7,NUM='918383963820',MK='w2sRefMobile',FROM='w2sRefFrom',TOAST='w2sRefToast';
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}},s=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
const W=window.W2SCode;if(!W)return;
const cleanM=v=>String(v||'').replace(/\D/g,'').replace(/^(91|0)(?=\d{10}$)/,'');
/* reuse the number from Desk Match if the person already created a player ID there */
function mobile(){let m=g(MK);if(W.okMobile(m))return m;
 try{const p=JSON.parse(g('w2sPlayer')||'null');if(p&&W.okMobile(p.m)){s(MK,p.m);return p.m}}catch(e){}return ''}
const myCode=()=>{const m=mobile();return m?W.make(m,'R'):''};
function link(){const u=new URL(location.href);u.search='';u.hash='';const c=myCode();if(c)u.searchParams.set('ref',c);return u.toString()+'#game'}
const wa=t=>'https://wa.me/?text='+encodeURIComponent(t);
const wt=t=>'https://wa.me/'+NUM+'?text='+encodeURIComponent(t);

/* someone opened a friend's link: only a genuine code counts */
const qv=new URLSearchParams(location.search).get('ref');let badInvite=false;
if(qv){const r=W.read(qv);
 if(r.ok&&r.type==='R'){if(r.mobile!==mobile())s(FROM,r.code)}else badInvite=true}
let from=g(FROM);{const r=W.read(from);if(!r.ok||r.mobile===mobile())from=null}

window.W2SRef={pct:PCT,code:myCode,link,wa,wt};

const $=id=>document.getElementById(id);
const box=$('refBox');if(!box)return;
const form=$('refForm'),err=$('refErr'),claim=$('refClaim');

function paint(){
 const c=myCode(),on=!!c;
 form.hidden=on;box.hidden=!on;if(claim)claim.hidden=!on;
 if(!on)return;
 $('refCode').textContent=c;
 $('refWa').href=wa('Hey! Work2Share (coworking in Gurugram) is giving us both '+PCT+'% off your first booking. Use my link: '+link());
 if(claim)claim.href=wt('Hi Work2Share, my referral code is '+c+'. My friend has booked, please apply my '+PCT+'% off.');
}
form.onsubmit=e=>{e.preventDefault();const m=cleanM($('refMob').value);
 if(!W.okMobile(m)){err.textContent='Enter a valid 10-digit mobile number.';err.hidden=false;return}
 err.hidden=true;s(MK,m);paint();
 if(from&&W.read(from).mobile===m){s(FROM,null);from=null;paintInvite()}};
const chg=$('refChange');if(chg)chg.onclick=e=>{e.preventDefault();s(MK,null);$('refMob').value='';paint();$('refMob').focus()};

const b=$('refCopy'),bt=b.querySelector('span')||b;
b.onclick=()=>{const l=link(),done=()=>{bt.textContent='Copied ✓';setTimeout(()=>bt.textContent='Copy link',1800)};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(l).then(done,()=>fb(l,done));else fb(l,done)};
function fb(t,done){const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();try{document.execCommand('copy');done()}catch(e){}x.remove()}

function paintInvite(){
 const inv=$('refIn');if(!inv)return;
 if(badInvite&&!$('refBad')){const w=document.createElement('p');w.id='refBad';w.className='gref-in';w.setAttribute('role','alert');
  w.textContent='⚠️ That invite code is not valid, so no offer is applied. Ask your friend to share their link again.';inv.parentNode.insertBefore(w,inv)}
 if(!from){inv.hidden=true;return}
 const gm=wt('Hi Work2Share, I was referred by code '+from+' and would like to claim my '+PCT+'% off.');
 $('refFrom').textContent=from;$('refGet').href=gm;inv.hidden=false;
}
paint();paintInvite();
if(from&&!badInvite){const gm=wt('Hi Work2Share, I was referred by code '+from+' and would like to claim my '+PCT+'% off.');
 let seen=null;try{seen=sessionStorage.getItem(TOAST)}catch(e){}
 if(!seen){const t=document.createElement('div');t.className='gtoast';t.setAttribute('role','status');
  t.innerHTML='<span>🎁 A friend invited you. Get <b>'+PCT+'% off</b> your first booking.</span><a class="btn" target="_blank" rel="noopener" href="'+gm+'"><span>Claim</span></a><button type="button" aria-label="Close">✕</button>';
  document.body.appendChild(t);setTimeout(()=>t.classList.add('on'),1200);
  t.querySelector('button').onclick=()=>{t.classList.remove('on');try{sessionStorage.setItem(TOAST,'1')}catch(e){}};}}
})();
