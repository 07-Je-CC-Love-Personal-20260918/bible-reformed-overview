(function(){
  if(!window.L||!document.getElementById('map'))return;
  const map=L.map('map',{scrollWheelZoom:false}).setView([31.5,38],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:12,attribution:'© OpenStreetMap'}).addTo(map);
  const C={patri:'#5f8a2e',exodus:'#c93c3c',kingdom:'#b5562b',empire:'#6b3fb5',nt:'#2f6f8f'};
  const P=[
   ['patri','吾珥','亚伯拉罕的出发地（创 11:31）',30.96,46.10],
   ['patri','哈兰','亚伯拉罕蒙召（创 12:1）',36.86,39.03],
   ['patri','示剑','神应许“我要把这地赐给你的后裔”',32.21,35.28],
   ['patri','别是巴','以撒、雅各的居所',31.25,34.79],
   ['patri','希伯仑·麦比拉洞','族长的墓地',31.53,35.10],
   ['exodus','兰塞','出埃及的起点（出 12:37）',30.80,31.83],
   ['exodus','红海','过红海（出 14）',29.9,32.6],
   ['exodus','西乃山','立约、颁布十诫（传统地点）',28.54,33.97],
   ['exodus','加低斯巴尼亚','12 探子，40 年漂流（民 13–14）',30.69,34.49],
   ['exodus','尼波山','摩西观看应许地（申 34）',31.77,35.73],
   ['exodus','耶利哥','进迦南第一战（书 6）',31.87,35.44],
   ['kingdom','耶路撒冷','大卫之城、圣殿',31.778,35.235],
   ['kingdom','撒玛利亚','北国首都（暗利建）',32.28,35.20],
   ['kingdom','但','耶罗波安的金牛犊',33.25,35.65],
   ['kingdom','伯特利','耶罗波安的金牛犊',31.93,35.22],
   ['kingdom','迦密山','以利亚对决巴力（王上 18）',32.67,35.05],
   ['empire','尼尼微','亚述首都（约拿、那鸿）',36.36,43.15],
   ['empire','巴比伦','被掳之地（但以理）',32.54,44.42],
   ['empire','苏萨（书珊）','波斯王宫（以斯帖、尼希米）',32.19,48.25],
   ['empire','孟菲斯','埃及古都',29.85,31.25],
   ['nt','伯利恒','基督降生',31.70,35.20],
   ['nt','拿撒勒','耶稣的家乡',32.70,35.30],
   ['nt','迦百农','加利利事工的中心',32.88,35.57],
   ['nt','安提阿','外邦宣教的基地（徒 13）',36.20,36.16],
   ['nt','以弗所','保罗驻留 3 年',37.94,27.34],
   ['nt','哥林多','保罗书信',37.91,22.88],
   ['nt','罗马','保罗殉道',41.90,12.49],
   ['nt','拔摩岛','启示录',37.31,26.55]];
  const groups={};
  P.forEach(([g,n,d,la,lo])=>{(groups[g]=groups[g]||L.layerGroup().addTo(map));
    L.circleMarker([la,lo],{radius:7,color:'#fff',weight:2,fillColor:C[g],fillOpacity:.95}).bindPopup('<b>'+n+'</b><br>'+d).bindTooltip(n).addTo(groups[g])});
  const routes={patri:[[30.96,46.10],[36.86,39.03],[32.21,35.28],[31.53,35.10]],
    exodus:[[30.80,31.83],[29.9,32.6],[28.54,33.97],[30.69,34.49],[31.77,35.73],[31.87,35.44]]};
  Object.entries(routes).forEach(([g,r])=>L.polyline(r,{color:C[g],weight:3,dashArray:'8 6'}).addTo(groups[g]));
  document.querySelectorAll('#mapTabs .btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#mapTabs .btn').forEach(x=>x.classList.toggle('on',x===b));
    const l=b.dataset.l;Object.entries(groups).forEach(([g,lg])=>{if(l==='all'||l===g)lg.addTo(map);else map.removeLayer(lg)});
    const ls=Object.entries(groups).filter(([g])=>l==='all'||l===g).flatMap(([,lg])=>lg.getLayers().filter(x=>x.getLatLng).map(x=>x.getLatLng()));
    if(ls.length)map.fitBounds(L.latLngBounds(ls).pad(.2))}));
})();
