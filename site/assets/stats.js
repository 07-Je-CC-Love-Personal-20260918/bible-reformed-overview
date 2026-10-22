// 圣经统计可视化（章数为通用分章；节数按 KJV 分节，和合本略有出入）
(function(){
const D=[
['创','律法',50,1533],['出','律法',40,1213],['利','律法',27,859],['民','律法',36,1288],['申','律法',34,959],
['书','历史',24,658],['士','历史',21,618],['得','历史',4,85],['撒上','历史',31,810],['撒下','历史',24,695],['王上','历史',22,816],['王下','历史',25,719],['代上','历史',29,942],['代下','历史',36,822],['拉','历史',10,280],['尼','历史',13,406],['斯','历史',10,167],
['伯','诗歌',42,1070],['诗','诗歌',150,2461],['箴','诗歌',31,915],['传','诗歌',12,222],['歌','诗歌',8,117],
['赛','大先知',66,1292],['耶','大先知',52,1364],['哀','大先知',5,154],['结','大先知',48,1273],['但','大先知',12,357],
['何','小先知',14,197],['珥','小先知',3,73],['摩','小先知',9,146],['俄','小先知',1,21],['拿','小先知',4,48],['弥','小先知',7,105],['鸿','小先知',3,47],['哈','小先知',3,56],['番','小先知',3,53],['该','小先知',2,38],['亚','小先知',14,211],['玛','小先知',4,55],
['太','福音书',28,1071],['可','福音书',16,678],['路','福音书',24,1151],['约','福音书',21,879],['徒','历史·新',28,1007],
['罗','保罗书信',16,433],['林前','保罗书信',16,437],['林后','保罗书信',13,257],['加','保罗书信',6,149],['弗','保罗书信',6,155],['腓','保罗书信',4,104],['西','保罗书信',4,95],['帖前','保罗书信',5,89],['帖后','保罗书信',3,47],['提前','保罗书信',6,113],['提后','保罗书信',4,83],['多','保罗书信',3,46],['门','保罗书信',1,25],
['来','普通书信',13,303],['雅','普通书信',5,108],['彼前','普通书信',5,105],['彼后','普通书信',3,61],['约一','普通书信',5,105],['约二','普通书信',1,13],['约三','普通书信',1,14],['犹','普通书信',1,25],['启','预言',22,404]];
const C={律法:'#b5562b',历史:'#2f6f8f',诗歌:'#5f8a2e',大先知:'#c93c3c',小先知:'#b8860b',福音书:'#d4a017','历史·新':'#0e7490',保罗书信:'#6b3fb5',普通书信:'#c2185b',预言:'#1b1b1b'};
const sum=(a,i)=>a.reduce((s,x)=>s+x[i],0),OT=D.slice(0,39),NT=D.slice(39);
const $=id=>document.getElementById(id);
// KPI
if($('kpi'))$('kpi').innerHTML=[['📚','卷',66],['📖','章',sum(D,2)],['🔢','节',sum(D,3).toLocaleString()],['🕰️','年跨度','约 1500'],['✍️','作者','约 40']].map(([i,n,v])=>`<div class="card kp"><div class="kv">${v}</div><div>${i} ${n}</div></div>`).join('');
// 章数柱状图
function bars(id,arr,idx,label){const el=$(id);if(!el)return;const W=1000,H=260,pad=30,bw=(W-pad*2)/arr.length,max=Math.max(...arr.map(x=>x[idx]));
 let s=`<svg viewBox="0 0 ${W} ${H+46}" role="img" aria-label="${label}">`;
 [0.25,.5,.75,1].forEach(f=>{const y=H-(H-20)*f;s+=`<line x1="${pad}" x2="${W-pad}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${pad-4}" y="${y+4}" text-anchor="end" font-size="10" fill="var(--sub)">${Math.round(max*f)}</text>`});
 arr.forEach((b,i)=>{const h=(H-20)*b[idx]/max,x=pad+i*bw;s+=`<g class="sb"><rect x="${x+1}" y="${H-h}" width="${Math.max(1,bw-2)}" height="${h}" rx="2" fill="${C[b[1]]}" style="--d:${i*12}ms"><title>${b[0]}：${b[idx]} ${idx==2?'章':'节'}</title></rect>${arr.length<=40||i%1===0?`<text x="${x+bw/2}" y="${H+12}" font-size="${arr.length>40?8:10}" text-anchor="middle" fill="var(--sub)" transform="rotate(${arr.length>40?60:0} ${x+bw/2} ${H+12})">${b[0]}</text>`:''}</g>`});
 el.innerHTML=s+'</svg>'}
bars('chChart',D,2,'各卷章数');
const tg=$('chTog');if(tg)tg.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{tg.querySelectorAll('.btn').forEach(x=>x.classList.toggle('on',x===b));const k=b.dataset.k;
 bars('chChart',k==='ot'?OT:k==='nt'?NT:D,b.dataset.i?+b.dataset.i:2,'各卷')}));
