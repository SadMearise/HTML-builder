const path = require('path');
const { mkdir, readFile, writeFile, readdir, copyFile, rm } = require('node:fs/promises');
const fs = require('fs');

const getDir = (pathToDir) => path.join(__dirname, pathToDir);

async function createDir(dirName) {
  const assets = path.join(getDir(dirName), 'assets');

  await rm(assets, { recursive: true, force: true });
  await mkdir(assets, { recursive: true });

  copyDir(getDir('assets'), path.join(getDir('project-dist'), 'assets'));
  mergeFiles('styles');
}

async function copyDir(from, to) {
  const items = await readdir(from, {withFileTypes: true});

  for (const item of items) {
    const { name } = item;

    if (item.isFile()) {
      await copyFile(path.join(from, name), path.join(to, name));
    } else {
      const pathFromFolder = path.join(from, name);
      const pathToFolder = path.join(getDir('project-dist'), 'assets', name);

      await mkdir(pathToFolder, { recursive: true });
      copyDir(pathFromFolder, pathToFolder);
    }
  }
}

async function replaceHtml(templateName) {
  const template = getDir(templateName);
  let templateContent = await readFile(template, 'utf-8');
  const replacementExpressions = templateContent.match(/{{[a-z.]+}}/gi);
  
  if (replacementExpressions) {
    for (const expression of replacementExpressions) {
      const componentFilename = `${expression.replace(/{{(.*)}}/, '$1')}.html`;
      const component = await readFile(path.join(getDir('components'), componentFilename), 'utf-8');
      
      templateContent = templateContent.replace(expression, component);
    }
  }

  writeFile(path.join(getDir('project-dist'), 'index.html'), templateContent);
}

async function mergeFiles(dirName) {
  const files = await readdir(getDir(dirName));
  const outputFile = path.join(getDir('project-dist'), 'style.css');
  const writeStream = fs.createWriteStream(outputFile, 'utf-8');

  for (const file of files) {
    if (path.extname(file) !== '.css') continue;

    const content = await readFile(path.join(getDir(dirName), file), 'utf-8');
    writeStream.write(`${content}\n`);
  }
}

createDir('project-dist');
replaceHtml('template.html');
