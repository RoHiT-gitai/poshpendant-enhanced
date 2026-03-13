const AMAZON_STORE='https://www.amazon.com/stores/page/69770F17-3394-4D3F-8AEC-9A48CE53B447?maas=maas_adg_605FA232F4C4195D3BA227BA2C68768D_afap_abs&ref_=aa_maas&tag=maas';
const ETSY_STORE='https://poshpendantjaipur.etsy.com';
const STRIPE_BASE='https://buy.stripe.com/your-payment-link';

// ─────────────────────────────────────────────────────────────
// CLOUDFLARE ANALYTICS + CONVERSION TRACKING
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', function() {
  // Cloudflare Web Analytics (if enabled)
  if(window.cf) {
    // Track page views automatically
    window.cf.push(['pageview']);
  }
});

// Track conversions and events
function trackEvent(eventName, eventData) {
  if(typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  // Also send to Cloudflare Analytics Engine
  if(navigator.sendBeacon) {
    const payload = JSON.stringify({
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
    navigator.sendBeacon('/api/analytics', payload);
  }
}

// Track key conversions
function trackConversion(type, value, currency = 'USD') {
  trackEvent('purchase', { value, currency, type });
}

// Performance monitoring
window.addEventListener('load', function() {
  if(window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

    trackEvent('page_performance', {
      load_time: loadTime,
      dom_ready: domReady
    });
  }
});

// MOBILE MENU TOGGLE
(function(){
  const navBar=document.getElementById('navbar');
  const hamburger=document.getElementById('navHamburger');
  if(hamburger&&navBar){
    hamburger.addEventListener('click',e=>{
      e.preventDefault();
      navBar.classList.toggle('mobile-open');
    });
    document.querySelectorAll('nav a').forEach(link=>{
      link.addEventListener('click',()=>navBar.classList.remove('mobile-open'));
    });
    document.addEventListener('click',e=>{
      if(!navBar.contains(e.target)&&navBar.classList.contains('mobile-open')){
        navBar.classList.remove('mobile-open');
      }
    });
  }})();

// EMAIL COPY TO CLIPBOARD
document.addEventListener('DOMContentLoaded',()=>{
  const emailLinks=document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link=>{
    link.addEventListener('click',e=>{
      const email=link.textContent.replace(/\s/g,'');
      if(email){
        navigator.clipboard.writeText(email).then(()=>{
          const orig=link.textContent;
          link.textContent='📋 Copied!';
          setTimeout(()=>link.textContent=orig,2000);
        });
      }
    });
  });});

// TWINKLING STARS
(function(){
  const c=document.getElementById('starCanvas');if(!c)return;
  const ctx=c.getContext('2d');let W,H,stars=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;stars=Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,o:Math.random(),s:Math.random()*.012+.003,d:Math.random()>.5?1:-1}))}
  resize();window.addEventListener('resize',resize);
  (function draw(){ctx.clearRect(0,0,W,H);stars.forEach(s=>{s.o+=s.s*s.d;if(s.o>1||s.o<0)s.d*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(196,121,122,${s.o})`;ctx.fill()});requestAnimationFrame(draw)})();
})();

// SPARKLE CURSOR TRAIL
document.addEventListener('mousemove',e=>{
  if(Math.random()>.82){
    const sp=document.createElement('div');const sz=3+Math.random()*6;
    sp.className='sparkle';sp.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:var(--rose-pale);`;
    document.body.appendChild(sp);setTimeout(()=>sp.remove(),700);
  }
});

// FLOATING PARTICLES
(function(){
  const cols=['rgba(196,121,122,.1)','rgba(232,160,161,.08)','rgba(201,149,106,.07)','rgba(242,196,196,.12)'];
  for(let i=0;i<14;i++){const p=document.createElement('div');p.className='particle';const sz=4+Math.random()*8;p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}vw;background:${cols[i%4]};animation-duration:${14+Math.random()*18}s;animation-delay:${Math.random()*16}s;`;document.body.appendChild(p);}
})();

// GEO BANNER
function closeBanner(){const b=document.getElementById('geoBanner');if(b)b.classList.remove('visible')}
let isUSA=false;
async function detectGeo(){
  try{const r=await fetch('https://ipapi.co/json/');const d=await r.json();isUSA=d.country_code==='US';}catch(e){isUSA=false;}
  const banner=document.getElementById('geoBanner');
  const geoFlag=document.getElementById('geoFlag');
  const geoBannerText=document.getElementById('geoBannerText');
  if(geoFlag)geoFlag.textContent=isUSA?'🇺🇸':'🌍';
  if(geoBannerText)geoBannerText.innerHTML=isUSA?`You are in the USA! Shop on <a href="${AMAZON_STORE}" target="_blank">Amazon</a> for Prime shipping.`:`Welcome! Shop our handcrafted pendants on <a href="${ETSY_STORE}" target="_blank">Etsy</a> with worldwide shipping.`;
  const shopGeoIcon=document.getElementById('shopGeoIcon');
  const shopGeoText=document.getElementById('shopGeoText');
  if(shopGeoIcon)shopGeoIcon.textContent=isUSA?'🇺🇸':'🌍';
  if(shopGeoText)shopGeoText.textContent=isUSA?'We recommend Amazon for fast US delivery.':'We recommend Etsy for worldwide shipping.';
  const hl=document.getElementById(isUSA?'shopAmazon':'shopEtsy');
  if(hl)hl.style.boxShadow='0 28px 64px rgba(196,121,122,.28)';
  if(banner)setTimeout(()=>banner.classList.add('visible'),1600);
  if(banner)setTimeout(()=>closeBanner(),10000);
  if(typeof renderCat==='function')renderCat();
}

// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
if(cur&&ring){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function anim(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();
  document.querySelectorAll('a,button,input,select,textarea').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.2)';ring.style.opacity='0';});
    el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='.5';});
  });
}

// SCROLL NAV
window.addEventListener('scroll',()=>{const nb=document.getElementById('navbar');if(nb)nb.classList.toggle('scrolled',scrollY>60);});

// REVEAL
const ro=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}
}),{threshold:.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>ro.observe(el));

// COUNTERS
let countersAnimated=false;
function animateCounters(){
  if(countersAnimated)return;countersAnimated=true;
  document.querySelectorAll('.stat-number[data-target]').forEach(el=>{
    const target=parseInt(el.dataset.target);const suffix=target>=1000?'k+':target===49?'/50':'+';const disp=target>=1000?Math.floor(target/1000):target;let cur=0;const step=disp/60;
    const t=setInterval(()=>{cur=Math.min(cur+step,disp);el.textContent=Math.floor(cur)+suffix;if(cur>=disp)clearInterval(t);},20);
  });
}
const statsEl=document.querySelector('.stats-strip');
if(statsEl){new IntersectionObserver(es=>{if(es[0].isIntersecting)animateCounters();},{threshold:.3}).observe(statsEl);}

detectGeo();



// ── SCROLL PROGRESS BAR ──────────────────────────────────────
(function(){
  const pb = document.createElement('div');
  pb.id = 'scroll-progress';
  pb.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:99997;pointer-events:none;background:linear-gradient(90deg,#C4797A,#E8A0A1,#C9956A);width:0%;box-shadow:0 0 10px rgba(196,121,122,.6);transition:width .08s linear;';
  document.body.appendChild(pb);
  window.addEventListener('scroll', function(){
    var pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    pb.style.width = Math.min(pct,100) + '%';
  }, { passive:true });
})();

// ── NAVBAR HIDE ON SCROLL DOWN ───────────────────────────────
(function(){
  var lastY = 0;
  window.addEventListener('scroll', function(){
    var nb = document.getElementById('navbar'); if(!nb) return;
    var y = window.scrollY;
    nb.classList.toggle('scrolled', y > 60);
    nb.style.transition = 'transform 0.42s cubic-bezier(.16,1,.3,1),background .3s,box-shadow .3s';
    if(y > lastY + 8 && y > 150) nb.style.transform = 'translateY(-100%)';
    else if(y < lastY - 4) nb.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive:true });
})();

// ── SCROLL REVEAL ────────────────────────────────────────────
(function(){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold:0.1, rootMargin:'0px 0px -30px 0px' });

  function initReveal(){
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-up,.reveal-pop').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight * 0.96) el.classList.add('visible');
      else obs.observe(el);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initReveal);
  else initReveal();
  window.addEventListener('reveal:reinit', initReveal);
})();

// ── 3D CARD TILT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.why-card,.feat-card,.review-card,.tier-card,.prod-card,.c-card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var x = ((e.clientX-r.left)/r.width-0.5)*12;
      var y = ((e.clientY-r.top)/r.height-0.5)*12;
      card.style.transform = 'perspective(800px) rotateX('+(-y)+'deg) rotateY('+x+'deg) scale(1.03) translateZ(8px)';
      card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
      card.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
    });
  });
});

// ── MAGNETIC BUTTONS ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.btn-primary,.nav-shop-btn,.btn-add-cart,.card-cta').forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      btn.style.transform = 'translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)';
    });
    btn.addEventListener('mouseleave', function(){ btn.style.transform=''; });
  });
});
