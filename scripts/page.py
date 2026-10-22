# 生成新页面的公共外壳：python3 scripts/page.py <内容片段.html> <输出.html> <标题> [额外脚本...]
import sys
src,out,title=sys.argv[1:4];extra=sys.argv[4:]
body=open(src,encoding='utf-8').read()
leaf='<link rel="stylesheet" href="assets/leaflet/leaflet.css">' if 'assets/leaflet/leaflet.js' in extra else ''
sw=''.join(f'<span class="sw" data-t="{t}" style="background:{c}" title="{n}"></span>' for t,c,n in [('dawn','#b5562b','晨曦'),('night','#1b2236','夜读'),('olive','#4f7a1f','橄榄'),('royal','#6b3fb5','君王紫'),('ocean','#0e7490','海洋'),('sakura','#c2185b','樱花'),('ink','#1b1b1b','水墨')])
scripts=''.join(f'<script src="{x}"></script>\n' for x in extra)
html=f'''<!doctype html>
<html lang="zh-CN" data-theme="dawn">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · CCstudy</title>
{leaf}<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
<div id="prog"></div>
<header class="top">
  <button class="btn" id="tocBtn" aria-label="目录">☰ 目录</button>
  <h1>{title}</h1>
  <div class="themes" title="切换主题">{sw}</div>
</header>
<div class="wrap">
<nav class="toc" data-auto></nav>
<main>
{body}
<footer>CCstudy · {title} v2.3.0 · 2026-10-22</footer>
</main></div>
<div class="fab"><button class="btn" id="upBtn" title="回到顶部">↑</button></div>
{scripts}<script src="assets/lenis.min.js"></script>
<script src="assets/app.js"></script>
</body></html>'''
open(out,'w',encoding='utf-8').write(html)
