/* Mobile performance helpers */
(function(){
  'use strict';
  // 1. Lazy-load every image except logo/header + hero
  try{
    document.querySelectorAll('img').forEach(function(im){
      if(im.closest('header,.hero')||im.hasAttribute('loading'))return;
      im.setAttribute('loading','lazy');im.setAttribute('decoding','async');
    });
  }catch(e){}

  // 2. Pause CSS animations in sections that are off-screen
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)});
  },{rootMargin:'150px 0px'});
  document.querySelectorAll('main > section, main section, footer').forEach(function(s){io.observe(s)});

  // 3. Pause everything when the tab is hidden
  document.addEventListener('visibilitychange',function(){
    document.documentElement.classList.toggle('off',document.hidden);
  });
})();
