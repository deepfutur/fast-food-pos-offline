
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  cashAmount?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, tax, total, taxRate, cashAmount }) => {
  const change = cashAmount && parseFloat(cashAmount) > 0 
    ? Math.max(0, parseFloat(cashAmount) - total) 
    : undefined;

  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between text-lg">
        <span>Sous-total:</span>
        <span>{subtotal.toFixed(2)} MAD</span>
      </div>
      <div className="flex justify-between text-lg">
        <span>TVA ({(taxRate * 100).toFixed(0)}%):</span>
        <span>{tax.toFixed(2)} MAD</span>
      </div>
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>{total.toFixed(2)} MAD</span>
      </div>
      
      <Separator className="my-4" />
      
      {cashAmount && parseFloat(cashAmount) > 0 && !isNaN(parseFloat(cashAmount)) && (
        <div className="flex justify-between text-lg">
          <span>Monnaie à rendre:</span>
          <span className="font-bold">
            {change?.toFixed(2)} MAD
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
