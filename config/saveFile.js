const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '../out');
const saveFile = async (fileName, buf) => {

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
  
    fs.writeFileSync(path.resolve(baseDir, fileName), buf);
  }

  module.exports = saveFile;