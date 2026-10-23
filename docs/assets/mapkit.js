// 地图工具：① 离线概念示意图（SVG，永远可用） ② 实时地图（多个底图源自动切换）
(function(){
// ---------- 实时地图：底图源依次尝试 ----------
const PROVIDERS=[
 ['Esri 地形','https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}','© Esri'],
 ['CARTO','https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png','© OpenStreetMap © CARTO'],
 ['Esri 影像','https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}','© Esri'],
 ['OSM','https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png','© OpenStreetMap']];
window.CCMap=function(el,o){if(!window.L||!el)return null;o=o||{};
 const map=L.map(el,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView(o.center||[32,36],o.zoom||5);
 let k=0,layer=null,ok=0,bad=0,timer=null;
 const badge=L.control({position:'topright'});badge.onAdd=()=>{const d=L.DomUtil.create('div','mapbadge');d.innerHTML='🛰️ 加载中';L.DomEvent.on(d,'click',()=>use((k+1)%PROVIDERS.length));return d};badge.addTo(map);
 function use(i){k=i;ok=0;bad=0;if(layer)map.removeLayer(layer);const[p,u,a]=PROVIDERS[i];
  layer=L.tileLayer(u,{maxZoom:12,attribution:a,crossOrigin:true}).addTo(map);
  layer.on('tileload',()=>{ok++;badge.getContainer().innerHTML='🛰️ '+p+' · 点此换底图'});
  layer.on('tileerror',()=>{bad++;if(ok===0&&bad>=4)next()});
  clearTimeout(timer);timer=setTimeout(()=>{if(ok===0)next()},5000)}
 function next(){if(k<PROVIDERS.length-1)use(k+1);else{badge.getContainer().innerHTML='⚠️ 实时底图暂时无法加载，请看上方示意图';el.classList.add('nomap')}}
 const det=el.closest('details');
 if(det&&!det.open){det.addEventListener('toggle',function f(){if(det.open){map.invalidateSize();if(!layer)use(0);if(o.onOpen)o.onOpen()}},{passive:true})}else use(0);
 if(det)det.addEventListener('toggle',()=>setTimeout(()=>map.invalidateSize(),50));
 setTimeout(()=>map.invalidateSize(),300);
 return map};

// ---------- 概念示意图 ----------
const COAST=[
 [[31.2,25],[31.3,29.9],[31.5,31.2],[31.1,32.3],[31.2,33.1],[31.5,34.4],[32.1,34.77],[32.8,34.98],[33.27,35.2],[33.9,35.5],[34.9,35.85],[35.5,35.78],[36.2,35.9],[36.6,36.2],[36.8,36.0],[36.6,34.9],[36.8,34.6],[36.2,33.6],[36.05,32.8],[36.6,31.8],[36.85,30.7],[36.3,30.1],[36.2,29.4],[36.6,28.0],[37.0,27.4],[37.9,27.3],[38.4,26.8],[39.0,26.9],[39.5,26.2],[40.0,26.2],[40.6,26.6],[40.9,25.5],[40.9,24.4],[40.6,23.0],[40.0,22.6],[39.4,22.9],[38.4,23.6],[38.0,24.0],[37.6,23.2],[37.0,22.5],[36.5,22.4],[37.0,21.6],[38.3,21.4],[39.5,20.2],[40.5,19.4],[41.8,19.5],[42.6,18.1]],
 [[45.6,13.7],[44.4,12.3],[43.6,13.5],[42.0,15.4],[41.9,16.1],[41.1,16.9],[40.6,17.9],[40.0,18.4],[40.4,17.2],[39.4,17.1],[38.9,16.6],[38.0,16.1],[37.95,15.65],[38.3,15.65],[38.9,16.1],[39.9,15.7],[40.6,14.3],[41.2,13.6],[41.7,12.5],[42.4,11.2],[43.5,10.3],[44.1,9.6]],
 [[38.2,15.6],[37.0,15.3],[36.7,15.1],[37.1,14.2],[37.6,12.6],[38.1,12.6],[38.2,13.4],[38.0,14.5],[38.2,15.6]],
 [[35.3,23.6],[35.5,24.2],[35.3,25.6],[35.3,26.3],[35.0,26.2],[35.0,24.8],[35.2,23.6]],
 [[35.1,32.3],[35.4,33.0],[35.6,34.6],[35.0,34.0],[34.6,33.0],[34.7,32.4],[35.1,32.3]],
 [[29.97,32.55],[27.9,33.6],[24,35.5]],[[29.5,34.95],[28.0,34.4],[24.5,37.5]],
 [[30.0,48.0],[29.4,48.0],[28.5,48.6],[27.0,50.0]],[[30.0,48.0],[30.4,49.5],[29.0,50.8],[27.5,52.0]]];
const RIVER={尼罗河:[[31.4,31.4],[30.05,31.25],[27.2,31.2],[25.7,32.6],[24.1,32.9]],幼发拉底河:[[38.4,38.5],[37.0,38.0],[36.0,38.2],[35.0,40.5],[34.4,41.0],[33.4,43.3],[32.5,44.4],[31.0,46.0],[30.5,47.5]],底格里斯河:[[38.0,40.2],[36.36,43.15],[35.0,43.6],[33.3,44.4],[32.0,45.8],[31.0,47.4]],约旦河:[[33.25,35.62],[32.85,35.6],[32.7,35.57],[32.2,35.55],[31.78,35.55]]};
const LAKES=[[[32.9,35.55],[32.88,35.65],[32.72,35.63],[32.72,35.55],[32.9,35.55]],[[31.76,35.46],[31.75,35.55],[31.45,35.58],[31.05,35.46],[31.3,35.4],[31.76,35.46]]];
const REG=[['埃 及',27.5,30.5],['迦 南',31.6,35.0],['美索不达米亚',34.6,41.5],['亚 述',36.8,43.5],['巴比伦',31.8,45.2],['波 斯',30.8,51.5],['阿拉伯',27.0,40.0],['小亚细亚',38.8,32.5],['马其顿',41.2,22.8],['亚该亚',37.6,22.0],['意大利',41.7,14.2],['地 中 海',34.0,21.0,1],['红 海',26.0,35.3,1],['西 奈',29.2,33.9],['加利利',32.95,35.3],['犹 太',31.45,34.95],['撒玛利亚',32.12,35.5],['加利利海',32.85,35.9,1],['盐 海',31.4,35.75,1]];
window.CCConcept=function(el,o){if(!el)return null;const b=o.bounds.slice();const W=o.w||1000,K=1.18,MAX=o.maxRatio||.72,MIN=.48;
 let r=(b[1]-b[0])*K/(b[3]-b[2]);
 if(r>MAX){const span=(b[1]-b[0])*K/MAX,c=(b[2]+b[3])/2;b[2]=c-span/2;b[3]=c+span/2;r=MAX}
 if(r<MIN){const span=(b[3]-b[2])*MIN/K,c=(b[0]+b[1])/2;b[0]=c-span/2;b[1]=c+span/2;r=MIN}
 const H=Math.round(W*r);
 const X=lng=>(lng-b[2])/(b[3]-b[2])*W,Y=lat=>(b[1]-lat)/(b[1]-b[0])*H;const P=pts=>pts.map(([a,c])=>`${X(c).toFixed(1)},${Y(a).toFixed(1)}`).join(' ');
 const inb=(a,c)=>a>=b[0]-3&&a<=b[1]+3&&c>=b[2]-3&&c<=b[3]+3;
 let s=`<svg viewBox="0 0 ${W} ${H}" class="concept" role="img" aria-label="${o.title||'示意图'}"><defs><pattern id="wv${o.id}" width="22" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 Q5.5 0 11 5 T22 5" fill="none" stroke="var(--acc2)" stroke-opacity=".12"/></pattern><filter id="gl${o.id}"><feGaussianBlur stdDeviation="2"/></filter></defs>`;
 s+=`<rect width="${W}" height="${H}" fill="url(#wv${o.id})"/>`;
 // 经纬网
 for(let lat=Math.ceil(b[0]);lat<=b[1];lat+=(b[1]-b[0]>8?5:1))s+=`<line x1="0" x2="${W}" y1="${Y(lat)}" y2="${Y(lat)}" stroke="var(--line)" stroke-dasharray="2 6"/>`;
 COAST.forEach(c=>{if(c.some(([a,l])=>inb(a,l)))s+=`<polyline points="${P(c)}" fill="none" stroke="var(--acc2)" stroke-width="2.4" stroke-opacity=".55" stroke-linejoin="round" stroke-linecap="round"/>`});
 LAKES.forEach(c=>{if(c.some(([a,l])=>inb(a,l)))s+=`<polygon points="${P(c)}" fill="var(--acc2)" fill-opacity=".25" stroke="var(--acc2)" stroke-opacity=".5"/>`});
 Object.entries(RIVER).forEach(([n,c])=>{if(c.some(([a,l])=>inb(a,l))){s+=`<polyline points="${P(c)}" fill="none" stroke="#3b82c4" stroke-width="2" stroke-opacity=".7" stroke-linecap="round"/>`;const m=c[Math.floor(c.length/2)];if(inb(m[0],m[1]))s+=`<text x="${X(m[1])+6}" y="${Y(m[0])}" font-size="11" fill="#3b82c4" font-style="italic">${n}</text>`}});
 REG.forEach(([n,a,l,sea])=>{if(n==='迦 南'&&b[1]-b[0]<5)return;if(['加利利','犹 太','撒玛利亚','加利利海','盐 海'].includes(n)&&b[1]-b[0]>8)return;if(a>b[0]&&a<b[1]&&l>b[2]&&l<b[3])s+=`<text x="${X(l)}" y="${Y(a)}" text-anchor="middle" font-size="${sea?14:15}" font-weight="800" fill="${sea?'#3b82c4':'var(--sub)'}" fill-opacity="${sea?.55:.45}" letter-spacing="2">${n}</text>`});
 // 路线
 (o.routes||[]).forEach((r,i)=>{s+=`<polyline class="croute" data-i="${i}" points="${P(r.pts)}" fill="none" stroke="${r.c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" ${r.dash?'stroke-dasharray="7 6"':''}/>`});
 // 地点
 (o.points||[]).forEach(p=>{if(!inb(p.lat,p.lng))return;s+=`<g class="cpt" data-g="${p.g||''}"><circle cx="${X(p.lng)}" cy="${Y(p.lat)}" r="${p.big?7:5}" fill="${p.c||'var(--acc)'}" stroke="#fff" stroke-width="1.6"><title>${p.n}${p.d?'：'+p.d.replace(/<[^>]+>/g,''):''}</title></circle><text x="${X(p.lng)+(p.left?-8:8)}" y="${Y(p.lat)+4}" font-size="${p.big?13:11.5}" font-weight="${p.big?800:600}" text-anchor="${p.left?'end':'start'}" paint-order="stroke" stroke="var(--bg)" stroke-width="3">${p.n}</text></g>`});
 s+=`<g class="cmk" style="display:none"><circle r="14" fill="var(--red)" opacity=".25"><animate attributeName="r" values="8;18;8" dur="1.6s" repeatCount="indefinite"/></circle><circle r="7" fill="var(--red)" stroke="#fff" stroke-width="2"/></g>`;
 s+=`<text x="${W-8}" y="${H-8}" text-anchor="end" font-size="10" fill="var(--sub)">示意图 · 比例与海岸线为概略</text></svg>`;
 el.innerHTML=s;const svg=el.querySelector('svg');
 const api={X,Y,svg,
  show(i,anim){svg.querySelectorAll('.croute').forEach(p=>{const on=i<0||+p.dataset.i===i;p.style.display=on?'':'none';if(on&&anim){const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset '+(o.speed||3)+'s ease-in-out';p.style.strokeDashoffset=0}else if(on){p.style.transition='none';p.style.strokeDashoffset=0;p.style.strokeDasharray=o.routes[+p.dataset.i].dash?'7 6':'none'}})},
  group(g){svg.querySelectorAll('.cpt').forEach(n=>n.style.display=!g||n.dataset.g===g?'':'none')},
  mark(lat,lng){const m=svg.querySelector('.cmk');m.style.display='';m.setAttribute('transform',`translate(${X(lng)},${Y(lat)})`);m.style.transition='transform .8s cubic-bezier(.2,.8,.2,1)'}};
 return api};
})();
