
import React, { useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Pizza, Coffee, Utensils, ShoppingCart } from 'lucide-react';

const CategoryTabs: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { categories, selectedCategory } = state;
  
  // Debug categories
  useEffect(() => {
    console.log("Available categories:", categories.map(cat => cat.id));
  }, [categories]);
  
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'pizza':
        return <Pizza size={18} className="mr-2" />;
      case 'drinks':
        return <Coffee size={18} className="mr-2" />;
      case 'tacos':
        return <ShoppingCart size={18} className="mr-2" />;
      case 'sandwiches':
        return <Utensils size={18} className="mr-2" />;
      case 'burgers':
        return <Utensils size={18} className="mr-2" />;
      case 'salads':
        return <Utensils size={18} className="mr-2" />;
      case 'pasticcio':
        return <Utensils size={18} className="mr-2" />;
      case 'pasta':
        return <Utensils size={18} className="mr-2" />;
      case 'dishes':
        return <Utensils size={18} className="mr-2" />;
      case 'menus':
        return <ShoppingCart size={18} className="mr-2" />;
      default:
        return <Utensils size={18} className="mr-2" />;
    }
  };
  
  return (
    <div className="flex overflow-x-auto space-x-2 pb-4">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        className={`whitespace-nowrap ${selectedCategory === null ? 'bg-pos-primary text-white' : ''} px-6 py-4`}
        onClick={() => {
          dispatch({ type: 'SET_CATEGORY', payload: null });
          console.log("Selected all categories");
        }}
      >
        {getCategoryIcon("all")}
        Tous
      </Button>
      
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`whitespace-nowrap ${selectedCategory === category.id ? 'bg-pos-primary text-white' : ''} px-6 py-4`}
          onClick={() => {
            dispatch({ type: 'SET_CATEGORY', payload: category.id });
            console.log(`Selected category: ${category.id}`);
          }}
        >
          {getCategoryIcon(category.id)}
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
