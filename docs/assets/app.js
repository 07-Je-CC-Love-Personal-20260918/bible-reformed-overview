// CCstudy v2.1 · 顺滑交互：Lenis 惯性滚动、rAF 节流、IntersectionObserver、View Transitions 主题切换
(function(){
  const root=document.documentElement,body=document.body;
  const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
  const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 主题 ----
  function apply(t){root.dataset.theme=t;set('cc-theme',t);document.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s.dataset.t===t));window.dispatchEvent(new Event('themechange'))}
  function theme(t){if(document.startViewTransition&&!reduce)document.startViewTransition(()=>apply(t));else apply(t)}
  document.querySelectorAll('.sw').forEach(s=>s.addEventListener('click',()=>theme(s.dataset.t)));
  apply(get('cc-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'night':'dawn'));


  // ---- 全站页面导航（统一注入）----
  const PAGES=[['index.html','① 📚 66 卷'],['overview.html','② 📖 全景总览'],['gospels.html','③ ✝️ 四福音·生平'],['acts.html','④ 🔥 使徒行传·新约史'],['compare.html','⑤ 🧩 分组对比'],['kings.html','⑥ 👑 列王与历代'],['creeds.html','⑦ 📜 信经信条'],['stats.html','⑧ 📊 统计'],['classic.html','🏛️ 经典版']];
  const here=(location.pathname.split('/').pop()||'index.html');
  // 预渲染其他页面：点导航时几乎瞬开
  try{if(HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules')){const sr=document.createElement('script');sr.type='speculationrules';sr.textContent=JSON.stringify({prerender:[{source:'document',where:{href_matches:'/*.html'},eagerness:'moderate'}]});document.head.appendChild(sr)}}catch(e){}
  const top=document.querySelector('header.top');
  if(top&&!document.querySelector('.pagenav')){const pn=document.createElement('nav');pn.className='pagenav';pn.setAttribute('aria-label','页面');
    pn.innerHTML=PAGES.map(([h,t])=>`<a href="${h}"${h===here?' class="on" aria-current="page"':''}>${t}</a>`).join('');top.after(pn);
    top.querySelectorAll('a.btn[href$=".html"]').forEach(a=>a.remove())}
  // ---- 自动目录 ----
  const at=document.querySelector('nav.toc[data-auto]');
  if(at){let h='';document.querySelectorAll('main section[id]').forEach(s=>{const t=s.querySelector('h2');if(!t)return;if(s.dataset.grp)h+=`<div class="grp">${s.dataset.grp}</div>`;h+=`<a href="#${s.id}">${t.childNodes[0].textContent.trim()}</a>`});at.innerHTML=h}

  // ---- 惯性平滑滚动 ----
  let lenis=null;
  if(window.Lenis&&!reduce&&matchMedia('(pointer:fine)').matches){
    lenis=new Lenis({duration:1.1,easing:t=>1-Math.pow(1-t,3),smoothWheel:true,syncTouch:false,
      prevent:n=>n.closest&&(n.closest('nav.toc')||n.closest('.tbl')||n.closest('.svgbox')||n.closest('#map'))});
    const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
    root.classList.add('lenis');
  }
  const go=(el)=>{if(!el)return;lenis?lenis.scrollTo(el,{offset:-64}):el.scrollIntoView({behavior:'smooth'})};
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const el=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));if(el){e.preventDefault();if(el.tagName==='DETAILS')el.open=true;go(el);history.replaceState(null,'','#'+el.id);if(innerWidth<=860)body.classList.remove('toc-on')}});

  // ---- 目录 ----
  const tb=document.getElementById('tocBtn');
  if(tb)tb.addEventListener('click',()=>{if(innerWidth<=860)body.classList.toggle('toc-on');else body.classList.toggle('toc-off')});

  // ---- 进度条（rAF 节流，只写 transform）----
  const prog=document.getElementById('prog');
  if(prog){prog.style.width='100%';prog.style.transformOrigin='0 0';prog.style.willChange='transform'}
  let ticking=false;
  const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const h=root.scrollHeight-root.clientHeight;if(prog)prog.style.transform=`scaleX(${h>0?root.scrollTop/h:0})`;ticking=false})};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // ---- 目录高亮（IO，不在滚动时测量）----
  const links=[...document.querySelectorAll('nav.toc a[href^="#"]')],map=new Map();
  links.forEach(a=>{const el=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));if(el)map.set(el,a)});
  if(map.size){let cur=null;const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){cur&&cur.classList.remove('on');cur=map.get(e.target);cur.classList.add('on');
      const nav=cur.closest('nav.toc');if(nav){const r=cur.offsetTop-nav.clientHeight/2;nav.scrollTo({top:r,behavior:'smooth'})}}})},{rootMargin:'-20% 0px -70% 0px'});
    map.forEach((a,el)=>io.observe(el))}

  // ---- 进场动画 ----
  const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>rv.observe(el));

  // ---- 标签页 ----
  document.querySelectorAll('[data-tabs]').forEach(g=>{const bs=g.querySelectorAll(':scope>.tabs .btn'),ps=g.querySelectorAll(':scope>.pane');
    bs.forEach((b,i)=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.remove('on'));ps.forEach(x=>x.classList.remove('on'));b.classList.add('on');ps[i]&&ps[i].classList.add('on')}))});

  // ---- 背诵遮挡 / 闪卡 ----
  document.querySelectorAll('[data-recite]').forEach(b=>b.addEventListener('click',()=>{const t=document.getElementById(b.dataset.recite);t.classList.toggle('hide-ans');b.classList.toggle('on')}));
  document.addEventListener('click',e=>{const f=e.target.closest('.flash');if(f)f.classList.toggle('on')});


  // ---- 右下角悬浮导航：主页 / 后退 / 前进 / 顶部 / 底部 ----
  document.querySelectorAll('.fab').forEach(f=>f.remove());
  const nav=document.createElement('nav');nav.className='fnav';nav.setAttribute('aria-label','快捷导航');
  nav.innerHTML='<button data-a="home" title="主页（66 卷）">🏠</button><button data-a="back" title="后退">‹</button><button data-a="fwd" title="前进">›</button><button data-a="top" title="回到顶部">⤒</button><button data-a="bottom" title="到底部">⤓</button><button data-a="fold" class="fold" title="收起/展开">⋯</button>';
  document.body.appendChild(nav);
  nav.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;
    if(a==='home')location.href='index.html';else if(a==='back')history.back();else if(a==='fwd')history.forward();
    else if(a==='top')(window.CC&&CC.lenis)?CC.lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'});
    else if(a==='bottom'){const y=document.documentElement.scrollHeight;(window.CC&&CC.lenis)?CC.lenis.scrollTo(y):scrollTo({top:y,behavior:'smooth'})}
    else if(a==='fold')nav.classList.toggle('min')});
  if(matchMedia('(max-width:600px)').matches)nav.classList.add('min');
  let lastY=0;addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('dim',y>lastY&&y>300);lastY=y},{passive:true});

  // ---- 回到顶部 ----
  const up=document.getElementById('upBtn');if(up)up.addEventListener('click',()=>lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'}));
  // details 展开后刷新 Lenis 高度
  document.addEventListener('toggle',()=>lenis&&lenis.resize(),true);
  window.CC={lenis,go};
})();
