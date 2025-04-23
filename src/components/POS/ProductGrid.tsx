
import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { Card, CardContent } from '@/components/ui/card';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { addToCart } = usePOS();
  
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
            />
            <div className="absolute top-0 right-0 bg-pos-primary text-white px-2 py-1 text-sm font-semibold rounded-bl-lg">
              {product.price.toFixed(2)} €
            </div>
          </div>
          <CardContent className="p-2">
            <h3 className="font-bold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">{product.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
