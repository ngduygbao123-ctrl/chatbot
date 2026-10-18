/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { defaultBotConfig, initialFAQs, initialTickets } from './data/mockStore';
import { BotConfig, FAQItem, Ticket, AnalyticsData } from './types';
import { Navbar } from './components/Navbar';
import { StorePreview } from './components/StorePreview';
import { ChatWidget } from './components/ChatWidget';
import { AdminDashboard } from './components/AdminDashboard';
import { Headphones, ShieldCheck, Clock, MapPin, Phone, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'chat' | 'admin'>('store');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Bot Config with localStorage persistence
  const [botConfig, setBotConfig] = useState<BotConfig>(() => {
    try {
      const saved = localStorage.getItem('novacare_bot_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultBotConfig;
  });

  // FAQs with localStorage persistence
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem('novacare_faqs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialFAQs;
  });

  // Tickets
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('novacare_tickets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialTickets;
  });

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMessages: 1248,
    resolvedCount: 1103,
    humanEscalations: 42,
    csatScore: 4.88,
    activeChatsToday: 156,
    recentTickets: initialTickets,
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('novacare_bot_config', JSON.stringify(botConfig));
    } catch {}
  }, [botConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('novacare_faqs', JSON.stringify(faqs));
    } catch {}
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('novacare_tickets', JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Fetch live analytics from backend
  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalMessages) {
          setAnalytics((prev) => ({
            ...prev,
            totalMessages: data.totalMessages,
            humanEscalations: data.humanEscalations,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateBotConfig = (newConfig: BotConfig) => {
    setBotConfig(newConfig);
  };

  const handleAddFAQ = (newFaq: Omit<FAQItem, 'id' | 'hits'>) => {
    const item: FAQItem = {
      ...newFaq,
      id: `faq-${Date.now()}`,
      hits: 1,
    };
    setFaqs((prev) => [item, ...prev]);
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
  };

  const handleOpenStoreChat = () => {
    setIsFloatingChatOpen(true);
  };

  const pendingTicketsCount = tickets.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Universal Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        botConfig={botConfig}
        pendingTicketsCount={pendingTicketsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: Store Simulation with Floating Chat Widget */}
        {currentView === 'store' && (
          <div className="relative flex-1">
            <StorePreview
              botConfig={botConfig}
              onOpenChat={handleOpenStoreChat}
              isChatOpen={isFloatingChatOpen}
            />

            {/* Floating Chat Widget */}
            <ChatWidget
              botConfig={botConfig}
              isOpen={isFloatingChatOpen}
              onClose={() => setIsFloatingChatOpen(false)}
              isFloating={true}
              onEscalationRecorded={() => {
                const newTicket: Ticket = {
                  id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
                  customer: 'Khách hàng mới (Widget)',
                  issue: 'Khách yêu cầu chuyển tiếp chuyên viên CSKH',
                  status: 'pending',
                  time: 'Vừa xong',
                  sentiment: 'urgent',
                };
                setTickets((prev) => [newTicket, ...prev]);
              }}
            />
          </div>
        )}

        {/* VIEW 2: Dedicated Fullscreen Chat Interface */}
        {currentView === 'chat' && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left information sidebar */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
              {/* Store & Bot Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl shadow-md"
                    style={{ backgroundColor: botConfig.primaryColor }}
                  >
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{botConfig.botName}</h3>
                    <p className="text-xs text-slate-500">{botConfig.companyName}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Trực tuyến 24/7
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {botConfig.tagline}. Giải đáp tự động mọi câu hỏi về đơn hàng, chính sách bảo hành và hướng dẫn sản phẩm.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Tổng đài: <strong>{botConfig.hotline}</strong> (Miễn phí)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Thời gian phục vụ: 8:00 - 22:00 hàng ngày</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bảo hành chính hãng 12-24 tháng</span>
                  </div>
                </div>
              </div>

              {/* Sample Order Codes for Quick Testing */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Mã đơn hàng mẫu để thử nghiệm</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Bạn có thể nhập hoặc copy các mã đơn sau vào ô chat để kiểm tra tính năng tra cứu đơn hàng:
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-indigo-600">#DH8291</strong>
                      <span className="text-[11px] text-slate-500 ml-2">Tai nghe Nova Pro (Đang giao)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-600">#DH9042</strong>
                      <span className="text-[11px] text-slate-500 ml-2">Bàn phím cơ RGB (Đã giao)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-600">#DH7104</strong>
                      <span className="text-[11px] text-slate-500 ml-2">Smart Watch 3 (Đang đóng gói)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special tip */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
                <p className="font-bold">💡 Mẹo tương tác:</p>
                <p className="text-[11px] leading-relaxed text-indigo-800">
                  • Bấm biểu tượng <strong>Microphone</strong> để nói trực tiếp bằng tiếng Việt.
                  <br />• Bấm biểu tượng <strong>Loa</strong> ở góc trên để bot đọc to câu trả lời.
                  <br />• Gõ <em>"tôi muốn gặp nhân viên"</em> để thử quy trình tự động phân luồng ticket khẩn cấp.
                </p>
              </div>
            </div>

            {/* Right Chat Column */}
            <div className="lg:col-span-8 h-[calc(100vh-130px)] min-h-[580px] flex flex-col">
              <ChatWidget
                botConfig={botConfig}
                isOpen={true}
                isFloating={false}
                onEscalationRecorded={() => {
                  const newTicket: Ticket = {
                    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
                    customer: 'Khách hàng cửa sổ Chat',
                    issue: 'Khách yêu cầu chuyển tiếp chuyên viên CSKH',
                    status: 'pending',
                    time: 'Vừa xong',
                    sentiment: 'urgent',
                  };
                  setTickets((prev) => [newTicket, ...prev]);
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: Admin & Agent Hub */}
        {currentView === 'admin' && (
          <AdminDashboard
            botConfig={botConfig}
            onUpdateBotConfig={handleUpdateBotConfig}
            faqs={faqs}
            onAddFAQ={handleAddFAQ}
            onDeleteFAQ={handleDeleteFAQ}
            tickets={tickets}
            onResolveTicket={handleResolveTicket}
            analytics={analytics}
          />
        )}
      </main>
    </div>
  );
}
