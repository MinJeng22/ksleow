import os
import re

def update_accounting():
    with open('src/pages/products/AutoCountAccounting.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Imports
    if 'import WhyChooseUs' not in content:
        content = content.replace('import AutoCountTrialModal', 'import WhyChooseUs from "../../components/WhyChooseUs.jsx";\nimport EnquireNowCTA from "../../components/EnquireNowCTA.jsx";\nimport AutoCountTrialModal')

    # 2. Replace the whole block
    start_marker = '{/* 🎀🌟 Why Choose Us 🎀🌟 */}'
    end_marker = '</div>\n      </div>\n\n      <Footer />'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx != -1 and end_idx != -1:
        new_block = '''{/* 🎀🌟 Why Choose Us 🎀🌟 */}
      <WhyChooseUs />

      {/* CTA band */}
      <EnquireNowCTA 
        heading="Ready to get started with AutoCount?"
        body="KSL Business Solutions provides full AutoCount implementation, training, and support across Pahang."
        buttons={[{ label: "Enquire Now", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
      />

'''
        content = content[:start_idx] + new_block + content[end_idx:]
    
    with open('src/pages/products/AutoCountAccounting.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

def update_cloud_accounting():
    with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Imports
    if 'import WhyChooseUs' not in content:
        content = content.replace('import AutoCountTrainingWebGL', 'import WhyChooseUs from "../../components/WhyChooseUs.jsx";\nimport EnquireNowCTA from "../../components/EnquireNowCTA.jsx";\nimport AutoCountTrainingWebGL')

    # 2. Fix the initial state of expanded release note to null
    content = content.replace('const [expanded, setExpanded] = useState(RELEASES[0]?.version || null);', 'const [expanded, setExpanded] = useState(null);')

    # 3. Add Why Choose Us nav icon (IconHandshake)
    if 'IconHandshake' not in content:
        content = content.replace('IconLedger, IconStar }', 'IconLedger, IconStar, IconHandshake }')
    if '{ id: "releases",      label: "Release Notes",   icon: IconLedger },' in content and '{ id: "why-ksl",       label: "Why Choose Us",   icon: IconHandshake },' not in content:
        content = content.replace('{ id: "releases",      label: "Release Notes",   icon: IconLedger },', '{ id: "releases",      label: "Release Notes",   icon: IconLedger },\n    { id: "why-ksl",       label: "Why Choose Us",   icon: IconHandshake },')

    # 4. Add PrimaryCTA className
    content = content.replace('primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true) }}', 'primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true), className: "ks-btn-cloud" }}')

    # 5. Replace Enquire Now Section with WhyChooseUs + EnquireNowCTA
    start_marker = '<div className="enquire-now-section">'
    end_marker = '</div>\n\n      <Footer />'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker, start_idx)
    
    if start_idx != -1 and end_idx != -1:
        new_block = '''<WhyChooseUs sectionFrom="var(--ks-page-cloud)" sectionTo="var(--ks-page-warm)" />
      <EnquireNowCTA 
        heading="Move accounting work into the cloud with proper guidance."
        body="KSL can help you choose the right edition, start the free trial, and prepare the account book for daily use."
        buttons={[{ label: "Enquire Now", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
      />
'''
        content = content[:start_idx] + new_block + content[end_idx:]

    with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_accounting()
update_cloud_accounting()
print("Updated page components.")
