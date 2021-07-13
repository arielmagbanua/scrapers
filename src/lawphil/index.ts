import { PDFOptions, PaperFormat, launch } from 'puppeteer';

/**
 * The main class for scraping Law Phil jurisprudence data bank.
 *
 * https://lawphil.net/
 */
export default class Index {
  /**
   * Constructor
   *
   * @param {string} url - The url scrape.
   */
  constructor(protected url: string | null = null) {}

  /**
   * Sets the url of the page to scrape.
   *
   * @param {string} url - The url of the page to scrape.
   * @return {Index}
   */
  pageUrl(url: string): Index {
    this.url = url;
    return this;
  }

  /**
   * Extract the data and return a pdf buffer.
   *
   * @param {string|undefined} savePath - The save path of the pdf.
   * @param {PaperFormat} format - The pdf format.
   * @return {Promise<Buffer | null>}
   */
  async pdf(
    savePath: string | undefined = undefined,
    format: PaperFormat = 'a4'
  ): Promise<Buffer | null> {
    if (!this.url) {
      return null;
    }

    // launch the browser
    const browser = await launch({ headless: true });

    // open new page
    const page = await browser.newPage();

    // go to the url
    await page.goto(this.url, { waitUntil: 'networkidle0' });

    // wait for the cookie button to show
    await page.waitForSelector('button#but ', {
      visible: true
    });

    // click the ok button
    await page.click('button#but');

    const dom = await page.$eval('center > table > tbody > tr:last-child', (e) => e.innerHTML);
    await page.setContent(dom);

    // TODO: Create the filename base on the url

    const options: PDFOptions = {
      path: savePath,
      format: format
    };

    return await page.pdf(options);
  }
}
