
import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CartItem } from '../../types/pos';
import { Printer, Download, FileImage } from 'lucide-react';
import html2canvas from 'html2canvas';

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
    const receiptContent = document.querySelector('.receipt-content');
    if (!receiptContent) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }
    
    // Get business logo URL
    const logoImg = receiptContent.querySelector('img');
    const logoSrc = logoImg ? logoImg.getAttribute('src') : '';
    
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu - ${businessInfo.name}</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: monospace; 
              margin: 0;
              padding: 0;
            }
            .print-container { 
              width: 80mm; 
              margin: 0 auto; 
              padding: 10px;
            }
            .logo-container {
              width: 100%;
              text-align: center;
              margin-bottom: 10px;
            }
            .logo-container img {
              max-width: 100px;
              height: auto;
            }
            table { 
              width: 100%;
              border-collapse: collapse; 
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .border-t { 
              border-top: 1px dashed #000; 
              margin-top: 8px; 
              padding-top: 8px; 
            }
            .border-b { 
              border-bottom: 1px dashed #000; 
              margin-bottom: 8px; 
              padding-bottom: 8px; 
            }
            .font-bold { font-weight: bold; }
            @media print {
              body { width: 80mm; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="text-center">
              <div class="logo-container">
                ${logoSrc ? `<img src="${logoSrc}" alt="${businessInfo.name}" />` : ''}
              </div>
              <div class="font-bold" style="font-size: 16px;">${businessInfo.name}</div>
              <div>${businessInfo.address}</div>
              <div>Tel: ${businessInfo.phone}</div>
              <div>TVA: ${businessInfo.taxId}</div>
              <div class="border-t"></div>
              <div>Ticket de Caisse</div>
              <div class="border-b"></div>
              <div style="text-align: left;">
                Date: ${date} ${time}
              </div>
            </div>
            
            <table class="w-full text-left" style="margin-top: 10px;">
              <thead>
                <tr>
                  <th style="width: 50%; text-align: left;">Article</th>
                  <th style="width: 16%; text-align: right;">Qté</th>
                  <th style="width: 16%; text-align: right;">Prix</th>
                  <th style="width: 16%; text-align: right;">Total</th>
                </tr>
                <tr>
                  <td colspan="4" class="border-b"></td>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                <tr>
                  <td style="text-align: left;">${item.name}</td>
                  <td style="text-align: right;">${item.quantity}</td>
                  <td style="text-align: right;">${item.price.toFixed(2)}</td>
                  <td style="text-align: right;">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
                `).join('')}
                <tr>
                  <td colspan="4" class="border-b"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="text-align: right; font-weight: 600;">Sous-total:</td>
                  <td colspan="2" style="text-align: right;">${order.subtotal.toFixed(2)} MAD</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: right; font-weight: 600;">TVA (${(state.tax * 100).toFixed(0)}%):</td>
                  <td colspan="2" style="text-align: right;">${order.tax.toFixed(2)} MAD</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: right; font-weight: 700;">TOTAL:</td>
                  <td colspan="2" style="text-align: right; font-weight: 700;">${order.total.toFixed(2)} MAD</td>
                </tr>
                
                ${order.paymentMethod === 'cash' && order.cashReceived && order.changeDue !== undefined ? `
                <tr>
                  <td colspan="2" style="text-align: right;">Montant reçu:</td>
                  <td colspan="2" style="text-align: right;">${order.cashReceived.toFixed(2)} MAD</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: right;">Monnaie rendue:</td>
                  <td colspan="2" style="text-align: right;">${order.changeDue.toFixed(2)} MAD</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="4" style="text-align: center; padding-top: 8px;">
                    Paiement par ${
                      order.paymentMethod === 'cash' ? 'Espèces' :
                      order.paymentMethod === 'card' ? 'Carte Bancaire' :
                      'Bon'
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
            
            <div style="text-align: center; margin-top: 20px;">
              <p>Merci de votre visite!</p>
              <p>À bientôt!</p>
            </div>
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
  };

  const handleDownload = async () => {
    const receiptContent = document.querySelector('.receipt-content');
    if (!receiptContent) return;
    
    try {
      // Set a white background for the canvas
      const originalBackground = receiptContent.style.background;
      receiptContent.style.background = 'white';
      
      // Convert the receipt to canvas
      const canvas = await html2canvas(receiptContent as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Better resolution
        logging: false,
        useCORS: true, // Allow images from other domains
        allowTaint: true
      });
      
      // Reset the background
      receiptContent.style.background = originalBackground;
      
      // Convert canvas to PNG data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `recu-${businessInfo.name}-${date.replace(/\//g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la génération du PNG:", error);
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
            <FileImage className="mr-2 h-4 w-4" />
            Télécharger PNG
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
