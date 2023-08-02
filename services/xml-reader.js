import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import chalk from 'chalk';
import dedent from 'dedent-js';
const Parser = new XMLParser();

const XmlReader = async (data) => {
  try {
    const parseToJson = await Parser.parse(data);
    let url;
    if (parseToJson?.sitemapindex?.sitemap?.length) {
      url = parseToJson.sitemapindex.sitemap[Math.floor(Math.random() * parseToJson.sitemapindex.sitemap.length)].loc;
      return url;
    }
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')}
            XML Reader не удалось прочитать файл, 
            ${e.message}
            `
    );
  }
};

const CollectRandomUrls = async (fileName, countCheck) => {
  try {
    let urls = [];
    return new Promise((resolve, reject) => {
      fs.readFile(join(homedir(), fileName), 'utf8', async (err, data) => {
        if (err) {
          reject("\x1b[31mФайл не найден!\x1b[0m -", err.message);
        }
        if (data) {
          const urlFromFile = await Parser.parse(data);
          const totalLinks = urlFromFile.urlset.url.length;
          if (countCheck > totalLinks) countCheck = totalLinks;
          for (let i = 0; i < countCheck; i++) {
            urls.push(urlFromFile.urlset.url[Math.floor(Math.random() * urlFromFile.urlset.url.length)].loc);
            if (urls.length == countCheck) {
              fs.unlinkSync(join(homedir(), fileName));
              resolve({ urls, totalLinks, countCheck });
            }
          }
        }
      });

    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')}
            CollectRandomUrls не удалось получить прочитать файл, 
            ${e.message}
            `
    );
  }
};

export { XmlReader, CollectRandomUrls };
