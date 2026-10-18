import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Phone, MapPin, Copy, Check } from 'lucide-react';
import { OrderData } from '../types';

interface OrderCardProps {
  order: OrderData;
  onAskFollowup?: (question: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onAskFollowup }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã giao thành công
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Đang vận chuyển hỏa tốc
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Đang đóng gói xuất kho
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Chờ xử lý đơn
          </span>
        );
    }
  };

  return (
    <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm text-slate-800 space-y-3.5 transition-all hover:border-indigo-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 tracking-wide">
                Đơn hàng #{order.orderId}
              </span>
              <button
                onClick={handleCopyId}
                title="Sao chép mã đơn"
                className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {order.customerName && (
              <p className="text-[11px] text-slate-500">Khách hàng: {order.customerName}</p>
            )}
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Product & Summary */}
      <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-xs font-medium text-slate-900 truncate">
            {order.product || 'Sản phẩm NovaTech chính hãng'}
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Truck className="w-3 h-3 text-slate-400" />
            {order.carrier}
          </p>
        </div>
        {order.amount && (
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-indigo-600">{order.amount}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>
            <strong className="text-slate-800">Dự kiến:</strong> {order.estimatedDelivery}
          </span>
        </div>
        {order.shipperPhone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              <strong className="text-slate-800">Shipper:</strong>{' '}
              <a href={`tel:${order.shipperPhone}`} className="text-indigo-600 hover:underline">
                {order.shipperPhone}
              </a>
            </span>
          </div>
        )}
        {order.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-slate-600 leading-tight">
              {order.address}
            </span>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Tiến trình vận chuyển
          </p>
          <div className="relative pl-5 space-y-2.5">
            {/* Vertical line connecting nodes */}
            <div className="absolute left-2 top-1.5 bottom-2 w-0.5 bg-slate-200 -translate-x-1/2" />
            {order.timeline.map((step, sIdx) => (
              <div key={sIdx} className="relative flex items-start gap-2">
                <span
                  className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center -translate-x-1/2 border-2 ${
                    step.done
                      ? 'bg-emerald-500 border-white text-white shadow-sm'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {step.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-xs ${
                      step.done ? 'font-medium text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.step}
                  </p>
                  <p className="text-[10px] text-slate-400">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fast Action Buttons */}
      {onAskFollowup && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
          <button
            onClick={() => onAskFollowup(`Nhắc shipper giao sớm cho đơn #${order.orderId}`)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition font-medium"
          >
            🚀 Nhắc giao sớm
          </button>
          <button
            onClick={() => onAskFollowup(`Tôi muốn đổi địa chỉ nhận hàng đơn #${order.orderId}`)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition font-medium"
          >
            📍 Đổi địa chỉ nhận
          </button>
        </div>
      )}
    </div>
  );
};
