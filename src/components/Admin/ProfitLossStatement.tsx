
import React, { useState, useMemo, useEffect } from 'react';
import { usePOS } from '@/context/POSContext';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  lastPurchaseDate: string;
  notes?: string;
}

// Example data for demonstration (in a real app, this would come from context or API)
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

const inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Fromage',
    category: 'ingrédient frais',
    quantity: 15,
    unit: 'kg',
    unitPrice: 60,
    supplier: 'Fromages Délices',
    lastPurchaseDate: '2025-05-01',
    notes: 'Conservation au frigo'
  },
  {
    id: '2',
    name: 'Sauces',
    category: 'ingrédient sec',
    quantity: 30,
    unit: 'bouteilles',
    unitPrice: 25,
    supplier: 'Épices & Co',
    lastPurchaseDate: '2025-04-28',
  },
  {
    id: '3',
    name: 'Pain burger',
    category: 'boulangerie',
    quantity: 100,
    unit: 'pièces',
    unitPrice: 3,
    supplier: 'Boulangerie Moderne',
    lastPurchaseDate: '2025-05-04',
  },
  {
    id: '4',
    name: 'Contenants',
    category: 'emballage',
    quantity: 200,
    unit: 'pièces',
    unitPrice: 2,
    supplier: 'Emballages Pro',
    lastPurchaseDate: '2025-04-15',
  },
];

interface ExpenseType {
  type: string;
  name: string;
  isVariable: boolean;
}

const expenseTypes: ExpenseType[] = [
  { type: 'ingredients', name: 'Ingrédients', isVariable: true },
  { type: 'packaging', name: 'Emballages', isVariable: true },
  { type: 'utilities', name: 'Charges (eau, électricité)', isVariable: false },
  { type: 'rent', name: 'Loyer', isVariable: false },
  { type: 'salary', name: 'Salaires', isVariable: false },
  { type: 'other', name: 'Autres', isVariable: true },
];

const ProfitLossStatement: React.FC = () => {
  const { state } = usePOS();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [periodType, setPeriodType] = useState<'monthly' | 'custom'>('monthly');
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryData);

  // Update date range based on selected period type
  useEffect(() => {
    if (periodType === 'monthly' && selectedMonth) {
      setStartDate(startOfMonth(selectedMonth));
      setEndDate(endOfMonth(selectedMonth));
    }
  }, [periodType, selectedMonth]);

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: startDate, end: endDate });
    });
  }, [transactions, startDate, endDate]);

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    const sales = filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = filteredTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const inventoryValue = inventory
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      
    const profit = sales - expenses;
    
    return { sales, expenses, inventoryValue, profit };
  }, [filteredTransactions, inventory]);

  // Group sales by date for chart
  const salesByDate = useMemo(() => {
    const salesData: Record<string, { date: string, sales: number, expenses: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const dateStr = format(parseISO(transaction.date), 'dd/MM');
      
      if (!salesData[dateStr]) {
        salesData[dateStr] = {
          date: dateStr,
          sales: 0,
          expenses: 0
        };
      }
      
      if (transaction.type === 'credit') {
        salesData[dateStr].sales += transaction.amount;
      } else {
        salesData[dateStr].expenses += transaction.amount;
      }
    });
    
    return Object.values(salesData);
  }, [filteredTransactions]);

  // Group expenses by category for chart
  const expensesByCategory = useMemo(() => {
    const categorized: Record<string, number> = {};
    
    filteredTransactions
      .filter(t => t.type === 'debit')
      .forEach(transaction => {
        if (!categorized[transaction.category]) {
          categorized[transaction.category] = 0;
        }
        categorized[transaction.category] += transaction.amount;
      });
    
    return Object.entries(categorized).map(([name, amount]) => ({
      name,
      value: amount
    }));
  }, [filteredTransactions]);

  // For export
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Catégorie', 'Montant (DH)', 'Type', 'Mode de paiement'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.category,
        t.amount.toString(),
        t.type,
        t.paymentMethod
      ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_financier_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">État des profits et pertes</h2>
        <Button onClick={exportToCSV} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Exporter en CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Période d'analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="mb-2 font-medium">Type de période</div>
              <Select 
                value={periodType}
                onValueChange={(value) => setPeriodType(value as 'monthly' | 'custom')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodType === 'monthly' ? (
              <div className="flex-1">
                <div className="mb-2 font-medium">Mois</div>
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={date => date && setSelectedMonth(date)}
                  className="rounded-md border"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="mb-2 font-medium">Du</div>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={date => date && setStartDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2 font-medium">Au</div>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={date => date && setEndDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.sales.toLocaleString()} DH</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.expenses.toLocaleString()} DH</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valeur du stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.inventoryValue.toLocaleString()} DH</div>
          </CardContent>
        </Card>
        
        <Card className={financialMetrics.profit >= 0 ? "bg-green-50" : "bg-red-50"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {financialMetrics.profit >= 0 ? "Bénéfice" : "Perte"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center ${
              financialMetrics.profit >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {financialMetrics.profit.toLocaleString()} DH
              {financialMetrics.profit >= 0 ? 
                <TrendingUp className="ml-2 h-5 w-5" /> : 
                <TrendingDown className="ml-2 h-5 w-5" />
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus et dépenses par jour</CardTitle>
            <CardDescription>
              Période: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: { label: "Revenus", theme: { light: "#22c55e", dark: "#22c55e" } },
                  expenses: { label: "Dépenses", theme: { light: "#ef4444", dark: "#ef4444" } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="sales" fill="#22c55e" name="Revenus" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {expensesByCategory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Montant (DH)</TableHead>
                      <TableHead>Pourcentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesByCategory.map((category, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.value.toLocaleString()}</TableCell>
                        <TableCell>
                          {(category.value / financialMetrics.expenses * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucune dépense pour cette période</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventes récentes</CardTitle>
              <CardDescription>Entrées de revenus pour la période sélectionnée</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions
                  .filter(t => t.type === 'credit')
                  .slice(0, 5)
                  .map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="font-medium">{transaction.amount.toLocaleString()} DH</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inventaire actuel</CardTitle>
              <CardDescription>Valeur totale: {financialMetrics.inventoryValue.toLocaleString()} DH</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Valeur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.slice(0, 5).map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>{(item.quantity * item.unitPrice).toLocaleString()} DH</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfitLossStatement;
