import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ShoppingBag, Users, Settings } from 'lucide-react';
import MenuEditor from '@/components/Admin/MenuEditor';
import Header from '@/components/Layout/Header';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4">
        <Tabs defaultValue="orders">
          <TabsList>
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
                Commandes en attente et historiques iront ici.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardContent className="p-6">
                Statistiques des ventes et rapports iront ici.
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

          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                Gestion des utilisateurs (ajouter, modifier, supprimer) ira ici.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                Paramètres de l'application (taxes, informations commerciales, etc.) iront ici.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
