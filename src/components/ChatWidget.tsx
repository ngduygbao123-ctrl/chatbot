import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Headphones,
  Check,
  ThumbsUp,
  ThumbsDown,
  X,
  ExternalLink,
  ChevronDown,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BotConfig, ChatMessage, OrderData } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { OrderCard } from './OrderCard';
import { EscalationCard } from './EscalationCard';

interface ChatWidgetProps {
  botConfig: BotConfig;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
  onEscalationRecorded?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  botConfig,
  isOpen = true,
  onClose,
  isFloating = false,
  onEscalationRecorded,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'model',
      text: botConfig.welcomeMessage,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const clean = text
        .replace(/[*#`_~]/g, '')
        .replace(/https?:\/\/\S+/g, 'đường liên kết')
        .replace(/#DH\d+/g, (m) => `đơn hàng ${m}`);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  };

  // Web Speech API for voice input
  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận dạng giọng nói trực tiếp. Vui lòng sử dụng gõ phím hoặc mở trên Google Chrome!');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      }
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!text && !selectedImage) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      image: selectedImage || undefined,
    };

    const newMessagesList = [...messages, newUserMessage];
    setMessages(newMessagesList);
    setInputValue('');
    const currentAttachedImage = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    // Placeholder message for streaming
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        role: 'model',
        text: '',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessagesList.map((m) => ({ role: m.role, text: m.text })),
          botConfig: botConfig,
          stream: true,
          image: currentAttachedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ chatbot');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let receivedOrder: OrderData | undefined = undefined;
      let receivedEscalation = false;

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === botMessageId
                          ? { ...m, text: accumulatedText }
                          : m
                      )
                    );
                  }
                  if (parsed.orderData) {
                    receivedOrder = parsed.orderData;
                  }
                  if (parsed.isEscalation) {
                    receivedEscalation = true;
                    if (onEscalationRecorded) onEscalationRecorded();
                  }
                } catch {
                  // Ignore JSON parse errors for split SSE buffers
                }
              }
            }
          }
        }
      }

      // Finalize bot message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                text: accumulatedText || 'Dạ em có thể hỗ trợ gì thêm cho anh/chị không ạ?',
                orderData: receivedOrder,
                isEscalation: receivedEscalation,
              }
            : m
        )
      );

      // Voice read-out if enabled
      if (ttsEnabled && accumulatedText) {
        speakText(accumulatedText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                text: 'Dạ, em xin lỗi anh/chị vì gián đoạn mạng tạm thời. Anh/chị vui lòng thử gửi lại tin nhắn hoặc gọi trực tiếp hotline ' + botConfig.hotline + ' để được hỗ trợ tức thì ạ!',
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: type } : m))
    );
    if (type === 'like') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn làm mới và xóa lịch sử trò chuyện này không?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'model',
          text: botConfig.welcomeMessage,
          timestamp: 'Vừa xong',
        },
      ]);
    }
  };

  const handleRateCSAT = (stars: number) => {
    setUserRating(stars);
    setShowRatingModal(false);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `rating-${Date.now()}`,
        role: 'model',
        text: `Dạ em cảm ơn anh/chị rất nhiều vì đã đánh giá **${stars} sao** ⭐! Chúc anh/chị một ngày thật nhiều niềm vui và luôn hài lòng với ${botConfig.companyName} ạ!`,
        timestamp: 'Vừa xong',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden shadow-2xl transition-all duration-200 border border-slate-200 ${
        isFloating
          ? 'fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[410px] h-[640px] max-h-[88vh] rounded-2xl ring-1 ring-slate-900/10'
          : 'w-full h-full rounded-xl'
      }`}
    >
      {/* Header */}
      <div
        className="px-4 py-3.5 flex items-center justify-between text-white select-none relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${botConfig.primaryColor}, #312e81)`,
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-wide text-white">{botConfig.botName}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-white/80 line-clamp-1">{botConfig.companyName} • Hỗ trợ 24/7</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 relative z-10">
          {/* TTS Audio toggle */}
          <button
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              if (ttsEnabled) window.speechSynthesis?.cancel();
            }}
            title={ttsEnabled ? 'Tắt đọc âm thanh' : 'Bật đọc câu trả lời bằng giọng nói'}
            className={`p-1.5 rounded-lg transition ${
              ttsEnabled ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Rate CSAT */}
          <button
            onClick={() => setShowRatingModal(true)}
            title="Đánh giá chất lượng phục vụ"
            className="p-1.5 rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition"
          >
            <Star className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={handleClearHistory}
            title="Bắt đầu lại cuộc trò chuyện"
            className="p-1.5 rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              title="Thu nhỏ cửa sổ"
              className="p-1.5 rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition ml-1"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* CSAT Rating Overlay Modal */}
      {showRatingModal && (
        <div className="absolute inset-x-0 top-14 z-30 p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              Đánh giá chất lượng hỗ trợ
            </span>
            <button
              onClick={() => setShowRatingModal(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            Bạn cảm thấy câu trả lời của trợ lý AI có hữu ích và nhanh chóng không?
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateCSAT(star)}
                className="p-1.5 hover:scale-125 transition-transform text-amber-400 hover:text-amber-500"
              >
                <Star
                  className={`w-6 h-6 ${
                    userRating && userRating >= star ? 'fill-amber-400' : 'fill-none'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`flex items-start gap-2 max-w-[88%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Bot Avatar */}
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  {/* Attached user image if any */}
                  {message.image && (
                    <div className="mb-2 overflow-hidden rounded-lg border border-white/20 max-w-[200px]">
                      <img
                        src={message.image}
                        alt="Đính kèm"
                        className="w-full h-auto object-cover max-h-40"
                      />
                    </div>
                  )}

                  {/* Text content */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  ) : (
                    <MarkdownRenderer content={message.text} />
                  )}

                  {/* Embedded Order Card */}
                  {message.orderData && (
                    <OrderCard
                      order={message.orderData}
                      onAskFollowup={(q) => handleSendMessage(q)}
                    />
                  )}

                  {/* Escalation Card */}
                  {message.isEscalation && (
                    <EscalationCard
                      hotline={botConfig.hotline}
                      companyName={botConfig.companyName}
                      onSendCallbackPhone={(phone) => {
                        handleSendMessage(
                          `Số điện thoại của tôi là ${phone}, vui lòng liên hệ lại hỗ trợ gấp giúp tôi.`
                        );
                      }}
                    />
                  )}

                  {/* Bottom bar for bot messages */}
                  {!isUser && message.text && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{message.timestamp}</span>
                      <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleFeedback(message.id, 'like')}
                          title="Hữu ích"
                          className={`p-1 rounded hover:bg-slate-100 transition ${
                            message.feedback === 'like' ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'dislike')}
                          title="Chưa hài lòng"
                          className={`p-1 rounded hover:bg-slate-100 transition ${
                            message.feedback === 'dislike' ? 'text-rose-600' : 'text-slate-400'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => speakText(message.text)}
                          title="Nghe câu trả lời"
                          className="p-1 rounded hover:bg-slate-100 transition text-slate-400 hover:text-indigo-600"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <span className="text-[10px] text-slate-400 mt-1 mr-1">{message.timestamp}</span>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium mr-1">{botConfig.botName} đang soạn câu trả lời</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      {botConfig.quickSuggestions && botConfig.quickSuggestions.length > 0 && (
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {botConfig.quickSuggestions.map((suggestion, sIdx) => (
            <button
              key={sIdx}
              onClick={() => handleSendMessage(suggestion)}
              disabled={isLoading}
              className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-medium transition border border-indigo-100 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Image Attachment Preview */}
      {selectedImage && (
        <div className="px-3 pt-2 bg-white border-t border-slate-100 flex items-center gap-2">
          <div className="relative inline-block border border-slate-300 rounded-lg overflow-hidden shadow-xs">
            <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 p-0.5 bg-black/60 text-white rounded-bl hover:bg-black/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-slate-500">Đã đính kèm ảnh (hóa đơn / sản phẩm)</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Attach Image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm ảnh minh họa hoặc hóa đơn"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition shrink-0"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Mic Speech Button */}
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? 'Dừng ghi âm' : 'Nhập câu hỏi bằng giọng nói (Microphone)'}
            className={`p-2 rounded-xl transition shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? 'Đang lắng nghe bạn nói...' : 'Nhập câu hỏi hoặc mã đơn #DH...'}
            disabled={isLoading}
            className="flex-1 min-w-0 bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 text-sm px-3.5 py-2 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-hidden transition shadow-inner"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedImage)}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition shadow-xs shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <span>⚡ Phản hồi tự động bởi {botConfig.botName}</span>
          <span className="flex items-center gap-1">
            Hotline: <strong className="text-slate-600">{botConfig.hotline}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
