const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        const filepath = path.join(dir, file);
        const content = fs.readFileSync(filepath, 'utf8');
        
        // Find const ComponentName = ...
        const match = content.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=/);
        if (match) {
            const name = match[1];
            if (!content.includes(`export default ${name}`)) {
                fs.writeFileSync(filepath, content + `\nexport default ${name};\n`);
                console.log(`Exported ${name} in ${file}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'components'));
processDir(path.join(__dirname, 'pages'));
