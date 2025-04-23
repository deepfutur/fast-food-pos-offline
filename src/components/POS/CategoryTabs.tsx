
import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';

const CategoryTabs: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { categories, selectedCategory } = state;
  
  return (
    <div className="flex overflow-x-auto space-x-2 pb-4">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        className={`whitespace-nowrap ${selectedCategory === null ? 'bg-pos-primary text-white' : ''} px-6 py-4`}
        onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}
      >
        Tous
      </Button>
      
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`whitespace-nowrap ${selectedCategory === category.id ? 'bg-pos-primary text-white' : ''} px-6 py-4`}
          onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id })}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;
