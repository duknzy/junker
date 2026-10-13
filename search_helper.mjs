import fs from 'fs';

const content = fs.readFileSync('past-exam.html', 'utf8');
const lines = content.split('\n');

const keyword = process.argv[2] || 'modal';
const found = [];
lines.forEach((line, idx) => {
  if (line.includes(keyword)) {
    found.push({ line: idx + 1, text: line.trim().substring(0, 100) });
  }
});

console.log(`Found ${found.length} lines containing "${keyword}":`);
found.slice(0, 20).forEach(f => console.log(`  L${f.line}: ${f.text}`));
