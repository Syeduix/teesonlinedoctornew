# Rebuilds tees-landing-single.html: index.html with css/style.css and js/main.js inlined.
import re
h = open('index.html', encoding='utf8').read()
css = open('css/style.css', encoding='utf8').read().strip()
js = open('js/main.js', encoding='utf8').read().strip()
link = '<link rel="stylesheet" href="css/style.css">'
script = '<script src="js/main.js"></script>'
assert h.count(link) == 1 and h.count(script) == 1
assert '</style>' not in css and '</script>' not in js
h = h.replace(link, '<style>\n' + css + '\n</style>').replace(script, '<script>\n' + js + '\n</script>')
open('tees-landing-single.html', 'w', encoding='utf8').write(h)
print("written", round(len(h.encode()) / 1024, 1), "KB")
print("linked css/js left:", re.findall(r'(?:href|src)="(?:css|js)/[^"]+"', h))
print("inline <style> blocks:", h.count('<style>'), "| inline <script> blocks:", len(re.findall(r'<script>', h)))
