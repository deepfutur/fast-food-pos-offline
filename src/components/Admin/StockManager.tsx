
import React, { useState, useRef } from 'react';
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
import { Box, Package, Plus, Trash2, FileEdit, FileDown, Filter, Calendar, CalendarDays } from "lucide-react";
import { toast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Types pour notre gestionnaire de stock
interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
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

// Données initiales pour notre stock
const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Farine',
    category: 'Ingrédients secs',
    quantity: 50,
    unit: 'kg',
    unitPrice: 20,
    supplier: 'Fournisseur A',
    lastPurchaseDate: '2025-04-15',
    totalValue: 1000
  },
  {
    id: '2',
    name: 'Fromage Mozzarella',
    category: 'Ingrédients frais',
    quantity: 30,
    unit: 'kg',
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
    unit: 'L',
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

// Catégories prédéfinies pour les produits
const productCategories = [
  'Ingrédients frais',
  'Ingrédients secs',
  'Boissons',
  'Emballages',
  'Produits finis',
  'Sauces',
  'Autre'
];

// Catégories prédéfinies pour les dépenses
const expenseCategories = [
  'Loyer',
  'Énergie',
  'Personnel',
  'Maintenance',
  'Marketing',
  'Fournitures',
  'Autre'
];

const units = ['kg', 'g', 'L', 'ml', 'pièce(s)', 'sachet(s)', 'carton(s)'];

const StockManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'expenses'>('inventory');
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  
  // État pour les options de filtrage
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('');
  const [expenseDateFilter, setExpenseDateFilter] = useState<string>('');

  // Références pour l'exportation
  const tableRef = useRef<HTMLDivElement>(null);
  
  // État pour le formulaire d'ajout de stock
  const [newStockItem, setNewStockItem] = useState<Omit<StockItem, 'id' | 'totalValue'>>({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
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

  // État pour le mode édition d'un article
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // État pour le mode édition d'une dépense
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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
      unit: 'kg',
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

  // Gestionnaire pour la suppression d'un article du stock
  const handleDeleteStockItem = (id: string) => {
    setStockItems(stockItems.filter(item => item.id !== id));
    toast({
      title: "Article supprimé",
      description: "L'article a été supprimé de votre inventaire."
    });
  };

  // Gestionnaire pour la suppression d'une dépense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Dépense supprimée",
      description: "La dépense a été supprimée."
    });
  };

  // Gestionnaire pour l'édition d'un article
  const handleEditStockItem = (item: StockItem) => {
    setEditingItemId(item.id);
    setEditingItem({...item});
  };

  // Gestionnaire pour l'enregistrement des modifications d'un article
  const handleSaveStockItemEdit = () => {
    if (editingItem) {
      // Recalculer la valeur totale
      const totalValue = editingItem.quantity * editingItem.unitPrice;
      const updatedItem = {...editingItem, totalValue};
      
      setStockItems(stockItems.map(item => 
        item.id === editingItemId ? updatedItem : item
      ));
      
      setEditingItemId(null);
      setEditingItem(null);
      
      toast({
        title: "Article modifié",
        description: `${updatedItem.name} a été mis à jour.`
      });
    }
  };

  // Gestionnaire pour l'édition d'une dépense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditingExpense({...expense});
  };

  // Gestionnaire pour l'enregistrement des modifications d'une dépense
  const handleSaveExpenseEdit = () => {
    if (editingExpense) {
      setExpenses(expenses.map(expense => 
        expense.id === editingExpenseId ? editingExpense : expense
      ));
      
      setEditingExpenseId(null);
      setEditingExpense(null);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense ${editingExpense.description} a été mise à jour.`
      });
    }
  };

  // Fonction pour exporter les données au format CSV
  const exportToCSV = (type: 'inventory' | 'expenses') => {
    let csvContent = '';
    let filename = '';
    
    if (type === 'inventory') {
      // En-tête pour l'inventaire
      csvContent = 'Nom,Catégorie,Quantité,Unité,Prix unitaire (DH),Valeur totale (DH),Fournisseur,Date d\'achat\n';
      
      // Données d'inventaire
      filteredStockItems.forEach(item => {
        csvContent += `${item.name},${item.category},${item.quantity},${item.unit},${item.unitPrice},${item.totalValue},${item.supplier},${item.lastPurchaseDate}\n`;
      });
      
      filename = `inventaire_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // En-tête pour les dépenses
      csvContent = 'Description,Montant (DH),Catégorie,Date\n';
      
      // Données de dépenses
      filteredExpenses.forEach(expense => {
        csvContent += `${expense.description},${expense.amount},${expense.category},${expense.date}\n`;
      });
      
      filename = `depenses_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    // Création du lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: `Les données ont été exportées au format CSV (${filename}).`
    });
  };

  // Application des filtres pour les articles
  const filteredStockItems = stockItems.filter(item => {
    return (!categoryFilter || item.category === categoryFilter) &&
           (!supplierFilter || item.supplier === supplierFilter) &&
           (!dateFilter || item.lastPurchaseDate >= dateFilter);
  });

  // Application des filtres pour les dépenses
  const filteredExpenses = expenses.filter(expense => {
    return (!expenseCategoryFilter || expense.category === expenseCategoryFilter) &&
           (!expenseDateFilter || expense.date >= expenseDateFilter);
  });

  // Listes uniques pour les filtres
  const uniqueCategories = [...new Set(stockItems.map(item => item.category))];
  const uniqueSuppliers = [...new Set(stockItems.map(item => item.supplier))];
  const uniqueExpenseCategories = [...new Set(expenses.map(expense => expense.category))];

  // Calcul des statistiques
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
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xl font-semibold">Inventaire</h3>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Button 
                variant="outline" 
                onClick={() => exportToCSV('inventory')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exporter CSV
              </Button>
              
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
                        <Select 
                          value={newStockItem.category} 
                          onValueChange={(value) => setNewStockItem({...newStockItem, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
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
                        <Label htmlFor="unit">Unité</Label>
                        <Select 
                          value={newStockItem.unit} 
                          onValueChange={(value) => setNewStockItem({...newStockItem, unit: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
          </div>

          {/* Filtres pour l'inventaire */}
          <div className="flex flex-wrap gap-2 bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtres:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {uniqueSuppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="w-[180px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              {(categoryFilter || supplierFilter || dateFilter) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setCategoryFilter('');
                    setSupplierFilter('');
                    setDateFilter('');
                  }}
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>

          <div ref={tableRef} className="overflow-x-auto">
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockItems.map((item) => (
                  <TableRow key={item.id}>
                    {editingItemId === item.id ? (
                      // Mode édition
                      <>
                        <TableCell>
                          <Input 
                            value={editingItem?.name} 
                            onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} 
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={editingItem?.category} 
                            onValueChange={(value) => setEditingItem(prev => prev ? {...prev, category: value} : null)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {productCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            value={editingItem?.quantity} 
                            className="w-[70px]"
                            onChange={(e) => setEditingItem(prev => prev ? {
                              ...prev, 
                              quantity: parseInt(e.target.value) || 0
                            } : null)} 
                          />
                          <Select 
                            value={editingItem?.unit} 
                            onValueChange={(value) => setEditingItem(prev => prev ? {...prev, unit: value} : null)}
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={editingItem?.unitPrice} 
                            onChange={(e) => setEditingItem(prev => prev ? {
                              ...prev, 
                              unitPrice: parseFloat(e.target.value) || 0
                            } : null)} 
                          />
                        </TableCell>
                        <TableCell>
                          {editingItem ? (editingItem.quantity * editingItem.unitPrice).toFixed(2) : 0} DH
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={editingItem?.supplier} 
                            onChange={(e) => setEditingItem(prev => prev ? {...prev, supplier: e.target.value} : null)} 
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="date" 
                            value={editingItem?.lastPurchaseDate} 
                            onChange={(e) => setEditingItem(prev => prev ? {...prev, lastPurchaseDate: e.target.value} : null)} 
                          />
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={handleSaveStockItemEdit}>
                            Enregistrer
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingItemId(null);
                            setEditingItem(null);
                          }}>
                            Annuler
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      // Mode affichage
                      <>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>{item.unitPrice.toFixed(2)} DH</TableCell>
                        <TableCell>{item.totalValue.toFixed(2)} DH</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lastPurchaseDate}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditStockItem(item)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteStockItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                
                {filteredStockItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Aucun article trouvé. Ajoutez des articles ou modifiez vos filtres.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xl font-semibold">Dépenses</h3>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Button 
                variant="outline" 
                onClick={() => exportToCSV('expenses')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exporter CSV
              </Button>
              
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
                        <Select 
                          value={newExpense.category} 
                          onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
          </div>

          {/* Filtres pour les dépenses */}
          <div className="flex flex-wrap gap-2 bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtres:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={expenseCategoryFilter} onValueChange={setExpenseCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {uniqueExpenseCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  className="w-[180px]"
                  value={expenseDateFilter}
                  onChange={(e) => setExpenseDateFilter(e.target.value)}
                />
              </div>

              {(expenseCategoryFilter || expenseDateFilter) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setExpenseCategoryFilter('');
                    setExpenseDateFilter('');
                  }}
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>

          <Table>
            <TableCaption>Liste des dépenses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  {editingExpenseId === expense.id ? (
                    // Mode édition pour les dépenses
                    <>
                      <TableCell>
                        <Input 
                          value={editingExpense?.description} 
                          onChange={(e) => setEditingExpense(prev => prev ? {...prev, description: e.target.value} : null)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={editingExpense?.amount} 
                          onChange={(e) => setEditingExpense(prev => prev ? {
                            ...prev, 
                            amount: parseFloat(e.target.value) || 0
                          } : null)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={editingExpense?.category} 
                          onValueChange={(value) => setEditingExpense(prev => prev ? {...prev, category: value} : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="date" 
                          value={editingExpense?.date} 
                          onChange={(e) => setEditingExpense(prev => prev ? {...prev, date: e.target.value} : null)} 
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSaveExpenseEdit}>
                          Enregistrer
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingExpenseId(null);
                          setEditingExpense(null);
                        }}>
                          Annuler
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    // Mode affichage pour les dépenses
                    <>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.amount.toFixed(2)} DH</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditExpense(expense)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              
              {filteredExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Aucune dépense trouvée. Ajoutez des dépenses ou modifiez vos filtres.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StockManager;
