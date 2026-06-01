import os
import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Fix sticky header
css_content = css_content.replace('.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: inherit;', '.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: #2f315a;')

# Add btn-cloud class
btn_cloud_css = '''
.ks-btn-cloud {
  background: #16a14b;
  border-color: #16a14b;
  color: white;
}
.ks-btn-cloud:hover {
  background: #19b554;
  border-color: #19b554;
  color: white;
}
'''
if '.ks-btn-cloud' not in css_content:
    css_content += btn_cloud_css

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css_content)


with open('src/components/ProductHero.jsx', 'r', encoding='utf-8') as f:
    hero_content = f.read()

hero_content = hero_content.replace('className="ks-btn ks-btn-primary"', 'className={"ks-btn ks-btn-primary " + (cta.className || "")}')

with open('src/components/ProductHero.jsx', 'w', encoding='utf-8') as f:
    f.write(hero_content)

print("Updated CSS and Hero.")
