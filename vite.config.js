import { defineConfig } from 'vite';
import { resolve, extname, relative } from 'path';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to recursively find all HTML files
const getHtmlFiles = (dir, filesList = []) => {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = resolve(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== 'public') {
        getHtmlFiles(filePath, filesList);
      }
    } else if (extname(file) === '.html') {
      filesList.push(filePath);
    }
  }
  return filesList;
};

const getHtmlInputs = () => {
  const inputs = {};
  const htmlFiles = getHtmlFiles(__dirname);
  
  htmlFiles.forEach(file => {
    const relPath = relative(__dirname, file);
    // Replace separators and extension for entry key
    const name = relPath.replace(/\.html$/, '').replace(/\\/g, '/');
    inputs[name] = file;
  });
  
  return inputs;
};

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
});
