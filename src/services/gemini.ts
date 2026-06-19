// services/gemini.ts

import { products } from '../data/products'; // استيراد بيانات المنتجات

// تحويل بيانات المنتجات إلى نص يفهمه الذكاء الاصطناعي
const productsContext = products.map(p => `
- المنتج: ${p.name}
- الوصف: ${p.description}
- السعر: ${p.price} ريال
- المميزات: ${p.features.join('، ')}
- طريقة الاستخدام: ${p.usage}
`).join('\n');

// هذا هو "التعليم" الذي سيعرف منه البوت كل شيء عن المتجر
const systemPrompt = `
أنت مساعد ذكي في متجرنا الإلكتروني. مهمتك هي مساعدة العملاء ومعرفة معلومات المنتجات.

إليك قائمة المنتجات الموجودة في المتجر:
${productsContext}

قواعد مهمة:
1. أجب فقط عن الأسئلة المتعلقة بالمنتجات الموجودة في القائمة أعلاه.
2. إذا سأل العميل عن منتج غير موجود، أخبره że هذا المنتج غير متوفر حالياً واقترح منتجاً مشابهاً.
3. إذا سأل العميل عن طريقة الاستخدام، أعطه الطريقة الصحيحة من القائمة.
4. إذا سأل عن المميزات، اذكر له كل المميزات.
5. إذا سأل عن السعر، أعطه السعر بالريال.
6. كن ودوداً ومختصاً ومحترفاً.
7. أجب باللغة العربية.
`



export async function getGeminiResponse(userMessage: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt }  // التعليم + بيانات المنتجات
            ]
          },
          {
            role: 'model',
            parts: [
              { text: 'فهمت، أنا مساعد المتجر وجاهز للإجابة على أسئلة العملاء عن المنتجات.' }
            ]
          },
          {
            role: 'user',
            parts: [
              { text: userMessage }  // سؤال العميل
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    }
  );

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من الإجابة.';
}
