export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  options?: ProductOption[];
}

export interface ProductOption {
  id: string;
  name: string;
  choices: {
    id: string;
    choiceName: string;
    price: number;
  }[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock?: number;
  unitPrice: number;
  category: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
}

export interface Recipe {
  productId: string;
  ingredients: RecipeItem[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    optionId: string;
    choiceId: string;
    name: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'voucher';
  cashReceived?: number;
  changeDue?: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
  cashierId: string;
}

export interface User {
  id: string;
  name: string;
  pin: string;
  role: 'admin' | 'cashier';
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  taxId: string;
  logo?: string;
}

export interface POSState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  selectedCategory: string | null;
  currentUser: User | null;
  tax: number;
  businessInfo: BusinessInfo;
  currency: string;
  ingredients: Ingredient[];
  recipes: Recipe[];
}
