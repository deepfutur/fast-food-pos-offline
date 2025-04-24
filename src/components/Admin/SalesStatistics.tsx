
import React, { useMemo } from 'react';
import { usePOS } from '@/context/POSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesStatistics: React.FC = () => {
  const { state } = usePOS();
  
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; total: number }> = {};
    
    state.orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { 
            name: item.name, 
            quantity: 0,
            total: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].total += item.price * item.quantity;
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [state.orders]);
  
  const totalSales = useMemo(() => {
    return state.orders.reduce((total, order) => total + order.total, 0);
  }, [state.orders]);
  
  const totalOrders = state.orders.length;
  
  const chartData = topProducts.map(product => ({
    name: product.name,
    quantité: product.quantity
  }));
  
  if (state.orders.length === 0) {
    return <p className="text-center py-8">Aucune vente enregistrée pour le moment.</p>;
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales.toFixed(2)} {state.currency}</div>
            <p className="text-xs text-muted-foreground">
              Sur {totalOrders} commande{totalOrders > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nombre de Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00'} {state.currency}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Produits les Plus Vendus</CardTitle>
          <CardDescription>Top 5 des produits les plus vendus en quantité</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" scale="band" width={100} />
                <Tooltip />
                <Bar dataKey="quantité" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesStatistics;
