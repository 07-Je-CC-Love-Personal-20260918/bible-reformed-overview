const fs=require('fs');const {JSDOM}=require('jsdom');
const errs=[];const store={};
const dom=new JSDOM(fs.readFileSync('site/index.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/',
 beforeParse(w){w.matchMedia=q=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};
  Object.defineProperty(w,'localStorage',{value:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}}});
  w.addEventListener('error',e=>errs.push('ERR '+e.message));}});
const w=dom.window,d=w.document;const M=el=>el&&el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
let p=0,f=0;const t=(n,c,x='')=>{(c?p++:f++);console.log((c?'PASS':'FAIL')+'  '+n+(x?'  '+x:''));};
setTimeout(()=>{
 t('目录 15 组 / 58 小节', d.querySelectorAll('#toc > li').length===15 && d.querySelectorAll('#toc .sub a').length===58,
   d.querySelectorAll('#toc > li').length+' / '+d.querySelectorAll('#toc .sub a').length);
 t('目录可收起再展开', (M(d.querySelector('#tocBtn')), d.querySelector('#wrap').dataset.toc==='off') && (M(d.querySelector('#tocBtn')), d.querySelector('#wrap').dataset.toc==='on'));
 t('66 卷 · 九字段', d.querySelectorAll('#canon .bk').length===66 && (M(d.querySelectorAll('#canon .bk')[0]), d.querySelectorAll('#bkpanel dt').length===9));
 t('时间线 68 事件 + 10 时期', d.querySelectorAll('#timeline .ev').length===68 && d.querySelectorAll('#eraBar .era').length===11);
 // 列王
 t('列王双轨图 57 色块', d.querySelectorAll('#kingsChart [data-kn]').length===57, d.querySelectorAll('#kingsChart [data-kn]').length);
 const hz=[...d.querySelectorAll('#kingsChart [data-kn]')].find(g=>g.dataset.kn==='希西家'); M(hz);
 t('点王显示详情', /716–687 BC/.test(d.querySelector('#kingPanel').textContent) && /四大贤王/.test(d.querySelector('#kingPanel').textContent),
   d.querySelector('#kingPanel h4').textContent);
 const pr=[...d.querySelectorAll('#kingsChart [data-kn]')].find(g=>g.dataset.kn==='以赛亚'); M(pr);
 t('点先知显示详情', /向南国说话/.test(d.querySelector('#kingPanel').textContent));
 M([...d.querySelectorAll('[data-kf]')].find(b=>b.dataset.kf==='good'));
 const lit=[...d.querySelectorAll('#kingsChart .kbar')].filter(g=>g.style.opacity!=='0.14').length;
 t('只看行正的王 = 5 位', lit===5, lit+' 位（大卫＋南国四贤王）');
 M([...d.querySelectorAll('[data-kf]')].find(b=>b.dataset.kf==='all'));
 t('帝国横条 6 条', d.querySelectorAll('#empireChart .ebar').length===6);
 t('帝国横条动画已触发', d.querySelector('#empireChart .ebar').style.transform==='scaleX(1)');
 // 地图与图表
 t('四张地图图层齐全', d.querySelectorAll('#mapANE .layer').length===4 && d.querySelectorAll('#mapCanaan .layer').length===2 && d.querySelectorAll('#mapPaul .layer').length===4);
 t('地图图层可切换', (M([...d.querySelectorAll('#mapPaul .lyr')].find(b=>b.dataset.l==='j4')), d.querySelector('#mapPaul .layer[data-l="j4"]').classList.contains('on')));
 t('66 卷柱状图 + 环形 + 分组', d.querySelectorAll('#chapChart .cbar').length===66 && d.querySelector('#otArc')!==null && d.querySelectorAll('#groupChart .gbar').length===10);
 t('时间轴可播放', d.querySelectorAll('#axisNodes .step').length===12 && (M(d.querySelector('#axisAll')), [...d.querySelectorAll('#axisNodes .step')].every(n=>n.classList.contains('lit'))));
 // 记忆引擎
 t('闪卡 71 张 / 8 类', d.querySelectorAll('#flashwrap .fc').length===71 && d.querySelectorAll('#fcBar .chip[data-c]').length===9,
   d.querySelectorAll('#flashwrap .fc').length+' / '+(d.querySelectorAll('#fcBar .chip[data-c]').length-1));
 M([...d.querySelectorAll('#fcBar .chip[data-c]')].find(b=>b.dataset.c==='列王年代'));
 t('列王年代闪卡 11 张', d.querySelectorAll('#flashwrap .fc').length===11, d.querySelectorAll('#flashwrap .fc').length);
 M([...d.querySelectorAll('#fcBar .chip[data-c]')].find(b=>b.dataset.c==='全部'));
 M(d.querySelector('#flashwrap .mark'));
 t('背熟进度持久化', store['bible2-cards']!==undefined);
 t('自测 16 题', d.querySelectorAll('#quizwrap .quiz').length===16);
 const q=d.querySelectorAll('#quizwrap .quiz')[12];
 M(q.querySelectorAll('[data-o]')[1]);
 t('列王题判分正确', q.querySelectorAll('[data-o]')[1].classList.contains('ok'), '答案 B 为正解');
 t('52 主日 + 术语 36', d.querySelectorAll('#ldGrid .ld').length===52 && d.querySelectorAll('#glossBody tr').length===36);
 t('附录速查 66 行', d.querySelectorAll('#quickBody tr').length===66);
 // 搜索
 M(d.querySelector('#searchBtn'));
 const pi=d.querySelector('#palIn'); pi.value='希西家'; pi.dispatchEvent(new w.Event('input',{bubbles:true}));
 t('搜索可找到列王内容', d.querySelectorAll('#palList [data-i]').length>0, d.querySelectorAll('#palList [data-i]').length+' 条');
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 t('主题三态', (M(d.querySelector('#themeBtn')),d.documentElement.getAttribute('data-theme')==='light'));
 w.dispatchEvent(new w.Event('scroll'));
 t('目录高亮与进度条', d.querySelectorAll('#toc a.on').length>=1 && d.querySelector('#prog')!==null);
 console.log('\n合计 '+p+' 通过 / '+f+' 失败');
 console.log('JS errors:',errs.length?errs:'none');
},1400);
