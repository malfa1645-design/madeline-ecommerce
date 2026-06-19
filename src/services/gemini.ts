import { GoogleGenerativeAI } from "@google/generative-ai";

// الاتصال بمفتاح Gemini الخاص بك
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ⚠️ لاحظ كلمة export في اول السطر! هي السبب الرئيسي للخطأ
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  // في حال لم تضف المفتاح بعد
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "مرحباً، الذكاء الاصطناعي غير مفعل حالياً";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "عذراً، حدث خطأ في الرد، الرجاء المحاولة لاحقاً";
  }
};
