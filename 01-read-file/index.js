const path = require('path');
const fs = require('fs');
const { stdout } = process;

const filename = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filename, 'utf-8');

readStream.on('data', (data) => stdout.write(data));
