
import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Plus, Trash2, CreditCard, DollarSign, Receipt, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import ReceiptPreview from './ReceiptPreview';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose }) => {
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
    } else {
      completeOrder(paymentMethod);
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
            <span>{getCartSubtotal().toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>TVA ({(state.tax * 100).toFixed(0)}%):</span>
            <span>{getCartTax().toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{getCartTotal().toFixed(2)} €</span>
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
          
          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <div className="font-semibold">Montant reçu</div>
              <Input 
                type="number" 
                value={cashAmount} 
                onChange={(e) => setCashAmount(e.target.value)} 
                placeholder="Montant reçu"
                className="text-xl p-6"
              />
              {parseFloat(cashAmount) > 0 && !isNaN(parseFloat(cashAmount)) && (
                <div className="flex justify-between text-lg">
                  <span>Monnaie à rendre:</span>
                  <span className="font-bold">
                    {Math.max(0, parseFloat(cashAmount) - getCartTotal()).toFixed(2)} €
                  </span>
                </div>
              )}
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

const ShoppingCart: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart, getCartSubtotal, getCartTotal, getCartTax } = usePOS();
  const { cart } = state;
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  
  const handleQuantityChange = (id: string, change: number) => {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      updateQuantity(id, cartItem.quantity + change);
    }
  };
  
  const handleCompletePurchase = () => {
    // Préparer les données de prévisualisation avant finalisation
    const orderPreview = {
      items: [...cart],
      subtotal: getCartSubtotal(),
      tax: getCartTax(),
      total: getCartTotal(),
      paymentMethod: 'cash',
      cashReceived: 0,
      changeDue: 0
    };
    
    setCurrentOrder(orderPreview);
    setShowPayment(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Panier</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-pos-danger border-pos-danger hover:bg-pos-danger hover:text-white"
          onClick={clearCart}
          disabled={cart.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Vider
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText className="h-12 w-12 mb-2" />
            <p>Panier vide</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between p-2 border-b">
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="ml-2 text-sm text-gray-500">{item.price.toFixed(2)} € l'unité</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-pos-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-1">
          <span>Sous-total:</span>
          <span>{getCartSubtotal().toFixed(2)} €</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>TVA ({(state.tax * 100).toFixed(0)}%):</span>
          <span>{getCartTax().toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>{getCartTotal().toFixed(2)} €</span>
        </div>
        
        <Button 
          className="w-full bg-pos-success hover:bg-green-700 py-6 text-lg"
          disabled={cart.length === 0}
          onClick={handleCompletePurchase}
        >
          Payer {getCartTotal().toFixed(2)} €
        </Button>
      </div>
      
      <PaymentDialog 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
      />
      
      {currentOrder && (
        <ReceiptPreview 
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          order={currentOrder}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
