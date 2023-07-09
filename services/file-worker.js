import fs from 'fs';
import zlib from 'zlib';
import { homedir } from 'os';
import { join } from 'path';
import * as fflate from 'fflate';


const UnzipFile = async (files) => {
  try {
    let fileNames = [];
    files.forEach(async file => {
      let fileName = file.replace(/\.gz/, "");
      fileNames.push(fileName);
      console.log(fileName);


      const readFile = fs.createReadStream(join(homedir(), file));
      const decompressed = fflate.decompressSync(readFile);
      console.log(decompressed);
      
      // const readFile = fs.createReadStream(join(homedir(), file),);
      // const writeFile = fs.createWriteStream(join(homedir(), fileName));
      // readFile.pipe(zlib.createUnzip()).pipe(writeFile)
      /* .pipe(zlib.createGunzip())
      .pipe(fs.createWriteStream(join(homedir(), fileName))); */
      /* if (fileNames.length == files.length) {
        console.log('all file completed', fileNames);
      } */
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
