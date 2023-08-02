import fs from 'fs';
import dedent from 'dedent-js';
import zlib from 'zlib';
import { homedir } from 'os';
import { join } from 'path';


const UnzipFile = async (archivedFile) => {
  try {
    console.log(archivedFile);
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(join(homedir(), archivedFile))) {
        reject(new Error(`${archivedFile} отсутствует!`));
      }
      const fileNameXml = archivedFile.replace(/\.gz/, "");
      const readFile = fs.createReadStream(join(homedir(), archivedFile))
        .pipe(zlib.createGunzip())
        .pipe(fs.createWriteStream(join(homedir(), fileNameXml)));
      readFile.on('finish', () => {
        fs.unlinkSync(join(homedir(), archivedFile));
        resolve(fileNameXml);
      });
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} распаковки файла 
            ${e.message}
            `
    );
  }
};

const GetInfoAboutFile = async (fileName) => {
  try {
    return new Promise((resolve, reject) => {
      fs.stat(join(homedir(), fileName), function (err, stats) {
        if (err) {
          reject(err);
        }
        else {
          resolve((Math.round(stats.size * 0.0009765625) * 10) / 10000);
        }
      }
      );
    });
  } catch (e) {
    console.log(
      dedent`
          ${chalk.bgRed(' ОШИБКА ')} чтения файла 
          ${e.message}
          `
    );
  }
};

export { UnzipFile, GetInfoAboutFile };
