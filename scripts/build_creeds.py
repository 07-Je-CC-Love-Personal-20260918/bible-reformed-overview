import json,re,html
L=[x.replace('\f','') for x in open('book.txt',encoding='utf-8').read().split('\n')]
D=json.load(open('docs.json',encoding='utf-8'))
def block(a,b,starts):
    t=[l.strip() for l in L[a-1:b] if l.strip() and not re.fullmatch(r'\d+',l.strip()) and l.strip()!='受生与被造的区别']
    s=''.join(t).replace('受生与被造的区别','')
    for k in starts: s=s.replace(k,'\n'+k)
    return [x for x in s.split('\n') if x]
ap=block(58,68,['我信我主','我信圣灵','我相信圣而公','我相信罪','我相信身体','我相信永生'])
ni=block(85,104,['我们信独一主','为了拯救','他为了我们','我们信圣灵','我们相信','我们承认','我们盼望'])
def clauses(line):
    parts=re.split(r'(?<=[，；。！])',line)
    return ''.join(f'<span class="ans">{html.escape(p)}</span>' for p in parts if p)
ap_h=''.join(f'<p>{clauses(x)}</p>' for x in ap)
ni_h=''.join(f'<p>{clauses(x)}</p>' for x in ni)
ath=D['ath']['items']
groups=[('开头：得救必须持守大公信仰',1,2),('第一部分：三位一体（3–28）',3,28),('第二部分：基督的位格与工作（29–41）',29,41),('结尾',42,42)]
ath_h=''
for title,a,b in groups:
    ath_h+=f'<h4 class="part">{title}</h4>'+''.join(f'<p><b class="d">{n})</b> {clauses(t)}</p>' for n,t in ath if a<=int(n)<=b)
# 海德堡按主日折叠
hc=D['hc']['body']
parts=re.split(r'(?=<h4 class="(?:ch|part)">)',hc)
hc_h='';open_=False
for p in parts:
    m=re.match(r'<h4 class="(ch|part)">(.*?)</h4>',p)
    if not m: hc_h+=p;continue
    if m[1]=='part' or not m[2].startswith('主日'):
        if open_: hc_h+='</details>';open_=False
        hc_h+=p;continue
    if open_: hc_h+='</details>'
    qs=re.findall(r'第(\d+)问',p)
    rng=f'第 {qs[0]}–{qs[-1]} 问' if len(qs)>1 else (f'第 {qs[0]} 问' if qs else '')
    hc_h+=f'<details class="ld"><summary>📅 {m[2]} <span class="tag">{rng}</span></summary>'+p[m.end():];open_=True
if open_: hc_h+='</details>'
def fold(body):
    parts=re.split(r'(?=<h4 class="part">)',body);out=''
    for p in parts:
        m=re.match(r'<h4 class="part">(.*?)</h4>',p)
        if not m: out+=p;continue
        out+=f'<details class="ld" open><summary>📘 {m[1]}</summary>{p[m.end():]}</details>'
    return out
def belgic_fold(body):
    parts=re.split(r'(?=<h4 class="ch">)',body);out=''
    for p in parts:
        m=re.match(r'<h4 class="ch">(.*?)</h4>',p)
        if not m: out+=p;continue
        out+=f'<details class="ld"><summary>📘 {m[1]}</summary>{p[m.end():]}</details>'
    return out
T=open('creeds.tpl.html',encoding='utf-8').read()
for k,v in {'{{AP}}':ap_h,'{{NI}}':ni_h,'{{ATH_INTRO}}':html.escape(D['ath']['intro']),'{{ATH}}':ath_h,
 '{{BC_INTRO}}':D['belgic']['intro'],'{{BC}}':belgic_fold(D['belgic']['body']),
 '{{HC_INTRO}}':D['hc']['intro'],'{{HC}}':hc_h,'{{DORT_INTRO}}':D['dort']['intro'],'{{DORT}}':fold(D['dort']['body'])}.items():
    T=T.replace(k,v)
open('/home/claude/ccstudy/creeds.html','w',encoding='utf-8').write(T)
print(len(T),ap,ni,sep='\n')
