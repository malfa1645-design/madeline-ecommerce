import { useState, useEffect, useRef } from 'react';
import { products } from '../data/products';
import { getGeminiResponse } from '../services/gemini';

// تعريف نوع الرسائل لعدم ظهور اخطاء TypeScript
type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  // حالات التحكم بالشات
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    // رسالة ترحيب اولية تظهر فور فتح الشات
    { text: 'مرحباً! 🤍 أنا مساعدتك في متجر Madeleine، كيف أقدر اساعدك اليوم؟', sender: 'bot' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // تمرير تلقائي لاخر رسالة جديدة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // وظيفة معالجة ارسال الرسائل والرد
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userQuestion = input.trim();
    setInput('');

    // اضافة سؤال العميل للشاشة
    setMessages(prev => [...prev, { text: userQuestion, sender: 'user' }]);
    setIsTyping(true);

    try {
      // 🔍 البحث تلقائيا اذا كان العميل يسأل عن منتج موجود
      const askedProduct = products.find(product =>
        userQuestion.toLowerCase().includes(product.name.toLowerCase().split('-')[0])
        || userQuestion.toLowerCase().includes(product.id.replace('-', ' '))
      );

      let aiPrompt = '';
      if (askedProduct) {
        // اذا وجد المنتج، نعطي الذكاء الاصطناعي كل بياناته الحقيقية
        aiPrompt = `
          انت مساعدة لطيفة جداً في متجر مادلين لمنتجات العناية، اجبي باللهجة العامية البسيطة غير الرسمية.
          اجبي على سؤال العميل بناء على البيانات التالية فقط، لا تختاري معلومات وهمية:
          ---
          اسم المنتج: ${askedProduct.name}
          السعر: ${askedProduct.price}
          الوصف: ${askedProduct.description}
          المميزات: ${askedProduct.features.join('، ')}
          ${askedProduct.howToUse ? `طريقة الاستخدام: ${askedProduct.howToUse.join('، ')}` : ''}
          ---
          سؤال العميل: ${userQuestion}
          ابدا الاجابة بترحيب، واذكري الفوائد بشكل بسيط.
        `;
      } else {
        // اذا السؤال ليس عن منتج محدد، رد بشكل طبيعي
        aiPrompt = `
          انت مساعدة ودودة في متجر مادلين للعناية بالجمال.
          سؤال العميل: ${userQuestion}
          اذا سأل عن منتج غير موجود، اخبريه ان المنتجات المتوفرة حاليا هي: سيروم الأظافر، سيروم الرموش والحواجب، وجل الحواجب.
          اجبي بلغة عربية راقية ولطيفة.
        `;
      }

      // اخذ الرد من Gemini
      const botAnswer = await getGeminiResponse(aiPrompt);
      setMessages(prev => [...prev, { text: botAnswer, sender: 'bot' }]);

    } catch (error) {
      setMessages(prev => [...prev, { text: 'عذراً حدث خطأ بسيط، الرجاء اعادة ارسال سؤالك 🤍', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100]" dir="rtl">
      {/* زر فتح الشات العائم */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all"
        >
          💬
        </button>
      )}

      {/* نافذة الشات */}
      {isOpen && (
        <div className="bg-white w-[350px] max-h-[520px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* راس النافذة */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">مساعدة المتجر 🤍</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>

          {/* منطقة عرض الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-black text-white rounded-br-none mr-auto'
                    : 'bg-white shadow-sm border border-gray-100 rounded-bl-none ml-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-white shadow-sm p-3 rounded-2xl max-w-[80%] animate-pulse">
                جاري الكتابة...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* حقل الارسال */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتبي سؤالك هنا..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 rounded-lg hover:bg-black/80 transition"
            >
              ارسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
