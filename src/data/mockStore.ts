import { BotConfig, FAQItem, Ticket } from '../types';

export const defaultBotConfig: BotConfig = {
  botName: 'NovaCare AI',
  companyName: 'NovaTech Store',
  tagline: 'Chuyên viên chăm sóc khách hàng AI 24/7',
  hotline: '1900 6868',
  email: 'hotro@novatech.vn',
  tone: 'Thân thiện, lịch sự, ân cần (Dạ/vâng, xưng em gọi anh/chị)',
  primaryColor: '#4f46e5',
  welcomeMessage: 'Dạ em chào anh/chị ạ! Em là NovaCare AI - Trợ lý chăm sóc khách hàng của NovaTech Store. Em có thể hỗ trợ anh/chị tra cứu đơn hàng, tư vấn sản phẩm hoặc chính sách bảo hành ngay bây giờ ạ!',
  customKnowledge: `• Cửa hàng mở cửa từ 8:00 đến 22:00 hàng ngày kể cả Thứ 7, Chủ Nhật và ngày lễ.
• Địa chỉ showroom chính: 120 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM và 45 Thái Hà, Đống Đa, Hà Nội.
• Đổi mới 1-1 trong 30 ngày đối với tai nghe Nova Pro và đồng hồ thông minh nếu lỗi cảm ứng hoặc sạc không vào.
• Miễn phí giao hàng toàn quốc cho đơn hàng từ 300.000đ trở lên.
• Tặng kèm cáp sạc nhanh Type-C cho đơn hàng đặt hôm nay có nhập mã NOVACARE20.`,
  quickSuggestions: [
    'Tra cứu đơn hàng #DH8291',
    'Chính sách đổi trả trong 30 ngày',
    'Thời gian & phí giao hàng thế nào?',
    'Mã giảm giá & quà tặng hôm nay',
    'Tôi muốn gặp nhân viên tư vấn',
    'Tư vấn tai nghe chống ồn Nova Pro',
  ],
  autoEscalate: true,
};

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  tag: string;
  image: string;
  features: string[];
}

export const sampleProducts: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Tai nghe Nova Pro Wireless ANC',
    category: 'Âm thanh',
    price: 1890000,
    originalPrice: 2490000,
    rating: 4.9,
    reviewsCount: 328,
    tag: 'Bán chạy nhất',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    features: ['Chống ồn chủ động ANC 40dB', 'Pin 45 giờ liên tục', 'Bluetooth 5.3 độ trễ cực thấp'],
  },
  {
    id: 'prod-2',
    name: 'Bàn phím cơ Nova Mechanical RGB',
    category: 'Phụ kiện máy tính',
    price: 1250000,
    originalPrice: 1600000,
    rating: 4.8,
    reviewsCount: 194,
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    features: ['Switch cơ học Hotswap 5 pin', 'Kết nối 3 chế độ Type-C/2.4G/BT', 'LED RGB 16.8 triệu màu'],
  },
  {
    id: 'prod-3',
    name: 'Đồng hồ thông minh Nova Watch Active 3',
    category: 'Đồng hồ thông minh',
    price: 3490000,
    originalPrice: 4200000,
    rating: 4.9,
    reviewsCount: 412,
    tag: 'Cao cấp',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    features: ['Màn hình AMOLED 1.43 inch', 'Đo SpO2, nhịp tim & giấc ngủ 24/7', 'Chống nước 5ATM'],
  },
  {
    id: 'prod-4',
    name: 'Đèn bàn học thông minh Nova EyeCare',
    category: 'Gia dụng thông minh',
    price: 680000,
    originalPrice: 890000,
    rating: 4.7,
    reviewsCount: 86,
    tag: 'Chống mỏi mắt',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    features: ['Chỉ số hoàn màu Ra>95', 'Cảm biến tự điều chỉnh độ sáng', 'Hẹn giờ tắt thông minh'],
  },
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'chinh-sach',
    question: 'Chính sách đổi trả sản phẩm lỗi diễn ra như thế nào?',
    answer: 'Đổi mới 1-1 miễn phí trong 30 ngày đầu tiên nếu sản phẩm bị lỗi phần cứng từ nhà sản xuất. Hỗ trợ thu hồi hàng tận nơi.',
    hits: 542,
  },
  {
    id: 'faq-2',
    category: 'don-hang',
    question: 'Thời gian giao hàng mất bao lâu và phí ship bao nhiêu?',
    answer: 'Nội thành TP.HCM & Hà Nội giao hỏa tốc 2 giờ hoặc trong ngày. Các tỉnh khác 2-3 ngày. Đơn từ 300.000đ được Miễn phí vận chuyển.',
    hits: 418,
  },
  {
    id: 'faq-3',
    category: 'thanh-toan',
    question: 'Shop có hỗ trợ thanh toán khi nhận hàng (COD) không?',
    answer: 'Có hỗ trợ COD 100% toàn quốc. Quý khách được quyền đồng kiểm tra hàng trước khi thanh toán tiền cho nhân viên giao hàng.',
    hits: 312,
  },
  {
    id: 'faq-4',
    category: 'khuyen-mai',
    question: 'Mã giảm giá cho khách hàng mới là gì?',
    answer: 'Sử dụng mã NOVACARE20 khi đặt hàng để được giảm ngay 20% (tối đa 100.000đ) kèm quà tặng cáp sạc nhanh Type-C chính hãng.',
    hits: 289,
  },
];

export const initialTickets: Ticket[] = [
  {
    id: 'TCK-8821',
    customer: 'Anh Hoàng - 0903.***.882',
    issue: 'Muốn đổi size sang màu Đen Titan tai nghe Nova Pro',
    status: 'pending',
    time: '5 phút trước',
    sentiment: 'neutral',
  },
  {
    id: 'TCK-8819',
    customer: 'Chị Lan - 0982.***.114',
    issue: 'Cần xác nhận bảo hành điện tử máy Nova Watch',
    status: 'resolved',
    time: '28 phút trước',
    sentiment: 'positive',
  },
  {
    id: 'TCK-8815',
    customer: 'Bác Bình - 0918.***.556',
    issue: 'Cần hướng dẫn kết nối Bluetooth cho iPhone đời cũ',
    status: 'resolved',
    time: '1 giờ trước',
    sentiment: 'positive',
  },
  {
    id: 'TCK-8809',
    customer: 'Minh Thư - 0971.***.900',
    issue: 'Hỏi chương trình ưu đãi mua 2 tặng 1 quà tặng doanh nghiệp',
    status: 'resolved',
    time: '3 giờ trước',
    sentiment: 'positive',
  },
];
