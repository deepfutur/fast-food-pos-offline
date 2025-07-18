
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
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  useEffect(() => {
    console.log("ProductGrid received products:", products.length);
    if (products.length > 0) {
      console.log("First product:", products[0]);
      console.log("Products by category:",
        Array.from(new Set(products.map(p => p.category)))
          .map(cat => `${cat}: ${products.filter(p => p.category === cat).length}`));
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
        return 'https://images.unsplash.com/photo-1513104890138-7c749659a591';
      case 'tacos':
        return 'https://images.unsplash.com/photo-1611250188496-e966043a0629';
      case 'drinks':
        return 'https://images.unsplash.com/photo-1600271886742-f049cd451bba';
      case 'sandwiches':
        return 'https://images.unsplash.com/photo-1554433607-66b5efe9d304';
      case 'burgers':
        return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd';
      case 'salads':
        return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd';
      case 'pasticcio':
        return 'https://images.unsplash.com/photo-1560750133-c5d4ef4de911';
      case 'pasta':
        return 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8';
      case 'dishes':
        return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1';
      default:
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
      duration: 2000,
    });
  };

  // Filtrer les produits selon la catégorie sélectionnée
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (filteredProducts.length === 0) {
    return (
      <>
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Toutes les catégories</option>
            <option value="pizza">Pizza</option>
            <option value="tacos">Tacos</option>
            <option value="drinks">Boissons</option>
            <option value="burgers">Burgers</option>
            <option value="sandwiches">Sandwiches</option>
            <option value="salads">Salades</option>
            <option value="pasta">Pâtes</option>
            <option value="dishes">Plats</option>
          </select>
        </div>
        <p className="text-center py-8">Aucun produit trouvé dans cette catégorie.</p>
      </>
    );
  }

  return (
    <>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Toutes les catégories</option>
          <option value="pizza">Pizza</option>
          <option value="tacos">Tacos</option>
          <option value="drinks">Boissons</option>
          <option value="burgers">Burgers</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="salads">Salades</option>
          <option value="pasta">Pâtes</option>
          <option value="dishes">Plats</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <Card
            key={product.id + '-' + product.price}
            className="overflow-hidden hover:shadow-lg transition cursor-pointer hover:scale-105"
            onClick={() => handleAddToCart(product)}
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
    </>
  );
};

export default ProductGrid;
