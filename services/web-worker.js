import axios from 'axios';
import https from 'https';
import fs from 'fs';
import * as stream from 'stream';
import dedent from 'dedent-js';
import chalk from 'chalk';
import { promisify } from 'util';
import { homedir } from 'os';
import { join } from 'path';
import { getPath } from '../helpers/path.js';
import { ReportGenerator } from './report-generator.js';


const GetSitemap = async (url) => {
  try {
    return new Promise(async (resolve, reject) => {
      const response = await axios.get(url);
      if (response.data.includes('Incapsula')) {
        reject(new Error(dedent`
        Ошибка получения доступа: ${url}: ${chalk.yellow('Status Code')} ${chalk.red(403)}`));
      }
      if (response.status == 404) {
        reject(new Error(dedent`
      Ошибка получения доступа: ${url}: ${chalk.yellow('Status Code')} ${chalk.red(response.status)}`));
      }
      if (url.includes('.xml.gz')) {
        resolve();
      }
      resolve(response.data);
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
    return new Promise((resolve, reject) => {
      const pipeline = promisify(stream.pipeline);
      const fileName = fileUrl.slice(fileUrl.lastIndexOf('/') + 1);
      axios.get(fileUrl, { responseType: 'stream' })
        .then(response => {
          pipeline(response.data, fs.createWriteStream(join(homedir(), fileName)).on('finish', () => { resolve(fileName); }));
        }).catch(function (error, response) {
          if (error) {
            reject(new Error(dedent`
          Ошибка скачивания файла: ${fileUrl} 
          ${chalk.yellow('Error:')} ${chalk.red(error.message)}`));
          }
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
        https.request(`${replacedUrl}`, (res) => {
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
          }, 7 * i);
        }).on('error', (e) => { console.error(`Ошибка ЗАПРОСА: ${e.message}`); }).end();
      }, 100 * i);
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
