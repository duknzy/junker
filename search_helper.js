const fs = require('fs');

const content = fs.readFileSync('past-exam.html', 'utf8');
console.log('past-exam.html length:', content.length);

// 検索
const lines = content.split('\n');
console.log('Total lines:', lines.length);

const keyword = process.argv[2] || 'modal';
const found = [];
lines.forEach((line, idx) => {
  if (line.includes(keyword)) {
    found.push({ line: idx + 1, text: line.trim().substring(0, 100) });
  }
});

console.log(`Found ${found.length} lines containing "${keyword}":`);
found.slice(0, 15).forEach(f => console.log(`  L${f.line}: ${f.text}`));
