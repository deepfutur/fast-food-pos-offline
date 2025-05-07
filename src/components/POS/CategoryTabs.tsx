
import React, { useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Pizza, Coffee } from 'lucide-react';

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
      default:
        return null;
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
