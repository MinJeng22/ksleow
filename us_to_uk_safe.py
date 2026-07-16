import os
import re

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
    r'\borganization(s)?\b': lambda m: 'organisation' + (m.group(1) or ''),
    r'\bOrganization(s)?\b': lambda m: 'Organisation' + (m.group(1) or ''),
    r'\bcatalog(s)?\b': lambda m: 'catalogue' + (m.group(1) or ''),
    r'\bCatalog(s)?\b': lambda m: 'Catalogue' + (m.group(1) or ''),
    r'\blabeling\b': lambda m: 'labelling',
    r'\bLabeling\b': lambda m: 'Labelling',
    r'\bcanceled\b': lambda m: 'cancelled',
    r'\bCanceled\b': lambda m: 'Cancelled'
}

changed_files = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.json', '.js', '.txt')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', newline='') as f:
                content = f.read()
                
            original_content = content
            
            new_content = content
            for pattern, repl in us_to_uk.items():
                new_content = re.sub(pattern, repl, new_content)
                    
            if new_content != original_content:
                print(f"Updating {path}")
                with open(path, 'w', encoding='utf-8', newline='') as f:
                    f.write(new_content)
                changed_files += 1

print(f"Updated {changed_files} files.")
