import React, { useState } from 'react';
import { Headset, PhoneCall, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface EscalationCardProps {
  hotline: string;
  companyName: string;
  onSendCallbackPhone?: (phone: string) => void;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({
  hotline,
  companyName,
  onSendCallbackPhone,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ticketId = React.useMemo(() => `TCK-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setSubmitted(true);
    if (onSendCallbackPhone) {
      onSendCallbackPhone(phoneNumber);
    }
  };

  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-amber-50/90 to-orange-50/60 rounded-xl border border-amber-200/80 shadow-sm text-slate-800 space-y-3">
      {/* Ticket Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Headset className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-900 tracking-wide">
                Phiếu hỗ trợ ưu tiên #{ticketId}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-200/70 text-amber-900">
                Ưu tiên 1
              </span>
            </div>
            <p className="text-[11px] text-amber-700">Chuyển tiếp chuyên viên CSKH {companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-white/70 px-2 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
          Phản hồi &lt; 5 phút
        </div>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed">
        Yêu cầu của bạn đã được ghi nhận vào hệ thống hỗ trợ trực tiếp. Chuyên viên kỹ thuật và giải quyết khiếu nại sẽ đồng hành cùng bạn.
      </p>

      {/* Action Choice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* Direct Call */}
        <a
          href={`tel:${hotline.replace(/\s+/g, '')}`}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 transition shadow-xs text-xs font-semibold"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
          Gọi ngay {hotline}
        </a>

        {/* Callback Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-1">
            <input
              type="tel"
              placeholder="Nhập số ĐT để nhận gọi lại..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition shrink-0 shadow-xs"
            >
              Gọi lại em
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/80 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Đã gửi số {phoneNumber}, nhân viên sẽ gọi lại ngay!</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-amber-200/50">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Cam kết bảo mật thông tin & giải quyết thỏa đáng 100%</span>
      </div>
    </div>
  );
};
