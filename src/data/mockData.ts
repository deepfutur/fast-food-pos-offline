export const products = [
  {
    id: 'burger-cheese',
    name: 'Burger Cheese',
    price: 8.99,
    category: 'burgers',
    image: '/images/cheese-burger.png',
    description: 'Délicieux burger avec fromage fondant.',
  },
  {
    id: 'burger-chicken',
    name: 'Burger Chicken',
    price: 7.99,
    category: 'burgers',
    image: '/images/chicken-burger.png',
    description: 'Savoureux burger au poulet croustillant.',
  },
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita',
    price: 12.50,
    category: 'pizzas',
    image: '/images/margherita-pizza.png',
    description: 'Classique pizza margherita avec sauce tomate, mozzarella et basilic frais.',
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pizza Pepperoni',
    price: 13.50,
    category: 'pizzas',
    image: '/images/pepperoni-pizza.png',
    description: 'Pizza pepperoni avec sauce tomate, mozzarella et pepperoni épicé.',
  },
  {
    id: 'fries-classic',
    name: 'Fries Classic',
    price: 3.50,
    category: 'sides',
    image: '/images/classic-fries.png',
    description: 'Frites classiques, croustillantes et salées.',
  },
  {
    id: 'salad-caesar',
    name: 'Salad Caesar',
    price: 6.50,
    category: 'salads',
    image: '/images/caesar-salad.png',
    description: 'Salade César avec laitue romaine, croûtons, parmesan et sauce César.',
  },
  {
    id: 'coke-cola',
    name: 'Coca-Cola',
    price: 2.50,
    category: 'drinks',
    image: '/images/coca-cola.png',
    description: 'Boisson rafraîchissante Coca-Cola.',
  },
  {
    id: 'water-mineral',
    name: 'Water Mineral',
    price: 1.50,
    category: 'drinks',
    image: '/images/mineral-water.png',
    description: 'Eau minérale naturelle.',
  },
  {
    id: 'ice-cream-vanilla',
    name: 'Ice Cream Vanilla',
    price: 4.50,
    category: 'desserts',
    image: '/images/vanilla-ice-cream.png',
    description: 'Crème glacée à la vanille onctueuse.',
  },
  {
    id: 'cake-chocolate',
    name: 'Cake Chocolate',
    price: 5.50,
    category: 'desserts',
    image: '/images/chocolate-cake.png',
    description: 'Gâteau au chocolat riche et décadent.',
  },
];

export const categories = [
  { id: 'cat-1', name: 'burgers' },
  { id: 'cat-2', name: 'pizzas' },
  { id: 'cat-3', name: 'sides' },
  { id: 'cat-4', name: 'salads' },
  { id: 'cat-5', name: 'drinks' },
  { id: 'cat-6', name: 'desserts' },
];

export const users = [
  {
    id: 'user-1',
    name: 'Admin User',
    role: 'admin',
    pin: '1234',
  },
  {
    id: 'user-2',
    name: 'Cashier One',
    role: 'cashier',
    pin: '5678',
  },
];

export const tax = 0; // Changed from 0.2 (20%) to 0 (0%)

export const currency = 'MAD';

export const businessInfo = {
  name: 'My Restaurant',
  address: '123 Main Street, Cityville',
  phone: '555-123-4567',
  taxId: '123456789',
  website: 'www.myrestaurant.com',
};

export const ingredients = [
  {
    id: 'ing-1',
    name: 'Pain burger',
    unit: 'pièce',
    stock: 100,
    minStock: 20,
    unitPrice: 2.5,
    category: 'boulangerie'
  },
  {
    id: 'ing-2',
    name: 'Steak de bœuf',
    unit: 'pièce',
    stock: 50,
    minStock: 10,
    unitPrice: 15,
    category: 'viande'
  },
  {
    id: 'ing-3',
    name: 'Fromage cheddar',
    unit: 'tranche',
    stock: 80,
    minStock: 15,
    unitPrice: 1,
    category: 'produit laitier'
  },
  {
    id: 'ing-4',
    name: 'Sauce burger',
    unit: 'portion',
    stock: 120,
    minStock: 20,
    unitPrice: 0.5,
    category: 'condiment'
  },
  {
    id: 'ing-5',
    name: 'Tomate',
    unit: 'pièce',
    stock: 60,
    minStock: 12,
    unitPrice: 2,
    category: 'légume'
  },
  {
    id: 'ing-6',
    name: 'Laitue',
    unit: 'portion',
    stock: 40,
    minStock: 10,
    unitPrice: 1,
    category: 'légume'
  }
];

export const recipes = [
  {
    productId: 'burger-cheese',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 1 },
      { ingredientId: 'ing-2', quantity: 1 },
      { ingredientId: 'ing-3', quantity: 2 },
      { ingredientId: 'ing-4', quantity: 1 },
      { ingredientId: 'ing-5', quantity: 0.25 },
      { ingredientId: 'ing-6', quantity: 0.5 }
    ]
  },
  {
    productId: 'burger-chicken',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 1 },
      { ingredientId: 'ing-3', quantity: 1 },
      { ingredientId: 'ing-4', quantity: 1 },
      { ingredientId: 'ing-5', quantity: 0.25 },
      { ingredientId: 'ing-6', quantity: 0.5 }
    ]
  }
];
