import re

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Feature Highlights styling
content = content.replace(
    '<div className="product-app-section product-app-section-paper product-app-section-clean">\n        <FeatureHighlights />\n      </div>',
    '<div className="product-app-section product-app-section-paper product-app-section-clean" style={{ \'--feature-strip-bg\': \'linear-gradient(180deg, #16a14b 0%, #0d7032 100%)\', \'--feature-strip-shadow\': \'0 0 16px rgba(22, 161, 75, 0.4)\' }}>\n        <FeatureHighlights />\n      </div>'
)

# 2. Training colours
content = content.replace('themeColor="#16a14b"', 'themeColor="#16a14b"')
content = content.replace('playBtnBg="#00a2ed"', 'playBtnBg="#16a14b"')
content = content.replace('activeTabBg="#00a2ed"', 'activeTabBg="#16a14b"')

# 3. Monthly Price colors
content = content.replace('color: "#00a2ed"', 'color: "#16a14b"')

# 4. Release notes "View More" 
new_release_header = '''
            <div className="ks-tab-list" style={{ background: "#f0f0f5" }}>
              {[["browse", "Browse All"], ["compare", "Compare Versions"]].map(([mode, label]) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setCompareMode(mode === "compare")}
                  className={`ks-tab-button ${(compareMode ? "compare" : "browse") === mode ? "is-active" : ""}`}
                >
                  {label}
                </button>
              ))}
              <a 
                href={OFFICIAL_RELEASE_URL}
                target="_blank"
                rel="noreferrer"
                className="ks-tab-button"
                style={{ background: "rgba(47,49,90,0.06)", color: "#2f315a" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.1)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(47,49,90,0.06)"}
              >
                View more releases
              </a>
            </div>
'''
content = re.sub(
    r'<div className="ks-tab-list" style={{ background: "#f0f0f5" }}>.*?</div>\s*</div>',
    new_release_header.strip() + '\n          </div>', 
    content, 
    flags=re.DOTALL
)

# 5. Remove the "Official CloudAccounting release notes" card
card_pattern = r'<div style={{ marginTop: "2\.5rem", padding: "1\.25rem 1\.5rem".*?Official Forum\s*</a>\s*</div>'
content = re.sub(card_pattern, '', content, flags=re.DOTALL)

# 6. Change CTA section to use enquire-now-section
old_cta = r'<div style={{ background: "#2f315a", padding: "4rem 0" }}>.*?Move accounting work into the cloud.*?</div>\s*</div>\s*</div>'
new_cta = '''<div className="enquire-now-section">
        <BackgroundParticles
          theme="light"
          vignetteStart="rgba(240,240,245,0)"
          vignetteEnd="rgba(47,49,90,0.08)"
          densityScale={0.78}
          mobileDensityScale={2.2}
          lineAlphaScale={0.38}
          dotAlpha={0.6}
        />
        <div className="enquire-now-content content-wrap">
          <h2 className="enquire-now-heading">
            Move accounting work into the cloud with proper guidance.
          </h2>
          <p className="enquire-now-body">
            KSL can help you choose the right edition, start the free trial, and prepare the account book for daily use.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
              WhatsApp KSL Support
            </a>
            <a href={OFFICIAL_PRODUCT_URL} target="_blank" rel="noreferrer" className="btn-ghost-base btn-ghost-dark">
              Official Product Page
            </a>
          </div>
        </div>
      </div>'''
content = re.sub(old_cta, new_cta, content, flags=re.DOTALL)

# Ensure BackgroundParticles is imported
if 'import BackgroundParticles' not in content:
    content = content.replace('import ProductHero from "../../components/ProductHero.jsx";', 'import ProductHero from "../../components/ProductHero.jsx";\nimport BackgroundParticles from "../../components/BackgroundParticles.jsx";')

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
