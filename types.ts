export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'published' | 'review';
  coverUrl?: string;
  keywords: string[];
  salesCount: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  units: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CREATE_BOOK = 'CREATE_BOOK',
  ANALYZE_COVER = 'ANALYZE_COVER',
  SETTINGS = 'SETTINGS'
}

export interface AIAnalysisResult {
  titleSuggestion?: string;
  descriptionSuggestion?: string;
  keywords?: string[];
  coverFeedback?: string;
  score?: number;
}