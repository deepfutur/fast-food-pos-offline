import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, FileText, ShoppingBag, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AdminDashboard: React.FC = () => {
  const { state } = usePOS();
  const { orders } = state;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [currency, setCurrency] = useState('MAD');
  
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  const salesByProducts = orders.reduce((products, order) => {
    order.items.forEach(item => {
      if (!products[item.name]) {
        products[item.name] = { quantity: 0, total: 0 };
      }
      products[item.name].quantity += item.quantity;
      products[item.name].total += item.price * item.quantity;
    });
    return products;
  }, {} as Record<string, { quantity: number, total: number }>);
  
  const topProducts = Object.entries(salesByProducts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-pos-dark text-pos-light p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-pos-light hover:text-white hover:bg-pos-primary mr-2"
              onClick={() => navigate('/pos')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Administration</h1>
          </div>
          <div className="text-sm">
            <span className="opacity-75">Mode:</span>{' '}
            <span className="font-semibold">Admin</span>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto p-4 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-pos-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales.toFixed(2)} MAD</div>
              <p className="text-xs text-gray-500">Total des ventes enregistrées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <FileText className="h-4 w-4 text-pos-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-gray-500">Nombre total de commandes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-pos-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.users.length}</div>
              <p className="text-xs text-gray-500">Utilisateurs enregistrés</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="orders" className="h-full flex flex-col" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ventes
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="overflow-auto flex-1 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caissier</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              Aucune commande enregistrée
                            </td>
                          </tr>
                        ) : (
                          orders.map(order => {
                            const cashier = state.users.find(u => u.id === order.cashierId);
                            return (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {order.id.split('-')[1]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(order.timestamp)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                    order.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' : 
                                    order.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.paymentMethod === 'cash' ? 'Espèces' : 
                                     order.paymentMethod === 'card' ? 'Carte' : 'Bon'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                  {order.total.toFixed(2)} MAD
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {cashier?.name || 'Inconnu'}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sales" className="overflow-auto flex-1 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes par produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité vendue</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topProducts.map(product => (
                            <tr key={product.name} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {product.total.toFixed(2)} MAD
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="bg-pos-info hover:bg-blue-600">
                          Exporter les données (CSV)
                        </Button>
                        <Button className="bg-pos-accent hover:bg-yellow-600">
                          Rapport détaillé
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="overflow-auto flex-1 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Informations de l'établissement</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nom de l'établissement</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-md" 
                            defaultValue={state.businessInfo.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Téléphone</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-md"
                            defaultValue={state.businessInfo.phone}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Adresse</label>
                          <input 
                            type="text"
                            className="w-full p-2 border rounded-md"
                            defaultValue={state.businessInfo.address}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Paramètres de devise</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Devise</label>
                          <Select 
                            value={currency} 
                            onValueChange={(value: string) => setCurrency(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une devise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="XAF">Franc CFA (XAF)</SelectItem>
                              <SelectItem value="USD">Dollar US ($)</SelectItem>
                              <SelectItem value="MAD">Dirham Marocain (MAD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-pos-primary hover:bg-red-700">
                        Sauvegarder les changements
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
