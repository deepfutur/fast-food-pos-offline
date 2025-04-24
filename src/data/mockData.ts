import { Category, Product, User, POSState } from '../types/pos';

export const categories: Category[] = [
  { id: 'sandwiches', name: 'Sandwichs' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'menus', name: 'Menus' },
  { id: 'drinks', name: 'Boissons' },
  { id: 'tacos', name: 'Tacos' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'salads', name: 'Salade' },
  { id: 'pasticcio', name: 'Pasticcio' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'dishes', name: 'Plats' }
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
    id: 'drink-orange',
    name: 'Jus d\'orange',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus d\'orange frais'
  },
  {
    id: 'drink-beetroot',
    name: 'Jus de betterave',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1594312180721-3b5217cfc65f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus de betterave frais'
  },
  {
    id: 'drink-apple',
    name: 'Jus de pommes',
    price: 15.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1620837953295-3328afb074f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus de pommes frais'
  },
  {
    id: 'drink-pineapple',
    name: 'Jus d\'ananas',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1587736661445-d96c39068824?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus d\'ananas frais'
  },
  {
    id: 'drink-strawberry',
    name: 'Jus de fraise',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1508254627334-d4fa3b3b8178?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus de fraise frais'
  },
  {
    id: 'drink-mango',
    name: 'Jus de mangue',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus de mangue frais'
  },
  {
    id: 'drink-royal',
    name: 'Jus royale',
    price: 25.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre mélange spécial de fruits'
  },
  {
    id: 'drink-banana',
    name: 'Jus de banane',
    price: 15.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1557409518-691ebcd96038?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Jus de banane frais'
  },
  {
    id: 'drink-lemon',
    name: 'Jus de citron',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1444952483853-7c36e902e722?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Citronnade fraîche'
  },
  {
    id: 'drink-zaazaa',
    name: 'Jus zaazaa',
    price: 25.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre spécialité Zaazaa'
  },
  {
    id: 'drink-soda',
    name: 'Soda',
    price: 6.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Soda au choix'
  },
  {
    id: 'drink-water',
    name: 'Bouteille d\'eau',
    price: 4.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Eau minérale'
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
  tax: 0,
  businessInfo: {
    name: 'Deli in the Box',
    address: 'settat, maroc',
    phone: '0695112794',
    taxId: '',
  },
  currency: 'MAD',
};
