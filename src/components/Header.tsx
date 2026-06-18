import React, { useState } from 'react';
import { ShoppingBag, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useToast } from './Toast';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  user: { name: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onAuthClick, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { showToast } = useToast();

  const handleNavClick = (section: string) => {
    setMobileMenuOpen(false);
    showToast(`انتقال إلى: ${section}`, 'info');
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 text-white border-b border-gold/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); showToast('العودة إلى الأعلى', 'info'); }}
            className="text-2xl font-bold tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-gold">MADELEINE</span>
            <span className="text-xs uppercase tracking-[0.3em] font-light hidden sm:inline-block">Beauty</span>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); handleNavClick('الرئيسية'); }}
            className="hover:text-gold transition-colors"
          >
            الرئيسية
          </button>
          <button 
            onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); handleNavClick('المنتجات'); }}
            className="hover:text-gold transition-colors"
          >
            المنتجات
          </button>
          <button 
            onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) || window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); handleNavClick('عن مادلين'); }}
            className="hover:text-gold transition-colors"
          >
            عن مادلين
          </button>
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:text-gold transition-colors bg-white/5 px-3 py-2 rounded-full"
              >
                <User size={20} />
                <span className="text-sm hidden sm:inline-block">{user.name}</span>
                <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-black rounded-2xl shadow-2xl border overflow-hidden z-50">
                  <div className="p-4 bg-black text-white text-xs">
                    <div className="font-bold">مرحباً</div>
                    <div className="text-gold">{user.name}</div>
                  </div>
                  <button 
                    onClick={() => { setUserMenuOpen(false); showToast('صفحة الحساب', 'info'); }}
                    className="w-full text-right p-4 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <User size={16} />
                    حسابي الشخصي
                  </button>
                  <button 
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="w-full text-right p-4 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 border-t"
                  >
                    <LogOut size={16} />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <User size={20} />
              <span className="text-sm hidden sm:inline-block">تسجيل الدخول</span>
            </button>
          )}
          
          <button 
            onClick={() => { onCartClick(); showToast('فتح سلة المشتريات', 'info'); }}
            className="relative p-2 bg-gold/10 rounded-full text-gold hover:bg-gold hover:text-black transition-all active:scale-95"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gold/20 bg-black">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <button 
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); handleNavClick('الرئيسية'); }}
              className="text-right py-3 border-b border-white/10 hover:text-gold transition-colors font-medium"
            >
              🏠 الرئيسية
            </button>
            <button 
              onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); handleNavClick('المنتجات'); }}
              className="text-right py-3 border-b border-white/10 hover:text-gold transition-colors font-medium"
            >
              🛍️ المنتجات
            </button>
            <button 
              onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); handleNavClick('عن مادلين'); }}
              className="text-right py-3 border-b border-white/10 hover:text-gold transition-colors font-medium"
            >
              ℹ️ عن مادلين
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
