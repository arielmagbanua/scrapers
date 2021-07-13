import LawPhil from '../index';

/**
 * The use case for getting the page content.
 *
 * @param {string} url - The url of the page to scrape.
 * @param {string | undefined} savePath - The directory path to optionally save the pdf file.
 */
export default async (
  url: string,
  savePath: string | undefined = undefined
): Promise<Buffer | null> => {
  return await new LawPhil(url).pdf(savePath);
};
