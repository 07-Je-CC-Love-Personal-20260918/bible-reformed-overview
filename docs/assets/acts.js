// 使徒行传：保罗旅程动态地图 + 新约历史多轨时间线
(function(){
const P={安提阿:[36.20,36.16],西流基:[36.12,35.92],撒拉米:[35.18,33.90],帕弗:[34.76,32.42],别加:[36.96,30.85],彼西底的安提阿:[38.30,31.19],以哥念:[37.87,32.49],路司得:[37.58,32.45],特庇:[37.35,33.36],亚大利:[36.89,30.70],
特罗亚:[39.75,26.16],尼亚坡里:[40.94,24.41],腓立比:[41.01,24.29],帖撒罗尼迦:[40.64,22.94],庇哩亚:[40.52,22.20],雅典:[37.98,23.73],哥林多:[37.91,22.88],坚革哩:[37.88,22.99],以弗所:[37.94,27.34],该撒利亚:[32.50,34.89],耶路撒冷:[31.778,35.235],
亚朔:[39.49,26.34],米利都:[37.53,27.28],罗底:[36.43,28.22],帕大喇:[36.26,29.31],推罗:[33.27,35.20],多利买:[32.92,35.07],西顿:[33.56,35.37],每拉:[36.26,29.98],佳澳:[34.93,24.80],米利大:[35.90,14.45],叙拉古:[37.07,15.29],利基翁:[38.11,15.65],部丢利:[40.82,14.12],罗马:[41.90,12.49],大马士革:[33.51,36.29]};
const J=[
 {n:'① 第一次旅程',t:'约 46–48 · 徒 13–14',c:'#c93c3c',r:['安提阿','西流基','撒拉米','帕弗','别加','彼西底的安提阿','以哥念','路司得','特庇','路司得','以哥念','彼西底的安提阿','别加','亚大利','安提阿'],note:'与巴拿巴同行；在居比路和加拉太南部建立教会；第一次向外邦人大开信道之门（14:27）'},
 {n:'② 第二次旅程',t:'约 49–52 · 徒 15:36–18:22',c:'#2f6f8f',r:['安提阿','特庇','路司得','以哥念','特罗亚','尼亚坡里','腓立比','帖撒罗尼迦','庇哩亚','雅典','哥林多','坚革哩','以弗所','该撒利亚','耶路撒冷','安提阿'],note:'与西拉、提摩太、路加同行；马其顿的异象使福音<b>首次进入欧洲</b>；在哥林多住了一年半，写下帖前、帖后'},
 {n:'③ 第三次旅程',t:'约 53–57 · 徒 18:23–21:17',c:'#5f8a2e',r:['安提阿','特庇','彼西底的安提阿','以弗所','特罗亚','腓立比','帖撒罗尼迦','哥林多','腓立比','特罗亚','亚朔','米利都','罗底','帕大喇','推罗','多利买','该撒利亚','耶路撒冷'],note:'在以弗所住了三年（19:10“亚细亚的人都听见了主的道”）；写下林前、林后、加、罗；在米利都与以弗所长老告别（20）'},
 {n:'④ 解往罗马',t:'约 59–60 · 徒 27–28',c:'#6b3fb5',r:['该撒利亚','西顿','每拉','佳澳','米利大','叙拉古','利基翁','部丢利','罗马'],note:'上诉于该撒；途中遭遇风暴，在米利大岛（马耳他）船破；在罗马租屋住了两年，“放胆传讲神国的道”（28:31）'}];
const mapEl=document.getElementById('actsMap');
const concept=window.CCConcept&&CCConcept(document.getElementById('actsConcept'),{id:'acts',bounds:[30.5,43.5,11,37.5],w:1000,speed:4,
 points:Object.entries(P).filter(([n])=>['安提阿','耶路撒冷','以弗所','哥林多','罗马','腓立比','帖撒罗尼迦','雅典','特罗亚','该撒利亚','米利大','路司得','彼西底的安提阿','帕弗','大马士革','米利都','部丢利','佳澳'].includes(n)).map(([n,[a,l]])=>({n,lat:a,lng:l,c:'#334155',big:['耶路撒冷','安提阿','以弗所','哥林多','罗马'].includes(n),left:['耶路撒冷','该撒利亚','米利都','雅典','哥林多','佳澳'].includes(n)})),
 routes:J.map(j=>({c:j.c,pts:j.r.map(n=>P[n])}))});
const map=window.CCMap&&CCMap(mapEl,{center:[37.5,26],zoom:5});
const lines=[];let timers=[];const info=document.getElementById('actsInfo');
if(map){const used=new Set();J.forEach(j=>j.r.forEach(x=>used.add(x)));used.add('大马士革');
 used.forEach(n=>L.circleMarker(P[n],{radius:4,color:'#fff',weight:1,fillColor:'#334155',fillOpacity:.85}).bindTooltip(n).addTo(map));
 J.forEach(j=>lines.push(L.polyline([],{color:j.c,weight:3.5,opacity:.9}).addTo(map)))}
function draw(k,anim){timers.forEach(clearInterval);timers=[];if(concept)concept.show(k,anim);
 if(map)J.forEach((j,i)=>{const show=k===-1||k===i;const pts=j.r.map(n=>P[n]);
  if(!show){lines[i].setLatLngs([]);return}
  if(!anim){lines[i].setLatLngs(pts);return}
  let s=1;lines[i].setLatLngs([pts[0]]);const tm=setInterval(()=>{s++;lines[i].setLatLngs(pts.slice(0,s));if(s>=pts.length)clearInterval(tm)},300);timers.push(tm)});
 if(k>=0){if(map)map.fitBounds(L.latLngBounds(J[k].r.map(n=>P[n])).pad(.15));info.innerHTML=`<b style="color:${J[k].c}">${J[k].n}</b> · <span class="d">${J[k].t}</span><br>${J[k].r.filter((x,i,a)=>a.indexOf(x)===i).join(' → ')}<br>${J[k].note}`}
 else{if(map)map.setView([37.5,26],5);info.innerHTML='四条路线一起看：福音从<span class="m">耶路撒冷 → 安提阿 → 小亚细亚 → 欧洲 → 罗马</span>，正是徒 1:8 的展开。'}}
const bt=document.getElementById('actsBtns');
if(bt){bt.innerHTML='<button class="btn on" data-k="-1">全部</button>'+J.map((j,i)=>`<button class="btn" data-k="${i}" style="border-color:${j.c}">${j.n}</button>`).join('')+'<button class="btn" id="actsPlay">▶ 依次播放</button>';
 bt.addEventListener('click',e=>{const b=e.target.closest('.btn');if(!b)return;bt.querySelectorAll('.btn').forEach(x=>x.classList.toggle('on',x===b));
  if(b.id==='actsPlay'){let k=0;draw(0,true);const t=setInterval(()=>{k++;if(k>3){clearInterval(t);return}draw(k,true)},4800);timers.push(t)}else draw(+b.dataset.k,+b.dataset.k>=0)});
 draw(-1,false)}
// ---------- 多轨时间线 ----------
const tl=document.getElementById('ntTimeline');if(!tl)return;
const X0=28,X1=100,W=1000,LX=110,Rm=14,sx=y=>LX+(y-X0)/(X1-X0)*(W-LX-Rm);
const tracks=[
 ['🔥 使徒行传',[[30,30,'五旬节'],[33,34,'司提反殉道·扫罗归主'],[40,40,'哥尼流'],[44,44,'雅各被杀'],[46,48,'①'],[49,49,'耶路撒冷会议'],[49,52,'②'],[53,57,'③'],[57,59,'该撒利亚被囚'],[59,60,'航海'],[60,62,'罗马软禁']],'#c93c3c'],
 ['✉️ 书信写成',[[45,49,'雅'],[48,49,'加'],[50,51,'帖前后'],[55,56,'林前后'],[57,57,'罗'],[60,62,'弗腓西门'],[62,64,'彼前·提前·多'],[64,67,'提后·彼后·来·犹'],[85,95,'约一二三·启']],'#6b3fb5'],
 ['📖 福音书',[[50,65,'太·可'],[60,62,'路·徒'],[85,95,'约']],'#d4a017'],
 ['🏛️ 罗马皇帝',[[28,37,'提庇留'],[37,41,'该犹'],[41,54,'革老丢'],[54,68,'尼禄'],[69,79,'维斯帕先'],[79,81,'提多'],[81,96,'多米田']],'#334155'],
 ['⚔️ 重大事件',[[49,49,'革老丢逐犹太人'],[51,52,'迦流任方伯'],[62,62,'主的兄弟雅各殉道'],[64,64,'罗马大火'],[64,67,'彼得、保罗殉道'],[66,70,'犹太战争'],[70,70,'圣殿被毁'],[95,95,'拔摩岛']],'#2f6f8f']];
let y=34,out=[];for(let t=30;t<=100;t+=10){const x=sx(t);out.push(`<line x1="${x}" x2="${x}" y1="24" y2="100%" stroke="var(--line)"/><text x="${x}" y="16" text-anchor="middle" font-size="11" fill="var(--sub)">${t}</text>`)}
tracks.forEach(([name,ev,c])=>{out.push(`<text x="6" y="${y+16}" font-size="12" font-weight="800" fill="${c}">${name}</text>`);let lane=0,ends=[];
 ev.forEach(([a,b,n])=>{let l=0;while(ends[l]!==undefined&&ends[l]>a-0.2)l++;ends[l]=b+Math.max(2,n.length*0.95);const x=sx(a),w=Math.max(6,sx(b)-sx(a)),yy=y+l*22;lane=Math.max(lane,l);
  out.push(`<g class="tle"><rect x="${x}" y="${yy}" width="${w}" height="16" rx="8" fill="${c}" opacity=".88"><title>${n} ${a}${a!==b?'–'+b:''}</title></rect><text x="${x+w+4}" y="${yy+12}" font-size="11">${n}</text></g>`)});
 y+=(lane+1)*22+16});
tl.innerHTML=`<svg viewBox="0 0 ${W} ${y}" role="img" aria-label="新约历史多轨时间线">${out.join('')}</svg>`;
})();
