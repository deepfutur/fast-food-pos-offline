
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parse, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Plus, Trash2, FileSpreadsheet, LineChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';

// Types pour les transactions financières
interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  paymentMethod: string;
  comment?: string;
}

// Données fictives pour démonstration
const initialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    date: '2025-05-01',
    description: 'Vente du jour',
    category: 'recette',
    amount: 3500,
    type: 'credit',
    paymentMethod: 'espèces',
    comment: 'Bonne journée'
  },
  {
    id: '2',
    date: '2025-05-01',
    description: 'Achat fromage',
    category: 'achat',
    amount: 850,
    type: 'debit',
    paymentMethod: 'carte',
    comment: 'Fournisseur Fromages Délices'
  },
  {
    id: '3',
    date: '2025-05-02',
    description: 'Vente du jour',
    category: 'recette',
    amount: 2800,
    type: 'credit',
    paymentMethod: 'espèces',
  },
  {
    id: '4',
    date: '2025-05-02',
    description: 'Facture électricité',
    category: 'charge',
    amount: 450,
    type: 'debit',
    paymentMethod: 'virement',
    comment: 'Référence: FACT-2025-452'
  },
  {
    id: '5',
    date: '2025-05-03',
    description: 'Salaire serveur',
    category: 'salaire',
    amount: 1200,
    type: 'debit',
    paymentMethod: 'virement',
  },
  {
    id: '6',
    date: '2025-05-05',
    description: 'Vente du jour',
    category: 'recette',
    amount: 4200,
    type: 'credit',
    paymentMethod: 'carte',
  },
];

// Catégories prédéfinies
const transactionCategories = [
  'recette', 
  'achat', 
  'charge', 
  'salaire', 
  'livraison', 
  'loyer', 
  'impôt', 
  'autre'
];

// Méthodes de paiement
const paymentMethods = [
  'espèces',
  'carte',
  'virement',
  'chèque',
  'autre'
];

