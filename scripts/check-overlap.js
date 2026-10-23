const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const f of ['index.html','overview.html','gospels.html','acts.html','compare.html','kings.html','creeds.html','stats.html'])for(const w of [375,1280]){
const p=await b.newPage({viewport:{width:w,height:900}});await p.goto('file://'+process.cwd()+'/'+f);await p.waitForTimeout(900);
await p.evaluate(()=>{document.querySelectorAll('.reveal,.bars,.chartbox').forEach(e=>e.classList.add('in'));document.querySelectorAll('details').forEach(d=>d.open=true)});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const out=[];
 // 书脊文字是否超出
 document.querySelectorAll('.spine').forEach(s=>{const t=s.querySelector('span');if(t&&t.getBoundingClientRect().height>s.getBoundingClientRect().height-2)out.push('spine:'+t.textContent)});
 // SVG 文字两两重叠
 document.querySelectorAll('svg').forEach((svg,si)=>{if(svg.closest('.leaflet-container'))return;const ts=[...svg.querySelectorAll('text')].filter(t=>t.getClientRects().length&&t.textContent.trim()&&getComputedStyle(t).display!=='none'&&!t.closest('[style*="display: none"]')).map(t=>[t,t.getBoundingClientRect()]);
  for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){const a=ts[i][1],c=ts[j][1];const ox=Math.min(a.right,c.right)-Math.max(a.left,c.left),oy=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top);if(ox>3&&oy>3)out.push((svg.closest('[id]')||{}).id+':'+ts[i][0].textContent.slice(0,8)+'×'+ts[j][0].textContent.slice(0,8))}});
 // 文字被裁切的按钮/标签
 document.querySelectorAll('.btn,.tag,.pill,.gbar>a,.phases div').forEach(e=>{if(e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible')out.push('clip:'+e.textContent.trim().slice(0,10))});
 return out});
console.log(f,w,r.length,JSON.stringify(r.slice(0,14)));await p.close()}
await b.close()})();
