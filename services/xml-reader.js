import { XMLParser } from 'fast-xml-parser';
import { getPath } from '../helpers/path.js';
import chalk from 'chalk';
import dedent from 'dedent-js';
const Parser = new XMLParser();

const XmlReader = async (data) => {
  try {
    const parseToJson = await Parser.parse(data);
    let URLs = [];
    if (parseToJson?.sitemapindex?.sitemap?.length) {
      parseToJson.sitemapindex.sitemap.forEach((obj, i, arr) => {
        /* if (i == 0) URLs.push(obj.loc);
        if (i == (arr.length - 1) / 2) URLs.push(obj.loc);
        if (i == arr.length - 1) URLs.push(obj.loc); */
      });
      URLs.push(parseToJson.sitemapindex.sitemap[Math.floor(Math.random() * parseToJson.sitemapindex.sitemap.length)].loc);
      return URLs;
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


export { XmlReader };
