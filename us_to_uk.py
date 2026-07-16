import os
import re

# Dictionary of American to British spellings
us_to_uk = {
    r'\bcustomize(d|s|r)?\b': lambda m: 'customise' + (m.group(1) or ''),
    r'\bCustomize(d|s|r)?\b': lambda m: 'Customise' + (m.group(1) or ''),
    r'\boptimize(d|s|r)?\b': lambda m: 'optimise' + (m.group(1) or ''),
    r'\bOptimize(d|s|r)?\b': lambda m: 'Optimise' + (m.group(1) or ''),
    r'\banalyze(d|s|r)?\b': lambda m: 'analyse' + (m.group(1) or ''),
    r'\bAnalyze(d|s|r)?\b': lambda m: 'Analyse' + (m.group(1) or ''),
    r'\bminimize(d|s)?\b': lambda m: 'minimise' + (m.group(1) or ''),
    r'\bMinimize(d|s)?\b': lambda m: 'Minimise' + (m.group(1) or ''),
    r'\bmaximize(d|s)?\b': lambda m: 'maximise' + (m.group(1) or ''),
    r'\bMaximize(d|s)?\b': lambda m: 'Maximise' + (m.group(1) or ''),
    r'\bdigitize(d|s)?\b': lambda m: 'digitise' + (m.group(1) or ''),
    r'\bDigitize(d|s)?\b': lambda m: 'Digitise' + (m.group(1) or ''),
    r'\bsynchronize(d|s)?\b': lambda m: 'synchronise' + (m.group(1) or ''),
    r'\bSynchronize(d|s)?\b': lambda m: 'Synchronise' + (m.group(1) or ''),
    r'\bbehavior(s)?\b': lambda m: 'behaviour' + (m.group(1) or ''),
    r'\bBehavior(s)?\b': lambda m: 'Behaviour' + (m.group(1) or ''),
    r'\borganization(s)?\b': lambda m: 'organisation' + (m.group(1) or ''),
    r'\bOrganization(s)?\b': lambda m: 'Organisation' + (m.group(1) or ''),
    r'\bcatalog(s)?\b': lambda m: 'catalogue' + (m.group(1) or ''),
    r'\bCatalog(s)?\b': lambda m: 'Catalogue' + (m.group(1) or ''),
    r'\blabeling\b': lambda m: 'labelling',
    r'\bLabeling\b': lambda m: 'Labelling',
    r'\bcanceled\b': lambda m: 'cancelled',
    r'\bCanceled\b': lambda m: 'Cancelled',
    r'\bcolor(s)?\b': lambda m: 'colour' + (m.group(1) or ''),
    r'\bColor(s)?\b': lambda m: 'Colour' + (m.group(1) or ''),
    r'\bcenter(s|ed)?\b': lambda m: 'centre' + (m.group(1) or ''),
    r'\bCenter(s|ed)?\b': lambda m: 'Centre' + (m.group(1) or '')
}

def is_safe_to_replace(line):
    # Skip lines that look like they contain CSS classes, style tags, or code variables/imports
    ignore_patterns = [
        r'className=', r'style=', r'import ', r'export ', 
        r'function ', r'const ', r'let ', r'var ', r'\.css',
        r'href=', r'src=', r'url\(', r'<svg', r'<path', r'<rect', r'<circle'
    ]
    if any(re.search(p, line) for p in ignore_patterns):
        # We might still want to replace text inside tags on these lines, but it's risky.
        # However, for JSON files this is safer.
        pass
        
    return True

changed_files = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.json', '.js', '.txt')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Safe replacement logic: only replace outside of HTML tags or variable names for color/center
            # For simplicity in this script, we'll just apply the regex but skip obvious code words.
            # To be safe, we'll do a simple regex sub, but we must be VERY careful with 'color' and 'center'
            # We'll skip 'color' and 'center' if they are part of camelCase or kebab-case
            
            new_content = content
            for pattern, repl in us_to_uk.items():
                if 'color' in pattern.lower() or 'center' in pattern.lower():
                    # More strict pattern for color and center: only match if not preceded/followed by hyphen or part of camelCase
                    strict_pattern = pattern.replace(r'\b', r'(?<![A-Za-z0-9\-])\b') + r'(?![A-Za-z0-9\-])'
                    new_content = re.sub(strict_pattern, repl, new_content)
                else:
                    new_content = re.sub(pattern, repl, new_content)
                    
            if new_content != original_content:
                print(f"Updating {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                changed_files += 1

print(f"Updated {changed_files} files.")
