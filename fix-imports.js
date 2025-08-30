import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixImports(filePath);
    } else if (file.name.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix relative imports - handle directory imports that should point to index.js
      content = content.replace(
        /import\s+(.+?)\s+from\s+['"](\.[^'"]*?)(?<!\.js)['"]/g,
        (match, importPart, importPath) => {
          // Check if this is a directory import that needs /index.js
          const fullPath = path.resolve(path.dirname(filePath), importPath);
          const indexPath = path.join(fullPath, 'index.js');
          
          if (fs.existsSync(indexPath)) {
            return `import ${importPart} from '${importPath}/index.js'`;
          } else if (fs.existsSync(fullPath + '.js')) {
            return `import ${importPart} from '${importPath}.js'`;
          }
          return match; // Keep original if we can't resolve
        }
      );
      
      // Fix export from statements
      content = content.replace(
        /export\s+(.+?)\s+from\s+['"](\.[^'"]*?)(?<!\.js)['"]/g,
        (match, exportPart, importPath) => {
          // Check if this is a directory import that needs /index.js
          const fullPath = path.resolve(path.dirname(filePath), importPath);
          const indexPath = path.join(fullPath, 'index.js');
          
          if (fs.existsSync(indexPath)) {
            return `export ${exportPart} from '${importPath}/index.js'`;
          } else if (fs.existsSync(fullPath + '.js')) {
            return `export ${exportPart} from '${importPath}.js'`;
          }
          return match; // Keep original if we can't resolve
        }
      );
      
      fs.writeFileSync(filePath, content);
    }
  }
}

fixImports(path.join(__dirname, 'dist'));
console.log('Fixed all import paths to include .js extensions');