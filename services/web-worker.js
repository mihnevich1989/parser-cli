import axios from 'axios';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import dedent from 'dedent-js';
import chalk from 'chalk';

const GetSitemap = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const DownloadArchive = async (urls) => {
  try {
    return new Promise((resolve, reject) => {
      if (!urls.length) reject('Ссылки не были получены');
      let files = [];
      urls.forEach(async url => {
        const fileName = url.slice(url.lastIndexOf('/') + 1);
        const writer = fs.createWriteStream(join(homedir(), fileName));
        const response = await axios({
          method: 'get',
          url,
          responseType: 'stream',
        });
        await response.data.pipe(writer);
        files.push(fileName);
        if (files.length == urls.length) resolve(files);
      });
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} скачивания файла 
            ${e}
            `
    );
  }
};

export { GetSitemap, DownloadArchive };
