
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Receipt } from 'lucide-react';

interface PaymentMethodsProps {
  selectedMethod: 'cash' | 'card' | 'voucher';
  onMethodSelect: (method: 'cash' | 'card' | 'voucher') => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onMethodSelect }) => {
  return (
    <div className="space-y-2">
      <div className="font-semibold mb-2">Mode de paiement</div>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant={selectedMethod === 'cash' ? 'default' : 'outline'}
          className={selectedMethod === 'cash' ? 'bg-pos-success text-white' : ''}
          onClick={() => onMethodSelect('cash')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Espèces
        </Button>
        <Button 
          variant={selectedMethod === 'card' ? 'default' : 'outline'}
          className={selectedMethod === 'card' ? 'bg-pos-info text-white' : ''}
          onClick={() => onMethodSelect('card')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Carte
        </Button>
        <Button 
          variant={selectedMethod === 'voucher' ? 'default' : 'outline'}
          className={selectedMethod === 'voucher' ? 'bg-pos-accent text-white' : ''}
          onClick={() => onMethodSelect('voucher')}
        >
          <Receipt className="mr-2 h-4 w-4" />
          Bon
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethods;
