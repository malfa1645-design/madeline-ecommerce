import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Settings, Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react';
import { Product, Order } from '../types';
import { useToast } from './Toast';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, orders, onUpdateProduct, onAddProduct, onDeleteProduct, onUpdateOrderStatus, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (isAdding) {
        onAddProduct(editingProduct);
        showToast('تم إضافة المنتج بنجاح', 'success');
      } else {
        onUpdateProduct(editingProduct);
        showToast('تم تحديث بيانات المنتج', 'success');
      }
      setEditingProduct(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-gray-100 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black text-white p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gold">لوحة الإدارة</h2>
          <button onClick={onClose} className="md:hidden text-white"><X /></button>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-gold text-black font-bold' : 'hover:bg-white/10 text-gray-400'}`}
          >
            <Package size={20} />
            إدارة المنتجات
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-gold text-black font-bold' : 'hover:bg-white/10 text-gray-400'}`}
          >
            <ShoppingCart size={20} />
            الطلبات
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-auto">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-4">
          <button 
            onClick={() => {
              if(confirm('هل تريدين إعادة الموقع لحالته الأصلية؟ سيتم حذف جميع الصور والتعديلات والطلبات.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full text-center py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 text-xs border border-red-500/20"
          >
            إعادة ضبط المصنع
          </button>
          <button onClick={onClose} className="w-full text-center py-3 bg-white/5 rounded-xl hover:bg-white/10 text-sm">العودة للمتجر</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {activeTab === 'products' ? 'قائمة المنتجات' : 'سجل الطلبات'}
          </h3>
          {activeTab === 'products' && (
            <button 
              onClick={() => {
                setIsAdding(true);
                setEditingProduct({ id: Date.now().toString(), name: '', price: 0, description: '', features: [], image: '', category: 'عام' });
              }}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gold hover:text-black transition-colors"
            >
              <Plus size={18} />
              إضافة منتج جديد
            </button>
          )}
        </header>

        <div className="flex-grow overflow-y-auto p-6">
          {activeTab === 'products' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border flex gap-4 items-center">
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <p className="text-gold font-bold text-xs">{p.price} دينار</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setIsAdding(false); setEditingProduct(p); }} className="p-2 bg-gray-100 rounded-lg hover:bg-blue-50 text-blue-600"><Edit2 size={16} /></button>
                    <button onClick={() => { if(confirm('هل أنت متأكد؟')) onDeleteProduct(p.id); }} className="p-2 bg-gray-100 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">لا توجد طلبات بعد</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">#{order.id.slice(-6)}</span>
                        <h4 className="font-bold">{order.customerName}</h4>
                        <p className="text-xs text-gray-500">{order.customerPhone} • {order.customerCity}</p>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold border-none outline-none ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="completed">تم التوصيل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-bold">{item.price * item.quantity} د.أ</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-black border-t pt-2 text-gold">
                        <span>المجموع</span>
                        <span>{order.total} دينار</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-black text-white flex justify-between">
              <h4 className="font-bold">{isAdding ? 'إضافة منتج جديد' : 'تعديل المنتج'}</h4>
              <button onClick={() => setEditingProduct(null)}><X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500">اسم المنتج</label>
                  <input 
                    required 
                    className="w-full bg-gray-50 p-3 rounded-xl border-none" 
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">السعر (دينار)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-gray-50 p-3 rounded-xl border-none" 
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">التصنيف</label>
                  <input 
                    className="w-full bg-gray-50 p-3 rounded-xl border-none" 
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 block">صورة المنتج</label>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    {editingProduct.image && (
                      <img src={editingProduct.image} className="w-12 h-12 rounded-lg object-cover border" alt="preview" />
                    )}
                    <label className="flex-grow cursor-pointer">
                      <span className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gold hover:text-black transition-colors inline-block">
                        اختر صورة من جهازك
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingProduct({
                                ...editingProduct,
                                image: reader.result as string
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400">يمكنك رفع صورة مباشرة أو وضع رابط أدناه:</p>
                  <input 
                    className="w-full bg-gray-50 p-2 rounded-lg border-none text-[10px] text-gray-400" 
                    placeholder="رابط الصورة اختياري"
                    value={editingProduct.image}
                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500">الوصف</label>
                  <textarea 
                    className="w-full bg-gray-50 p-3 rounded-xl border-none text-sm h-24" 
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-gold text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save size={20} />
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
