/* Work2Share code maker + checker (used by the games and by verify.html).
   Every code belongs to ONE mobile number and carries a check that only this secret can produce,
   so a code typed or invented by hand will not pass verify.html.
   IMPORTANT: if you change SECRET, every code made before the change stops being valid. */
(function(){
const SECRET='ExHnLCeH8SppE6VdVSMC1PbQp85r';
const AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 letters/digits, no I, O, 0, 1
const PFX={R:'W2S',M:'W5'};                  // R = 7% referral code, M = 5% Desk Match code

/* small SHA-256 (works on http, https and file:// alike) */
const pr=[];for(let n=2;pr.length<64;n++){if(pr.every(p=>n%p))pr.push(n)}
const fr=x=>Math.floor((x-Math.floor(x))*4294967296)>>>0;
const K=pr.map(p=>fr(Math.cbrt(p))),H0=pr.slice(0,8).map(p=>fr(Math.sqrt(p)));
function sha256hex(msg){
 const b=new TextEncoder().encode(msg),l=b.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);
 m.set(b);m[l]=128;const dv=new DataView(m.buffer);dv.setUint32(n-8,Math.floor(l*8/4294967296));dv.setUint32(n-4,(l*8)>>>0);
 const h=H0.slice(),w=new Array(64),R=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let o=0;o<n;o+=64){
  for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);
  for(let i=16;i<64;i++){const a=w[i-15],c=w[i-2];w[i]=(w[i-16]+(R(a,7)^R(a,18)^(a>>>3))+w[i-7]+(R(c,17)^R(c,19)^(c>>>10)))|0}
  let [a,b2,c2,d,e,f,g,hh]=h;
  for(let i=0;i<64;i++){
   const t1=(hh+(R(e,6)^R(e,11)^R(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((R(a,2)^R(a,13)^R(a,22))+((a&b2)^(a&c2)^(b2&c2)))|0;
   hh=g;g=f;f=e;e=(d+t1)|0;d=c2;c2=b2;b2=a;a=(t1+t2)|0}
  [a,b2,c2,d,e,f,g,hh].forEach((v,i)=>h[i]=(h[i]+v)|0)}
 return h.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');
}
const M34=(1n<<34n)-1n,M26=(1n<<26n)-1n;
const mask=t=>BigInt('0x'+sha256hex(SECRET+':m:'+t).slice(0,9))&M34;
const chk=(t,n)=>BigInt('0x'+sha256hex(SECRET+':c:'+t+':'+n).slice(0,7))&M26;
const okMobile=m=>/^[6-9]\d{9}$/.test(m);

function make(mobile,type){
 type=type||'R';mobile=String(mobile||'');
 if(!okMobile(mobile)||!PFX[type])return '';
 const n=BigInt(mobile),v=(((n^mask(type))<<26n)|chk(type,n));
 let s='';for(let i=0,x=v;i<12;i++,x>>=5n)s=AL[Number(x&31n)]+s;
 return PFX[type]+'-'+s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8);
}
/* returns {ok:true,type,mobile} for a genuine code, {ok:false} for anything else */
function read(code){
 const t=String(code||'').toUpperCase().replace(/\s+/g,''),mt=/^(W2S|W5)-([A-Z2-9]{4})-([A-Z2-9]{4})-([A-Z2-9]{4})$/.exec(t);
 if(!mt)return{ok:false};
 const type=mt[1]==='W2S'?'R':'M',s=mt[2]+mt[3]+mt[4];let v=0n;
 for(const ch of s){const i=AL.indexOf(ch);if(i<0)return{ok:false};v=(v<<5n)|BigInt(i)}
 const n=(v>>26n)^mask(type);
 if(n<6000000000n||n>9999999999n||(v&M26)!==chk(type,n))return{ok:false};
 return{ok:true,type,mobile:n.toString(),code:t};
}
window.W2SCode={make,read,okMobile};
})();
