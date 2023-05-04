const path = require('path');
const fs = require('fs');
const { readdir, readFile } = require('fs/promises');

const pathToDir = path.join(__dirname, 'styles');

async function mergeFiles() {
  const files = await readdir(pathToDir);
  const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(outputFile, 'utf-8');
  
  for (const file of files) {
    if (path.extname(file) !== '.css') continue;

    const content = await readFile(path.join(pathToDir, file), 'utf-8');
    writeStream.write(`${content}\n`);
  }
}

mergeFiles();
