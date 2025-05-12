
import { create } from 'zustand';

// Types pour les transactions financières
export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  paymentMethod: string;
  comment?: string;
}

// Types pour les articles d'inventaire
export interface InventoryItem {
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

// Données initiales pour les transactions
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

// Données initiales pour l'inventaire
const initialInventory: InventoryItem[] = [
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

// Création du store pour la gestion financière
interface FinancialState {
  transactions: FinancialTransaction[];
  inventory: InventoryItem[];
  
  // Actions
  addTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<FinancialTransaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Action pour synchroniser les ventes et l'inventaire
  recordSale: (productName: string, quantity: number, price: number, date?: string) => void;
  
  // Action pour synchroniser les achats d'inventaire
  recordPurchase: (productName: string, quantity: number, unitPrice: number, supplier?: string, date?: string) => void;
}

// Création du store Zustand
export const useFinancialStore = create<FinancialState>((set) => ({
  transactions: initialTransactions,
  inventory: initialInventory,
  
  // Actions pour les transactions
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, {
      ...transaction,
      id: `transaction-${Date.now()}`
    }]
  })),
  
  updateTransaction: (id, transaction) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...transaction } : t)
  })),
  
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
  
  // Actions pour l'inventaire
  addInventoryItem: (item) => set((state) => ({
    inventory: [...state.inventory, {
      ...item,
      id: `inventory-${Date.now()}`
    }]
  })),
  
  updateInventoryItem: (id, item) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...item } : i)
  })),
  
  deleteInventoryItem: (id) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== id)
  })),
  
  // Enregistrer une vente (modifie les transactions et l'inventaire)
  recordSale: (productName, quantity, price, date) => set((state) => {
    const today = date || new Date().toISOString().split('T')[0];
    const totalAmount = quantity * price;
    
    // Trouver l'article d'inventaire correspondant
    const inventoryItem = state.inventory.find(item => 
      item.name.toLowerCase() === productName.toLowerCase()
    );
    
    // Mettre à jour l'inventaire si l'article existe
    let updatedInventory = state.inventory;
    if (inventoryItem) {
      const newQuantity = Math.max(0, inventoryItem.quantity - quantity);
      updatedInventory = state.inventory.map(item => 
        item.id === inventoryItem.id 
          ? { ...item, quantity: newQuantity }
          : item
      );
    }
    
    // Créer la transaction de vente
    const newTransaction: FinancialTransaction = {
      id: `transaction-${Date.now()}`,
      date: today,
      description: `Vente de ${productName}`,
      category: 'recette',
      amount: totalAmount,
      type: 'credit',
      paymentMethod: 'espèces', // Valeur par défaut
    };
    
    return {
      transactions: [...state.transactions, newTransaction],
      inventory: updatedInventory
    };
  }),
  
  // Enregistrer un achat (modifie les transactions et l'inventaire)
  recordPurchase: (productName, quantity, unitPrice, supplier, date) => set((state) => {
    const today = date || new Date().toISOString().split('T')[0];
    const totalAmount = quantity * unitPrice;
    
    // Vérifier si l'article existe déjà dans l'inventaire
    const existingItem = state.inventory.find(item => 
      item.name.toLowerCase() === productName.toLowerCase()
    );
    
    let updatedInventory = [...state.inventory];
    
    if (existingItem) {
      // Mettre à jour l'article existant
      updatedInventory = state.inventory.map(item => 
        item.id === existingItem.id 
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              unitPrice: unitPrice, // Mettre à jour le prix unitaire
              lastPurchaseDate: today,
              supplier: supplier || item.supplier
            }
          : item
      );
    } else {
      // Ajouter un nouvel article
      updatedInventory.push({
        id: `inventory-${Date.now()}`,
        name: productName,
        category: 'ingrédient', // Catégorie par défaut
        quantity: quantity,
        unit: 'pièce', // Unité par défaut
        unitPrice: unitPrice,
        supplier: supplier || 'Non spécifié',
        lastPurchaseDate: today
      });
    }
    
    // Créer la transaction d'achat
    const newTransaction: FinancialTransaction = {
      id: `transaction-${Date.now()}`,
      date: today,
      description: `Achat de ${productName}`,
      category: 'achat',
      amount: totalAmount,
      type: 'debit',
      paymentMethod: 'carte', // Valeur par défaut
      comment: supplier ? `Fournisseur: ${supplier}` : undefined
    };
    
    return {
      transactions: [...state.transactions, newTransaction],
      inventory: updatedInventory
    };
  })
}));

// Fonction utilitaire pour calculer la valeur totale de l'inventaire
export const calculateInventoryValue = (inventory: InventoryItem[]) => {
  return inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};

// Fonction utilitaire pour calculer les métriques financières
export const calculateFinancialMetrics = (transactions: FinancialTransaction[], inventory: InventoryItem[]) => {
  const sales = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const inventoryValue = calculateInventoryValue(inventory);
    
  const profit = sales - expenses;
  
  return { sales, expenses, inventoryValue, profit };
};
