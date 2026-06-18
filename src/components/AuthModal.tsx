import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      name: formData.name || formData.email.split('@')[0], 
      email: formData.email 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative h-32 bg-black flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-black text-gold tracking-tight">MADELEINE</h2>
            <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Beauty & Care</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 text-center font-bold transition-colors border-b-2 ${isLogin ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              تسجيل دخول
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 text-center font-bold transition-colors border-b-2 ${!isLogin ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              إنشاء حساب
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 mr-1">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-gold transition-all"
                    placeholder="أدخل اسمك"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full bg-gray-50 border-none rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-gold transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 mr-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border-none rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-gold transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-left">
                <button type="button" className="text-xs text-gray-400 hover:text-black transition-colors">نسيت كلمة المرور؟</button>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 hover:bg-gold transition-colors flex items-center justify-center gap-2"
            >
              {isLogin ? 'دخول' : 'إنشاء الحساب'}
              <ArrowRight size={18} className="rotate-180" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            من خلال الاستمرار، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بمادلين.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
