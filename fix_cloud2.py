import re

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Dividers
content = content.replace('<SectionDivider icon={IconVideo} targetId="training" />', '<SectionDivider icon={IconVideo} color="#16a14b" targetId="training" />')
content = content.replace('<SectionDivider icon={IconGrid} targetId="editions" />', '<SectionDivider icon={IconGrid} color="#2f315a" targetId="editions" />')
content = content.replace('<SectionDivider icon={IconLedger} targetId="releases" />', '<SectionDivider icon={IconLedger} color="#16a14b" targetId="releases" />')

# 2. Update CTA Section
old_cta = '''          <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
              WhatsApp KSL Support
            </a>
            <a href={OFFICIAL_PRODUCT_URL} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
              Official Product Page
            </a>
          </div>'''
new_cta = '''          <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
              Enquire Now
            </a>
          </div>'''
content = content.replace(old_cta, new_cta)

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
