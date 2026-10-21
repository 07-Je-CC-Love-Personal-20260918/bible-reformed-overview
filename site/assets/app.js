// CCstudy 交互：主题、目录、进度、滚动动画、标签页、遮挡背诵
(function(){
  const root=document.documentElement,body=document.body;
  const T=['dawn','night','olive','royal'];
  const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
  const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  function theme(t){root.dataset.theme=t;set('cc-theme',t);document.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s.dataset.t===t));window.dispatchEvent(new Event('themechange'))}
  document.querySelectorAll('.sw').forEach(s=>s.onclick=()=>theme(s.dataset.t));
  theme(get('cc-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'night':'dawn'));
  // 目录
  const tb=document.getElementById('tocBtn');
  if(tb)tb.onclick=()=>{if(innerWidth<=860)body.classList.toggle('toc-on');else body.classList.toggle('toc-off')};
  document.querySelectorAll('nav.toc a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=860)body.classList.remove('toc-on')}));
  // 进度条 + 目录高亮
  const prog=document.getElementById('prog'),links=[...document.querySelectorAll('nav.toc a[href^="#"]')];
  addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    let cur=null;links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s&&s.getBoundingClientRect().top<120)cur=a});
    links.forEach(a=>a.classList.toggle('on',a===cur))},{passive:true});
  // 滚动显现
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // 标签页
  document.querySelectorAll('[data-tabs]').forEach(g=>{const bs=g.querySelectorAll('.tabs .btn'),ps=g.querySelectorAll('.pane');
    bs.forEach((b,i)=>b.onclick=()=>{bs.forEach(x=>x.classList.remove('on'));ps.forEach(x=>x.classList.remove('on'));b.classList.add('on');ps[i].classList.add('on')})});
  // 背诵遮挡
  document.querySelectorAll('[data-recite]').forEach(b=>b.onclick=()=>{const t=document.getElementById(b.dataset.recite);t.classList.toggle('hide-ans');b.classList.toggle('on')});
  const up=document.getElementById('upBtn');if(up)up.onclick=()=>scrollTo({top:0});
})();
