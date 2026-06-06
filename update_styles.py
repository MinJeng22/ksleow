import os

# 1. Update global.css
global_css_path = 'src/styles/global.css'
with open(global_css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace hover scale
css = css.replace("transform: translateY(-4px) scale(1.02);", "transform: translateY(-4px) scale(1.01);")

# Replace placeholder background
old_placeholder = """.ks-bento-placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0)),
      #e6e6e9;
    opacity: 0.76;
  }"""
new_placeholder = """.ks-bento-placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: transparent;
  }"""

if old_placeholder in css:
    css = css.replace(old_placeholder, new_placeholder)
else:
    print("WARNING: Could not find exact placeholder block in global.css")

with open(global_css_path, 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update BentoGrid.jsx
bento_jsx_path = 'src/components/ui/BentoGrid.jsx'
with open(bento_jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

old_is_empty = """.other-services-carousel .ks-bento-card.is-empty {
  background: rgba(255,255,255,0.3);
  border-color: rgba(47,49,90,0.05);
}"""
new_is_empty = """.other-services-carousel .ks-bento-card.is-empty {
  background: transparent;
  border-color: rgba(47,49,90,0.06);
}"""

if old_is_empty in jsx:
    jsx = jsx.replace(old_is_empty, new_is_empty)
else:
    print("WARNING: Could not find exact is-empty block in BentoGrid.jsx")

with open(bento_jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

print("Styles updated successfully!")
