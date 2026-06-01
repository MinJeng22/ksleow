import os

# 1. Update global.css for mobile table
with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace width: 20% with flex: 1 for headers
old_th = '''    .ks-compare-thead .ks-compare-th:not(.ks-compare-th-left) {
      width: 20%;
      padding: 0.5rem 0.2rem;'''
new_th = '''    .ks-compare-thead .ks-compare-th:not(.ks-compare-th-left) {
      flex: 1;
      padding: 0.5rem 0.1rem;'''

# Replace width: 20% with flex: 1 for data cells
old_td = '''    .ks-compare-td-data:not(.ks-compare-td-left),
    .ks-compare-td-book:not(.ks-compare-td-left) {
      width: 20%;'''
new_td = '''    .ks-compare-td-data:not(.ks-compare-td-left),
    .ks-compare-td-book:not(.ks-compare-td-left) {
      flex: 1;'''

if 'width: 20%;' in css:
    css = css.replace(old_th, new_th)
    css = css.replace(old_td, new_td)
    with open('src/styles/global.css', 'w', encoding='utf-8') as f:
        f.write(css)

# 2. Update AutoCountCloudAccounting.jsx
with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    acc_cloud = f.read()

# Update General Tutorial video ID
acc_cloud = acc_cloud.replace("id: 'M8j_39IEpjQ',", "id: 'zHstLv2-ATw',")

# Update WebGL props
old_props = '''          <AutoCountTrainingWebGL 
            customVideos={CLOUD_VIDEOS} 
            title="AutoCount CloudAccounting Quick-Start Guide"
            themeColor="#0d6efd" 
            themeHoverColor="#0b5ed7" 
            activeTabBg="#0d6efd"
            playBtnBg="#0d6efd" 
            playIconColor="#ffffff" 
          />'''
new_props = '''          <AutoCountTrainingWebGL 
            customVideos={CLOUD_VIDEOS} 
            title="AutoCount CloudAccounting Quick-Start Guide"
            themeColor="#16a14b" 
            themeHoverColor="#19b554" 
            activeTabBg="#2f315a"
            playBtnBg="#16a14b" 
            playIconColor="#ffffff" 
          />'''

if 'themeColor="#0d6efd"' in acc_cloud:
    acc_cloud = acc_cloud.replace(old_props, new_props)
    with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
        f.write(acc_cloud)

print("Applied mobile table and tutorial fixes!")
