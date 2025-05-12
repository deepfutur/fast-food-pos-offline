
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ShoppingBag, Users, Settings, Package, BarChart2, CircleDollarSign, Utensils, Book } from 'lucide-react';
import MenuEditor from '@/components/Admin/MenuEditor';
import UpdatePinForm from '@/components/Admin/UpdatePinForm';
import OrderHistory from '@/components/Admin/OrderHistory';
import SalesStatistics from '@/components/Admin/SalesStatistics';
import AppSettings from '@/components/Admin/AppSettings';
import UserManager from '@/components/Admin/UserManager';
import StockManager from '@/components/Admin/StockManager';
import FinancialReport from '@/components/Admin/FinancialReport';
import ProfitLossStatement from '@/components/Admin/ProfitLossStatement';
import RecipeManager from '@/components/Admin/RecipeManager';
import Header from '@/components/Layout/Header';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4">
        <Tabs defaultValue="recipes">
          <TabsList className="mb-6 flex flex-wrap gap-2">
            <TabsTrigger value="orders">
              <FileText className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="sales">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ventes
            </TabsTrigger>
            <TabsTrigger value="menu">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="stock">
              <Package className="h-4 w-4 mr-2" />
              Stock
            </TabsTrigger>
            <TabsTrigger value="recipes">
              <Utensils className="h-4 w-4 mr-2" />
              Recettes
            </TabsTrigger>
            <TabsTrigger value="financial">
              <BarChart2 className="h-4 w-4 mr-2" />
              Bilan
            </TabsTrigger>
            <TabsTrigger value="profitloss">
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Profits et Pertes
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                <OrderHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardContent className="p-6">
                <SalesStatistics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardContent className="p-6">
                <MenuEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardContent className="p-6">
                <StockManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card>
              <CardContent className="p-6">
                <RecipeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardContent className="p-6">
                <FinancialReport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitloss">
            <Card>
              <CardContent className="p-6">
                <ProfitLossStatement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="p-6 space-y-6">
                <UserManager />
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Changer le code PIN</h3>
                  <UpdatePinForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <AppSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
