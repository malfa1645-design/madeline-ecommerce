import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, CreditCard, CheckCircle, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { useToast } from './Toast';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClear }) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'عمان',
  });
  const { showToast } = useToast();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 20 ? 0 : 2;
  const grandTotal = total + shipping;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep('checkout');
    showToast('الانتقال إلى صفحة الدفع', 'info');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      showToast('الرجاء ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    
    // إرسال البيانات للتطبيق الرئيسي لحفظ الطلب
    (window as any).onPlaceOrder?.(checkoutForm);

        // --- كود الربط مع n8n الجديد ---
    fetch('https://topgo20.app.n8n.cloud/webhook-test/8ef0f484-bd02-409a-ae54-8b73e093d884', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: checkoutForm.name,
        customerPhone: checkoutForm.phone,
        customerAddress: checkoutForm.address,
        customerCity: checkoutForm.city,
        orderDate: new Date().toLocaleString('ar-EG'),
        // إذا أردت إرسال المنتجات الموجودة في السلة أيضاً:
        // items: items 
      }),
    }).catch(err => console.error("Error sending to n8n:", err));
    // --------------------------------
    setCheckoutStep('success');
    showToast('تم تقديم طلبك بنجاح! 🎉', 'success');
  };

  const resetCart = () => {
    setCheckoutStep('cart');
    setCheckoutForm({ name: '', phone: '', address: '', city: 'عمان' });
    onClear();
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => { if (checkoutStep !== 'success') onClose(); }}
      />
      
      <div className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between bg-black text-white">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-gold" />
              <h2 className="text-xl font-bold">
                {checkoutStep === 'cart' && 'سلة المشتريات'}
                {checkoutStep === 'checkout' && 'إتمام الطلب'}
                {checkoutStep === 'success' && 'تم بنجاح!'}
              </h2>
            </div>
            <button 
              onClick={() => { if (checkoutStep !== 'success') onClose(); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart View */}
          {checkoutStep === 'cart' && (
            <>
              <div className="flex-grow overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">سلتك فارغة</h3>
                    <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات بعد</p>
                    <button 
                      onClick={onClose}
                      className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gold transition-colors active:scale-95"
                    >
                      ابدأ التسوق
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{items.length} منتجات في السلة</span>
                      <button 
                        onClick={() => { onClear(); showToast('تم إفراغ السلة', 'info'); }}
                        className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        إفراغ السلة
                      </button>
                    </div>
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 group">
                        <div className="w-20 h-24 rounded-lg overflow-hidden bg-white border shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                            <button 
                              onClick={() => { onRemove(item.id); showToast('تمت إزالة المنتج', 'info'); }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="text-gold font-bold mb-3">{item.price} دينار</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors active:scale-90"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => { onUpdateQuantity(item.id, 1); showToast('تمت الإضافة', 'success'); }}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors active:scale-90"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="font-bold">{(item.price * item.quantity).toFixed(2)} د.أ</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-bold">{total.toFixed(2)} د.أ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التوصيل</span>
                      <span className="font-bold">{shipping === 0 ? 'مجاني 🎁' : `${shipping} د.أ`}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="text-gray-800 font-bold">المجموع الكلي</span>
                      <span className="text-2xl font-black text-gold">{grandTotal.toFixed(2)} دينار</span>
                    </div>
                  </div>
                  {shipping > 0 && <p className="text-xs text-center text-gray-500 mb-4">💡 أضيفي منتجات بأكثر من {20 - total} دينار للحصول على توصيل مجاني!</p>}
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gold transition-colors flex items-center justify-center gap-3 active:scale-98"
                  >
                    إتمام الطلب
                    <ArrowLeft size={20} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Checkout View */}
          {checkoutStep === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="flex-grow flex flex-col overflow-y-auto">
              <div className="p-6 flex-grow space-y-5">
                <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4">
                  <p className="text-sm font-bold">ملخص الطلب</p>
                  <p className="text-xs text-gray-600 mt-1">{items.length} منتجات • المجموع: {total.toFixed(2)} د.أ</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold focus:border-gold transition-all outline-none"
                    placeholder="أدخل اسمك"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">رقم الجوال *</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold focus:border-gold transition-all outline-none"
                    placeholder="07XXXXXXXX"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">المدينة</label>
                  <select 
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold transition-all outline-none"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                  >
                    <option>عمان</option>
                    <option>الزرقاء</option>
                    <option>إربد</option>
                    <option>السلط</option>
                    <option>الكرك</option>
                    <option>العقبة</option>
                    <option>مأدبا</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">العنوان التفصيلي *</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold transition-all outline-none resize-none"
                    placeholder="الشارع، الحي، رقم المبنى..."
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">المجموع الكلي</span>
                  <span className="text-2xl font-black text-gold">{grandTotal.toFixed(2)} دينار</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="flex-1 py-4 rounded-2xl font-bold border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    رجوع
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gold transition-colors flex items-center justify-center gap-3 active:scale-98"
                  >
                    <CreditCard size={20} />
                    تأكيد الطلب
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Success View */}
          {checkoutStep === 'success' && (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={56} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">تم تقديم طلبك!</h3>
                <p className="text-gray-500">شكراً لثقتك بمادلين. سيتم التواصل معك قريباً لتأكيد الطلب.</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 w-full space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">الاسم:</span><span className="font-bold">{checkoutForm.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">الجوال:</span><span className="font-bold">{checkoutForm.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">المدينة:</span><span className="font-bold">{checkoutForm.city}</span></div>
                <div className="flex justify-between border-t pt-2 mt-2"><span className="text-gray-500">المجموع:</span><span className="font-black text-gold">{grandTotal.toFixed(2)} دينار</span></div>
              </div>
              <button 
                onClick={resetCart}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gold transition-colors active:scale-98"
              >
                متابعة التسوق
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
