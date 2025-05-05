import React, { useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { Card, CardContent } from '@/components/ui/card';
import { Pizza, Coffee, Utensils } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  
  const getFallbackImage = (category: string) => {
    switch (category) {
      case 'pizza':
        return 'https://images.unsplash.com/photo-1513104890138-7c749659a591'; // Pizza fallback
      case 'tacos':
        return 'https://images.unsplash.com/photo-1611250188496-e966043a0629'; // Tacos fallback
      case 'drinks':
        return 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'; // Drinks fallback
      default:
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'; // Generic food fallback
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pizza':
        return <Pizza size={48} className="text-gray-400" />;
      case 'drinks':
        return <Coffee size={48} className="text-gray-400" />;
      default:
        return <Utensils size={48} className="text-gray-400" />;
    }
  };
  
  useEffect(() => {
    // Force refresh of the component to ensure latest prices are displayed
    if (products.length > 0) {
      console.log("Displaying products with updated prices:", 
        products.filter(p => p.category === 'pizza').map(p => `${p.name}: ${p.price}`));
    }
  }, [products]);
  
  if (products.length === 0) {
    return <p className="text-center py-8">Aucun produit trouvé dans cette catégorie.</p>;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <Card 
          key={product.id + '-' + product.price} // Adding price to key to force re-render on price change
          className="overflow-hidden hover:shadow-lg transition cursor-pointer hover:scale-105"
          onClick={() => addToCart(product)}
        >
          <div className="relative w-full h-40">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImage(product.category);
                  console.error(`Failed to load image for ${product.name}`);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                {getCategoryIcon(product.category)}
              </div>
            )}
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
