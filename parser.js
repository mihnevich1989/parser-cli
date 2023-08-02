import dedent from 'dedent-js';
import { GetSitemap, DownloadArchive, GetStatusCodeAndReport } from './services/web-worker.js';
import { XmlReader, CollectRandomUrls } from './services/xml-reader.js';
import chalk from 'chalk';
import { GetInfoAboutFile, UnzipFile } from './services/file-worker.js';


const SERVER = process.argv[2];
const SITEMAP = process.argv[3];
const COUNT = process.argv[4] || 300;

const parserCLI = async () => {
  try {
    let parser;
    const sitemap = await GetSitemap(SITEMAP);
    if (!SITEMAP.includes('.xml.gz')) parser = await XmlReader(sitemap);
    const archive = await DownloadArchive(parser ?? SITEMAP);
    const unzipedFile = await UnzipFile(archive);
    const fileSize = await GetInfoAboutFile(unzipedFile);
    const collectRandomUrls = await CollectRandomUrls(unzipedFile, COUNT);
    await GetStatusCodeAndReport(collectRandomUrls.urls, SERVER, unzipedFile, collectRandomUrls.totalLinks, fileSize, collectRandomUrls.countCheck);
  } catch (e) {
    console.log(
      dedent`
            ${chalk.bgRed(' ОШИБКА ')} верхнего уровня 
            ${e.message}
            `
    );
  }
};

parserCLI();
