import os

def process_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/pages/products/FeedMePOS.jsx', [
    ('section: { padding: "4rem 0" },', 'section: {},')
])

process_file('src/pages/apps/Sales2DO.jsx', [
    ('section: { padding: "4rem 0" },', 'section: {},')
])

process_file('src/pages/products/AutoCountPOS.jsx', [
    ('padding: clamp(4rem, 7vw, 6.25rem) 0;', ''),
    ('padding: 3.5rem 0;', '')
])
