import dedent from 'dedent-js';
import { GetSitemap, DownloadArchive } from './services/web-worker.js';
import { XmlReader } from './services/xml-reader.js';
import chalk from 'chalk';
import { UnzipFile } from './services/file-worker.js';

// 'https://nuwber.com/sitemaps/doD2NmDRD2hk.xml';

const parserCLI = async (url) => {
  try {

    const sitemap = await GetSitemap(/* url */ 'https://nuwber.com/sitemaps/doD2NmDRD2hk.xml');
    const parser = await XmlReader(sitemap);
    const archive = await DownloadArchive(parser);
    const unzipAndRead = await UnzipFile(archive);
    console.log(archive);
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} верхнего уровня 
            ${e}
            `
    );
  }
};

parserCLI();
