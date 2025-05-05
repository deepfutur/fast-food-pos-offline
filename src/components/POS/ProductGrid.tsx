
import React, { useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { Card, CardContent } from '@/components/ui/card';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { addToCart, state } = usePOS();
  
  useEffect(() => {
    console.log("ProductGrid received products:", products.length);
    if (products.length > 0) {
      console.log("First product:", products[0]);
    }
  }, [products]);
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'MAD':
        return 'DH';
      case 'XAF':
        return 'XAF';
      case 'USD':
        return '$';
      case 'EUR':
      default:
        return '€';
    }
  };
  
  if (products.length === 0) {
    return <p className="text-center py-8">Aucun produit trouvé dans cette catégorie.</p>;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <Card 
          key={product.id} 
          className="overflow-hidden hover:shadow-lg transition cursor-pointer hover:scale-105"
          onClick={() => addToCart(product)}
        >
          <div className="relative w-full h-40">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f'; // Fallback image
                console.error(`Failed to load image for ${product.name}`);
              }}
            />
            <div className="absolute top-0 right-0 bg-pos-primary text-white px-2 py-1 text-sm font-semibold rounded-bl-lg">
              {product.price.toFixed(2)} {getCurrencySymbol(state.currency)}
            </div>
          </div>
          <CardContent className="p-2">
            <h3 className="font-bold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">{product.description || ''}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
