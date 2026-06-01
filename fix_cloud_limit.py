import re

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const [search, setSearch] = useState("");', 'const [search, setSearch] = useState("");\n  const [visibleLimit, setVisibleLimit] = useState(5);')
content = content.replace('{filtered.map((release) => (\n                    <ReleaseCard', '{filtered.slice(0, visibleLimit).map((release) => (\n                    <ReleaseCard')

button_code = '''
                  ))}
                  {!search && visibleLimit < filtered.length && (
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <button onClick={() => setVisibleLimit(prev => prev + 5)}
                        style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2f315a", background: "rgba(47,49,90,0.06)", border: "none", borderRadius: 50, padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.1)"}
                        onMouseOut={e => e.currentTarget.style.background = "rgba(47,49,90,0.06)"}
                      >
                        View more releases
                      </button>
                    </div>
                  )}
'''
content = content.replace('                  ))}\n                </div>', button_code + '                </div>')

# Remove the top "View more releases" button we added in the previous commit
top_btn = '''              <a 
                href={OFFICIAL_RELEASE_URL}
                target="_blank"
                rel="noreferrer"
                className="ks-tab-button"
                style={{ background: "rgba(47,49,90,0.06)", color: "#2f315a" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(47,49,90,0.1)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(47,49,90,0.06)"}
              >
                View more releases
              </a>'''
content = content.replace(top_btn, '')

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
