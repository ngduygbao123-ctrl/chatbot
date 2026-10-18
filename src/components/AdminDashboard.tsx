import React, { useState } from 'react';
import {
  BarChart3,
  MessageSquare,
  BookOpen,
  Settings,
  Code2,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Save,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Star,
  Zap,
} from 'lucide-react';
import { BotConfig, FAQItem, Ticket, AnalyticsData } from '../types';

interface AdminDashboardProps {
  botConfig: BotConfig;
  onUpdateBotConfig: (config: BotConfig) => void;
  faqs: FAQItem[];
  onAddFAQ: (faq: Omit<FAQItem, 'id' | 'hits'>) => void;
  onDeleteFAQ: (id: string) => void;
  tickets: Ticket[];
  onResolveTicket: (id: string) => void;
  analytics: AnalyticsData;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  botConfig,
  onUpdateBotConfig,
  faqs,
  onAddFAQ,
  onDeleteFAQ,
  tickets,
  onResolveTicket,
  analytics,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'knowledge' | 'settings' | 'embed'>('overview');
  const [localConfig, setLocalConfig] = useState<BotConfig>(botConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New FAQ form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<'chinh-sach' | 'don-hang' | 'thanh-toan' | 'khuyen-mai'>('chinh-sach');
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);

  // Handle save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBotConfig(localConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle add FAQ
  const handleCreateFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    onAddFAQ({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
    });
    setNewQuestion('');
    setNewAnswer('');
    setShowAddFaqModal(false);
  };

  const embedScriptSnippet = `<!-- NovaCare AI Customer Service Widget -->
<script>
  window.NovaCareConfig = {
    botName: "${botConfig.botName}",
    companyName: "${botConfig.companyName}",
    hotline: "${botConfig.hotline}",
    primaryColor: "${botConfig.primaryColor}",
    welcomeMessage: "${botConfig.welcomeMessage.replace(/"/g, '\\"')}"
  };
</script>
<script src="${window.location.origin}/widget.js" async defer></script>
<!-- End NovaCare AI Widget -->`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedScriptSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <BarChart3 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Trung Tâm Quản Trị Chatbot CSKH
                </h1>
                <p className="text-xs text-slate-500">
                  Cấu hình trợ lý AI {botConfig.botName} • Giám sát hội thoại & cơ sở tri thức doanh nghiệp
                </p>
              </div>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tổng quan & KPI
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tickets'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phiếu hỗ trợ (Tickets)
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {tickets.filter((t) => t.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'knowledge'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cơ sở tri thức (FAQ)
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cấu hình Bot
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'embed'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mã nhúng Web
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Tổng tin nhắn</span>
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {analytics.totalMessages.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">+12% hôm nay</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Tin nhắn tương tác tự động 24/7</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Tự động xử lý</span>
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">88.4%</span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({analytics.resolvedCount} đơn)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Bot tự giải quyết không cần nhân viên</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Đánh giá CSAT</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {analytics.csatScore} / 5.0
                  </span>
                  <span className="text-xs font-semibold text-amber-600">Tuyệt vời ⭐</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Dựa trên 450+ lượt đánh giá của khách</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Chuyển nhân viên</span>
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-600">
                    {analytics.humanEscalations} ca
                  </span>
                  <span className="text-xs font-semibold text-slate-500">cần gọi lại</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Tự động phân loại ca khẩn cấp & khiếu nại</p>
              </div>
            </div>

            {/* Performance Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>Chủ đề được khách hàng quan tâm nhiều nhất</span>
                  <span className="text-xs font-normal text-slate-500">7 ngày qua</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">📦 Tra cứu trạng thái vận chuyển đơn hàng</span>
                      <span className="text-indigo-600 font-bold">42% (524 lượt)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">🛡️ Chính sách bảo hành & đổi trả 1-1 trong 30 ngày</span>
                      <span className="text-indigo-600 font-bold">28% (349 lượt)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">🎁 Hỏi mã giảm giá, quà tặng & ưu đãi thanh toán</span>
                      <span className="text-indigo-600 font-bold">18% (225 lượt)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">👤 Yêu cầu gặp nhân viên tư vấn hoặc khiếu nại</span>
                      <span className="text-indigo-600 font-bold">12% (150 lượt)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Được hỗ trợ bởi mô hình <strong>Gemini 3.8 Flash</strong> phản hồi siêu tốc.
                  </span>
                  <button
                    onClick={() => setActiveTab('knowledge')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Bổ sung câu trả lời mẫu &rarr;
                  </button>
                </div>
              </div>

              {/* Bot Persona Quickcard */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold text-xl">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{botConfig.botName}</h4>
                      <p className="text-xs text-indigo-200">{botConfig.companyName}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-indigo-100/90">
                    <div className="flex items-center justify-between border-b border-indigo-800/80 pb-1.5">
                      <span className="text-indigo-300">Giọng điệu:</span>
                      <span className="font-medium text-white">{botConfig.tone}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-indigo-800/80 pb-1.5">
                      <span className="text-indigo-300">Hotline ưu tiên:</span>
                      <span className="font-bold text-amber-300">{botConfig.hotline}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-indigo-800/80 pb-1.5">
                      <span className="text-indigo-300">Tự động chuyển tổng đài:</span>
                      <span className="font-semibold text-emerald-300">Bật</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-300">Thời gian phản hồi:</span>
                      <span className="font-medium text-white">&lt; 0.8 giây</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-800/80">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition shadow-sm text-center"
                  >
                    Chỉnh sửa cấu hình & giọng điệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TICKETS (PHIẾU HỖ TRỢ CỦA KHÁCH) */}
        {activeTab === 'tickets' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Danh Sách Phiếu Hỗ Trợ & Yêu Cầu Chuyển Tuyến</h3>
                <p className="text-xs text-slate-500">
                  Các ca khách hàng yêu cầu gọi lại hoặc vấn đề cần bộ phận chăm sóc khách hàng can thiệp
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Tổng cộng: {tickets.length} ca
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Mã Ticket</th>
                    <th className="py-3 px-3">Khách hàng</th>
                    <th className="py-3 px-3">Nội dung yêu cầu</th>
                    <th className="py-3 px-3">Thời gian</th>
                    <th className="py-3 px-3">Trạng thái</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{t.customer}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">{t.issue}</td>
                      <td className="py-3 px-3 text-slate-400">{t.time}</td>
                      <td className="py-3 px-3">
                        {t.status === 'resolved' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã giải quyết
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Cần nhân viên gọi lại
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {t.status !== 'resolved' ? (
                          <button
                            onClick={() => onResolveTicket(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-2xs"
                          >
                            Xác nhận hoàn tất
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE BASE (FAQ & POLICIES) */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Cơ Sở Tri Thức & Câu Hỏi Thường Gặp (FAQs)</h3>
                  <p className="text-xs text-slate-500">
                    Bot AI sẽ tự động học hỏi các dữ liệu này để trả lời chính xác thông tin doanh nghiệp bạn
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFaqModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  Thêm câu hỏi mới
                </button>
              </div>

              {/* Add FAQ form modal */}
              {showAddFaqModal && (
                <form
                  onSubmit={handleCreateFAQ}
                  className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-indigo-900">Tạo câu hỏi & câu trả lời mẫu mới</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Câu hỏi của khách:
                      </label>
                      <input
                        type="text"
                        required
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="VD: Có xuất hóa đơn VAT điện tử cho công ty không?"
                        className="w-full bg-white px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Danh mục:
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full bg-white px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="chinh-sach">Chính sách & Bảo hành</option>
                        <option value="don-hang">Đơn hàng & Giao nhận</option>
                        <option value="thanh-toan">Thanh toán & Hóa đơn</option>
                        <option value="khuyen-mai">Khuyến mãi & Quà tặng</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nội dung giải đáp chuẩn:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="VD: Dạ bên em có hỗ trợ xuất hóa đơn VAT điện tử đầy đủ trong vòng 24h sau khi quý khách nhận hàng ạ..."
                      className="w-full bg-white px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFaqModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Lưu vào hệ thống
                    </button>
                  </div>
                </form>
              )}

              {/* List of FAQs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                          {faq.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {faq.hits} lượt tham khảo
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mb-1">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-end">
                      <button
                        onClick={() => onDeleteFAQ(faq.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Knowledge Policy Context Note */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Ghi chú & Quy định đặc thù của Cửa hàng (System Prompt Injection)
              </h3>
              <p className="text-xs text-slate-500">
                Nhập các điều khoản nội bộ, giờ làm việc, địa chỉ cửa hàng hoặc thông điệp khuyến mãi để AI tự động tích hợp vào câu trả lời:
              </p>
              <textarea
                rows={4}
                value={localConfig.customKnowledge}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, customKnowledge: e.target.value })
                }
                className="w-full text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Save className="w-4 h-4" />
                  Cập nhật kiến thức mới
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS (PERSONA & CHATBOT CONFIG) */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Cấu Hình Trợ Lý Chatbot AI</h3>
                <p className="text-xs text-slate-500">
                  Tùy biến tên gọi, thương hiệu, giọng điệu phản hồi và màu sắc nhận diện
                </p>
              </div>
              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Check className="w-4 h-4" /> Đã lưu thành công!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bot Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Trợ Lý Ảo (Bot Name):
                </label>
                <input
                  type="text"
                  value={localConfig.botName}
                  onChange={(e) => setLocalConfig({ ...localConfig, botName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Doanh Nghiệp / Cửa Hàng:
                </label>
                <input
                  type="text"
                  value={localConfig.companyName}
                  onChange={(e) => setLocalConfig({ ...localConfig, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Hotline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hotline Hỗ Trợ 24/7:
                </label>
                <input
                  type="text"
                  value={localConfig.hotline}
                  onChange={(e) => setLocalConfig({ ...localConfig, hotline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email CSKH:
                </label>
                <input
                  type="email"
                  value={localConfig.email}
                  onChange={(e) => setLocalConfig({ ...localConfig, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Tone */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giọng Điệu & Phong Cách Phản Hồi:
                </label>
                <select
                  value={localConfig.tone}
                  onChange={(e) => setLocalConfig({ ...localConfig, tone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Thân thiện, lịch sự, ân cần (Dạ/vâng, xưng em gọi anh/chị)">
                    Thân thiện, lịch sự, ân cần (Dạ/vâng, xưng em gọi anh/chị) [Khuyên dùng cho TMĐT VN]
                  </option>
                  <option value="Chuyên nghiệp, trang trọng, ngắn gọn và súc tích">
                    Chuyên nghiệp, trang trọng, súc tích (Dành cho doanh nghiệp B2B & Công nghệ)
                  </option>
                  <option value="Trẻ trung, năng động, nhiệt huyết và hóm hỉnh">
                    Trẻ trung, năng động, nhiệt huyết (Dành cho giới trẻ & Thời trang)
                  </option>
                </select>
              </div>

              {/* Welcome message */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lời Chào Mở Đầu (Welcome Greeting):
                </label>
                <textarea
                  rows={2}
                  value={localConfig.welcomeMessage}
                  onChange={(e) => setLocalConfig({ ...localConfig, welcomeMessage: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Primary Color theme */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Màu Sắc Thương Hiệu (Primary Color):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={localConfig.primaryColor}
                    onChange={(e) => setLocalConfig({ ...localConfig, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600">{localConfig.primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                Lưu toàn bộ thay đổi
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: EMBED CODE */}
        {activeTab === 'embed' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Mã Nhúng Chatbot Vào Website Bất Kỳ</h3>
                <p className="text-xs text-slate-500">
                  Chỉ cần dán đoạn mã này vào trước thẻ &lt;/body&gt; trên website WordPress, Shopify, Haravan hoặc Custom Web
                </p>
              </div>
              <button
                onClick={handleCopyEmbed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Đã sao chép!' : 'Sao chép mã nhúng'}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                {embedScriptSnippet}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">1. Tự động tương thích</h5>
                <p className="text-[11px] text-slate-500">Hoạt động trơn tru trên cả điện thoại (iOS/Android) và máy tính để bàn.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">2. Tải siêu tốc</h5>
                <p className="text-[11px] text-slate-500">Tối ưu kích thước nhẹ dưới 45KB, không làm chậm tốc độ load trang.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">3. Bảo mật thông tin</h5>
                <p className="text-[11px] text-slate-500">Toàn bộ dữ liệu mã hóa SSL an toàn tuyệt đối theo chuẩn quốc tế.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
