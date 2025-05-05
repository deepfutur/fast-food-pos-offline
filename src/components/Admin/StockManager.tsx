
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Box, Package, Plus, Trash2, FileEdit } from "lucide-react";
import { toast } from '@/components/ui/use-toast';

// Types pour notre gestionnaire de stock
interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  lastPurchaseDate: string;
  totalValue: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Farine',
    category: 'Ingrédients',
    quantity: 50,
    unitPrice: 20,
    supplier: 'Fournisseur A',
    lastPurchaseDate: '2025-04-15',
    totalValue: 1000
  },
  {
    id: '2',
    name: 'Fromage Mozzarella',
    category: 'Ingrédients',
    quantity: 30,
    unitPrice: 45,
    supplier: 'Fournisseur B',
    lastPurchaseDate: '2025-04-20',
    totalValue: 1350
  },
  {
    id: '3',
    name: 'Sauce Tomate',
    category: 'Sauces',
    quantity: 40,
    unitPrice: 15,
    supplier: 'Fournisseur C',
    lastPurchaseDate: '2025-04-22',
    totalValue: 600
  }
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Loyer du local',
    amount: 3500,
    date: '2025-05-01',
    category: 'Loyer'
  },
  {
    id: '2',
    description: 'Facture d\'électricité',
    amount: 850,
    date: '2025-04-28',
    category: 'Énergie'
  },
  {
    id: '3',
    description: 'Salaires personnel',
    amount: 8500,
    date: '2025-04-30',
    category: 'Personnel'
  }
];

const StockManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'expenses'>('inventory');
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  
  // État pour le formulaire d'ajout de stock
  const [newStockItem, setNewStockItem] = useState<Omit<StockItem, 'id' | 'totalValue'>>({
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
    lastPurchaseDate: new Date().toISOString().split('T')[0]
  });
  
  // État pour le formulaire d'ajout de dépense
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: ''
  });

  // Gestionnaire pour l'ajout d'un article au stock
  const handleAddStockItem = () => {
    const totalValue = newStockItem.quantity * newStockItem.unitPrice;
    
    const stockItem: StockItem = {
      id: `item-${Date.now()}`,
      ...newStockItem,
      totalValue
    };
    
    setStockItems([...stockItems, stockItem]);
    setNewStockItem({
      name: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      supplier: '',
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Article ajouté",
      description: `${stockItem.name} a été ajouté à votre inventaire.`
    });
  };
  
  // Gestionnaire pour l'ajout d'une dépense
  const handleAddExpense = () => {
    const expense: Expense = {
      id: `expense-${Date.now()}`,
      ...newExpense
    };
    
    setExpenses([...expenses, expense]);
    setNewExpense({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: ''
    });
    
    toast({
      title: "Dépense enregistrée",
      description: `La dépense ${expense.description} a été enregistrée.`
    });
  };

  // Calcul des statistiques de stock
  const totalInventoryValue = stockItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lowStockItems = stockItems.filter(item => item.quantity < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des stocks</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'inventory' ? "default" : "outline"}
            onClick={() => setActiveTab('inventory')}
            className="flex items-center"
          >
            <Box className="mr-2 h-4 w-4" />
            Inventaire
          </Button>
          <Button 
            variant={activeTab === 'expenses' ? "default" : "outline"}
            onClick={() => setActiveTab('expenses')}
            className="flex items-center"
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Dépenses
          </Button>
        </div>
      </div>

      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-600">Valeur totale du stock</h3>
          <p className="text-2xl font-bold">{totalInventoryValue.toFixed(2)} DH</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-600">Total des dépenses</h3>
          <p className="text-2xl font-bold">{totalExpenses.toFixed(2)} DH</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h3 className="text-sm font-medium text-amber-600">Articles en stock faible</h3>
          <p className="text-2xl font-bold">{lowStockItems}</p>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Inventaire</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un article
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel article</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'article</Label>
                      <Input 
                        id="name" 
                        value={newStockItem.name}
                        onChange={(e) => setNewStockItem({...newStockItem, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Input 
                        id="category" 
                        value={newStockItem.category}
                        onChange={(e) => setNewStockItem({...newStockItem, category: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input 
                        id="quantity" 
                        type="number"
                        value={newStockItem.quantity}
                        onChange={(e) => setNewStockItem({...newStockItem, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Prix unitaire (DH)</Label>
                      <Input 
                        id="unitPrice" 
                        type="number"
                        value={newStockItem.unitPrice}
                        onChange={(e) => setNewStockItem({...newStockItem, unitPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Fournisseur</Label>
                      <Input 
                        id="supplier" 
                        value={newStockItem.supplier}
                        onChange={(e) => setNewStockItem({...newStockItem, supplier: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastPurchaseDate">Date d'achat</Label>
                      <Input 
                        id="lastPurchaseDate" 
                        type="date"
                        value={newStockItem.lastPurchaseDate}
                        onChange={(e) => setNewStockItem({...newStockItem, lastPurchaseDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddStockItem}>Ajouter l'article</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableCaption>Liste des articles en inventaire</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Valeur totale</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Date d'achat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice.toFixed(2)} DH</TableCell>
                  <TableCell>{item.totalValue.toFixed(2)} DH</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.lastPurchaseDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Dépenses</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une dépense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle dépense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Montant (DH)</Label>
                      <Input 
                        id="amount" 
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Input 
                        id="category" 
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddExpense}>Ajouter la dépense</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableCaption>Liste des dépenses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount.toFixed(2)} DH</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StockManager;
