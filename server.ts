import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Mock Order Database
const mockOrders: Record<string, any> = {
  'DH8291': {
    orderId: 'DH8291',
    customerName: 'Nguyễn Văn An',
    product: 'Tai nghe chụp tai chống ồn Nova Pro Wireless',
    amount: '1.890.000đ',
    status: 'in_transit',
    statusText: 'Đang vận chuyển hỏa tốc',
    carrier: 'Viettel Post (Mã vận đơn: VP8829103)',
    shipperPhone: '0988.123.456 (Anh Tuấn)',
    estimatedDelivery: 'Dự kiến giao trước 17:30 hôm nay',
    address: 'Số 45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    timeline: [
      { step: 'Đặt hàng thành công', time: '09:15 - 17/10/2026', done: true },
      { step: 'Đã xuất kho đóng gói', time: '11:40 - 17/10/2026', done: true },
      { step: 'Đang giao hàng (Shipper đang trên đường)', time: '08:20 - Hôm nay', done: true },
      { step: 'Giao hàng thành công', time: 'Dự kiến 17:30', done: false },
    ],
  },
  'DH9042': {
    orderId: 'DH9042',
    customerName: 'Trần Thị Mai',
    product: 'Bàn phím cơ không dây Nova Mechanical RGB',
    amount: '1.250.000đ',
    status: 'delivered',
    statusText: 'Giao thành công',
    carrier: 'Giao Hàng Tiết Kiệm (GHTK)',
    shipperPhone: '0912.345.678 (Anh Hoàng)',
    estimatedDelivery: 'Đã hoàn tất lúc 14:30 hôm qua',
    address: 'Toà nhà Landmark 81, P. 22, Bình Thạnh, TP. HCM',
    timeline: [
      { step: 'Đặt hàng', time: '14/10/2026', done: true },
      { step: 'Xuất kho', time: '15/10/2026', done: true },
      { step: 'Đang giao', time: '16/10/2026', done: true },
      { step: 'Khách đã nhận & thanh toán COD', time: '14:30 - 17/10/2026', done: true },
    ],
  },
  'DH7104': {
    orderId: 'DH7104',
    customerName: 'Lê Hoàng Long',
    product: 'Đồng hồ thông minh Nova Watch Active Gen 3',
    amount: '3.490.000đ',
    status: 'processing',
    statusText: 'Đang chuẩn bị đóng gói tại kho Hà Nội',
    carrier: 'Giao Hàng Nhanh (GHN Express)',
    estimatedDelivery: 'Dự kiến giao ngày mai',
    address: '128 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    timeline: [
      { step: 'Đơn hàng mới tiếp nhận', time: '07:30 - Sáng nay', done: true },
      { step: 'Nhân viên đang đóng gói', time: '09:00 - Sáng nay', done: true },
      { step: 'Bàn giao cho đơn vị vận chuyển', time: 'Dự kiến 14:00', done: false },
      { step: 'Giao hàng tận nơi', time: 'Dự kiến 19/10/2026', done: false },
    ],
  },
  'DH6520': {
    orderId: 'DH6520',
    customerName: 'Phạm Thu Trang',
    product: 'Bộ đèn bàn học thông minh Smart EyeCare LED',
    amount: '680.000đ',
    status: 'pending',
    statusText: 'Chờ xác nhận đơn hàng',
    carrier: 'Chưa gán vận chuyển',
    estimatedDelivery: 'Đang chờ bộ phận CSKH gọi xác nhận',
    address: '72 Nguyễn Huệ, TP. Đà Nẵng',
    timeline: [
      { step: 'Đã tạo đơn hàng', time: '10:05 - Hôm nay', done: true },
      { step: 'Xác nhận thông tin & Địa chỉ', time: 'Đang xử lý', done: false },
      { step: 'Đóng gói & Vận chuyển', time: 'Chờ tiếp theo', done: false },
    ],
  },
};

// Analytics in-memory store
const analytics = {
  totalMessages: 1248,
  resolvedCount: 1103,
  humanEscalations: 42,
  csatScore: 4.88,
  activeChatsToday: 156,
  recentTickets: [
    { id: 'TCK-8821', customer: 'Anh Hoàng (0903***882)', issue: 'Muốn đổi size sang màu Đen Titan', status: 'pending', time: '5 phút trước', sentiment: 'neutral' },
    { id: 'TCK-8819', customer: 'Chị Lan (0982***114)', issue: 'Kiểm tra bảo hành tai nghe Nova Pro', status: 'resolved', time: '28 phút trước', sentiment: 'positive' },
    { id: 'TCK-8815', customer: 'Bác Bình (0918***556)', issue: 'Cần hỗ trợ kết nối bluetooth với iPhone', status: 'resolved', time: '1 giờ trước', sentiment: 'positive' },
    { id: 'TCK-8810', customer: 'Minh Thư (0971***900)', issue: 'Hỏi chương trình khuyến mãi mua 2 tặng 1', status: 'resolved', time: '2 giờ trước', sentiment: 'positive' },
  ],
};

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
  });
});

