import axios from 'axios';
import { get } from 'https';
import { getPath } from '../helpers/path.js';
import * as stream from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import dedent from 'dedent-js';
import chalk from 'chalk';
import { ReportGenerator } from './report-generator.js';


const GetSitemap = async (url) => {
  try {
    return new Promise(async (resolve, reject) => {
      const response = await axios.get(url);
      if (response.data.includes('Incapsula')) {
        reject(new Error(dedent`
        Ошибка получения доступа: ${url}: ${chalk.yellow('Status Code')} ${chalk.red(403)}`));
      } else {
        if (url.includes('.xml.gz')) {
          resolve();
        }
        resolve(response.data);
      }
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} получения контента sitemap 
            ${e.message}
            `
    );
  }
};

const DownloadArchive = async (fileUrl) => {
  try {
    return new Promise((resolve) => {
      const pipeline = promisify(stream.pipeline);
      const fileName = fileUrl.slice(fileUrl.lastIndexOf('/') + 1);
      axios.get(fileUrl, { responseType: 'stream' })
        .then(response => {
          pipeline(response.data, fs.createWriteStream(join(homedir(), fileName)).on('finish', () => { resolve(fileName); }));
        });
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} скачивания файла 
            ${e.message}
            `
    );
  }
};

const GetStatusCodeAndReport = async (urls, server, unzipedFile, totalLinks, fileSize, countCheck, startTime) => {
  try {
    let fails = 0;

    urls.forEach((url, i) => {
      const replacedUrl = (server.includes('leadar') ? `${server.slice(0, 8)}${username}:${password}@${server.slice(8)}` : `${server}`) + getPath(url);
      setTimeout(async function () {
        await get(`${replacedUrl}`, (res) => {
          if (res.statusCode !== 200) {
            fails++;
            console.log(`${replacedUrl} - ${chalk.yellow('Status Code:')} ${chalk.bgRed(res.statusCode)}`);
          } else {
            console.log(`${replacedUrl} - ${chalk.yellow('Status Code:')} ${chalk.green(res.statusCode)}`);
          }
          setTimeout(function () {
            if (i + 1 == countCheck) {
              ReportGenerator(unzipedFile, totalLinks, fileSize, countCheck, fails, startTime);
            }
          }, 5 * i);
        });
      }, 30 * i);
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} скачивания файла 
            ${e.message}
            `
    );
  }
};

export { GetSitemap, DownloadArchive, GetStatusCodeAndReport };
