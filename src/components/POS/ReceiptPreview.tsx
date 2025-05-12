
import React, { useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from '@/components/ui/use-toast';

interface ReceiptPreviewProps {
  orderId: string;
  onClose: () => void;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ orderId, onClose }) => {
  const { state } = usePOS();
  const { orders, businessInfo, currency } = state;
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return <div>Commande non trouvée</div>;
  }
  
  const date = new Date(order.timestamp);
  const formattedDate = `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}`;
  
  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        // Apply print-specific styles
        const elements = receiptRef.current.querySelectorAll('*');
        elements.forEach(el => {
          (el as HTMLElement).style.color = 'black';
          (el as HTMLElement).style.backgroundColor = 'white';
        });
        
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2, // Higher quality
          backgroundColor: '#ffffff',
        });
        
        const image = canvas.toDataURL('image/png');
        
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = `reçu-${order.id}.png`;
        link.click();
        
        toast({
          title: "Téléchargement réussi",
          description: "Le reçu a été téléchargé avec succès",
        });
      } catch (error) {
        console.error('Error downloading receipt:', error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le reçu",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=600,height=600');
      if (printWindow) {
        const receiptHTML = receiptRef.current.innerHTML;
        
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Reçu ${order.id}</title>
            <style>
              body { font-family: monospace; color: black; background-color: white; }
              .receipt { padding: 20px; width: 300px; margin: 0 auto; }
              .text-center { text-align: center; }
              .mb-2 { margin-bottom: 8px; }
              .mb-4 { margin-bottom: 16px; }
              .text-xs { font-size: 12px; }
              .text-sm { font-size: 14px; }
              .font-bold { font-weight: bold; }
              .border-t { border-top: 1px dashed #ccc; padding-top: 8px; }
              .border-b { border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 4px 0; }
              img { max-width: 100px; margin: 0 auto; display: block; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${businessInfo.logo ? `<div class="text-center mb-4"><img src="${businessInfo.logo}" alt="${businessInfo.name}" /></div>` : ''}
              ${receiptHTML}
            </div>
            <script>
              window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        toast({
          title: "Erreur",
          description: "Les popups sont peut-être bloqués par votre navigateur",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg max-w-md mx-auto">
      <div className="flex justify-between mb-6">
        <Button variant="outline" onClick={handlePrint} className="flex items-center">
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
        <Button variant="outline" onClick={handleDownload} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>
      </div>
      
      <div 
        ref={receiptRef} 
        className="bg-white text-black p-4 font-mono text-sm border border-gray-300 rounded"
      >
        {businessInfo.logo && (
          <div className="text-center mb-4">
            <img src={businessInfo.logo} alt={businessInfo.name} className="max-h-16 mx-auto" />
          </div>
        )}
        
        <div className="text-center mb-4">
          <div className="font-bold text-lg">{businessInfo.name}</div>
          <div>{businessInfo.address}</div>
          <div>{businessInfo.phone}</div>
          {businessInfo.taxId && <div>TVA: {businessInfo.taxId}</div>}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Reçu #:</span>
            <span>{order.id.replace('order-', '')}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Caissier:</span>
            <span>{state.users.find(u => u.id === order.cashierId)?.name || 'Inconnu'}</span>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-300 py-2 mb-4">
          <table className="w-full text-xs">
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.quantity}x</td>
                  <td>{item.name}</td>
                  <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{order.subtotal.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA ({(state.tax * 100).toFixed(0)}%):</span>
            <span>{order.tax.toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{order.total.toFixed(2)} {currency}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Méthode:</span>
            <span>
              {order.paymentMethod === 'cash' ? 'Espèces' : 
                order.paymentMethod === 'card' ? 'Carte' : 'Bon'}
            </span>
          </div>
          {order.paymentMethod === 'cash' && order.cashReceived && (
            <>
              <div className="flex justify-between">
                <span>Montant reçu:</span>
                <span>{order.cashReceived.toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Monnaie:</span>
                <span>{(order.cashReceived - order.total).toFixed(2)} {currency}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="text-center text-xs">
          <div className="mb-2">Merci de votre visite!</div>
          {businessInfo.website && <div>{businessInfo.website}</div>}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Button onClick={onClose} variant="secondary">
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPreview;
