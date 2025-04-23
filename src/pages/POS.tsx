
import React from 'react';
import { usePOS } from '../context/POSContext';
import CategoryTabs from '../components/POS/CategoryTabs';
import ProductGrid from '../components/POS/ProductGrid';
import ShoppingCart from '../components/POS/ShoppingCart';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const POS: React.FC = () => {
  const { state, logout } = usePOS();
  const { products, selectedCategory, currentUser } = state;
  
  // Filter products by selected category or show all if no category selected
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-pos-dark text-pos-light p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Fast Food Express POS</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="opacity-75">Utilisateur:</span>{' '}
              <span className="font-semibold">{currentUser?.name}</span>{' '}
              <span className="bg-pos-primary text-white text-xs px-2 py-1 rounded-full ml-1">
                {currentUser?.role === 'admin' ? 'Admin' : 'Caissier'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-pos-light hover:text-white hover:bg-pos-primary"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
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
