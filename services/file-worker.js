import fs from 'fs';
import zlib from 'zlib';
import { homedir } from 'os';
import { join } from 'path';

const UnzipFile = async (files) => {
  try {

    let fileNames = [];

    files.forEach(async file => {
      let fileName = file.replace(/\.gz/, "");
      fileNames.push(fileName);

      const readFile = fs.createReadStream(file)
        .pipe(zlib.createGunzip())
        .pipe(fs.createWriteStream(fileName));

      readFile.on('finish', () => {
        console.log('FINISH READ');
      });

      if (fileNames.length == files.length) {
        console.log(fileNames);
      }
    });







  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} распаковки файла 
            ${e}
            `
    );
  }
};


export { UnzipFile };
