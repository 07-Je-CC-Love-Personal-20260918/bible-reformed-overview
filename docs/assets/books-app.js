// 66 卷主页：书架、关联网络、逐卷卡片、筛选、闪卡
(function(){
const B=window.BOOKS,R=window.REL||{};
const CH=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const G=['律法','历史','诗歌','大先知','小先知','福音书','保罗书信','普通书信','预言'];
const C={律法:'#b5562b',历史:'#2f6f8f',诗歌:'#5f8a2e',大先知:'#c93c3c',小先知:'#b8860b',福音书:'#d4a017',保罗书信:'#6b3fb5',普通书信:'#c2185b',预言:'#334155'};
const IC={律法:'📜',历史:'🏰',诗歌:'🎵',大先知:'🔥',小先知:'📢',福音书:'✝️',保罗书信:'✉️',普通书信:'📨',预言:'🌅'};
const byId={};B.forEach((b,i)=>{b.i=i;b.ch=CH[i];byId[b.id]=b});
const $=id=>document.getElementById(id);
const strip=s=>s.replace(/<[^>]+>/g,'');
// ---------- 书架 ----------
if($('shelf')){$('shelf').innerHTML=B.map(b=>`<a class="spine" href="#${b.id}" title="${b.n} · ${b.ch} 章" style="--h:${Math.max(28,Math.sqrt(b.ch)*13)}px;--c:${C[b.g]};--d:${b.i*14}ms"><span>${b.n.replace(/(记|书|福音|纪|篇|言|歌)$/,'')}</span></a>`).join('')}
// ---------- 分组目录与卡片 ----------
const groups=[];B.forEach(b=>{const key=(b.i<39?'旧约 · ':'新约 · ')+b.g;let g=groups.find(x=>x.key===key);if(!g){g={key,g:b.g,items:[]};groups.push(g)}g.items.push(b)});
let toc='',list='';
groups.forEach(gr=>{toc+=`<div class="grp">${IC[gr.g]} ${gr.key}（${gr.items.length}）</div>`;
 list+=`<section id="g-${gr.items[0].id}" class="bgrp" data-g="${gr.g}"><h2>${IC[gr.g]} ${gr.key} <span class="tag">${gr.items.length} 卷</span></h2>`;
 gr.items.forEach(b=>{toc+=`<a href="#${b.id}">${b.n}</a>`;
  const rel=(R[b.id]||[]).map(([t,why])=>byId[t]?`<a class="relchip" href="#${t}" style="--c:${C[byId[t].g]}"><b>${byId[t].n}</b><small>${why}</small></a>`:'').join('');
  const pos=(b.i+.5)/66*100;
  const X=(window.BX||{})[b.id]||{};const kv=X.v||b.v;
  const kc=(X.kc||[]).map(([c,t])=>`<span class="kc"><b>${c}</b>${t}</span>`).join('');
  list+=`<details class="book bk" id="${b.id}" data-g="${b.g}" data-s="${strip(b.n+b.k+b.core+b.why+b.mem+b.cx+kv+(X.bg||''))}" style="--c:${C[b.g]}">
<summary><span class="bno">${b.i+1}</span><span class="bn">${b.n}</span><span class="tag">${b.k}</span><span class="meta">✍️ ${b.a} · 🕰️ ${b.t} · 📖 ${b.ch} 章</span></summary>
<div class="bkbody">
<div class="poswrap" title="在 66 卷中的位置"><div class="posbar"><i style="left:${pos}%"></i></div><small>旧约 39</small><small style="left:59%">新约 27</small></div>
<dl>
<dt>🔑 钥节</dt><dd class="kvs">${kv.split('；').map(s=>{const m=s.match(/^(.*?)（(.*)）$/);return m?`<span class="kvi"><b class="d">${m[1]}</b><em>${m[2]}</em></span>`:`<span class="kvi"><b class="d">${s}</b></span>`}).join('')}</dd>
${X.bg?`<dt>🏺 写作背景</dt><dd>${X.bg}</dd>`:''}
<dt>❓ 为什么写</dt><dd>${b.why}</dd>
<dt>🗂️ 结构</dt><dd class="stx">${b.st}</dd>
${kc?`<dt>📍 重点章节</dt><dd><div class="kcs">${kc}</div></dd>`:''}
<dt>🎯 核心</dt><dd><div class="box key" style="margin:0">${b.core}</div></dd>
<dt>✝️ 指向基督</dt><dd>${b.cx}</dd>
<dt>⚠️ 难点</dt><dd>${b.hard}</dd>
<dt>📜 信条</dt><dd>${b.cf}</dd>
<dt>🌱 应用</dt><dd>${b.app}</dd>
<dt>🧠 口诀</dt><dd><span class="m">${b.mem}</span></dd>
${rel?`<dt>🔗 关联书卷</dt><dd><div class="rels">${rel}</div></dd>`:''}
</dl>
<div class="bknav">${b.i>0?`<a class="btn" href="#${B[b.i-1].id}">← ${B[b.i-1].n}</a>`:'<span></span>'}${b.i<65?`<a class="btn" href="#${B[b.i+1].id}">${B[b.i+1].n} →</a>`:''}</div>
</div></details>`});
 list+='</section>'});
$('toc').innerHTML=toc;$('list').innerHTML=list;
// 结构文本：把“｜”切成彩色段
document.querySelectorAll('.stx').forEach(d=>{const parts=d.innerHTML.split('｜');if(parts.length>1)d.innerHTML='<div class="segs">'+parts.map((p,i)=>`<span style="--k:${i}">${p}</span>`).join('')+'</div>'});
// ---------- 分布条 ----------
$('gbar').innerHTML=groups.map(gr=>`<a href="#g-${gr.items[0].id}" title="${gr.key}" data-n="${gr.items.length}" style="flex:${gr.items.length};background:${C[gr.g]}">${(gr.items.length===1?gr.items[0].n:gr.g)+' '+gr.items.length}</a>`).join('');
// ---------- 筛选 ----------
const chips=$('chips');chips.innerHTML='<button class="btn on" data-g="">全部 66</button>'+G.map(g=>`<button class="btn" data-g="${g}">${IC[g]} ${g}</button>`).join('')+'<button class="btn" id="openAll">展开全部</button><button class="btn" id="flashBtn">🃏 闪卡</button>';
let cur='';const apply=()=>{const q=$('q').value.trim();
 document.querySelectorAll('details.bk').forEach(d=>{const ok=(!cur||d.dataset.g===cur)&&(!q||d.dataset.s.includes(q));d.hidden=!ok;if(q&&ok)d.open=true});
 document.querySelectorAll('.bgrp').forEach(s=>s.hidden=![...s.querySelectorAll('details.bk')].some(d=>!d.hidden));
 document.querySelectorAll('.flash[data-g]').forEach(f=>f.hidden=!!cur&&f.dataset.g!==cur)};
chips.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{cur=b.dataset.g;chips.querySelectorAll('[data-g]').forEach(x=>x.classList.toggle('on',x===b));apply()});
$('openAll').onclick=e=>{const o=e.target.classList.toggle('on');document.querySelectorAll('details.bk').forEach(d=>d.open=o);e.target.textContent=o?'收起全部':'展开全部';window.CC&&CC.lenis&&CC.lenis.resize()};
$('q').oninput=apply;
// ---------- 闪卡 ----------
const cards=$('cards');
cards.innerHTML=B.map(b=>`<div class="flash" data-g="${b.g}"><div class="in"><div class="f" style="background:linear-gradient(135deg,${C[b.g]},var(--acc2))"><b style="font-size:1.4rem">${b.n}</b><span>${b.k}</span><small style="opacity:.85">${IC[b.g]} ${b.g} · 点我翻面</small></div><div class="bk"><div style="font-size:.9rem">${b.core}</div><div style="margin-top:8px"><span class="m">${b.mem}</span></div></div></div></div>`).join('');
$('flashBtn').onclick=e=>{const on=e.target.classList.toggle('on');cards.hidden=!on;$('list').hidden=on};
cards.hidden=true;
// ---------- 打开锚点 ----------
function openHash(){const id=decodeURIComponent(location.hash.slice(1));const d=id&&document.getElementById(id);if(d){if(d.tagName==='DETAILS')d.open=true;setTimeout(()=>{const y=d.getBoundingClientRect().top+scrollY-100;window.CC&&CC.lenis?CC.lenis.scrollTo(y,{immediate:true}):scrollTo(0,y)},80)}}
addEventListener('hashchange',openHash);addEventListener('load',openHash);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const d=document.getElementById(a.getAttribute('href').slice(1));if(d&&d.tagName==='DETAILS'){d.open=true;d.classList.remove('flashhi');void d.offsetWidth;d.classList.add('flashhi')}},true);
// ---------- 关联网络图 ----------
const net=$('net');
if(net){const W=760,cx=W/2,cy=W/2,r=W/2-70;const pt=i=>{const a=-Math.PI/2+i/66*Math.PI*2;return[cx+r*Math.cos(a),cy+r*Math.sin(a),a]};
 let edges='',nodes='',seen=new Set();
 B.forEach(b=>(R[b.id]||[]).forEach(([t])=>{const o=byId[t];if(!o)return;const k=[b.id,t].sort().join('-');if(seen.has(k))return;seen.add(k);const[x1,y1]=pt(b.i),[x2,y2]=pt(o.i);
  edges+=`<path class="e" data-a="${b.id}" data-b="${t}" d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="${C[b.g]}"/>`}));
 B.forEach(b=>{const[x,y,a]=pt(b.i),lx=cx+(r+16)*Math.cos(a),ly=cy+(r+16)*Math.sin(a),deg=a*180/Math.PI,flip=Math.cos(a)<0;
  nodes+=`<g class="n" data-id="${b.id}"><circle cx="${x}" cy="${y}" r="${3+Math.sqrt(b.ch)/2.2}" fill="${C[b.g]}"/><text x="${lx}" y="${ly}" font-size="11" text-anchor="${flip?'end':'start'}" dominant-baseline="middle" transform="rotate(${flip?deg+180:deg} ${lx} ${ly})">${b.n.replace(/(记|书|福音|纪|篇|言|歌)$/,'')}</text></g>`});
 net.innerHTML=`<svg viewBox="0 0 ${W} ${W}" role="img" aria-label="书卷关联网络">${edges}${nodes}</svg>`;
 const info=$('netInfo');
 const hi=id=>{net.classList.toggle('focus',!!id);net.querySelectorAll('.e').forEach(e=>e.classList.toggle('on',e.dataset.a===id||e.dataset.b===id));
  net.querySelectorAll('.n').forEach(n=>n.classList.toggle('on',n.dataset.id===id||[...net.querySelectorAll('.e.on')].some(e=>e.dataset.a===n.dataset.id||e.dataset.b===n.dataset.id)));
  if(id&&info){const b=byId[id];const links=[];B.forEach(x=>(R[x.id]||[]).forEach(([t,w])=>{if(x.id===id&&byId[t])links.push([t,w]);else if(t===id)links.push([x.id,w])}));
   info.innerHTML=`<b style="color:${C[b.g]}">${b.n}</b> 的关联：`+links.map(([t,w])=>`<a class="relchip" href="#${t}" style="--c:${C[byId[t].g]}"><b>${byId[t].n}</b><small>${w}</small></a>`).join('')}};
 net.addEventListener('pointerover',e=>{const n=e.target.closest('.n');if(n)hi(n.dataset.id)});
 net.addEventListener('click',e=>{const n=e.target.closest('.n');if(n)hi(n.dataset.id)});
 $('netCount')&&($('netCount').textContent=seen.size)}
})();
