import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import { ToastProvider, useToast } from './components/Toast';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Order } from './types';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, MessageCircle, Phone, Sparkles, Gift, Lock } from 'lucide-react';

function AppContent() {
  // تحميل البيانات المحفوظة عند فتح الموقع
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('madeleine_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('madeleine_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState<'الكل' | 'عيون' | 'أظافر'>('الكل');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  // حفظ المنتجات تلقائياً عند أي تعديل (بما في ذلك الصور)
  useEffect(() => {
    localStorage.setItem('madeleine_products', JSON.stringify(dynamicProducts));
  }, [dynamicProducts]);

  // حفظ الطلبات تلقائياً
  useEffect(() => {
    localStorage.setItem('madeleine_orders', JSON.stringify(orders));
  }, [orders]);

  // ربط نافذة الطلب
  useEffect(() => {
    (window as any).onPlaceOrder = (customerData: any) => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerCity: customerData.city,
        customerAddress: customerData.address,
        items: [...cartItems],
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) >= 20 ? 0 : 2),
        status: 'pending',
        createdAt: new Date(),
      };
      setOrders(prev => [newOrder, ...prev]);
      setCartItems([]);
    };
  }, [cartItems]);

  const handleUpdateProduct = (updated: Product) => {
    setDynamicProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };
  const handleAddProduct = (newProduct: Product) => {
    setDynamicProducts(prev => [...prev, newProduct]);
  };
  const handleDeleteProduct = (id: string) => {
    setDynamicProducts(prev => prev.filter(p => p.id !== id));
  };
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`تم إضافة "${product.name}" إلى السلة 🛍️`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    showToast(`مرحباً بك، ${userData.name}! ✨`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleAdminAccess = () => {
    const pass = prompt('الرجاء إدخال كلمة مرور المسؤولة:');
    if (pass === 'admin123') {
      setIsAdminOpen(true);
      showToast('مرحباً بكِ في لوحة التحكم', 'success');
    } else {
      showToast('كلمة المرور غير صحيحة', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {isAdminOpen && (
        <AdminDashboard 
          products={dynamicProducts}
          orders={orders}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <main>
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60"
              alt="Beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-white text-right">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full backdrop-blur-md border border-gold/30">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm font-bold tracking-widest uppercase">جديدنا: جل الحواجب بتركيبة الزيوت الطبيعية</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
                جمال طبيعي يبدأ من <span className="text-gold">التفاصيل</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                اكتشفي مجموعة مادلين للعناية بالجمال. تركيبات فريدة غنية بالفيتامينات والزيوت الطبيعية لتعزيز جمالك الحقيقي.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gold text-black px-10 py-4 rounded-full font-black text-lg hover:bg-white transition-all flex items-center gap-3 group active:scale-95"
                >
                  تسوقي الآن
                  <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-24 container mx-auto px-4">
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-gold font-black tracking-[0.4em] text-sm uppercase">المجموعة الحصرية</h2>
            <h3 className="text-4xl md:text-5xl font-black">كتالوج مادلين</h3>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          </div>

          {/* شريط التصنيفات */}
          <div className="flex justify-center gap-4 mb-16">
            {['الكل', 'عيون', 'أظافر'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
                  activeCategory === cat 
                  ? 'bg-black text-white border-black shadow-lg scale-105' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gold hover:text-gold'
                }`}
              >
                {cat === 'الكل' ? 'جميع المنتجات' : cat === 'عيون' ? 'قسم العيون' : 'قسم الأظافر'}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicProducts
              .filter(p => {
                if (activeCategory === 'الكل') return true;
                if (activeCategory === 'عيون') return p.category.includes('عين') || p.category.includes('حاجب') || p.category.includes('رموش');
                if (activeCategory === 'أظافر') return p.category.includes('أظافر');
                return true;
              })
              .map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
          </div>

          {dynamicProducts.filter(p => {
            if (activeCategory === 'الكل') return true;
            if (activeCategory === 'عيون') return p.category.includes('عين') || p.category.includes('حاجب') || p.category.includes('رموش');
            if (activeCategory === 'أظافر') return p.category.includes('أظافر');
            return true;
          }).length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold">
              لا توجد منتجات في هذا القسم حالياً.
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="text-2xl font-black">MADELEINE</div>
          <div className="flex justify-center gap-8">
             <button onClick={() => showToast('📞 0776120965', 'info')} className="flex items-center gap-2 text-gray-500 hover:text-black">
               <Phone size={18} />
               0776120965
             </button>
             <button onClick={handleAdminAccess} className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm">
               <Lock size={14} />
               دخول المسؤولة
             </button>
          </div>
          <div className="pt-12 border-t text-xs text-gray-400">
            &copy; {new Date().getFullYear()} مادلين بيوتي. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
