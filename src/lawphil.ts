// import * as puppeteer from 'puppeteer';
import { PDFOptions, PaperFormat, launch } from 'puppeteer';

class LawPhil {
  constructor(protected url: string | null = null) { }

  pageUrl(url: string) {
    this.url = url;
    return this;
  }

  async pdf(savePath: string | undefined = undefined, format: PaperFormat = 'a4') {
    if (!this.url) {
      return null;
    }

    // launch the browser
    const browser = await puppeteer.launch({ headless: true });

    // open new page
    const page = await browser.newPage();

    // go to the url
    await page.goto(this.url, { waitUntil: 'networkidle0' });

    // wait for the cookie button to show
    await page.waitForSelector('button#but ', {
      visible: true,
    });

    // click the ok button
    await page.click('button#but');

    const dom = await page.$eval('center > table > tbody > tr:last-child', (e) => e.innerHTML);
    await page.setContent(dom);

    // create the filename base on the url


    let options: PDFOptions = {
      path: savePath,
      format: format
    };

    return await page.pdf(options);
  }
}
