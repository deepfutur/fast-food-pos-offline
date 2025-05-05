
import React, { useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import CategoryTabs from '../components/POS/CategoryTabs';
import ProductGrid from '../components/POS/ProductGrid';
import ShoppingCart from '../components/POS/ShoppingCart';
import Header from '../components/Layout/Header';

const POS: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { products, selectedCategory } = state;
  
  // Vérifier si les catégories ont des produits au chargement
  useEffect(() => {
    const pizzaProducts = products.filter(p => p.category === 'pizza');
    const tacosProducts = products.filter(p => p.category === 'tacos');
    
    console.log('Catégories disponibles:', state.categories.map(c => c.id));
    console.log('Produits disponibles:', products.length);
    console.log('Produits pizza:', pizzaProducts.length);
    console.log('Détails produits pizza:', pizzaProducts.map(p => p.name));
    console.log('Produits tacos:', tacosProducts.length);
    console.log('Détails produits tacos:', tacosProducts.map(p => p.name));
    
    if (pizzaProducts.length === 0 && tacosProducts.length === 0) {
      console.warn('Les produits pizza et tacos sont définis mais ne sont pas chargés correctement.');
    }
  }, [state.categories, products]);
  
  // Sort products by category when no category is selected
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products.sort((a, b) => a.category.localeCompare(b.category));
  
  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-4 flex flex-col">
        <CategoryTabs />
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="w-2/3 overflow-auto pb-4">
            <ProductGrid products={filteredProducts} />
          </div>
          
          <div className="w-1/3">
            <ShoppingCart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
