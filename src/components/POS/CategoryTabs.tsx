
import React from 'react';
import { Button } from '@/components/ui/button';
import { Category } from '../../types/pos';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-4 overflow-x-auto whitespace-nowrap">
      <div className="inline-flex gap-2 py-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
        >
          All
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
