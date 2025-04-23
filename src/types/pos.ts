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
    name: string;
    price: number;
  }[];
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

export interface POSState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  users: User[];
  selectedCategory: string | null;
  currentUser: User | null;
  tax: number;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    taxId: string;
    logo?: string;
  };
  currency: 'EUR' | 'XAF' | 'USD' | 'MAD';
}
