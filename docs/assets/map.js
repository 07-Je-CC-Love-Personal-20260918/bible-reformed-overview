// 全景页地图：概念图 + 实时地图
(function(){
const C={patri:'#5f8a2e',exodus:'#c93c3c',kingdom:'#b5562b',empire:'#6b3fb5',nt:'#2f6f8f'};
const N={patri:'⭐ 族长：从吾珥到迦南，约前 2100–1800',exodus:'🔥 出埃及：从兰塞经西乃到摩押，前 1446–1406',kingdom:'👑 王国：耶路撒冷（南）与撒玛利亚（北），前 1050–586',empire:'🏛️ 帝国首都：神用列国管教以色列',nt:'✝️ 新约：从伯利恒到罗马'};
const P=[
['patri','吾珥','亚伯拉罕的出发地（创 11:31）',30.96,46.10],['patri','哈兰','亚伯拉罕蒙召（创 12:1）',36.86,39.03],['patri','示剑','“我要把这地赐给你的后裔”',32.21,35.28],['patri','别是巴','以撒、雅各的居所',31.25,34.79],['patri','希伯仑','麦比拉洞，族长的墓地',31.53,35.10],
['exodus','兰塞','出埃及的起点（出 12:37）',30.80,31.83],['exodus','过红海','出 14',29.9,32.6],['exodus','西乃山','立约、十诫（传统地点）',28.54,33.97],['exodus','加低斯','12 探子，漂流 40 年（民 13–14）',30.69,34.49],['exodus','尼波山','摩西观看应许地（申 34）',31.77,35.73],['exodus','耶利哥','进迦南第一战（书 6）',31.87,35.44],
['kingdom','耶路撒冷','大卫之城、圣殿',31.778,35.235],['kingdom','撒玛利亚','北国首都（暗利建）',32.28,35.20],['kingdom','但','耶罗波安的金牛犊',33.25,35.65],['kingdom','伯特利','耶罗波安的金牛犊',31.93,35.22],['kingdom','迦密山','以利亚对决巴力（王上 18）',32.67,35.05],
['empire','尼尼微','亚述首都（约拿、那鸿）',36.36,43.15],['empire','巴比伦','被掳之地（但以理）',32.54,44.42],['empire','书珊','波斯王宫（以斯帖、尼希米）',32.19,48.25],['empire','孟菲斯','埃及古都',29.85,31.25],
['nt','伯利恒','基督降生',31.70,35.20],['nt','拿撒勒','耶稣的家乡',32.70,35.30],['nt','迦百农','加利利事工的中心',32.88,35.57],['nt','安提阿','外邦宣教的基地（徒 13）',36.20,36.16],['nt','以弗所','保罗驻留 3 年',37.94,27.34],['nt','哥林多','保罗书信',37.91,22.88],['nt','罗马','保罗殉道',41.90,12.49],['nt','拔摩岛','启示录',37.31,26.55]];
const ROUTES={patri:[[30.96,46.10],[33.5,43],[36.86,39.03],[34.5,37.2],[32.21,35.28],[31.53,35.10]],exodus:[[30.80,31.83],[29.9,32.6],[28.54,33.97],[30.69,34.49],[30.5,35.3],[31.77,35.73],[31.87,35.44]]};
const keys=Object.keys(C);
const BD={all:[27,42,10,50],patri:[28.5,38.5,30,49],exodus:[27.6,32.6,30.6,36.8],kingdom:[30.9,33.6,34.2,36.2],empire:[27.5,38,28,50],nt:[30.5,43,10,37]};
let concept=null;
const mk=l=>window.CCConcept&&CCConcept(document.getElementById('conceptMap'),{id:'ov'+l,bounds:BD[l],w:1000,
 points:P.map(([g,n,d,a,l])=>({g,n,d,lat:a,lng:l,c:C[g],big:['耶路撒冷','巴比伦','罗马','西乃山'].includes(n),left:['撒玛利亚','伯特利','但','迦密山','孟菲斯','示剑','拿撒勒'].includes(n)})),
 routes:[{c:C.patri,pts:ROUTES.patri},{c:C.exodus,pts:ROUTES.exodus,dash:1}],speed:3});
const map=window.CCMap&&CCMap(document.getElementById('realMap'),{center:[33,30],zoom:4});
const groups={};
if(map){P.forEach(([g,n,d,a,l])=>{(groups[g]=groups[g]||L.layerGroup().addTo(map));L.circleMarker([a,l],{radius:7,color:'#fff',weight:2,fillColor:C[g],fillOpacity:.95}).bindPopup('<b>'+n+'</b><br>'+d).bindTooltip(n).addTo(groups[g])});
 Object.entries(ROUTES).forEach(([g,r])=>L.polyline(r,{color:C[g],weight:3,dashArray:'8 6'}).addTo(groups[g]))}
const info=document.getElementById('mapInfo');
function pick(l){concept=mk(l);if(concept){concept.group(l==='all'?'':l);concept.show(l==='patri'?0:l==='exodus'?1:l==='all'?-1:99,l==='patri'||l==='exodus')}
 if(info)info.innerHTML=l==='all'?'五个时代的地点一起看：<span class="m">两河 → 迦南 → 埃及 → 迦南 → 两河 → 迦南 → 罗马</span>，救赎史在“新月沃土”上来回，最后走向地极。':`<b style="color:${C[l]}">${N[l]}</b><br>`+P.filter(p=>p[0]===l).map(p=>`<span class="pill" style="background:${C[l]}">${p[1]}</span> ${p[2]}`).join('　');
 if(map){Object.entries(groups).forEach(([g,lg])=>{if(l==='all'||l===g)lg.addTo(map);else map.removeLayer(lg)});
  const ls=P.filter(p=>l==='all'||p[0]===l).map(p=>[p[3],p[4]]);if(ls.length)map.fitBounds(L.latLngBounds(ls).pad(.25))}}
document.querySelectorAll('#mapTabs .btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#mapTabs .btn').forEach(x=>x.classList.toggle('on',x===b));pick(b.dataset.l)}));
pick('all');
})();
