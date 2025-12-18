
export interface URLFeatures {
  url: string;
  length: number;
  hasAtSymbol: boolean;
  hasHttps: boolean;
  dotCount: number;
  isIPAddress: boolean;
}

export interface AnalysisResult {
  isPhishing: boolean;
  confidence: number;
  riskScore: number; // 0 to 100
  aiVerdict: string;
  features: URLFeatures;
}

export enum ActiveTab {
  ANALYZER = 'analyzer',
  CODEBASE = 'codebase',
  LEARNING = 'learning'
}

export interface PythonFile {
  name: string;
  content: string;
  language: string;
}
