import fs from 'fs';
import path from 'path';

function searchFiles(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') searchFiles(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('単語・熟語ライブラリ') || content.includes('mission_control')) {
        console.log('Match in:', full);
      }
    }
  }
}

searchFiles('C:/Users/kokih/OneDrive/ドキュメント/GitHub/hull/src');
