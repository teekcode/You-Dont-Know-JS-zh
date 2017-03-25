const readline  = require('readline');
const fs        = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('tmp.txt')
});

rl.on('line', (line) => {
    console.log(`Line from file: ${line}`);
});