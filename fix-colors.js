const fs = require('fs');
const path = require('path');

// Color mappings - text colors only
const textColorMap = {
  'color: #111827': 'color: var(--color-text-primary)',
  'color: #1a1a1a': 'color: var(--color-text-primary)',
  'color: #374151': 'color: var(--color-text-primary)',
  'color: #4b5563': 'color: var(--color-text-secondary)',
  'color: #6b7280': 'color: var(--color-text-secondary)',
  'color: #9ca3af': 'color: var(--color-text-tertiary)',
  'color: #d1d5db': 'color: var(--color-text-tertiary)',
};

// CSS files to process
const cssFiles = [
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
];

let totalChanges = 0;

cssFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileChanges = 0;

  // Replace text colors
  Object.entries(textColorMap).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileChanges += matches.length;
      content = content.replace(regex, newColor);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)} (${fileChanges} changes)`);
    totalChanges += fileChanges;
  } else {
    console.log(`➖ No changes needed for ${path.basename(filePath)}`);
  }
});

console.log(`\n🎉 Total: ${totalChanges} color replacements across ${cssFiles.length} files`);

