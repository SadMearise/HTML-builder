const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = process;

function convertBytesToKb(bytes) {
  return `${(bytes / 1024).toFixed(3)}kb`;
}

const pathToDir = path.join(__dirname, 'secret-folder');

async function getFilesInfo(pathToDir) {
  const files = await readdir(pathToDir, {withFileTypes: true});

  for (const file of files) {
    if (!file.isFile()) continue;

    const filenameDotIndex = file.name.lastIndexOf('.');
    const filename = file.name.slice(0, filenameDotIndex);
    const pathToFile = path.join(pathToDir, file.name);
    const extension = path.extname(file.name).slice(1);
    const fileInfo = await stat(pathToFile);
    const fileSize = convertBytesToKb(fileInfo.size);
    stdout.write(`${filename} - ${extension} - ${fileSize}\n`);
  }
}

getFilesInfo(pathToDir);
