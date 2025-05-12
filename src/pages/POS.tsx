
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
  const { products, selectedCategory, ingredients, recipes } = state;
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  
  // Force refresh products from mockData to ensure latest prices
  useEffect(() => {
    console.log("Checking product prices in mockData:", 
      mockProducts.filter(p => p.category === 'pizza').map(p => `${p.name}: ${p.price}`));
    
    // Force refresh of products 
    mockProducts.forEach(product => {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    });
    
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

  // Check ingredient stock levels
  useEffect(() => {
    // Find ingredients that are below their minimum stock level
    const lowStockIngredients = ingredients.filter(
      ing => ing.stock <= (ing.minStock || 0)
    );
    
    if (lowStockIngredients.length > 0) {
      // Show warning toast for low stock ingredients
      toast({
        title: "Ingrédients en stock bas",
        description: `${lowStockIngredients.length} ingrédients ont un stock bas`,
        variant: "warning",
      });
      
      // Log details to console
      console.log("Ingrédients en stock bas:", 
        lowStockIngredients.map(ing => `${ing.name}: ${ing.stock}/${ing.minStock} ${ing.unit}`));
    }
  }, [ingredients]);
  
  // Filter products by category
  const filteredProducts = selectedCategory
    ? displayProducts.filter(product => product.category === selectedCategory)
    : displayProducts.sort((a, b) => a.category.localeCompare(b.category));
  
  // Debug the filtering
  useEffect(() => {
    if (selectedCategory) {
      console.log(`Filtering by category: ${selectedCategory}`);
      console.log(`Filtered products count: ${filteredProducts.length}`);
      if (filteredProducts.length === 0) {
        // Check if the category exists in the products
        const categoryExists = products.some(p => p.category === selectedCategory);
        console.log(`Does category ${selectedCategory} exist in products? ${categoryExists}`);
        console.log(`Available categories: ${Array.from(new Set(products.map(p => p.category)))}`);
      }
    }
  }, [selectedCategory, filteredProducts, products]);
  
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
