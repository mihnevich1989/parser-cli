import dedent from 'dedent-js';
import { GetSitemap, DownloadArchive, GetStatusCodeAndReport } from './services/web-worker.js';
import { XmlReader, CollectRandomUrls, CollectRandomUrlsFromWebXML } from './services/xml-reader.js';
import chalk from 'chalk';
import { GetInfoAboutFile, UnzipFile } from './services/file-worker.js';
import { performance } from 'perf_hooks';


const SERVER = process.argv[2];
const SITEMAP = process.argv[3];
const COUNT = process.argv[4] || 300;

const parserCLI = async () => {
  try {
    if (!SITEMAP.includes('.xml')) {
      throw new Error('Некорректная сайтмапа');
    }
    const time = performance.now();
    let parser;
    let fileSize = null;
    let collectRandomUrls = null;
    const sitemap = await GetSitemap(SITEMAP);

    if (!SITEMAP.includes('.xml.gz')) {

      console.log('here 0');

      parser = await XmlReader(sitemap);
    }

    if (!!parser && !parser.includes('.xml.gz') && parser.includes('.xml')) {

      console.log('here 1');

      const nextLevelSitemap = await GetSitemap(parser);
      collectRandomUrls = await CollectRandomUrlsFromWebXML(nextLevelSitemap, COUNT);
      await GetStatusCodeAndReport(collectRandomUrls.urls, SERVER, parser, collectRandomUrls.totalLinks, null, collectRandomUrls.countCheck, time);

    } else if (!!parser && !parser.includes('.xml.gz') && !parser.includes('.xml')) {

      console.log('here 2');

      collectRandomUrls = await CollectRandomUrlsFromWebXML(parser, COUNT);
      await GetStatusCodeAndReport(collectRandomUrls.urls, SERVER, SITEMAP, collectRandomUrls.totalLinks, null, collectRandomUrls.countCheck, time);

    } else {

      console.log('here 3');

      const archive = await DownloadArchive(parser ?? SITEMAP);
      const unzipedFile = await UnzipFile(archive);
      fileSize = await GetInfoAboutFile(unzipedFile);
      collectRandomUrls = await CollectRandomUrls(unzipedFile, COUNT);
      await GetStatusCodeAndReport(collectRandomUrls.urls, SERVER, unzipedFile, collectRandomUrls.totalLinks, fileSize, collectRandomUrls.countCheck, time);
    }

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
