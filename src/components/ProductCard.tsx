import React from 'react';
import { Product } from '../types';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gold transition-colors"
          >
            <Plus size={16} />
            إضافة للسلة
          </button>
        </div>
        <div className="absolute top-4 right-4 bg-black/80 text-gold px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md">
          {product.price} دينار
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{product.category}</div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2 mb-6 flex-grow">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Check size={10} strokeWidth={3} />
              </div>
              {feature}
            </div>
          ))}
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          className="w-full py-3 rounded-xl border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-all duration-300"
        >
          اطلب الآن
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
