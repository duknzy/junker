import fs from 'fs';

const html = fs.readFileSync('custom-sprint.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Found scripts:', scriptMatches.length);

scriptMatches.forEach((m, idx) => {
    let code = m[1];
    // Remove import and export statements for simple Function evaluation
    code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import removed');
    code = code.replace(/export\s+[\s\S]*?;/g, '// export removed');
    try {
        new Function(code);
        console.log(`Script ${idx + 1}: Syntax VALID`);
    } catch (e) {
        console.error(`Script ${idx + 1}: Syntax ERROR ->`, e.message);
    }
});
