import os
import re

# Color mappings
color_map = {
    r'color:\s*#111827': 'color: var(--color-text-primary)',
    r'color:\s*#1a1a1a': 'color: var(--color-text-primary)',
    r'color:\s*#374151': 'color: var(--color-text-primary)',
    r'color:\s*#6b7280': 'color: var(--color-text-secondary)',
    r'color:\s*#4b5563': 'color: var(--color-text-secondary)',
    r'color:\s*#9ca3af': 'color: var(--color-text-tertiary)',
}

# CSS files to process
css_files = [
    'verein-web/src/pages/Dashboard/Dashboard.css',
    'verein-web/src/pages/Dashboard/VereinDashboard.css',
    'verein-web/src/pages/Dashboard/MitgliedDashboard.css',
    'verein-web/src/pages/Mitglieder/MitgliedList.css',
    'verein-web/src/pages/Mitglieder/MitgliedDetail.css',
    'verein-web/src/pages/Mitglieder/MitgliedAilem.css',
    'verein-web/src/pages/Vereine/VereinList.css',
    'verein-web/src/pages/Vereine/VereinDetail.css',
    'verein-web/src/pages/Veranstaltungen/VeranstaltungList.css',
    'verein-web/src/pages/Veranstaltungen/VeranstaltungDetail.css',
    'verein-web/src/pages/Settings/Settings.css',
    'verein-web/src/pages/Profile/Profile.css',
]

for file_path in css_files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (not found)")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for pattern, replacement in color_map.items():
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated {file_path}")
    else:
        print(f"- No changes needed for {file_path}")

print("\nDone!")

