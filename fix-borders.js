const fs = require('fs');

// Border color mappings
const borderColorMap = {
  'border: 2px solid #e5e7eb': 'border: 2px solid var(--color-border)',
  'border: 1px solid #e5e7eb': 'border: 1px solid var(--color-border)',
  'border-color: #e5e7eb': 'border-color: var(--color-border)',
  'border-top: 1px solid #e5e7eb': 'border-top: 1px solid var(--color-border)',
  'border-bottom: 1px solid #e5e7eb': 'border-bottom: 1px solid var(--color-border)',
  'border: 2px dashed #e5e7eb': 'border: 2px dashed var(--color-border)',
  'background: #f3f4f6': 'background: var(--color-surface-secondary)',
  'background-color: #f3f4f6': 'background-color: var(--color-surface-secondary)',
};

// CSS files to process
const cssFiles = [
  'verein-web/src/pages/Vereine/VereinList.css',
  'verein-web/src/pages/Vereine/VereinDetail.css',
  'verein-web/src/pages/Mitglieder/MitgliedList.css',
  'verein-web/src/pages/Mitglieder/MitgliedDetail.css',
  'verein-web/src/pages/Veranstaltungen/VeranstaltungList.css',
  'verein-web/src/pages/Veranstaltungen/VeranstaltungDetail.css',
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

  // Replace border colors
  Object.entries(borderColorMap).forEach(([oldBorder, newBorder]) => {
    const regex = new RegExp(oldBorder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileChanges += matches.length;
      content = content.replace(regex, newBorder);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    const fileName = filePath.split('/').pop();
    console.log(`✅ Updated ${fileName} (${fileChanges} changes)`);
    totalChanges += fileChanges;
  } else {
    const fileName = filePath.split('/').pop();
    console.log(`➖ No changes needed for ${fileName}`);
  }
});

console.log(`\n🎉 Total: ${totalChanges} border/background replacements`);

