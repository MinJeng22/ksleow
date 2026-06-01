import os

# 1. Update global.css to remove overflow limits from .ks-compare-wrap
with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

# I will replace the .ks-compare-wrap block
old_wrap = '''.ks-compare-wrap {
  overflow-x: auto;
  max-height: 75vh;
  overflow-y: auto;
}'''
new_wrap = '''.ks-compare-wrap {
  /* No overflow limit, fully displayed */
}'''
css = css.replace(old_wrap, new_wrap)

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Add IconTrophy to SectionDivider.jsx
with open('src/components/SectionDivider.jsx', 'r', encoding='utf-8') as f:
    sd = f.read()

icon_trophy = '''
export const IconTrophy = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="1.8" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 22h16" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke="currentColor" strokeWidth="1.8" />
    <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
  </svg>
);
'''

if 'IconTrophy' not in sd:
    sd += icon_trophy
    with open('src/components/SectionDivider.jsx', 'w', encoding='utf-8') as f:
        f.write(sd)


# 3. Update WhyChooseUs.jsx
with open('src/components/WhyChooseUs.jsx', 'r', encoding='utf-8') as f:
    wcu = f.read()

wcu = wcu.replace('import SectionDivider, { IconHandshake } from "./SectionDivider";', 'import SectionDivider, { IconTrophy } from "./SectionDivider";')
wcu = wcu.replace('<SectionDivider icon={IconHandshake} targetId="why-ksl" />', '<SectionDivider icon={IconTrophy} targetId="why-ksl" />')

# Replace CSS for desktop sizing
old_css = '''          /* Desktop: Static, fit 14 items */
          @media (min-width: 1025px) {
            .ac-awards-container-new {
              mask-image: none;
              -webkit-mask-image: none;
            }
            .ac-awards-marquee-track {
              animation: none !important;
              justify-content: center;
            }
            .ac-awards-item.dup {
              display: none;
            }
            .ac-awards-item {
              width: 70px;
              height: 95px;
              padding: 0 0.15rem;
            }
            .ac-awards-item:nth-child(14) {
              margin-right: 0;
            }
          }'''

new_css = '''          /* Desktop: Static, fit 14 items exactly to screen */
          @media (min-width: 1025px) {
            .ac-awards-container-new {
              mask-image: none;
              -webkit-mask-image: none;
              max-width: 1400px; /* Limit max width on very large screens */
              margin-left: auto;
              margin-right: auto;
            }
            .ac-awards-marquee-track {
              animation: none !important;
              justify-content: space-between;
              width: 100%;
            }
            .ac-awards-item.dup {
              display: none;
            }
            .ac-awards-item {
              flex: 1;
              max-width: calc(100% / 14);
              height: 140px;
              padding: 0 5px;
              margin-right: 0 !important;
            }
            .ac-awards-item img {
              width: 100%;
              object-fit: contain;
            }
          }'''

if '14 items exactly' not in wcu:
    wcu = wcu.replace(old_css, new_css)
    with open('src/components/WhyChooseUs.jsx', 'w', encoding='utf-8') as f:
        f.write(wcu)

print("Applied fixes!")
