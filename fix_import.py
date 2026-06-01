with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('BackgroundParticles', 'ParticleBackground')
if 'import ParticleBackground' not in content:
    content = content.replace('import ProductHero from "../../components/ProductHero.jsx";', 'import ProductHero from "../../components/ProductHero.jsx";\nimport ParticleBackground from "../../components/ParticleBackground.jsx";')
with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
