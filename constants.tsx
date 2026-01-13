import { HeroSlide, TradeConfig, User, MarketData, NewsItem, AppConfig, MemberType, TradeSubmission } from './types';

export const INITIAL_APP_CONFIG: AppConfig = {
  logoText: 'JD MORGAN',
  logoIcon: 'fa-earth-americas',
  heroSlides: [
    { id: '1', img: 'https://40072.jdmorgan.ca/pictures/hero-gold.jpg', title: '黃金現貨交易', subtitle: 'Gold Spot Trading & Wealth Management', order: 1 },
    { id: '2', img: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2070&auto=format&fit=crop', title: '全球能源配置', subtitle: 'Global Energy Allocation Network', order: 2 },
    { id: '3', img: 'https://images.unsplash.com/photo-1566433311776-e7843431637c?q=80&w=2070&auto=format&fit=crop', title: '大宗物資貿易', subtitle: 'Bulk Commodity Trading & Logistics', order: 3 }
  ],
  buttons: [
    { id: 'cta_primary', text: '進入交易大廳', link: 'login' },
    { id: 'cta_secondary', text: '關於我們', link: 'home' }
  ]
};

export const MOCK_USERS: User[] = [
  { uid: 'mock_admin_1', username: 'Info@jdmorgan.ca', role: 'admin', name: 'JD Morgan Admin', memberType: MemberType.PROJECT_MANAGER, isApproved: true },
  { uid: 'mock_client_1', username: 'client', role: 'client', name: 'Valued Member', country: 'Singapore', email: 'member@jdmorgan.com', memberType: MemberType.PREMIUM, isApproved: true },
  { uid: 'mock_client_2', username: 'user1', role: 'client', name: '張先生', country: 'Taiwan', email: 'user1@example.com', memberType: MemberType.REGULAR, isApproved: false }
];

export const INITIAL_SUBMISSIONS: TradeSubmission[] = [
  { id: 'sub_1', type: 'buyer', commodity: 'Gold Bullion (AU)', quantity: '1000kg', price: '65000', timestamp: '2025-05-10 14:20', status: 'Pending', clientName: 'Alpha Energy Ltd' },
  { id: 'sub_2', type: 'seller', commodity: 'Crude Oil (Brent/WTI)', quantity: '500,000 BBL', price: '82', timestamp: '2025-05-10 13:55', status: 'Verified', clientName: 'Global Gold Group' },
  { id: 'sub_3', type: 'buyer', commodity: 'Copper Cathodes', quantity: '5000 MT', price: '8900', timestamp: '2025-05-10 12:10', status: 'In Review', clientName: 'Commodity Prime' }
];

export const INITIAL_CONFIG: TradeConfig = {
  commodities: [
    'Gold Bullion (AU)', 
    'Crude Oil (Brent/WTI)', 
    'LNG (Liquefied Natural Gas)', 
    'Copper Cathodes', 
    'Iron Ore', 
    'Soybeans', 
    'Sugar (ICUMSA 45)', 
    'Refined Fuel (EN590)'
  ],
  paymentTerms: ['DLC', 'SBLC', 'T/T', 'Escrow'],
  incoterms: ['FOB', 'CIF', 'TTO']
};

export const MARKET_DATA: MarketData[] = [
  { symbol: 'XAU/USD', price: '2,045.20', change: '+0.45%', isUp: true },
  { symbol: 'BRENT OIL', price: '82.14', change: '-1.20%', isUp: false },
  { symbol: 'WTI OIL', price: '77.85', change: '-0.85%', isUp: false },
  { symbol: 'COPPER', price: '3.88', change: '+1.15%', isUp: true },
  { symbol: 'NAT GAS', price: '1.82', change: '+2.40%', isUp: true },
  { symbol: 'IRON ORE', price: '128.50', change: '-0.30%', isUp: false },
];

export const NEWS_ITEMS: NewsItem[] = [
  { id: 1, title: '美聯儲維持利率不變，金價窄幅震盪', time: '10分鐘前', category: '金融' },
  { id: 2, title: '中東局勢持續緊張，能源供應鏈面臨挑戰', time: '1小時前', category: '能源' },
  { id: 3, title: '全球銅礦供應預期下調，基礎金屬市場走強', time: '3小時前', category: '金屬' },
  { id: 4, title: 'JD Morgan 與主要產油國達成戰略分配協議', time: '5小時前', category: '公告' },
];

export const COUNTRIES = [
  'China', 'Taiwan', 'Singapore', 'Hong Kong', 'Malaysia', 'Canada', 'Kazakhstan', 'USA', 'UK', 'Germany', 'Japan', 'South Korea', 'UAE', 'Saudi Arabia', 'Australia'
];