import re,sys
import xml.etree.ElementTree as ET
CLS_FS={'cap':10,'lbl':10.4,'lbl-k':11,'barlbl':10,'flowtxt':11}
def w_of(ch):
    o=ord(ch)
    if 0x4E00<=o<=0x9FFF or 0x3000<=o<=0x303F or 0xFF00<=o<=0xFFEF or 0x2010<=o<=0x201F: return 1.0
    if o<128: return 0.53
    return 0.9
def fnum(v,d):
    try: return float(re.sub(r'[^\d.\-]','',v))
    except: return d
bad=[];tot=0
raw=open('/tmp/allsvg.txt',encoding='utf-8').read().split('\n<<<SVG-SEP>>>\n')
for idx,s in enumerate(raw):
    m=re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"',s)
    if not m: continue
    W,H=float(m.group(1)),float(m.group(2))
    try: root=ET.fromstring(s)
    except Exception as e:
        print("  [parse fail SVG#%d] %s"%(idx,e)); continue
    def walk(el,st):
        global tot
        tag=el.tag.split('}')[-1]
        cur=dict(st)
        tr=el.get('transform','')
        mt=re.search(r'translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)',tr)
        if mt: cur['tx']+=float(mt.group(1)); cur['ty']+=float(mt.group(2))
        if el.get('text-anchor'): cur['anchor']=el.get('text-anchor')
        if el.get('font-size'): cur['fs']=fnum(el.get('font-size'),cur['fs'])
        for c in (el.get('class') or '').split():
            if c in CLS_FS: cur['fs']=CLS_FS[c]
        if tag=='text':
            txt=''.join(el.itertext())
            if txt.strip() and 'rotate' not in tr:
                x=fnum(el.get('x','0'),0)+cur['tx']; y=fnum(el.get('y','0'),0)+cur['ty']
                wpx=sum(w_of(ch) for ch in txt)*cur['fs']
                a=cur['anchor']
                if a=='middle': x0,x1=x-wpx/2,x+wpx/2
                elif a=='end': x0,x1=x-wpx,x
                else: x0,x1=x,x+wpx
                tot+=1
                if x0<-2 or x1>W+2 or y>H+2 or y-cur['fs']<-2:
                    bad.append((idx,txt[:30],round(x0,1),round(x1,1),W,y,H))
            return
        for ch in el: walk(ch,cur)
    walk(root,{'tx':0.0,'ty':0.0,'anchor':'start','fs':11.0})
print("文本元素 %d 个，越界 %d 个"%(tot,len(bad)))
for b in bad: print("  SVG#%d 「%s」 x∈[%s,%s] W=%s y=%s H=%s"%b)
