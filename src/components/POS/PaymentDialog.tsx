
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePOS } from '../../context/POSContext';
import { toast } from '@/components/ui/sonner';
import PaymentMethods from './PaymentMethods';
import OrderSummary from './OrderSummary';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (paymentMethod: 'cash' | 'card' | 'voucher', cashReceived?: number) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose, onComplete }) => {
  const { getCartSubtotal, getCartTotal, getCartTax, completeOrder, state } = usePOS();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'voucher'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  
  const handleComplete = () => {
    if (paymentMethod === 'cash') {
      const cashReceived = parseFloat(cashAmount);
      if (isNaN(cashReceived) || cashReceived < getCartTotal()) {
        toast.error("Montant insuffisant");
        return;
      }
      completeOrder(paymentMethod, cashReceived);
      onComplete(paymentMethod, cashReceived);
    } else {
      completeOrder(paymentMethod);
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
