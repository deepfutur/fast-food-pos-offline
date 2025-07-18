
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePOS } from '../../context/POSContext';
import { toast } from '@/components/ui/sonner';
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
  const { getCartSubtotal, getCartTotal, getCartTax, completeOrder, state } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'voucher'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  
  // Utilisation du service financier
  const { addTransaction } = useFinancialStore();
  
  const handleComplete = () => {
    const total = getCartTotal();
    
    // Vérifier le montant pour les paiements en espèces
    if (paymentMethod === 'cash') {
      const cashReceived = parseFloat(cashAmount);
      if (isNaN(cashReceived) || cashReceived < total) {
        toast.error("Montant insuffisant");
        return;
      }
      
      // Compléter la commande dans le système POS
      completeOrder(paymentMethod, cashReceived);
      
      // Ajouter la transaction au système financier
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Vente (${state.cart.length} articles)`,
        category: 'recette',
        amount: total,
        type: 'credit',
        paymentMethod: 'espèces',
        comment: `Payé: ${cashReceived.toFixed(2)}, Rendu: ${(cashReceived - total).toFixed(2)}`
      });
      
      // Compléter la transaction
      onComplete(paymentMethod, cashReceived);
    } else {
      // Compléter la commande dans le système POS
      completeOrder(paymentMethod);
      
      // Ajouter la transaction au système financier
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Vente (${state.cart.length} articles)`,
        category: 'recette',
        amount: total,
        type: 'credit',
        paymentMethod: paymentMethod === 'card' ? 'carte' : 'autre',
      });
      
      // Compléter la transaction
      onComplete(paymentMethod);
    }
    
    toast.success("Commande finalisée avec succès!");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finaliser la commande</DialogTitle>
        </DialogHeader>
        
        <OrderSummary 
          subtotal={getCartSubtotal()}
          tax={getCartTax()}
          total={getCartTotal()}
          taxRate={state.tax}
          cashAmount={cashAmount}
        />
        
        <PaymentMethods 
          selectedMethod={paymentMethod}
          onMethodSelect={setPaymentMethod}
        />
        
        {paymentMethod === 'cash' && (
          <div className="mt-4 space-y-2">
            <label htmlFor="cash-amount" className="font-semibold">
              Montant reçu
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                id="cash-amount"
                type="number"
                className="pl-10"
                placeholder={`Minimum ${getCartTotal().toFixed(2)} MAD`}
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button 
            className="bg-pos-success hover:bg-green-700"
            onClick={handleComplete}
            disabled={paymentMethod === 'cash' && (parseFloat(cashAmount) < getCartTotal() || isNaN(parseFloat(cashAmount)))}
          >
            Valider le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
