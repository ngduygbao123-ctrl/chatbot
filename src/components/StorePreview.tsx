import React from 'react';
import {
  ShoppingBag,
  Search,
  Sparkles,
  Headphones,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  MessageSquare,
  ArrowRight,
  PhoneCall,
  SearchCheck,
} from 'lucide-react';
import { sampleProducts, ProductItem } from '../data/mockStore';
import { BotConfig } from '../types';

interface StorePreviewProps {
  botConfig: BotConfig;
  onOpenChat: (initialPrompt?: string) => void;
  isChatOpen: boolean;
}

export const StorePreview: React.FC<StorePreviewProps> = ({
  botConfig,
  onOpenChat,
  isChatOpen,
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
        <span>Ưu đãi tri ân: Nhập mã <strong>NOVACARE20</strong> giảm ngay 20% đơn hàng đầu tiên • Freeship toàn quốc từ 300K</span>
        <span className="hidden md:inline text-indigo-200">|</span>
        <span className="hidden md:flex items-center gap-1 text-indigo-100">
          <PhoneCall className="w-3 h-3" /> Hotline: {botConfig.hotline}
        </span>
      </div>

      {/* Store Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md font-bold text-lg">
              N
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                {botConfig.companyName}
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Official Flagship Store
              </span>
            </div>
          </div>

          {/* Search bar mock */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm tai nghe chống ồn, bàn phím cơ, smartwatch..."
                className="w-full bg-slate-100 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenChat('Tôi muốn tra cứu đơn hàng #DH8291')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition border border-slate-200"
            >
              <SearchCheck className="w-4 h-4 text-indigo-500" />
              Tra cứu đơn hàng
            </button>

            <button
              onClick={() => onOpenChat()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tư vấn AI 24/7</span>
            </button>

            <div className="relative p-2 text-slate-600 hover:text-indigo-600 cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 to-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hệ thống Chăm sóc Khách hàng Tự động Hóa AI 24/7</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Công nghệ đỉnh cao, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Chăm sóc khách hàng tận tâm.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
              Trải nghiệm mua sắm tiện lợi với trợ lý ảo <strong>{botConfig.botName}</strong>. Giải đáp mọi thắc mắc về đơn hàng, đổi trả 1-1, kích hoạt bảo hành điện tử chỉ trong 1 giây.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenChat('Tư vấn cho tôi các sản phẩm bán chạy nhất hiện tại')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Trò chuyện với {botConfig.botName}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenChat('Chính sách đổi trả trong 30 ngày của shop như thế nào?')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 transition shadow-xs"
              >
                Chính sách đổi trả 30 ngày
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 max-w-lg">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Giao siêu tốc 2h</h4>
                  <p className="text-[10px] text-slate-500">Nội thành TP.HCM & HN</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Bảo hành 24T</h4>
                  <p className="text-[10px] text-slate-500">100% Chính hãng</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">1 Đổi 1 trong 30N</h4>
                  <p className="text-[10px] text-slate-500">Lỗi từ nhà sản xuất</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white p-3">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Tai nghe Nova Pro"
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Sản phẩm tiêu biểu
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 (328 đánh giá)</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mt-1">Tai nghe Nova Pro Wireless ANC</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  Chống ồn chủ động đỉnh cao, thời lượng pin 45 giờ liên tục, đệm tai mút hoạt tính cực êm.
                </p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-base font-extrabold text-indigo-600">1.890.000đ</span>
                    <span className="text-xs text-slate-400 line-through ml-2">2.490.000đ</span>
                  </div>
                  <button
                    onClick={() => onOpenChat('Tôi muốn tư vấn và đặt mua tai nghe Nova Pro Wireless ANC')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
                  >
                    Hỏi {botConfig.botName}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Danh mục sản phẩm
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Sản phẩm bán chạy nhất tuần này
            </h2>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Mọi sản phẩm đều được trợ lý AI tư vấn thông số và hỗ trợ kỹ thuật
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative overflow-hidden aspect-4/3 bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-indigo-700 shadow-xs">
                  {product.tag}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium mb-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount})</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {product.features.map((feat, fIdx) => (
                      <p key={fIdx} className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        {feat}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="block text-[10px] text-slate-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenChat(`Tư vấn cho mình sản phẩm: ${product.name} có những ưu điểm gì?`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition"
                    title="Hỏi trợ lý AI về sản phẩm này"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Chat Trigger Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
          {/* Greeting Speech Bubble */}
          <div
            onClick={() => onOpenChat()}
            className="mb-2 max-w-[220px] p-2.5 rounded-2xl bg-white border border-slate-200 shadow-lg text-xs text-slate-800 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300 hover:border-indigo-400 transition"
          >
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{botConfig.botName}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Dạ chào anh/chị! Em có thể giúp tra cứu đơn hoặc giải đáp câu hỏi nào ạ?
            </p>
          </div>

          <button
            onClick={() => onOpenChat()}
            className="relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl transition hover:scale-105 active:scale-95 pulse-glow"
            style={{ backgroundColor: botConfig.primaryColor }}
            title="Mở hộp thoại hỗ trợ khách hàng 24/7"
          >
            <Headphones className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
              1
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
