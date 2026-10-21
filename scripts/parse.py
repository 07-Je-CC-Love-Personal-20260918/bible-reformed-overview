import re,html,json
NOTES={'Book by Joel R. Beeke','Why do we Still to Sin?','而是被更新了','..','受生与被造的区别'}
L=[x.replace('\f','') for x in open('book.txt',encoding='utf-8').read().split('\n')]
L=['' if x.strip() in NOTES else x for x in L]
def seg(a,b): return L[a-1:b-1]
def esc(s): return html.escape(s)
def mark(s):
    s=esc(s)
    s=re.sub(r'[（(](\d{1,2})[）)]',r'<sup>\1</sup>',s)
    return s
def parse(lines,kind):
    out=[];para=None;refs=[]
    def flush():
        nonlocal para,refs
        if para is not None:
            out.append(('p',para))
        if refs: out.append(('r',refs))
        para=None;refs=[]
    for raw in lines:
        if re.fullmatch(r'\s*\d+\s*',raw) or raw.strip()=='' :
            continue
        st=raw.strip(); lead=len(raw)-len(raw.lstrip())
        if re.match(r'^[（(]\d+[）)]\s*\S',st) and len(st)<120 and not re.search(r'[，。“]',st):
            if para is not None: out.append(('p',para)); para=None
            refs.append(re.sub(r'^[（(](\d+)[）)]\s*',r'\1 ',st)); continue
        if refs: out.append(('r',refs)); refs=[]
        ishead = (re.match(r'^(第[一二三四五六七八九十、]+(条|项教义)|主日\s*\d+|第.部|结论)',st) and len(st)<=40 and not st.endswith('。')) or lead>=6 and len(st)<=32 and not re.search(r'[，。；：、]$',st) and not st.startswith('驳斥')
        if ishead:
            if para is not None: out.append(('p',para)); para=None
            out.append(('h',st)); continue
        newp = lead>=2 or re.match(r'^\d+\s*[．.]\s*问',st) or st.startswith('答：') or re.match(r'^错谬',st)
        if newp or para is None:
            if para is not None: out.append(('p',para))
            para=st
        else:
            para+=st
    flush()
    return out
def render(blocks):
    h=[]
    for t,x in blocks:
        if t=='h':
            cls='ch' if re.match(r'^(主日|第.+条|第.+项教义|第.+部|结论)',x) else 'ch2'
            if re.match(r'^第[^条]+项教义|^第.部|^结论',x): cls='part'
            h.append(f'<h4 class="{cls}">{esc(x)}</h4>')
        elif t=='r':
            h.append('<div class="refs">'+' · '.join(esc(r) for r in x)+'</div>')
        else:
            m=re.match(r'^(\d+)\s*[．.]\s*问：(.*)',x)
            if m: h.append(f'<p class="q"><b class="qn">第{m[1]}问</b>{mark(m[2])}</p>'); continue
            if x.startswith('答：'): h.append(f'<p class="a"><b>答：</b><span class="ans">{mark(x[2:])}</span></p>'); continue
            if x.startswith('驳斥：'): h.append(f'<p class="rej"><b>驳斥：</b>{mark(x[3:])}</p>'); continue
            if re.match(r'^错谬',x): h.append(f'<p class="err">{mark(x)}</p>'); continue
            h.append(f'<p>{mark(x)}</p>')
    return '\n'.join(h)
def intro_body(lines,first_marker):
    for i,l in enumerate(lines):
        if re.search(first_marker,l): return lines[:i],lines[i:]
    return [],lines
docs={}
for key,(a,b,first) in {'belgic':(192,1434,r'第一条 只有一位神'),'hc':(1435,3115,r'主日 1\s*$'),'dort':(3116,4582,r'第一项教义')}.items():
    s=seg(a,b); i,bd=intro_body(s,first)
    docs[key]={'intro':render(parse(i,key)),'body':render(parse(bd,key))}
# athanasian
s=seg(43,190); txt=''.join(x.strip() for x in s if not re.fullmatch(r'\s*\d*\s*',x))
k=txt.find('1) 所有'); intro=txt[txt.find('《亚他那修信经》是以'):k]
items=re.split(r'(\d{1,2})\) ',txt[k:]); ath=[]
for j in range(1,len(items),2): ath.append((items[j],items[j+1].strip()))
docs['ath']={'intro':intro,'items':ath}
json.dump(docs,open('docs.json','w',encoding='utf-8'),ensure_ascii=False)
for k,v in docs.items(): print(k,len(v.get('body',''))if 'body' in v else len(v['items']))
