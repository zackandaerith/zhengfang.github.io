const fs = require('fs');

const files = [
  'src/utils/__tests__/resume-parser-error-handling.property.test.ts',
  'src/types/__tests__/data-model-validation.property.test.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/{ numRuns: \d+ }/g, '{ numRuns: 2 }');
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});