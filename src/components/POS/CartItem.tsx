
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/pos';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <li className="flex justify-between p-2 border-b">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{item.name}</span>
          <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} MAD</span>
        </div>
        <div className="flex items-center mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => onQuantityChange(item.id, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <span className="ml-2 text-sm text-gray-500">{item.price.toFixed(2)} MAD l'unité</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-500 hover:text-pos-danger"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </li>
  );
};

export default CartItem;
