import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CreditCard, DollarSign, Receipt } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { toast } from '@/components/ui/sonner';

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
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between text-lg">
            <span>Sous-total:</span>
            <span>{getCartSubtotal().toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>TVA ({(state.tax * 100).toFixed(0)}%):</span>
            <span>{getCartTax().toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{getCartTotal().toFixed(2)} MAD</span>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="font-semibold mb-2">Mode de paiement</div>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className={paymentMethod === 'cash' ? 'bg-pos-success text-white' : ''}
                onClick={() => setPaymentMethod('cash')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Espèces
              </Button>
              <Button 
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className={paymentMethod === 'card' ? 'bg-pos-info text-white' : ''}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Carte
              </Button>
              <Button 
                variant={paymentMethod === 'voucher' ? 'default' : 'outline'}
                className={paymentMethod === 'voucher' ? 'bg-pos-accent text-white' : ''}
                onClick={() => setPaymentMethod('voucher')}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Bon
              </Button>
            </div>
          </div>
          
          {paymentMethod === 'cash' && parseFloat(cashAmount) > 0 && !isNaN(parseFloat(cashAmount)) && (
            <div className="flex justify-between text-lg">
              <span>Monnaie à rendre:</span>
              <span className="font-bold">
                {Math.max(0, parseFloat(cashAmount) - getCartTotal()).toFixed(2)} MAD
              </span>
            </div>
          )}
        </div>
        
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
