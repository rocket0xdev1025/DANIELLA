/* ===== Single source of truth ===== */
const CONFIG = {
  CA: 'Asgq1QLYv4WxfEXfkcnu4jEZkcq5WA3GXW1ciEXbpump',
  X: 'https://x.com/AuraFinalBoob',
  TG: 'https://t.me/AuraFinalBoob',
  SOL_MINT: 'So11111111111111111111111111111111111111112'
};
const isTBA = v => !v || v === 'Asgq1QLYv4WxfEXfkcnu4jEZkcq5WA3GXW1ciEXbpump';
const LINKS = {
  buy: `https://swap.pump.fun/?input=${CONFIG.SOL_MINT}&output=${CONFIG.CA}`,
  chart: `https://dexscreener.com/solana/${CONFIG.CA}`,
  embed: `https://dexscreener.com/solana/${CONFIG.CA}?embed=1&theme=dark&trades=0&info=0`
};

document.body.classList.remove('no-js');
const $$ = s => [...document.querySelectorAll(s)];

$$('[data-link]').forEach(a => {
  a.href = LINKS[a.dataset.link];
  if (isTBA(CONFIG.CA)) a.title = 'Contract address Asgq1QLYv4WxfEXfkcnu4jEZkcq5WA3GXW1ciEXbpump. Link goes live at launch.';
});
$$('[data-social]').forEach(a => {
  const v = CONFIG[a.dataset.social];
  if (isTBA(v)) {
    a.classList.add('soon'); a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.title = 'Soon';
    a.addEventListener('click', e => { e.preventDefault(); toast('Socials coming soon'); });
  } else { a.href = v; a.target = '_blank'; a.rel = 'noopener'; }
});
document.getElementById('ca-value').textContent = CONFIG.CA;
const iframe = document.getElementById('dex-embed');
iframe.src = LINKS.embed;
if (!isTBA(CONFIG.CA)) document.getElementById('chart-overlay').classList.add('hidden');

/* Copy CA */
const tEl = document.getElementById('toast'); let tT;
function toast(m) { tEl.textContent = m; tEl.classList.add('show'); clearTimeout(tT); tT = setTimeout(() => tEl.classList.remove('show'), 1800); }
function fallbackCopy(t) {
  const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;opacity:0;left:-9999px'; document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok;
}
async function copyCA(btn) {
  let ok = false;
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(CONFIG.CA); ok = true; } } catch (e) {}
  if (!ok) ok = fallbackCopy(CONFIG.CA);
  const span = btn.querySelector('span'), use = btn.querySelector('use'), old = span && span.textContent;
  if (span) span.textContent = ok ? 'Copied' : 'Copy failed';
  if (use) use.setAttribute('href', ok ? '#i-check' : '#i-copy');
  toast(ok ? (isTBA(CONFIG.CA) ? 'Copied: CA is Asgq1QLYv4WxfEXfkcnu4jEZkcq5WA3GXW1ciEXbpump until launch' : 'CA copied') : 'Copy failed, select it manually');
  setTimeout(() => { if (span) span.textContent = old; if (use) use.setAttribute('href', '#i-copy'); }, 1600);
}
$$('[data-copy-ca]').forEach(b => b.addEventListener('click', () => copyCA(b)));

