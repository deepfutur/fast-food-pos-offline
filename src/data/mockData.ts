
import { Category, Product, User, POSState } from '../types/pos';

export const categories: Category[] = [
  { id: 'sandwiches', name: 'Sandwichs' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'menus', name: 'Menus' },
  { id: 'drinks', name: 'Boissons' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'sides', name: 'Accompagnements' }
];

export const products: Product[] = [
  {
    id: 'burger-1',
    name: 'Classic Burger',
    price: 6.50,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Steak haché, salade, tomate, oignon, sauce maison'
  },
  {
    id: 'burger-2',
    name: 'Cheese Burger',
    price: 7.50,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Steak haché, fromage, salade, tomate, oignon, sauce maison'
  },
  {
    id: 'menu-1',
    name: 'Menu Classic Burger',
    price: 10.50,
    category: 'menus',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Classic Burger + Frites + Boisson'
  },
  {
    id: 'menu-2',
    name: 'Menu Cheese Burger',
    price: 11.50,
    category: 'menus',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587144e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Cheese Burger + Frites + Boisson'
  },
  {
    id: 'sandwich-1',
    name: 'Sandwich Poulet',
    price: 5.50,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pain, poulet, salade, tomate, sauce maison'
  },
  {
    id: 'drink-1',
    name: 'Coca-Cola',
    price: 2.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Coca-Cola 33cl'
  },
  {
    id: 'drink-2',
    name: 'Eau minérale',
    price: 1.50,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Eau minérale 50cl'
  },
  {
    id: 'dessert-1',
    name: 'Brownie',
    price: 3.50,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Brownie au chocolat'
  },
  {
    id: 'dessert-2',
    name: 'Tiramisu',
    price: 4.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Tiramisu maison'
  },
  {
    id: 'side-1',
    name: 'Frites',
    price: 3.00,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Portion de frites'
  }
];

export const users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin',
    pin: '1234',
    role: 'admin'
  },
  {
    id: 'cashier-1',
    name: 'Caissier',
    pin: '5678',
    role: 'cashier'
  }
];

export const initialState: POSState = {
  products,
  categories,
  cart: [],
  orders: [],
  users,
  selectedCategory: null,
  currentUser: null,
  tax: 0.20, // 20% VAT
  businessInfo: {
    name: 'Fast Food Express',
    address: '123 Rue de la Restauration, 75000 Paris',
    phone: '01 23 45 67 89',
    taxId: 'FR12345678900',
  }
};
