import LawPhil from '../index';

export default async (
  url: string,
  savePath: string | undefined = undefined
): Promise<Buffer | null> => {
  return await new LawPhil(url).pdf(savePath);
};