const FinancialReport: React.FC = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>(transactions);
  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'debit',
    amount: 0,
    category: 'achat',
    paymentMethod: 'espèces',
  });
  
  // États pour les filtres
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("daily");
  const [isChartView, setIsChartView] = useState(false);

  // Calcul du solde
  const balance = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      return transaction.type === 'credit' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
  }, [filteredTransactions]);

  // Générer les données pour le graphique
  const chartData = useMemo(() => {
    // Grouper par date pour une vue quotidienne
    if (filterPeriod === 'daily') {
      const dateGroups: {[key: string]: {date: string, credit: number, debit: number}} = {};
      
      filteredTransactions.forEach(transaction => {
        if (!dateGroups[transaction.date]) {
          dateGroups[transaction.date] = {
            date: format(parseISO(transaction.date), 'dd/MM'),
            credit: 0,
            debit: 0
          };
        }
        
        if (transaction.type === 'credit') {
          dateGroups[transaction.date].credit += transaction.amount;
        } else {
          dateGroups[transaction.date].debit += transaction.amount;
        }
      });
      
      return Object.values(dateGroups).sort((a, b) => 
        a.date.localeCompare(b.date)
      );
    } 
    // Grouper par mois
    else if (filterPeriod === 'monthly') {
      const monthGroups: {[key: string]: {date: string, credit: number, debit: number}} = {};
      
      filteredTransactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7); // YYYY-MM
        
        if (!monthGroups[month]) {
          monthGroups[month] = {
            date: format(parseISO(month + '-01'), 'MMM yyyy', { locale: fr }),
            credit: 0,
            debit: 0
          };
        }
        
        if (transaction.type === 'credit') {
          monthGroups[month].credit += transaction.amount;
        } else {
          monthGroups[month].debit += transaction.amount;
        }
      });
      
      return Object.values(monthGroups).sort((a, b) => 
        a.date.localeCompare(b.date)
      );
    }
    
    return [];
  }, [filteredTransactions, filterPeriod]);

  // Générer une liste des catégories uniques
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    transactions.forEach(transaction => categories.add(transaction.category));
    return Array.from(categories);
  }, [transactions]);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...transactions];
    
    // Filtre par type (débit/crédit/tous)
    if (filterType !== "all") {
      result = result.filter(t => t.type === filterType);
    }
    
    // Filtre par catégorie
    if (filterCategory !== "all") {
      result = result.filter(t => t.category === filterCategory);
    }
    
    // Filtre par période (si une date est sélectionnée)
    if (selectedDate) {
      if (filterPeriod === 'daily') {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        result = result.filter(t => t.date === dateStr);
      } else if (filterPeriod === 'monthly') {
        const startDate = startOfMonth(selectedDate);
        const endDate = endOfMonth(selectedDate);
        const startDateStr = format(startDate, 'yyyy-MM-dd');
        const endDateStr = format(endDate, 'yyyy-MM-dd');
        
        result = result.filter(t => 
          t.date >= startDateStr && t.date <= endDateStr
        );
      }
    }
    
    setFilteredTransactions(result);
  }, [transactions, filterType, filterCategory, selectedDate, filterPeriod]);

  // Gérer l'ajout d'une nouvelle transaction
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.date) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const transaction: FinancialTransaction = {
      id: Date.now().toString(),
      date: newTransaction.date as string,
      description: newTransaction.description as string,
      category: newTransaction.category as string,
      amount: newTransaction.amount as number,
      type: newTransaction.type as 'debit' | 'credit',
      paymentMethod: newTransaction.paymentMethod as string,
      comment: newTransaction.comment,
    };

    setTransactions(prev => [...prev, transaction]);
    
    // Réinitialiser le formulaire
    setNewTransaction({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'debit',
      amount: 0,
      category: 'achat',
      paymentMethod: 'espèces',
    });
  };

  // Supprimer une transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Exporter en CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Libellé', 'Catégorie', 'Montant', 'Type', 'Mode de paiement', 'Commentaire'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        `"${t.description}"`, // Entre guillemets pour gérer les virgules dans le texte
        t.category,
        t.amount.toString(),
        t.type,
        t.paymentMethod,
        t.comment ? `"${t.comment}"` : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bilan_financier_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Bilan Comptable</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsChartView(!isChartView)}>
            {isChartView ? "Voir Tableau" : "Voir Graphique"}
            <LineChart className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={exportToCSV}>
            Exporter CSV
            <FileSpreadsheet className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Période</label>
              <Select 
                value={filterPeriod} 
                onValueChange={setFilterPeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Jour</SelectItem>
                  <SelectItem value="monthly">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select 
                value={filterType} 
                onValueChange={setFilterType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="debit">Débit</SelectItem>
                  <SelectItem value="credit">Crédit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catégorie</label>
              <Select 
                value={filterCategory} 
                onValueChange={setFilterCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solde actuel */}
      <Card className={balance >= 0 ? "bg-green-50" : "bg-red-50"}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Solde actuel</h3>
              <p className="text-sm text-muted-foreground">
                Basé sur {filteredTransactions.length} transactions
              </p>
            </div>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString()} DH
            </div>
          </div>
        </CardContent>
      </Card>

      {isChartView ? (
        /* Vue graphique */
        <Card>
          <CardHeader>
            <CardTitle>Évolution financière</CardTitle>
            <CardDescription>
              {filterPeriod === 'daily' ? 'Vue quotidienne' : 'Vue mensuelle'} des recettes et dépenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  credit: { label: "Crédit", theme: { light: "#22c55e", dark: "#22c55e" } },
                  debit: { label: "Débit", theme: { light: "#ef4444", dark: "#ef4444" } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area type="monotone" dataKey="credit" stroke="#22c55e" fillOpacity={1} fill="url(#colorCredit)" name="crédit" />
                    <Area type="monotone" dataKey="debit" stroke="#ef4444" fillOpacity={1} fill="url(#colorDebit)" name="débit" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Vue tableau */
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode de paiement</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(parseISO(transaction.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.amount.toLocaleString()} DH
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'credit' ? 'Crédit' : 'Débit'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>{transaction.comment || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'ajout d'une transaction */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date*</label>
              <Input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Libellé / Description*</label>
              <Input
                value={newTransaction.description || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Ex: Achat fournitures"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type*</label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as 'debit' | 'credit' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Débit</SelectItem>
                  <SelectItem value="credit">Crédit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catégorie*</label>
              <Select
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Montant (DH)*</label>
              <Input
                type="number"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mode de paiement*</label>
              <Select
                value={newTransaction.paymentMethod}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Commentaire / Référence</label>
              <Input
                value={newTransaction.comment || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, comment: e.target.value })}
                placeholder="Optionnel"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">* Champs obligatoires</p>
          <Button onClick={handleAddTransaction}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FinancialReport;
