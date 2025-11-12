import type { ChapterData } from '../types';

const API_URL = 'https://bible-api.com/';

export const fetchReference = async (query: string): Promise<ChapterData> => {
  const url = `${API_URL}${encodeURIComponent(query)}?translation=almeida`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro na rede ou referência não encontrada.');
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  // Normalize response to always be ChapterData
  if (data.verses) {
    // It's a chapter response
    return {
      ...data,
      verses: data.verses.map((v: any) => ({
        verse: v.verse,
        text: v.text.replace(/\n/g, ' ').trim(),
      })),
    };
  } else {
    // It's a single verse response, wrap it to look like ChapterData
    const verseNumMatch = data.reference.match(/:(\d+)$/);
    const verseNum = verseNumMatch ? parseInt(verseNumMatch[1], 10) : 1;
    return {
      ...data,
      verses: [{ verse: verseNum, text: data.text.replace(/\n/g, ' ').trim() }],
    };
  }
};
