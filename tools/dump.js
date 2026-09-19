const fs=require('fs');const {JSDOM}=require('jsdom');
const store={};
const dom=new JSDOM(fs.readFileSync('site/index.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/',
 beforeParse(w){w.matchMedia=q=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};
  Object.defineProperty(w,'localStorage',{value:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}}});}});
setTimeout(()=>{
  const svgs=[...dom.window.document.querySelectorAll('svg')].map(s=>s.outerHTML);
  fs.writeFileSync('/tmp/allsvg.txt',svgs.join('\n<<<SVG-SEP>>>\n'));
  console.log('dumped SVGs:',svgs.length);
},1200);