// GET /api/analytics
app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

// POST /api/orders/lookup
app.post('/api/orders/lookup', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Mã đơn hàng không được để trống' });
  }

  const cleanId = String(orderId).trim().toUpperCase().replace('#', '');
  const order = mockOrders[cleanId];

  if (order) {
    return res.json({ found: true, order });
  }

  // Generate dynamic mock order for demo when user types any other code
  const dynamicOrder = {
    orderId: cleanId,
    customerName: 'Quý khách hàng',
    product: 'Đơn hàng thiết bị Nova Official Store',
    amount: '950.000đ',
    status: 'in_transit',
    statusText: 'Đang trên đường giao đến bạn',
    carrier: 'Giao Hàng Nhanh (GHN)',
    shipperPhone: '0977.888.999 (Anh Nam shipper)',
    estimatedDelivery: 'Dự kiến giao trong ngày hôm nay',
    address: 'Địa chỉ đăng ký của quý khách',
    timeline: [
      { step: 'Đã xác nhận đơn hàng', time: 'Hôm qua', done: true },
      { step: 'Kho xuất hàng', time: 'Sáng nay', done: true },
      { step: 'Đang vận chuyển', time: 'Hiện tại', done: true },
      { step: 'Giao hoàn tất', time: 'Hôm nay', done: false },
    ],
  };

  return res.json({ found: true, order: dynamicOrder, isDynamic: true });
});

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      botConfig,
      stream = true,
      image,
    } = req.body;

    analytics.totalMessages += 1;

    // Check for order code in the last message
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].text : '';
    const orderMatch = lastUserMessage.match(/#?(DH\d{3,6})/i);
    let matchedOrder: any = null;
    if (orderMatch) {
      const code = orderMatch[1].toUpperCase();
      matchedOrder = mockOrders[code] || {
        orderId: code,
        statusText: 'Đang vận chuyển trên hệ thống',
        carrier: 'Đơn vị vận chuyển liên kết',
        estimatedDelivery: 'Dự kiến trong vòng 24-48 giờ tới',
      };
    }

    // Check for escalation intent (human agent request)
    const lowerText = lastUserMessage.toLowerCase();
    const isEscalationRequest =
      lowerText.includes('gặp nhân viên') ||
      lowerText.includes('nói chuyện với người') ||
      lowerText.includes('tổng đài viên') ||
      lowerText.includes('chuyển máy') ||
      lowerText.includes('khiếu nại') ||
      lowerText.includes('gặp cskh');

    if (isEscalationRequest) {
      analytics.humanEscalations += 1;
    }

    const companyName = botConfig?.companyName || 'NovaTech Store';
    const botName = botConfig?.botName || 'NovaCare AI';
    const hotline = botConfig?.hotline || '1900 6868';
    const tone = botConfig?.tone || 'Thân thiện, lịch sự và chu đáo';
    const extraKnowledge = botConfig?.customKnowledge || '';

    const systemInstruction = `
Bạn là "${botName}", trợ lý ảo chăm sóc khách hàng AI thông minh, chuyên nghiệp và nhiệt tình của "${companyName}".
Phong cách phục vụ: ${tone}.
Luôn xưng hô lễ phép: "Dạ, em chào anh/chị ạ!", xưng "em" và gọi khách hàng là "anh/chị" hoặc "quý khách".

THÔNG TIN DOANH NGHIỆP:
- Hotline hỗ trợ: ${hotline} (miễn phí cước 8:00 - 22:00 tất cả các ngày).
- Email: hotro@${companyName.toLowerCase().replace(/\s+/g, '')}.vn
- Thời gian giao hàng: Hỏa tốc nội thành 2h, các tỉnh khác 2-3 ngày làm việc. Đơn từ 300.000đ được MIỄN PHÍ VẬN CHUYỂN.
- Chính sách đổi trả: Đổi mới 1-1 trong vòng 30 ngày nếu có lỗi từ nhà sản xuất; hoàn tiền trong 7 ngày nếu không hài lòng. Bảo hành chính hãng 12-24 tháng.
- Phương thức thanh toán: COD (nhận hàng kiểm tra rồi thanh toán), Chuyển khoản ngân hàng QR Code (giảm thêm 2%), Thẻ tín dụng/ghi nợ, Ví Momo/ZaloPay.
- Khuyến mãi hiện tại: Nhập mã "NOVACARE20" giảm ngay 20% tối đa 100k cho đơn đầu tiên, tặng kèm túi chống sốc cao cấp.

${extraKnowledge ? `KIẾN THỨC BỔ SUNG CỦA CỬA HÀNG:\n${extraKnowledge}\n` : ''}

${matchedOrder ? `THÔNG TIN ĐƠN HÀNG TRA CỨU ĐƯỢC (#${matchedOrder.orderId}):
Sản phẩm: ${matchedOrder.product || 'Thiết bị công nghệ'}
Trạng thái: ${matchedOrder.statusText}
Đơn vị giao: ${matchedOrder.carrier}
Dự kiến giao: ${matchedOrder.estimatedDelivery}
${matchedOrder.shipperPhone ? `Số điện thoại shipper: ${matchedOrder.shipperPhone}` : ''}
Hãy thông báo chi tiết, rõ ràng và trấn an khách hàng về đơn hàng này.
` : ''}

QUY TẮC PHẢN HỒI:
1. Trả lời bằng tiếng Việt tự nhiên, ấm áp, định dạng Markdown rõ ràng (dùng gạch đầu dòng, in đậm từ khóa quan trọng).
2. Nếu khách hỏi về tra cứu đơn hàng nhưng chưa cho mã, hãy hướng dẫn khách cung cấp mã đơn (ví dụ: #DH8291, #DH9042, #DH7104).
3. Nếu khách có vẻ thất vọng hoặc yêu cầu gặp người thật / tổng đài viên, hãy đồng cảm sâu sắc, cam kết hỗ trợ ngay và thông báo rằng yêu cầu đã được ghi nhận để nhân viên tư vấn trực tiếp liên hệ qua hotline ${hotline}.
4. Không bao giờ nói các câu cứng nhắc kiểu máy móc. Hãy như một chuyên viên chăm sóc khách hàng hàng đầu Việt Nam!
`;

    // If Gemini API is available, call it
    if (ai) {
      const contents: any[] = [];

      // Transform history
      if (Array.isArray(messages)) {
        for (let i = 0; i < messages.length; i++) {
          const m = messages[i];
          const role = m.role === 'model' || m.role === 'assistant' ? 'model' : 'user';

          // If last message has image
          if (i === messages.length - 1 && image) {
            const parts: any[] = [];
            if (image.startsWith('data:')) {
              const [meta, base64Data] = image.split(',');
              const mimeMatch = meta.match(/data:([^;]+);base64/);
              const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
              parts.push({
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              });
            }
            parts.push({ text: m.text || 'Hãy xem bức ảnh này và hỗ trợ em nhé.' });
            contents.push({ role, parts });
          } else {
            contents.push({
              role,
              parts: [{ text: m.text }],
            });
          }
        }
      }

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            }
          }

          // Send matched order meta if any
          if (matchedOrder) {
            res.write(`data: ${JSON.stringify({ orderData: matchedOrder })}\n\n`);
          }
          if (isEscalationRequest) {
            res.write(`data: ${JSON.stringify({ isEscalation: true })}\n\n`);
          }

          res.write('data: [DONE]\n\n');
          return res.end();
        } catch (genError: any) {
          console.error('Gemini stream error:', genError);
          // Fall through to fallback
        }
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });

        return res.json({
          text: response.text,
          orderData: matchedOrder,
          isEscalation: isEscalationRequest,
        });
      }
    }

    // Smart Fallback when GEMINI_API_KEY is not yet configured or error occurred
    let fallbackText = `Dạ, em là ${botName} từ ${companyName} ạ! Em xin phép được hỗ trợ anh/chị ngay nhé.`;

    if (matchedOrder) {
      fallbackText = `Dạ em đã kiểm tra thông tin đơn hàng **#${matchedOrder.orderId}** của anh/chị rồi ạ!\n\n` +
        `📦 **Sản phẩm:** ${matchedOrder.product || 'Đơn hàng thiết bị'}\n` +
        `🚚 **Trạng thái:** ${matchedOrder.statusText}\n` +
        `🏢 **Đơn vị giao hàng:** ${matchedOrder.carrier}\n` +
        `⏰ **Thời gian dự kiến:** ${matchedOrder.estimatedDelivery}\n` +
        (matchedOrder.shipperPhone ? `📞 **Liên hệ shipper:** ${matchedOrder.shipperPhone}\n\n` : '\n') +
        `Anh/chị yên tâm nhé, shipper sẽ gọi điện trước khi giao hàng 15-30 phút để anh/chị tiện nhận hàng ạ!`;
    } else if (isEscalationRequest) {
      fallbackText = `Dạ em hiểu vấn đề này anh/chị cần gặp trực tiếp nhân viên hỗ trợ để được xử lý kỹ lưỡng nhất ạ!\n\n` +
        `📋 Em đã tạo **Phiếu hỗ trợ ưu tiên: #TCK-${Math.floor(1000 + Math.random() * 9000)}**.\n` +
        `📞 Chuyên viên tư vấn của ${companyName} sẽ chủ động gọi lại cho anh/chị trong vòng **5 - 10 phút** tới.\n\n` +
        `Hoặc nếu cần gấp ngay lúc này, anh/chị có thể gọi trực tiếp tổng đài miễn cước **${hotline}** (nhấn phím 1) để được kết nối lập tức ạ!`;
    } else if (lowerText.includes('đổi trả') || lowerText.includes('bảo hành')) {
      fallbackText = `Dạ về chính sách đổi trả & bảo hành tại ${companyName}:\n\n` +
        `✅ **Đổi mới 1 - 1:** Áp dụng trong vòng **30 ngày đầu tiên** nếu sản phẩm phát sinh lỗi phần cứng từ nhà sản xuất.\n` +
        `✅ **Bảo hành chính hãng:** Thời hạn **12 đến 24 tháng** tùy mã máy, có tem điện tử kích hoạt tự động theo số điện thoại mua hàng.\n` +
        `✅ **Thu hồi tận nhà:** Nếu anh/chị cần bảo hành, bên em có dịch vụ shipper đến tận nơi nhận máy, anh/chị không cần đi xa ạ!\n\n` +
        `Anh/chị có cần em hướng dẫn gửi yêu cầu bảo hành ngay không ạ?`;
    } else if (lowerText.includes('khuyến mãi') || lowerText.includes('mã giảm') || lowerText.includes('voucher')) {
      fallbackText = `Dạ hiện tại ${companyName} đang có các ưu đãi cực hấp dẫn dành riêng cho anh/chị ạ:\n\n` +
        `🎁 Mã **NOVACARE20**: Giảm ngay **20%** (tối đa 100.000đ) cho đơn hàng đầu tiên.\n` +
        `🚚 **Freeship toàn quốc** cho tất cả đơn hàng có giá trị từ 300.000đ.\n` +
        `💳 Giảm thêm **2%** khi thanh toán trực tuyến qua VNPAY / Chuyển khoản QR code.\n\n` +
        `Anh/chị muốn xem thêm các sản phẩm đang có deal hời hôm nay không ạ?`;
    } else if (lowerText.includes('giao hàng') || lowerText.includes('ship') || lowerText.includes('vận chuyển')) {
      fallbackText = `Dạ thông tin giao hàng tại ${companyName} như sau ạ:\n\n` +
        `⚡ **Giao siêu tốc 2 giờ:** Áp dụng nội thành Hà Nội & TP. Hồ Chí Minh.\n` +
        `📦 **Giao tiêu chuẩn toàn quốc:** Từ 2 - 3 ngày làm việc qua GHN / Viettel Post.\n` +
        `🎉 **Miễn phí ship:** Đơn từ 300.000đ trở lên được miễn phí 100% cước vận chuyển ạ!`;
    } else {
      fallbackText = `Dạ em chào anh/chị! Em là ${botName} - Trợ lý chăm sóc khách hàng của ${companyName} ạ.\n\n` +
        `Em có thể hỗ trợ anh/chị các nội dung sau:\n` +
        `1. 🔍 **Tra cứu tình trạng đơn hàng** (anh/chị nhắn mã đơn như #DH8291)\n` +
        `2. 🛡️ **Tư vấn bảo hành & chính sách đổi trả hàng**\n` +
        `3. 🚚 **Thời gian & phí vận chuyển toàn quốc**\n` +
        `4. 🎁 **Cập nhật mã giảm giá & quà tặng mới nhất**\n` +
        `5. 👤 **Kết nối nhân viên tư vấn trực tiếp**\n\n` +
        `Anh/chị đang quan tâm đến nội dung nào để em giải đáp chi tiết nhất ạ?`;
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send chunks in simulated natural cadence
      const words = fallbackText.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(' ') + ' ';
        res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      if (matchedOrder) {
        res.write(`data: ${JSON.stringify({ orderData: matchedOrder })}\n\n`);
      }
      if (isEscalationRequest) {
        res.write(`data: ${JSON.stringify({ isEscalation: true })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    } else {
      return res.json({
        text: fallbackText,
        orderData: matchedOrder,
        isEscalation: isEscalationRequest,
      });
    }
  } catch (err: any) {
    console.error('Server error handling chat:', err);
    res.status(500).json({ error: 'Lỗi xử lý phản hồi chatbot: ' + err.message });
  }
});

// Vite middleware or static serving
if (!isProduction) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NovaCare Chatbot Server running on http://0.0.0.0:${PORT}`);
});
