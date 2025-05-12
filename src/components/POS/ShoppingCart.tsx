
import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';
import CartItem from './CartItem';
import PaymentDialog from './PaymentDialog';
import ReceiptPreview from './ReceiptPreview';

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
  
  const handlePaymentComplete = (paymentMethod: 'cash' | 'card' | 'voucher', cashReceived?: number) => {
    const orderDetails = {
      items: [...cart],
      subtotal: getCartSubtotal(),
      tax: getCartTax(),
      total: getCartTotal(),
      paymentMethod: paymentMethod,
      cashReceived: cashReceived,
      changeDue: cashReceived ? cashReceived - getCartTotal() : undefined
    };
    
    setCurrentOrder(orderDetails);
    setShowPayment(false);
    setShowReceipt(true);
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
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={removeFromCart}
              />
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-1">
          <span>Sous-total:</span>
          <span>{getCartSubtotal().toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>TVA ({(state.tax * 100).toFixed(0)}%):</span>
          <span>{getCartTax().toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>{getCartTotal().toFixed(2)} MAD</span>
        </div>
        
        <Button 
          className="w-full bg-pos-success hover:bg-green-700 py-6 text-lg"
          disabled={cart.length === 0}
          onClick={handleCompletePurchase}
        >
          Payer {getCartTotal().toFixed(2)} MAD
        </Button>
      </div>
      
      <PaymentDialog 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)}
        onComplete={handlePaymentComplete}
      />
      
      {currentOrder && (
        <ReceiptPreview 
          orderId={`preview-${Date.now()}`} 
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
