import { PDFOptions, PaperFormat, launch } from 'puppeteer';

/**
 * The main class for scraping Law Phil jurisprudence data bank.
 *
 * https://lawphil.net/
 */
export default class LawPhil {
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
   * @return {LawPhil}
   */
  pageUrl(url: string): LawPhil {
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
    await page.goto(this.url);

    const dom = await page.$eval('center > table > tbody > tr:last-child', (element: Element) => {
      // remove all back links
      const block = element.querySelectorAll('a[href$="javascript:history.back(1)"]');

      if (block) {
        block.forEach((e: Element) => {
          if (e.parentNode) {
            e.parentNode.removeChild(e);
          }
        });
      }

      // wrap the content with proper table
      return `
        <table>
          <tbody>
            <tr>${element.innerHTML}</tr>
          </tbody>
        </table>
      `;
    });

    await page.setContent(dom);

    const options: PDFOptions = {
      path: savePath,
      format: format
    };

    return await page.pdf(options);
  }
}
