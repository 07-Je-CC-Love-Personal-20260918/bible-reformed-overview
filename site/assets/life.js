// 耶稣生平：时间线 + 地图同步动态播放
(function(){
const E=[
 // [年代, 阶段, 事件, 地点, lat, lng, 经文, 要点]
 ['前6/5','预备','降生','伯利恒',31.705,35.207,'太 2；路 2','<span class="m">道成肉身</span>，生在大卫的城（弥 5:2）'],
 ['前5/4','预备','逃往埃及','埃及',30.05,31.25,'太 2:13–15','“我从埃及召出我的儿子来”（何 11:1），基督重演以色列的历史'],
 ['前4','预备','定居拿撒勒','拿撒勒',32.70,35.30,'太 2:23；路 2:39','卑微的成长：“拿撒勒还能出什么好的吗？”'],
 ['主后8','预备','12 岁在圣殿','耶路撒冷',31.778,35.235,'路 2:41–52','“我应当以我父的事为念”，唯一记载的少年事件'],
 ['约26/29','开始','受洗','约旦河·伯大巴拉',31.84,35.55,'太 3；可 1；路 3；约 1','三一神同时显现；<span class="k">受膏</span>为弥赛亚'],
 ['约26/29','开始','旷野受试探 40 天','犹太旷野',31.70,35.40,'太 4；路 4','第二亚当在旷野得胜，三次引用申命记'],
 ['约27','开始','迦拿婆筵：第一个神迹','迦拿',32.75,35.34,'约 2:1–11','“显出他的荣耀”，七个神迹之首'],
 ['约27·逾越①','早期犹太事工','第一次洁净圣殿；尼哥底母','耶路撒冷',31.778,35.235,'约 2–3','“人若不重生，就不能见神的国”'],
 ['约27','早期犹太事工','井旁的撒玛利亚妇人','叙加',32.21,35.28,'约 4','“用心灵和诚实拜他”，福音越过族群界线'],
 ['约28','加利利大事工','以迦百农为中心；呼召门徒','迦百农',32.88,35.575,'太 4；可 1；路 5','“天国近了，你们应当悔改”'],
 ['约28','加利利大事工','登山宝训','八福山',32.88,35.556,'太 5–7；路 6','天国子民的宪章：新的西乃山'],
 ['约28','加利利大事工','平静风浪；格拉森人被鬼附','加利利海东岸',32.83,35.65,'可 4–5','掌管自然界和灵界的主'],
 ['约29·逾越③','加利利大事工','喂饱五千人','伯赛大',32.91,35.63,'四福音都有','唯一四卷福音书都记载的神迹 → 约 6“生命的粮”'],
 ['约29','退修与训练','推罗、西顿；迦南妇人','推罗',33.27,35.20,'太 15；可 7','外邦人的信心'],
 ['约29','退修与训练','彼得认信 → 首次预言受难','该撒利亚腓立比',33.25,35.69,'太 16；可 8；路 9','<span class="m">全书的分水岭</span>：“你是基督，是永生神的儿子”'],
 ['约29','退修与训练','登山变像','黑门山（传统说他泊山）',33.40,35.85,'太 17；可 9；路 9','摩西（律法）和以利亚（先知）都指向他'],
 ['约29秋','后期犹太与比利亚事工','住棚节、修殿节','耶路撒冷',31.778,35.235,'约 7–10','“我是世界的光”“我是好牧人”'],
 ['约30初','后期犹太与比利亚事工','拉撒路复活','伯大尼',31.771,35.262,'约 11','“我是复活，我是生命”，直接促成了公会的杀机'],
 ['约30','后期犹太与比利亚事工','耶利哥：撒该、瞎子巴底买','耶利哥',31.87,35.44,'路 19；可 10','“人子来为要寻找拯救失丧的人”'],
 ['30·周日','受难周','骑驴进京','耶路撒冷',31.778,35.235,'四福音都有','应验亚 9:9，谦和的王'],
 ['30·周一','受难周','咒诅无花果树，洁净圣殿','耶路撒冷',31.778,35.235,'可 11','审判空有叶子、不结果子的宗教'],
 ['30·周二','受难周','圣殿中辩论；橄榄山讲论','橄榄山',31.778,35.244,'太 21–25','末世与审判'],
 ['30·周四','受难周','最后的晚餐；客西马尼园','客西马尼',31.779,35.239,'太 26；约 13–17','设立圣餐；“不要照我的意思，只要照你的意思”'],
 ['30·周五','受难周','六次受审 → 钉十字架','各各他',31.778,35.229,'四福音都有','<span class="m">“成了！”</span>代赎完成（海德堡第 37–40 问）'],
 ['30·周日','复活','复活：空坟墓','园中的坟墓',31.778,35.229,'四福音都有','“他不在这里，已经复活了”'],
 ['30','复活','40 天显现（以马忤斯、加利利海边）','以马忤斯',31.84,34.99,'路 24；约 21','“凡经上所指着自己的话都给他们讲解明白了”'],
 ['30','升天','升天，应许圣灵','橄榄山·伯大尼',31.771,35.262,'路 24；徒 1','坐在父的右边作王，为我们代求（海德堡第 46–49 问）']];
const PH={'预备':'#b8860b','开始':'#5f8a2e','早期犹太事工':'#2f6f8f','加利利大事工':'#0e7490','退修与训练':'#6b3fb5','后期犹太与比利亚事工':'#b5562b','受难周':'#c93c3c','复活':'#d4a017','升天':'#d4a017'};
const list=document.getElementById('lifeList'),mapEl=document.getElementById('lifeMap');if(!list)return;
list.innerHTML=E.map((e,i)=>`<div class="ev life" data-i="${i}" style="border-left:4px solid ${PH[e[1]]}"><span class="d">${e[0]}</span> <span class="pill" style="background:${PH[e[1]]}">${e[1]}</span> <b>${e[2]}</b> · 📍${e[3]} <small style="color:var(--sub)">（${e[6]}）</small><div style="font-size:.9rem">${e[7]}</div></div>`).join('');
// 阶段条
const bar=document.getElementById('lifePhases');
if(bar){const seen=[];E.forEach(e=>{if(!seen.includes(e[1]))seen.push(e[1])});const SH={'早期犹太事工':'早期','加利利大事工':'加利利','退修与训练':'训练','后期犹太与比利亚事工':'往京','受难周':'受难周','复活':'复活','升天':'升天','预备':'预备','开始':'开始'};bar.innerHTML=seen.map(p=>`<div style="flex:${E.filter(e=>e[1]===p).length};background:${PH[p]}" title="${p}">${SH[p]||p}</div>`).join('')}
let map=null,mk=null,line=null;
const concept=window.CCConcept&&CCConcept(document.getElementById('lifeConcept'),{id:'life',bounds:[31.0,33.55,34.55,36.05],w:900,
 points:[...new Map(E.map(e=>[e[3],e])).values()].map(e=>({n:e[3].split('·')[0].replace('（传统说他泊山）',''),lat:e[4],lng:e[5],c:PH[e[1]],big:['耶路撒冷','伯利恒','拿撒勒','迦百农'].includes(e[3]),left:['耶路撒冷','各各他','园中的坟墓','客西马尼','橄榄山','以马忤斯','犹太旷野','伯大尼','橄榄山·伯大尼'].includes(e[3])})).filter(p=>!['各各他','园中的坟墓','客西马尼','橄榄山'].includes(p.n)),
 routes:[{c:'#c93c3c',pts:E.map(e=>[e[4],e[5]]),dash:1}]});
if(concept)concept.show(-1,false);
map=window.CCMap&&CCMap(mapEl,{center:[32.3,35.4],zoom:8});
if(map){E.forEach(e=>L.circleMarker([e[4],e[5]],{radius:5,color:'#fff',weight:1.5,fillColor:PH[e[1]],fillOpacity:.9}).bindTooltip(e[3]).addTo(map));
 line=L.polyline([],{color:'#c93c3c',weight:3,dashArray:'6 6'}).addTo(map);mk=L.marker([E[0][4],E[0][5]]).addTo(map)}
let cur=-1,timer=null;
function show(i){cur=i;document.querySelectorAll('.life').forEach(d=>d.classList.toggle('on',+d.dataset.i===i));
 const e=E[i];document.getElementById('lifeNow').innerHTML=`<span class="d">${e[0]}</span> · <b>${e[2]}</b> · 📍${e[3]}<br>${e[7]}`;
 document.getElementById('lifeProg').style.transform=`scaleX(${(i+1)/E.length})`;
 if(concept)concept.mark(e[4],e[5]);
 if(map){mk.setLatLng([e[4],e[5]]);line.setLatLngs(E.slice(0,i+1).map(x=>[x[4],x[5]]));map.panTo([e[4],e[5]],{animate:true,duration:.8})}}
list.addEventListener('click',ev=>{const d=ev.target.closest('.life');if(d){stop();show(+d.dataset.i)}});
const btn=document.getElementById('lifePlay');
function stop(){clearInterval(timer);timer=null;btn.textContent='▶ 播放生平'}
btn.addEventListener('click',()=>{if(timer){stop();return}btn.textContent='⏸ 暂停';if(cur>=E.length-1)cur=-1;show(cur+1);timer=setInterval(()=>{if(cur>=E.length-1){stop();return}show(cur+1)},2200)});
document.getElementById('lifePrev').addEventListener('click',()=>{stop();show(Math.max(0,cur-1))});
document.getElementById('lifeNext').addEventListener('click',()=>{stop();show(Math.min(E.length-1,cur+1))});
show(0);
})();
