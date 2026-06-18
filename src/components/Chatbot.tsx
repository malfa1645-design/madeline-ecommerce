import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, ShoppingBag, HelpCircle, Info, Zap, } from 'lucide-react';
import { sendToGemini } from '../services/gemini';

interface Message {
id: string;
text: string;
sender: 'user' | 'bot';
timestamp: Date;
}

const QUICK_REPLIES = [
{ icon: ShoppingBag, text: 'ما هي المنتجات المتوفرة؟' },
{ icon: Info, text: 'ما هي الأسعار؟' },
{ icon: Sparkles, text: 'هل هناك عروض خاصة؟' },
{ icon: HelpCircle, text: 'كيف يمكنني الطلب؟' },
];

const Chatbot: React.FC = () => {
const [isOpen, setIsOpen] = useState(false);
const [input, setInput] = useState('');
const [messages, setMessages] = useState<Message[]>([
{
id: '1',
text: 'أهلاً بك في مادلين بيوتي! 🌸 أنا مادلين، مساعدتك الذكية. كيف يمكنني مساعدتك اليوم؟ ✨',
sender: 'bot',
timestamp: new Date(),
},
]);
const [isTyping, setIsTyping] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
scrollToBottom();
}, [messages, isTyping]);

const handleSend = async (customText?: string) => {
const textToSend = customText || input.trim();
if (!textToSend) return;

Text 

const userMessage: Message = {
  id: Date.now().toString(),
  text: textToSend,
  sender: 'user',
  timestamp: new Date(),
};

setMessages(prev => [...prev, userMessage]);
setInput('');
setIsTyping(true);

// إرسال الرسالة لـ Gemini مباشرة
const botReply = await sendToGemini(
  textToSend,
  [...messages, userMessage].map(m => ({ role: m.sender, content: m.text }))
);

setIsTyping(false);
setMessages(prev => [
  ...prev,
  {
    id: Date.now().toString(),
    text: botReply,
    sender: 'bot',
    timestamp: new Date(),
  },
]);
};

const handleKeyPress = (e: React.KeyboardEvent) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleSend();
}
};

return (
<>
{/* زر التشغيل العائد */}
<button
onClick={() => setIsOpen(!isOpen)}
className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-gold rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 transition-transform hover:rotate-12 duration-300 group"
aria-label="شات مادلين"
>
{isOpen ? (
<X size={28} strokeWidth={2.5} />
) : (
<>
<MessageCircle size={28} strokeWidth={2.5} />
<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
</>
)}
</button>

text

  {/* نافذة الشات */}
  {isOpen && (
    <div className="fixed bottom-24 left-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-300">
      {/* الرأس */}
      <div className="bg-black text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-lg">مادلين</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-gold" />
                نظام AI نشط
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-1">
                <User size={14} />
              </div>
            )}
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-white border border-gray-100 text-gray-800 rounded-tr-none'
                  : 'bg-black text-white rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-end">
            <div className="bg-black text-white p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center shrink-0 mt-1">
              <Bot size={14} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* الردود السريعة */}
      {messages.length <= 2 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-500 mb-3 mr-1">اسألني عن:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSend(reply.text)}
                className="text-xs bg-gray-100 hover:bg-gold hover:text-black text-gray-700 px-3 py-2 rounded-full transition-colors flex items-center gap-1.5"
              >
                <reply.icon size={12} />
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* منطقة الإدخال */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-gold transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            className="flex-grow bg-transparent outline-none text-sm py-2 px-3 text-right"
            dir="rtl"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 bg-gold text-black rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} className="rotate-180" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">
          نظام مادلين الذكي مدعوم بتقنيات Gemini AI المتطورة ✨
        </p>
      </div>
    </div>
  )}
</>
);
}; 
export default Chatbot; 

