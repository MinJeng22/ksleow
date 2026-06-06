import os

# 1. Update global.css
global_css_path = 'src/styles/global.css'
with open(global_css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Remove max-width from .ks-section-header
old_section_header = """.ks-section-header {
    max-width: 760px;
  }"""
new_section_header = """.ks-section-header {
    max-width: none;
  }"""
if old_section_header in css:
    css = css.replace(old_section_header, new_section_header)
else:
    print("Warning: .ks-section-header max-width not found exactly.")

# Force transparent background on .ks-bento-carousel-slide.ks-bento if they somehow see it
# Actually, I'll just append it to the end to ensure it takes precedence
css += """
.ks-bento-carousel-slide.ks-bento {
  background: transparent !important;
}
"""

with open(global_css_path, 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update BentoGrid.jsx
bento_jsx_path = 'src/components/ui/BentoGrid.jsx'
with open(bento_jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

old_track_padding = "padding: 0 min(4vw, 3rem) 1rem 0;"
new_track_padding = "padding: 1rem min(4vw, 3rem) 1rem 0;\n  margin-top: -1rem;"
if old_track_padding in jsx:
    jsx = jsx.replace(old_track_padding, new_track_padding)
else:
    print("Warning: ks-bento-carousel-track padding not found.")

with open(bento_jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

print("Update script executed.")
