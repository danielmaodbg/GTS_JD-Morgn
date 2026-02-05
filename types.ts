export enum View {
  HOME = 'home',
  HOME_LEGACY = 'home-legacy',
  LOGIN = 'login',
  ROLE_SELECT = 'role-select',
  BUYER_FORM = 'buyer-form',
  SELLER_FORM = 'seller-form',
  ADMIN = 'admin',
  MEMBER_DASHBOARD = 'member-dashboard',
  DATABASE_TEST = 'database-test',
  VERIFY_EMAIL = 'verify-email',
  NEWS = 'news',
  DISCLAIMER = 'disclaimer',
  FRAUD_REPORT = 'fraud-report'
}

export enum Language {
  ZH = 'zh',
  EN = 'en'
}

export enum MemberType {
  REGULAR = '一般會員',
  PREMIUM = '高級會員',
  PROJECT_MANAGER = '項目主管',
  ADMIN = '系統管理員'
}

export interface User {
  id?: string | number;
  uid?: string;
  memberId?: string;
  username: string;
  role: 'admin' | 'client' | 'guest';
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  socialMedia?: string;
  memberType?: MemberType;
  createdAt?: any;
  isApproved?: boolean;
}

export interface HeroSlide {
  id: string;
  img: string;
  title: string;
  subtitle: string;
  order: number;
}

export interface MarketQuote {
  id: string;
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
  sourceUrl?: string;
}

export interface IndustryNews {
  id: string;
  title: string;
  time: string;
  category: string;
  sourceUrl?: string;
  summary?: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  isPriority: boolean;
}

export interface AppConfig {
  logoText: string;
  logoIcon: string;
  heroSlides: HeroSlide[];
  announcements: SystemAnnouncement[];
  quotes: MarketQuote[];
  industryNews: IndustryNews[];
}

export interface TradeConfig {
  commodities: string[];
  paymentTerms: string[];
  incoterms: string[];
}

export interface TradeSubmission {
  id: string;
  type: 'buyer' | 'seller';
  commodity: string;
  quantity: string;
  price: string;
  timestamp: string;
  status: 'Pending' | 'Verified' | 'In Review';
  clientName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactRegion?: string;
  socialType?: string;
  socialAccount?: string;
  fileName?: string;
  fileUrl?: string;
}