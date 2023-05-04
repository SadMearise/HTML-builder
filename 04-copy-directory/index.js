const { mkdir, copyFile, readdir, rm } = require('node:fs/promises');
const path = require('path');

function pathToDir(dirName) {
  return path.join(__dirname, dirName);
}

async function createDir(dirName) {
  const path = pathToDir(dirName);

  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });

  copyDir('files', 'files-copy');
}

async function copyDir(from, to) {
  const copyFrom = pathToDir(from);
  const copyTo = pathToDir(to);
  const files = await readdir(copyFrom);

  for (const file of files) {
    copyFile(path.join(copyFrom, file), path.join(copyTo, file));
  }
}

createDir('files-copy');
