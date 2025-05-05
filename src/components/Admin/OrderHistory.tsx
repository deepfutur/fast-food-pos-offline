
import React from 'react';
import { usePOS } from '@/context/POSContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { FileDown, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const OrderHistory: React.FC = () => {
  const { state, deleteOrder } = usePOS();
  
  const downloadHistory = () => {
    try {
      const orders = state.orders.map(order => {
        const cashier = state.users.find(user => user.id === order.cashierId)?.name || 'Inconnu';
        return {
          id: order.id,
          date: format(order.timestamp, 'dd/MM/yyyy HH:mm'),
          items: order.items.reduce((acc, item) => acc + item.quantity, 0),
          total: `${order.total.toFixed(2)} ${state.currency}`,
          payment: order.paymentMethod === 'cash' ? 'Espèces' : order.paymentMethod === 'card' ? 'Carte' : 'Bon',
          cashier
        };
      });

      const csvContent = [
        ['ID', 'Date', 'Articles', 'Total', 'Paiement', 'Caissier'],
        ...orders.map(o => [o.id, o.date, o.items, o.total, o.payment, o.cashier])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `historique_commandes_${format(new Date(), 'dd-MM-yyyy')}.csv`;
      link.click();
      toast.success('Historique téléchargé avec succès');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };
  
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      deleteOrder(orderId);
      toast.success('Commande supprimée avec succès');
    }
  };
  
  if (state.orders.length === 0) {
    return <p className="text-center py-8">Aucune commande trouvée.</p>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Historique des commandes</h3>
        <Button onClick={downloadHistory} variant="outline" className="gap-2">
          <FileDown className="h-5 w-5" />
          Télécharger
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Méthode de paiement</TableHead>
              <TableHead>Caissier</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.orders.map(order => {
              const cashier = state.users.find(user => user.id === order.cashierId)?.name || 'Inconnu';
              return (
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
                  <TableCell>{cashier}</TableCell>
                  <TableCell className="text-right">
                    {order.total.toFixed(2)} {state.currency}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderHistory;
