
import React from 'react';
import { usePOS } from '../context/POSContext';
import CategoryTabs from '../components/POS/CategoryTabs';
import ProductGrid from '../components/POS/ProductGrid';
import ShoppingCart from '../components/POS/ShoppingCart';
import Header from '../components/Layout/Header';

const POS: React.FC = () => {
  const { state } = usePOS();
  const { products, selectedCategory } = state;
  
  // Filter products by selected category or show all if no category selected
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;
  
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
