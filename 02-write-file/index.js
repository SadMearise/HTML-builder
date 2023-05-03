const { stdin: input, stdout: output} = require('node:process');
const path = require('path');
const fs = require('fs');
const readline = require('node:readline');

const pathToFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToFile, 'utf-8');

const rl = readline.createInterface({ input, output });

function sayBye() {
  rl.write('Bye!'); 
  rl.close();
}

rl.write('Здравствуйте, введите текст!\n');
rl.on('line', (data) => {
  if (data.trim() === 'exit') sayBye();
  else writeStream.write(`${data}\n`);
});

rl.on('SIGINT', sayBye);
