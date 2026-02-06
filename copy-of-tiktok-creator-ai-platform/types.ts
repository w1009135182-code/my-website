
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  sales: number;
  reviews: number;
  currency: string;
}

export interface Creator {
  id: string;
  nickname: string;
  avatar: string;
  region: string;
  followers: number;
  videos: number;
  likes: number;
  engagementRate: number;
  tags: string[];
  matchScore?: number;
  recommendReason?: string;
  notRecommendReason?: string;
  isFavorite?: boolean;
  // New fields
  source?: 'SMART_MATCHING' | 'HOT_CREATORS';
  lastAnalyzedAt?: string; // ISO Date string or null if never analyzed
  analysisTags?: string[]; // New: Tags generated from batch analysis
  isNew?: boolean; // New: Visual indicator for recently analyzed creators
  followerGrowth?: number; // Growth percentage
}

export interface AnalysisRecord {
  id: string;
  product: Product;
  createdAt: string;
  createdBy: string;
  creatorCount: number;
  recommendedCount: number;
  contactedCount: number;     // New: Successfully contacted
  collaboratedCount: number;  // New: Successfully collaborated
  
  creators: Creator[];
  
  // New: AI Strategy Summary Data
  strategySummary?: {
    overview: string;
    conversionRate: number;
    highConversionTraits: string[];
    optimizationTips: string;
  };
}

export interface MatchDimension {
  score: number;
  items: string[];
}

export interface SalesPerformance {
  last30Days: {
    gmv: number;
    itemsSold: number;
    avgPrice: number;
  };
  video: {
    count: number;
    sales: number;
    gom: number; // Gross per Mille (Revenue per 1k views)
    avgViews: number;
  };
  live: {
    count: number;
    sales: number;
    gpm: number; // Gross per Mille
    avgViews: number;
  };
  updatedAt?: string;
}

export interface VideoInfo {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  views: number;
  tags: string[];
}

export interface AnalysisReport {
  creatorId: string;
  audience: {
    gender: { name: string; value: number }[];
    age: { name: string; value: number }[];
  };
  
  // Changed from boolean to detailed object or null
  salesData?: SalesPerformance | null;
  
  // Detailed match analysis
  matchDetails: {
    audienceOverlap: MatchDimension;
    contentRelevance: MatchDimension;
    promotionPotential: MatchDimension;
    engagementQuality: MatchDimension;
  };

  swot: {
    advantages: string[];
    risks: string[];
  };
  suggestions: {
    format: string;
    commission: string;
    scripts: string[];
    message: string;
  };
  relevantVideos?: VideoInfo[];
}

export type Page = 'SMART_MATCHING' | 'HOT_CREATORS' | 'FAVORITES';
export type SubPage = 'HISTORY' | 'NEW_ANALYSIS' | 'ANALYSIS_RESULT';