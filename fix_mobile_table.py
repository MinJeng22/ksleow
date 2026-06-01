import os
import re

# 1. Update global.css for mobile table layout and sticky header fix
with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Fix sticky header logic using CSS variables
css_content = css_content.replace('.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: #2f315a;', '.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: var(--th-bg, #2f315a);')
css_content = css_content.replace('.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: inherit;', '.ks-compare-th {\n  position: sticky;\n  top: 0;\n  background: var(--th-bg, #2f315a);')

mobile_css = '''
/* Mobile Compare Table Overrides */
@media (max-width: 768px) {
  .ks-compare-table, 
  .ks-compare-thead, 
  .ks-compare-tbody, 
  .ks-compare-th, 
  .ks-compare-td, 
  .ks-compare-tr,
  .ks-compare-tr-data,
  .ks-compare-tr-book,
  .ks-compare-tr-section {
    display: block;
    width: 100%;
  }
  
  .ks-compare-thead tr {
    display: flex;
  }
  .ks-compare-thead .ks-compare-th-left {
    display: none;
  }
  .ks-compare-thead .ks-compare-th:not(.ks-compare-th-left) {
    width: 20%;
    padding: 0.5rem 0.2rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ks-compare-tr-data, .ks-compare-tr-book {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(47,49,90,0.05);
  }
  
  .ks-compare-td-left {
    width: 100%;
    text-align: center;
    position: static !important;
    background: #f0f0f5 !important;
    padding: 0.7rem;
    border-bottom: 1px solid rgba(47,49,90,0.05);
  }
  
  .ks-compare-td-data:not(.ks-compare-td-left),
  .ks-compare-td-book:not(.ks-compare-td-left) {
    width: 20%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(47,49,90,0.05);
    padding: 0.5rem 0;
  }
  .ks-compare-td-data:not(.ks-compare-td-left):last-child,
  .ks-compare-td-book:not(.ks-compare-td-left):last-child {
    border-right: none;
  }
  
  .ks-compare-td-section {
    width: 100%;
    text-align: center;
    display: block;
  }
}
'''
if 'Mobile Compare Table Overrides' not in css_content:
    css_content += mobile_css

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. Update AutoCountCloudAccounting.jsx
with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    acc_cloud = f.read()

# Fix thead inline style
acc_cloud = acc_cloud.replace('<tr style={{ background: "#2f315a" }}>', '<tr style={{ "--th-bg": "#16a14b" }}>')

# Add e-Invoice Tutorial
old_videos = '''const CLOUD_VIDEOS = [
  {
    id: 'zHstLv2-ATw',
    label: 'CloudAccounting Tutorial',
    description: 'Learn AutoCount CloudAccounting in Just 30 Minutes. A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.',
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  }
];'''

new_videos = '''const CLOUD_VIDEOS = [
  {
    id: 'pHRMw-oo0o0?start=39',
    label: 'General Tutorial',
    description: 'Learn AutoCount CloudAccounting in Just 30 Minutes. A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.',
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'pHRMw-oo0o0',
    label: 'e-Invoice Tutorial',
    description: 'Learn how to generate e-Invoices with AutoCount CloudAccounting seamlessly.',
    note: 'e-Invoice Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  }
];'''

if 'General Tutorial' not in acc_cloud:
    acc_cloud = acc_cloud.replace(old_videos, new_videos)

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(acc_cloud)

# 3. Update AutoCountAccounting.jsx
with open('src/pages/products/AutoCountAccounting.jsx', 'r', encoding='utf-8') as f:
    acc = f.read()

# Fix thead inline style
acc = acc.replace('<tr style={{ background: "#80c31e" }}>', '<tr style={{ "--th-bg": "#80c31e" }}>')

with open('src/pages/products/AutoCountAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(acc)

print("Applied fixes")
