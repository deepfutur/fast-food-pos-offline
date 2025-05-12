
import React, { useState, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import POSLayout from '../components/Layout/POSLayout';
import ProductGrid from '../components/POS/ProductGrid';
import CategoryTabs from '../components/POS/CategoryTabs';
import ShoppingCart from '../components/POS/ShoppingCart';
import PaymentDialog from '../components/POS/PaymentDialog';
import ReceiptPreview from '../components/POS/ReceiptPreview';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const POS: React.FC = () => {
  const { state, dispatch } = usePOS();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [displayProducts, setDisplayProducts] = useState(state.products);
  
  // Check for low stock ingredients
  useEffect(() => {
    const lowStockIngredients = state.ingredients.filter(
      ing => ing.stock <= (ing.minStock || 0)
    );
    
    if (lowStockIngredients.length > 0) {
      lowStockIngredients.forEach(ing => {
        toast({
          title: "Stock bas",
          description: `Le stock de ${ing.name} est bas (${ing.stock} ${ing.unit})`,
          variant: "destructive",
        });
      });
    }
  }, [state.ingredients]);
  
  // Filter products based on selected category
  useEffect(() => {
    const category = state.selectedCategory;
    console.info("Current product prices in state after refresh:", 
      state.products.map(p => `${p.name}: ${p.price}`));
    
    if (category) {
      const filtered = state.products.filter((p) => p.category === category);
      setDisplayProducts(filtered);
    } else {
      setDisplayProducts(state.products);
    }
    
    console.info("Display products updated with latest state");
  }, [state.selectedCategory, state.products]);
  
  // Handle category selection
  const handleSelectCategory = (category: string | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };
  
  // Open payment dialog
  const openPayment = () => {
    if (state.cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des produits au panier",
        variant: "destructive",
      });
      return;
    }
    setIsPaymentOpen(true);
  };
  
  // Handle completed payment and order
  const handlePaymentComplete = () => {
    const orderId = `order-${Date.now()}`;
    setCompletedOrderId(orderId);
    setIsPaymentOpen(false);
    
    // Explicitement afficher le reçu après paiement
    console.log("Payment complete in POS component, showing receipt:", orderId);
    setTimeout(() => setShowReceipt(true), 100); // Petit délai pour s'assurer que tout est prêt
  };
  
  // Handle admin navigation
  const handleAdminClick = () => {
    navigate('/admin');
  };
  
  // Products with recipes check
  useEffect(() => {
    const productsWithoutRecipes = state.products.filter(
      product => !state.recipes.some(recipe => recipe.productId === product.id)
    );
    
    if (productsWithoutRecipes.length > 0 && state.currentUser?.role === 'admin') {
      toast({
        title: "Produits sans recettes",
        description: `${productsWithoutRecipes.length} produits n'ont pas de recettes définies.`,
        variant: "destructive",
      });
    }
  }, [state.products, state.recipes, state.currentUser]);

  return (
    <div className="h-full">
      <div className="h-full flex flex-col md:flex-row">
        <div className="w-full md:w-3/4 md:pr-4 flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <button 
              onClick={handleAdminClick}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Admin
            </button>
          </div>
          
          <div>
            <CategoryTabs 
              categories={state.categories} 
              selectedCategory={state.selectedCategory || ''} 
              onSelectCategory={handleSelectCategory} 
            />
          </div>
          
          <div className="flex-1 overflow-y-auto pb-4">
            <ProductGrid products={displayProducts} />
          </div>
        </div>
        
        <div className="w-full md:w-1/4 mt-4 md:mt-0">
          <ShoppingCart />
        </div>
      </div>
      
      <PaymentDialog 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onComplete={handlePaymentComplete}
      />
      
      {/* Afficher le reçu quand showReceipt est true et un orderId est disponible */}
      {showReceipt && completedOrderId && (
        <ReceiptPreview 
          orderId={completedOrderId}
          onClose={() => {
            console.log("Closing receipt in POS component");
            setShowReceipt(false);
            setCompletedOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default POS;
