export interface ChapterData {
  reference: string;
  verses: {
    verse: number;
    text: string;
  }[];
  translation_name: string;
  translation_id: string;
}

export interface HighlightCategory {
  name: string;
  colorClass: string;
  colorName: string;
}

export interface Highlight {
  id: string;
  reference: string;
  text: string;
  categoryName: string;
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';