/* Decorative layers */
const star = '<svg viewBox="0 0 24 24"><use href="#i-star"/></svg>';
const sp = document.querySelector('.sparkles');
for (let i = 0; i < 18; i++) { const d = document.createElement('div'); d.innerHTML = star; const s = d.firstChild; const z = 8 + Math.random() * 18; s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*90}%;width:${z}px;height:${z}px;opacity:${.4+Math.random()*.6}`; sp.appendChild(s); }
const co = document.querySelector('.coins');
[[8, 30], [88, 20], [92, 70], [4, 78], [55, 96]].forEach(([x, y]) => { const c = document.createElement('span'); c.style.left = x + '%'; c.style.top = y + '%'; c.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-sol"/></svg>'; co.appendChild(c); });

/* Word splitting */
$$('.split').forEach(el => {
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; } const o = document.createElement('span'); o.className = 'w'; o.innerHTML = '<span></span>'; o.firstChild.textContent = w; f.appendChild(o); });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.classList.contains('grad')) { const o = document.createElement('span'); o.className = 'w'; c.replaceWith(o); o.appendChild(c); } else if (c.nodeType === 1) walk(c);
  });
  walk(el);
});

/* Motion */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const prog = document.getElementById('progress');
const num = document.getElementById('aura-num'), bar = document.getElementById('aura-bar'), cap = document.getElementById('aura-cap'), art = document.querySelector('.meter-art');
const CAPS = ['Booting up good vibes...', 'Shaka detected. Aura rising.', 'Golden hour unlocked.', 'Sunset mode: maximum.', 'FINAL BOSS'];
function setMeter(p) {
  const v = Math.round(p * 100); num.textContent = v; bar.style.width = v + '%'; art.style.setProperty('--p', p);
  cap.textContent = CAPS[Math.min(4, Math.floor(p * 4.999))];
  if (v >= 100) num.textContent = '100';
}
function staticMode() {
  setMeter(1);
  addEventListener('scroll', () => { const h = document.documentElement; prog.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`; }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  if (reduce || !window.gsap || !window.ScrollTrigger) { staticMode(); return; }
  try {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: .1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { offset: -70 }); }));
    }
    const mobile = innerWidth < 860;
    gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    // hero intro
    gsap.from('.hero h1 .w>*', { yPercent: 110, duration: 1, stagger: .08, ease: 'expo.out', delay: .1 });
    gsap.from('.hero .kicker,.hero .lead,.hero-copy .flex', { y: 24, opacity: 0, duration: .9, stagger: .1, delay: .35 });
    gsap.from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 28px 28px)', duration: 1.4, ease: 'expo.out' });
    gsap.from('.chip', { scale: 0, opacity: 0, stagger: .12, delay: .8, ease: 'back.out(2)' });
    gsap.to('.chip', { y: -10, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .4 });

    // pinned hero parallax
    const ht = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: mobile ? '+=40%' : '+=90%', pin: true, scrub: true } });
    $$('#hero .layer').forEach(l => ht.to(l, { y: () => -parseFloat(l.dataset.speed) * innerHeight * .5, ease: 'none' }, 0));
    ht.to('.bigword', { xPercent: -25, ease: 'none' }, 0).to('.sun', { scale: 1.3, ease: 'none' }, 0).to('.hero-copy', { opacity: .2, y: -40, ease: 'none' }, 0);

    // aura meter
    const st = { p: 0 };
    gsap.to(st, { p: 1, ease: 'none', onUpdate: () => setMeter(st.p),
      scrollTrigger: { trigger: '#meter', start: 'top top', end: mobile ? '+=70%' : '+=160%', pin: true, scrub: .5 } });
    gsap.fromTo('.disc', { scale: .85, filter: 'saturate(.5)' }, { scale: 1, filter: 'saturate(1.2)', ease: 'none', scrollTrigger: { trigger: '#meter', start: 'top top', end: mobile ? '+=70%' : '+=160%', scrub: true } });

    // banner reveal + pan/zoom
    gsap.fromTo('.banner-clip', { clipPath: 'inset(30% 40% 30% 40% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'power2.out', scrollTrigger: { trigger: '.banner-sec', start: 'top 85%', end: 'top 30%', scrub: true } });
    gsap.fromTo('.banner-clip img', { scale: 1.35, xPercent: -6 }, { scale: 1.05, xPercent: 4, ease: 'none', scrollTrigger: { trigger: '.banner-sec', start: 'top bottom', end: 'bottom top', scrub: true } });

    // word reveals for section headings
    $$('.split').forEach(h => { if (h.closest('.hero')) return;
      gsap.from(h.querySelectorAll('.w>*'), { yPercent: 110, stagger: .07, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } }); });
    // staggered reveals
    ScrollTrigger.batch('.reveal', { start: 'top 88%', onEnter: b => gsap.from(b, { y: 50, opacity: 0, stagger: .12, duration: .9, ease: 'power3.out' }) });
    addEventListener('load', () => ScrollTrigger.refresh());
  } catch (e) { console.warn('Motion disabled:', e); staticMode(); }
});
