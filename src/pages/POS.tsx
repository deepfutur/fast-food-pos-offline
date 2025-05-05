
import React, { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import CategoryTabs from '../components/POS/CategoryTabs';
import ProductGrid from '../components/POS/ProductGrid';
import ShoppingCart from '../components/POS/ShoppingCart';
import Header from '../components/Layout/Header';
import { Product } from '../types/pos';
import { toast } from '@/components/ui/use-toast';
import { products as mockProducts } from '../data/mockData';

const POS: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { products, selectedCategory } = state;
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  
  // Force refresh products from mockData to ensure latest prices
  useEffect(() => {
    console.log("Checking product prices in mockData:", 
      mockProducts.filter(p => p.category === 'pizza').map(p => `${p.name}: ${p.price}`));
    
    // Force refresh of products with latest data
    dispatch({ type: 'REFRESH_PRODUCTS', payload: mockProducts });
    
    // Verify pizza prices after refresh
    setTimeout(() => {
      console.log("Current product prices in state after refresh:", 
        state.products.filter(p => p.category === 'pizza').map(p => `${p.name}: ${p.price}`));
    }, 100);
  }, [dispatch]);
  
  // Update display products when state.products changes
  useEffect(() => {
    setDisplayProducts(products);
    console.log("Display products updated with latest state");
  }, [products]);
  
  // Sort products by category when no category is selected
  const filteredProducts = selectedCategory
    ? displayProducts.filter(product => product.category === selectedCategory)
    : displayProducts.sort((a, b) => a.category.localeCompare(b.category));
  
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
