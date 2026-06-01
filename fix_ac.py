import os

with open('src/pages/products/AutoCountAccounting.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the whole block
start_marker = '{/* 🎀🌟 Why Choose Us 🎀🌟 */}'
end_marker = '<Footer />'

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

print("Updated AutoCountAccounting.jsx")
