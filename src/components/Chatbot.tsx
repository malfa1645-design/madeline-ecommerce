// Chatbot.tsx

import { useState } from 'react';
import { getGeminiResponse } from '../services/gemini';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      // إرسال سؤال العميل للذكاء الاصطناعي مع بيانات المنتجات
      const botReply = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 
        sender: 'bot' 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
      {/* زر فتح الشات بوت */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: '#25D366', color: 'white', border: 'none',
            fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          💬
        </button>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div style={{
          width: '350px', height: '500px', borderRadius: '15px',
          backgroundColor: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '15px', backgroundColor: '#25D366', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>🛒 متجرنا - خدمة العملاء</span>
            <button onClick={() => setIsOpen(false)} style={{ 
              background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' 
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                <p>👋 أهلاً بك!</p>
                <p>اسأل عن أي منتج في المتجر</p>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>مثال: "ما هو سعر عطر فلور؟"</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                marginBottom: '10px',
                textAlign: msg.sender === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block', padding: '10px 15px', borderRadius: '15px',
                  backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#f0f0f0',
                  maxWidth: '80%', wordWrap: 'break-word'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'center', color: '#999' }}>جاري الكتابة...</div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك هنا..."
              style={{
                flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd',
                outline: 'none', fontSize: '14px'
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: '10px 15px', borderRadius: '20px', border: 'none',
                backgroundColor: '#25D366', color: 'white', cursor: 'pointer'
              }}
            >
              إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
