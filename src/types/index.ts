export interface OrderTimeline {
  step: string;
  time: string;
  done: boolean;
}

export interface OrderData {
  orderId: string;
  customerName?: string;
  product?: string;
  amount?: string;
  status: 'in_transit' | 'delivered' | 'processing' | 'pending';
  statusText: string;
  carrier: string;
  shipperPhone?: string;
  estimatedDelivery: string;
  address?: string;
  timeline?: OrderTimeline[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  orderData?: OrderData;
  isEscalation?: boolean;
  feedback?: 'like' | 'dislike';
  image?: string;
}

export interface BotConfig {
  botName: string;
  companyName: string;
  tagline: string;
  hotline: string;
  email: string;
  tone: string;
  primaryColor: string;
  welcomeMessage: string;
  customKnowledge: string;
  quickSuggestions: string[];
  autoEscalate: boolean;
}

export interface Ticket {
  id: string;
  customer: string;
  issue: string;
  status: 'pending' | 'resolved' | 'escalated';
  time: string;
  sentiment: 'positive' | 'neutral' | 'urgent';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'chinh-sach' | 'don-hang' | 'thanh-toan' | 'khuyen-mai';
  hits: number;
}

export interface AnalyticsData {
  totalMessages: number;
  resolvedCount: number;
  humanEscalations: number;
  csatScore: number;
  activeChatsToday: number;
  recentTickets: Ticket[];
}
