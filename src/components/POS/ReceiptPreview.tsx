
import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CartItem } from '../../types/pos';
import { Printer, Download } from 'lucide-react';

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
    // Create a printable version of the receipt with correct styling
    const printContent = document.createElement('div');
    
    // Copy the receipt content
    const receiptContent = document.querySelector('.receipt-content');
    if (receiptContent) {
      printContent.innerHTML = receiptContent.innerHTML;
      
      // Apply print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        body { font-family: monospace; }
        .print-container { width: 80mm; margin: 0 auto; }
        img { max-width: 100%; height: auto; }
        table { width: 100%; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .border-t, .border-b { border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin: 8px 0; padding: 8px 0; }
        @media print {
          body { width: 80mm; }
          .no-print { display: none; }
        }
      `;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Reçu - ${businessInfo.name}</title>
              ${style.outerHTML}
            </head>
            <body>
              <div class="print-container">
                ${printContent.innerHTML}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = () => {
    // Create a downloadable HTML version of the receipt
    const receiptContent = document.querySelector('.receipt-content');
    if (receiptContent) {
      // Create full HTML document for download
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Reçu - ${businessInfo.name}</title>
            <meta charset="UTF-8">
            <style>
              body { font-family: monospace; }
              .container { width: 80mm; margin: 0 auto; }
              img { max-width: 100%; height: auto; }
              table { width: 100%; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .border-t, .border-b { border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin: 8px 0; padding: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              ${receiptContent.innerHTML}
            </div>
          </body>
        </html>
      `;
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu-${businessInfo.name}-${date.replace(/\//g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aperçu du Ticket</DialogTitle>
        </DialogHeader>
        
        <div className="receipt-content bg-white p-6 font-mono text-sm border mx-auto w-80">
          <div className="text-center mb-4">
            <div className="mx-auto w-32 h-32 mb-2">
              <img 
                src="/lovable-uploads/bd9aae2b-67cd-4156-be07-dae9877a6d5a.png" 
                alt="Deli in the Box" 
                className="w-full h-full object-contain"
              />
            </div>
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
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button 
            onClick={handleDownload} 
            variant="outline"
            className="bg-pos-primary text-white hover:bg-red-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-pos-primary hover:bg-red-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptPreview;
