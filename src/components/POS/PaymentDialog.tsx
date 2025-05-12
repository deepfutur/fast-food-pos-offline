
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePOS } from '../../context/POSContext';
import { toast } from '@/components/ui/use-toast';
import PaymentMethods from './PaymentMethods';
import OrderSummary from './OrderSummary';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';
import { useFinancialStore } from '../../services/financialService';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (paymentMethod: 'cash' | 'card' | 'voucher', cashReceived?: number) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose, onComplete }) => {
  const { getCartSubtotal, getCartTotal, getCartTax, completeOrder, state, dispatch } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'voucher'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  
  // Utilisation du service financier
  const { addTransaction } = useFinancialStore();
  
  const updateIngredientsStock = () => {
    // For each item in the cart, find its recipe and update ingredient stock
    state.cart.forEach(cartItem => {
      const recipe = state.recipes.find(recipe => recipe.productId === cartItem.productId);
      
      if (recipe) {
        // For each ingredient in the recipe, reduce stock by quantity × number of items
        recipe.ingredients.forEach(recipeItem => {
          const ingredient = state.ingredients.find(ing => ing.id === recipeItem.ingredientId);
          
          if (ingredient) {
            // Calculate how much is used (recipe quantity × number of items ordered)
            const quantityUsed = recipeItem.quantity * cartItem.quantity;
            
            // Update ingredient stock
            const updatedIngredient = {
              ...ingredient,
              stock: Math.max(0, ingredient.stock - quantityUsed)
            };
            
            // Dispatch update action
            dispatch({ 
              type: 'UPDATE_INGREDIENT', 
              payload: updatedIngredient 
            });
            
            // Alert if stock is low
            if (updatedIngredient.stock <= (ingredient.minStock || 0)) {
              toast({
                title: "Stock bas",
                description: `Le stock de ${ingredient.name} est bas (${updatedIngredient.stock} ${ingredient.unit})`,
                variant: "destructive",
              });
            }
          }
        });
      }
    });
  };
  
  const handleComplete = () => {
    const total = getCartTotal();
    
    // Vérifier le montant pour les paiements en espèces
    if (paymentMethod === 'cash') {
      const cashReceived = parseFloat(cashAmount);
      if (isNaN(cashReceived) || cashReceived < total) {
        toast({
          title: "Montant insuffisant",
          description: "Le montant reçu doit être supérieur ou égal au total",
          variant: "destructive",
        });
        return;
      }
      completeOrder(paymentMethod, cashReceived);
    } else {
      completeOrder(paymentMethod);
    }
    
    // Mise à jour du stock d'ingrédients
    updateIngredientsStock();
    
    // Enregistrer la transaction financière
    addTransaction({
      id: `trans-${Date.now()}`,
      type: "credit", // Changed from "sale" to "credit"
      amount: total,
      date: new Date().toISOString(), // Convert Date to string
      description: `Vente - ${state.cart.reduce((sum, item) => sum + item.quantity, 0)} produits`
    });
    
    toast({
      title: "Paiement accepté",
      description: "La commande a été complétée avec succès",
    });
    
    onComplete(paymentMethod, paymentMethod === 'cash' ? parseFloat(cashAmount) : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paiement</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <PaymentMethods
            selectedMethod={paymentMethod}
            onMethodSelect={setPaymentMethod} // Changed from onSelect to onMethodSelect
          />
          
          <OrderSummary 
            subtotal={getCartSubtotal()} 
            tax={getCartTax()} 
            total={getCartTotal()} 
            taxRate={state.tax} 
            cashAmount={cashAmount}
          />
          
          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <label htmlFor="cash-amount" className="block text-sm font-medium">
                Montant reçu
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </span>
                <Input
                  id="cash-amount"
                  type="number"
                  min={getCartTotal()}
                  step="0.01"
                  className="pl-10"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder={`${getCartTotal().toFixed(2)} ou plus`}
                />
              </div>
              {parseFloat(cashAmount) >= getCartTotal() && (
                <div className="text-sm text-right">
                  Monnaie: {(parseFloat(cashAmount) - getCartTotal()).toFixed(2)} {state.currency}
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Annuler
          </Button>
          <Button onClick={handleComplete}>
            {paymentMethod === 'cash'
              ? `Encaisser ${getCartTotal().toFixed(2)} ${state.currency}`
              : `Payer ${getCartTotal().toFixed(2)} ${state.currency}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
