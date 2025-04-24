
import React from 'react';
import { usePOS } from '@/context/POSContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const OrderHistory: React.FC = () => {
  const { state } = usePOS();
  
  if (state.orders.length === 0) {
    return <p className="text-center py-8">Aucune commande trouvée.</p>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historique des commandes</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Méthode de paiement</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.slice(-6)}</TableCell>
                <TableCell>
                  {format(order.timestamp, 'dd MMM yyyy, HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)} articles
                </TableCell>
                <TableCell>
                  {order.paymentMethod === 'cash' && 'Espèces'}
                  {order.paymentMethod === 'card' && 'Carte'}
                  {order.paymentMethod === 'voucher' && 'Bon'}
                </TableCell>
                <TableCell className="text-right">
                  {order.total.toFixed(2)} {state.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderHistory;
