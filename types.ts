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

export enum MemberType {
  REGULAR = '一般會員',
  PREMIUM = '高級會員',
  PROJECT_MANAGER = '項目主管',
  ADMIN = '系統管理員'
}

export interface User {
  id?: string | number;
  uid?: string;
  memberId?: string; // 新增：JD-XXXXX 格式編號
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

export interface TradeConfig {
  commodities: string[];
  paymentTerms: string[];
  incoterms: string[];
}

export interface MarketData {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  time: string;
  category: string;
  summary?: string;
}

export interface ButtonConfig {
  id: string;
  text: string;
  link: string;
}

export interface AppConfig {
  logoText: string;
  logoIcon: string;
  heroSlides: HeroSlide[];
  buttons: ButtonConfig[];
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
  fileData?: string; 
}