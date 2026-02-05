import { HeroSlide, TradeConfig, User, AppConfig, MemberType, TradeSubmission, MarketQuote, IndustryNews, SystemAnnouncement } from './types';

export const INITIAL_APP_CONFIG: AppConfig = {
  logoText: 'JD MORGAN',
  logoIcon: 'fa-earth-americas',
  heroSlides: [
    { 
      id: '1', 
      img: 'https://40072.jdmorgan.ca/pictures/hero-gold.jpg', 
      title: '黃金現貨交易', 
      titleEn: 'GOLD SPOT TRADING',
      subtitle: 'Gold Spot Trading & Wealth Management', 
      subtitleEn: 'Wealth Management Terminal',
      order: 1 
    },
    { 
      id: '2', 
      img: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2070&auto=format&fit=crop', 
      title: '全球能源配置', 
      titleEn: 'GLOBAL ENERGY ALLOCATION',
      subtitle: 'Global Energy Allocation Network', 
      subtitleEn: 'Sustainable Resource Terminal',
      order: 2 
    },
    { 
      id: '3', 
      img: 'https://images.unsplash.com/photo-1566433311776-e7843431637c?q=80&w=2070&auto=format&fit=crop', 
      title: '大宗物資貿易', 
      titleEn: 'BULK COMMODITY TRADING',
      subtitle: 'Bulk Commodity Trading & Logistics', 
      subtitleEn: 'Global Logistics Network',
      order: 3 
    }
  ],
  announcements: [
    { id: 'ann_1', title: '系統安全升級：引入 AI 智能物資分配演算法 V3.0', content: '我們已在所有核心交易終端部署了最新的量化分配系統，顯著提升 LOI 與 SCO 的自動對接效率。', date: '2026-05-12', isPriority: true }
  ],
  quotes: [
    { id: 'q_1', symbol: 'XAU/USD (Gold)', price: '2,345.20', change: '+1.45%', isUp: true, sourceUrl: 'https://www.kitco.com' },
    { id: 'q_2', symbol: 'EN590 (Diesel)', price: '845.00', change: '-0.20%', isUp: false, sourceUrl: 'https://www.platts.com' },
    { id: 'q_3', symbol: 'XAG/USD (Silver)', price: '28.14', change: '+0.85%', isUp: true, sourceUrl: 'https://www.kitco.com' },
    { id: 'q_4', symbol: 'BRENT OIL', price: '84.15', change: '-1.10%', isUp: false, sourceUrl: 'https://www.bloomberg.com' }
  ],
  industryNews: [
    { id: 'news_1', title: '全球銅礦供應預期下調，基礎金屬市場走強', time: '3小時前', category: '金屬', sourceUrl: 'https://www.reuters.com' },
    { id: 'news_2', title: '中東局勢持續緊張，能源供應鏈面臨新挑戰', time: '1小時前', category: '能源', sourceUrl: 'https://www.bloomberg.com' }
  ]
};

// Fix: Export missing members required by MemberDashboard.tsx
export const MARKET_DATA = INITIAL_APP_CONFIG.quotes;
export const NEWS_ITEMS = INITIAL_APP_CONFIG.industryNews;

export const MOCK_USERS: User[] = [
  { uid: 'mock_admin_1', username: 'Info@jdmorgan.ca', role: 'admin', name: 'JD Morgan Admin', memberType: MemberType.PROJECT_MANAGER, isApproved: true },
  { uid: 'mock_client_1', username: 'client', role: 'client', name: 'Valued Member', country: 'Singapore', email: 'member@jdmorgan.com', memberType: MemberType.PREMIUM, isApproved: true }
];

export const INITIAL_SUBMISSIONS: TradeSubmission[] = [];

export const INITIAL_CONFIG: TradeConfig = {
  commodities: ['Gold Bullion (AU)', 'Crude Oil (Brent/WTI)', 'LNG (Liquefied Natural Gas)', 'Copper Cathodes', 'Iron Ore', 'Soybeans', 'Sugar (ICUMSA 45)', 'Refined Fuel (EN590)'],
  paymentTerms: ['DLC', 'SBLC', 'T/T', 'Escrow'],
  incoterms: ['FOB', 'CIF', 'TTO']
};

export const COUNTRIES = ['China', 'Taiwan', 'Singapore', 'Hong Kong', 'Malaysia', 'Canada', 'Kazakhstan', 'USA', 'UK', 'Germany', 'Japan', 'South Korea', 'UAE', 'Saudi Arabia', 'Australia'];