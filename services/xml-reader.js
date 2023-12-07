import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { getPath } from '../helpers/path.js';
import chalk from 'chalk';
import dedent from 'dedent-js';
const Parser = new XMLParser();

const XmlReader = async (data, subdomain) => {
  try {
    const parseToJson = await Parser.parse(data);
    let url;
    if (parseToJson?.sitemapindex?.sitemap.length) {
      url = parseToJson.sitemapindex.sitemap[Math.floor(Math.random() * parseToJson.sitemapindex.sitemap.length)].loc;
      if (subdomain != null) {
        return `${subdomain}${getPath(url)}`;
      } else {
        return url;
      }
    } else {
      return data;
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

const CollectRandomUrlsFromFile = async (fileName, countCheck) => {
  try {
    return new Promise((resolve, reject) => {
      fs.readFile(join(homedir(), fileName), 'utf8', async (err, data) => {
        if (err) {
          reject("\x1b[31mФайл не найден!\x1b[0m -", err.message);
        }
        if (data) {
          const result = await parseXmlData(data, true, countCheck, fileName);
          if (result) {
            resolve(result);
          }
        }
      });
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')}
            CollectRandomUrls не удалось прочитать файл, 
            ${e.message}
            `
    );
  }
};

const CollectRandomUrlsFromWebXML = async (xmlSitemap, countCheck) => {
  try {
    return new Promise(async (resolve, reject) => {
      const result = await parseXmlData(xmlSitemap, false, countCheck);
      if (result) {
        resolve(result);
      }
    });
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')}
            CollectRandomUrls не удалось прочитать xml, 
            ${e.message}
            `
    );
  }
};

async function parseXmlData(data, file = true, countCheck, ...fileName) {
  let urls = [];
  const urlFromFile = await Parser.parse(data);
  const totalLinks = urlFromFile.urlset.url.length;
  if (countCheck > totalLinks) countCheck = totalLinks;
  for (let i = 0; i < countCheck; i++) {
    urls.push(urlFromFile.urlset.url[Math.floor(Math.random() * urlFromFile.urlset.url.length)].loc);
    if (urls.length == countCheck) {
      if (file) fs.unlinkSync(join(homedir(), fileName[0]));
      return { urls, totalLinks, countCheck };
    }
  }
}

export { XmlReader, CollectRandomUrlsFromFile, CollectRandomUrlsFromWebXML };
