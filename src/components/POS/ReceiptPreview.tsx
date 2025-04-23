import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CartItem, Order } from '../../types/pos';
import { Printer } from 'lucide-react';

interface ReceiptPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: 'cash' | 'card' | 'voucher';
    cashReceived?: number;
    changeDue?: number;
  };
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ isOpen, onClose, order }) => {
  const { state } = usePOS();
  const { businessInfo } = state;
  const date = new Date().toLocaleDateString('fr-FR');
  const time = new Date().toLocaleTimeString('fr-FR');
  
  const handlePrint = () => {
    console.log('Impression du ticket...');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Ticket</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-6 font-mono text-sm border mx-auto w-80">
          <div className="text-center mb-4">
            <div className="font-bold text-lg">{businessInfo.name}</div>
            <div>{businessInfo.address}</div>
            <div>Tel: {businessInfo.phone}</div>
            <div>TVA: {businessInfo.taxId}</div>
            <div className="border-t border-dashed my-2"></div>
            <div>Ticket de Caisse</div>
            <div className="border-b border-dashed my-2"></div>
            <div className="text-left">
              Date: {date} {time}
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="w-1/2">Article</th>
                <th className="w-1/6 text-right">Qté</th>
                <th className="w-1/6 text-right">Prix</th>
                <th className="w-1/6 text-right">Total</th>
              </tr>
              <tr>
                <td colSpan={4} className="border-b border-dashed py-1"></td>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="truncate pr-1">{item.name}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.price.toFixed(2)}</td>
                  <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="border-b border-dashed py-1"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right font-semibold">Sous-total:</td>
                <td colSpan={2} className="text-right">{order.subtotal.toFixed(2)} MAD</td>
              </tr>
              <tr>
                <td colSpan={2} className="text-right font-semibold">TVA ({(state.tax * 100).toFixed(0)}%):</td>
                <td colSpan={2} className="text-right">{order.tax.toFixed(2)} MAD</td>
              </tr>
              <tr>
                <td colSpan={2} className="text-right font-bold">TOTAL:</td>
                <td colSpan={2} className="text-right font-bold">{order.total.toFixed(2)} MAD</td>
              </tr>
              
              {order.paymentMethod === 'cash' && order.cashReceived && order.changeDue !== undefined && (
                <>
                  <tr>
                    <td colSpan={2} className="text-right">Montant reçu:</td>
                    <td colSpan={2} className="text-right">{order.cashReceived.toFixed(2)} MAD</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-right">Monnaie rendue:</td>
                    <td colSpan={2} className="text-right">{order.changeDue.toFixed(2)} MAD</td>
                  </tr>
                </>
              )}
              <tr>
                <td colSpan={4} className="text-center py-2">
                  Paiement par {
                    order.paymentMethod === 'cash' ? 'Espèces' :
                    order.paymentMethod === 'card' ? 'Carte Bancaire' :
                    'Bon'
                  }
                </td>
              </tr>
            </tfoot>
          </table>
          
          <div className="text-center mt-6">
            <p>Merci de votre visite!</p>
            <p>À bientôt!</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={handlePrint} className="bg-pos-primary hover:bg-red-700">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptPreview;