// 环形图：按类别的节数
function donut(id,arr){const el=$(id);if(!el)return;const g={};arr.forEach(x=>g[x[1]]=(g[x[1]]||0)+x[3]);const T=Object.values(g).reduce((a,b)=>a+b,0);
 let a0=-Math.PI/2,s=`<svg viewBox="0 0 300 300" role="img" aria-label="类别占比">`,leg="";const cx=150,cy=150,r=110,ri=62;
 Object.entries(g).forEach(([k,v])=>{const a1=a0+v/T*Math.PI*2,lg=a1-a0>Math.PI?1:0,p=(a,R)=>[cx+R*Math.cos(a),cy+R*Math.sin(a)];const[x0,y0]=p(a0,r),[x1,y1]=p(a1,r),[x2,y2]=p(a1,ri),[x3,y3]=p(a0,ri);
  s+=`<path d="M${x0} ${y0}A${r} ${r} 0 ${lg} 1 ${x1} ${y1}L${x2} ${y2}A${ri} ${ri} 0 ${lg} 0 ${x3} ${y3}Z" fill="${C[k]}" stroke="var(--bg)" stroke-width="2"><title>${k} ${v} 节</title></path>`;
  leg+=`<span><i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${C[k]};margin-right:6px;vertical-align:-1px"></i>${k} <b>${(v/T*100).toFixed(1)}%</b></span>`;a0=a1});
 s+=`<text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="20" font-weight="800">${T.toLocaleString()}</text><text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="12" fill="var(--sub)">节</text>`;el.innerHTML=`<div class="donutwrap">${s}</svg><div class="legend dleg">${leg}</div></div>`}
donut('donut',D);
// 新旧约比例
if($('otnt')){const o=sum(OT,3),n=sum(NT,3),oc=sum(OT,2),nc=sum(NT,2);$('otnt').innerHTML=`<div class="gbar" style="height:40px"><div style="flex:${o};background:var(--acc)">旧约 ${o.toLocaleString()} 节 · ${oc} 章 · ${(o/(o+n)*100).toFixed(0)}%</div><div style="flex:${n};background:var(--acc2)">新约 ${n.toLocaleString()} 节 · ${nc} 章</div></div>`}
// 前十长 / 前十短
const rank=(id,arr)=>{const el=$(id);if(!el)return;const m=Math.max(...arr.map(x=>x[3]));el.innerHTML=arr.map(b=>`<div class="row"><b>${b[0]}</b><div class="bar" style="--v:${b[3]/m};background:${C[b[1]]}"></div><span>${b[3]}</span></div>`).join('')};
rank('longest',[...D].sort((a,b)=>b[3]-a[3]).slice(0,10));
rank('shortest',[...D].sort((a,b)=>a[3]-b[3]).slice(0,10));
// 作者
const A=[['保罗',13],['摩西',5],['约翰',5],['所罗门',3],['路加',2],['彼得',2],['耶利米',2]];
if($('authors')){$('authors').innerHTML=A.map(([n,v])=>`<div class="row"><b>${n}</b><div class="bar" style="--v:${v/13}"></div><span>${v} 卷</span></div>`).join('')}
// 进场触发
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll('.bars,.chartbox').forEach(x=>io.observe(x));
})();
