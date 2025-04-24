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
  },
  {
    id: 'salade-royale',
    name: 'Salade royale',
    price: 35.00,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Salade royale fraîche et délicieuse'
  },
  {
    id: 'salade-nicoise',
    name: 'Salade niçoise',
    price: 25.00,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1619889437448-e71529f15a1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Salade niçoise traditionnelle'
  },
  {
    id: 'salade-deli',
    name: 'Salade deli in the box',
    price: 40.00,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre salade spéciale maison'
  },
  {
    id: 'salade-fruits',
    name: 'Salade de fruits',
    price: 25.00,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Salade de fruits frais de saison'
  },
  {
    id: 'pasticcio-viande',
    name: 'Pasticcio viande hachée',
    price: 35.00,
    category: 'pasticcio',
    image: 'https://images.unsplash.com/photo-1560750133-c5d4ef4de911?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pasticcio à la viande hachée'
  },
  {
    id: 'pasticcio-poulet',
    name: 'Pasticcio poulet',
    price: 35.00,
    category: 'pasticcio',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pasticcio au poulet'
  },
  {
    id: 'pasticcio-deli',
    name: 'Pasticcio deli in the box',
    price: 40.00,
    category: 'pasticcio',
    image: 'https://images.unsplash.com/photo-1633436374961-09b92742047b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre pasticcio spécial maison'
  },
  {
    id: 'pasticcio-mer',
    name: 'Pasticcio fruits de mer',
    price: 40.00,
    category: 'pasticcio',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pasticcio aux fruits de mer'
  },
  {
    id: 'sandwich-thon',
    name: 'Sandwich thon',
    price: 15.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich au thon'
  },
  {
    id: 'sandwich-crispy',
    name: 'Sandwich crispy chicken',
    price: 30.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich au poulet croustillant'
  },
  {
    id: 'sandwich-viande',
    name: 'Sandwich viande hachée',
    price: 30.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1628191011227-522c7c3f0af9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich à la viande hachée'
  },
  {
    id: 'sandwich-mixte',
    name: 'Sandwich mixte',
    price: 35.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich mixte garni'
  },
  {
    id: 'sandwich-saucisse',
    name: 'Sandwich saucisse',
    price: 25.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich à la saucisse'
  },
  {
    id: 'sandwich-chamali',
    name: 'Sandwich chamali',
    price: 20.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sandwich chamali traditionnel'
  },
  {
    id: 'sandwich-deli',
    name: 'Sandwich deli in the box',
    price: 35.00,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre sandwich spécial maison'
  },
  {
    id: 'burger-cheese',
    name: 'Cheese burger',
    price: 25.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Burger au fromage'
  },
  {
    id: 'burger-chicken',
    name: 'Chicken burger',
    price: 27.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1615297319154-8fb9e6c0b6fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Burger au poulet'
  },
  {
    id: 'burger-king',
    name: 'King burger',
    price: 35.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Notre burger signature'
  },
  {
    id: 'burger-goku',
    name: 'Goku burger',
    price: 30.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Burger spécial Goku'
  },
  {
    id: 'pasta-bolognaise',
    name: 'Spaghetti bolognaise',
    price: 30.00,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Spaghetti à la sauce bolognaise'
  },
  {
    id: 'pasta-poulet',
    name: 'Spaghetti sauce blanche poulet aux champignons',
    price: 35.00,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Spaghetti sauce blanche, poulet et champignons'
  },
  {
    id: 'pasta-pesto',
    name: 'Spaghetti pesto',
    price: 35.00,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Spaghetti à la sauce pesto'
  },
  {
    id: 'pasta-mer',
    name: 'Spaghetti fruits de mer',
    price: 40.00,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Spaghetti aux fruits de mer'
  },
  {
    id: 'plat-brochettes',
    name: 'Plat brochettes de poulet',
    price: 40.00,
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Brochettes de poulet avec accompagnements'
  },
  {
    id: 'plat-emince',
    name: 'Plat émincé de poulet',
    price: 45.00,
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Émincé de poulet avec accompagnements'
  },
  {
    id: 'plat-viande',
    name: 'Plat viande hachée',
    price: 40.00,
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Plat de viande hachée avec accompagnements'
  },
  {
    id: 'plat-mixte',
    name: 'Plat mixte',
    price: 45.00,
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Assortiment de viandes avec accompagnements'
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
