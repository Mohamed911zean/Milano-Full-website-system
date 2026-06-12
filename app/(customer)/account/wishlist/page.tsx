import React from 'react';
import { SectionLabel } from '@/components/ui/Typography';
import { getWishlistProducts } from '@/app/actions/wishlist';
import ProductCard from '@/components/products/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'المفضلة | حسابي',
};

export default async function WishlistPage() {
  const products = await getWishlistProducts();

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <SectionLabel>المنتجات المفضلة</SectionLabel>
          <h1 className="text-4xl font-display font-bold text-white">قائمة الأمنيات</h1>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center text-gold mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">لا توجد منتجات في المفضلة</h3>
            <p className="text-text-muted text-sm font-light">تصفح منتجاتنا وأضف ما يعجبك إلى قائمتك</p>
          </div>
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-gold hover:bg-gold-light text-bg-base font-bold rounded-xl transition-all"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
