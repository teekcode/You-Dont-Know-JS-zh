const fs = require('fs');

let files = [];

function ScanDir(path) {
    let that = this;
    if(fs.statSync(path).isFile()){
        return files.push(path)
    }
    try {
        fs.readdirSync(path).forEach(file =>
            ScanDir.call(that, path + '\\' + file)
        )
    } catch (e) {
        console.log("error")
    }
}

ScanDir(process.cwd())
console.log(files);