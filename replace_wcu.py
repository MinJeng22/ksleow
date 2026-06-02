import os

file_path = 'src/pages/products/AutoCountAccounting.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '{/* ── Why Choose Us ── */}' in line:
        start_idx = i
        break

if start_idx != -1:
    # Find the end of this section. It's followed by {/* CTA band */}
    for i in range(start_idx, len(lines)):
        if '{/* CTA band */}' in line or '{/* CTA band */}' in lines[i]:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + ['      {/* ── Why Choose Us ── */}\n', '      <WhyChooseUs />\n\n'] + lines[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Replaced Why Choose Us block from line {start_idx} to {end_idx}.")
else:
    print(f"Could not find start or end index. start={start_idx}, end={end_idx}")
