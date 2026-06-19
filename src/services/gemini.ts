import { products } from '../data/products';

const productsInfo = products.map(p => {
  let info = `المنتج: ${p.name} - السعر: $${p.price} - الوصف: ${p.description} - المميزات: ${p.features.join('، ')}`;
  if (p.howToUse && p.howToUse.length > 0) {
    info += ` - طريقة الاستخدام: ${p.howToUse.join('، ')}`;
  }
  return info;
}).join('\n');

const systemPrompt = `أنت مساعد ذكي لمتجر Madeleine. إليك المنتجات:\n${productsInfo}\n\nقواعد: أجب بالعربي فقط. لا تخترع معلومات.`;

export async function getGeminiResponse(userMessage: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return 'عذراً، هناك مشكلة في الإعدادات.';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'أهلاً، أنا مساعد متجر Madeleine. كيف يمكنني مساعدتك؟' }] },
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من فهم سؤالك.';
  } catch (error) {
    console.error('Error:', error);
    return 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
  }
}