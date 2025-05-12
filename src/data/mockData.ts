
import { Category, Product, User, POSState, Ingredient, Recipe } from '../types/pos';

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
  // Pizza - with updated prices and better images
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita',
    price: 30.00,
    category: 'pizza',
    description: 'Sauce tomate, mozzarella',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  },
  {
    id: 'pizza-thon',
    name: 'Pizza Thon',
    price: 30.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, thon, oignon, mozzarella',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  },
  {
    id: 'pizza-poulet',
    name: 'Pizza Poulet',
    price: 40.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, poulet, mozzarella',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
  },
  {
    id: 'pizza-viande',
    name: 'Pizza Viande Hachée',
    price: 40.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, viande hachée, mozzarella',
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a',
  },
  {
    id: 'pizza-4-saisons',
    name: 'Pizza 4 Saisons',
    price: 40.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, viande hachée, thon, poulet, charcuterie, mozzarella',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',
  },
  {
    id: 'pizza-4-fromages',
    name: 'Pizza 4 Fromages',
    price: 40.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, edam cheese, mozzarella, gouda, parmesan',
    image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5',
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pizza Pepperoni',
    price: 40.00, // Updated price
    category: 'pizza',
    description: 'Sauce tomate, pepperoni, mozzarella',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee',
  },
  {
    id: 'pizza-fruits-mer',
    name: 'Pizza Fruits de Mer',
    price: 60.00,
    category: 'pizza',
    description: 'Sauce tomate, fruits de mer, mozzarella',
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5',
  },
  {
    id: 'pizza-deli',
    name: 'Pizza Deli in the Box',
    price: 60.00,
    category: 'pizza',
    description: 'Sauce tomate, pepperoni, viande hachée, mozzarella',
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de',
  },
  
  // Tacos - with better food images
  {
    id: 'tacos-poulet',
    name: 'Tacos Poulet',
    price: 35.00,
    category: 'tacos',
    description: 'Délicieux tacos au poulet',
    image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629',
  },
  {
    id: 'tacos-viande',
    name: 'Tacos Viande Hachée',
    price: 35.00,
    category: 'tacos',
    description: 'Tacos avec viande hachée savoureuse',
    image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b',
  },
  {
    id: 'tacos-mixte',
    name: 'Tacos Mixte',
    price: 35.00,
    category: 'tacos',
    description: 'Tacos mixte poulet et viande hachée',
    image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f',
  },
  {
    id: 'tacos-saucisse',
    name: 'Tacos Saucisse',
    price: 35.00,
    category: 'tacos',
    description: 'Tacos à la saucisse',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
  },
  {
    id: 'tacos-nuggets',
    name: 'Tacos Nuggets',
    price: 40.00,
    category: 'tacos',
    description: 'Tacos avec nuggets',
    image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934',
  },
  {
    id: 'tacos-cordon-bleu',
    name: 'Tacos Cordon Bleu',
    price: 40.00,
    category: 'tacos',
    description: 'Tacos avec cordon bleu',
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa6c',
  },
  {
    id: 'tacos-deli',
    name: 'Tacos Deli in the Box',
    price: 40.00,
    category: 'tacos',
    description: 'Tacos spécial Deli in the Box',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e0d4d',
  },
  
  // Drinks - with better images matching the fruit descriptions
  {
    id: 'drink-orange',
    name: 'Jus d\'orange',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    description: 'Jus d\'orange frais'
  },
  {
    id: 'drink-beetroot',
    name: 'Jus de betterave',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5',
    description: 'Jus de betterave frais'
  },
  {
    id: 'drink-apple',
    name: 'Jus de pommes',
    price: 15.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1602763288580-74b2483fe703',
    description: 'Jus de pommes frais'
  },
  {
    id: 'drink-pineapple',
    name: 'Jus d\'ananas',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1587736661445-d96c39068824',
    description: 'Jus d\'ananas frais'
  },
  {
    id: 'drink-strawberry',
    name: 'Jus de fraise',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1601493700625-9185417898cf',
    description: 'Jus de fraise frais'
  },
  {
    id: 'drink-mango',
    name: 'Jus de mangue',
    price: 20.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4',
    description: 'Jus de mangue frais'
  },
  {
    id: 'drink-royal',
    name: 'Jus royale',
    price: 25.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
    description: 'Notre mélange spécial de fruits'
  },
  {
    id: 'drink-banana',
    name: 'Jus de banane',
    price: 15.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd',
    description: 'Jus de banane frais'
  },
  {
    id: 'drink-lemon',
    name: 'Jus de citron',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1603833971780-4a152c652c41',
    description: 'Citronnade fraîche'
  },
  {
    id: 'drink-zaazaa',
    name: 'Jus zaazaa',
    price: 25.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1560508180-03f285f67ded',
    description: 'Notre spécialité Zaazaa'
  },
  {
    id: 'drink-soda',
    name: 'Soda',
    price: 6.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a',
    description: 'Soda au choix'
  },
  {
    id: 'drink-water',
    name: 'Bouteille d\'eau',
    price: 4.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1606168094336-48f955066ebd',
    description: 'Eau minérale'
  },

  // Salads
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

  // Pasticcio
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

  // Sandwiches
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

  // Burgers
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
    image: 'https://images.unsplash.com/photo-1614790141165-d5162806ecd8?auto=format&fit=crop&w=500&h=500&q=80',
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

  // Pasta
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

  // Dishes
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

// Initial ingredients
export const ingredients: Ingredient[] = [
  {
    id: 'ingredient-1',
    name: 'Pain à burger',
    unit: 'pièce',
    stock: 100,
    minStock: 20,
    unitPrice: 2.00,
    category: 'boulangerie'
  },
  {
    id: 'ingredient-2',
    name: 'Steak de bœuf',
    unit: 'pièce',
    stock: 80,
    minStock: 15,
    unitPrice: 8.00,
    category: 'viande'
  },
  {
    id: 'ingredient-3',
    name: 'Fromage Cheddar',
    unit: 'tranche',
    stock: 150,
    minStock: 30,
    unitPrice: 1.50,
    category: 'produit frais'
  },
  {
    id: 'ingredient-4',
    name: 'Tomate',
    unit: 'kg',
    stock: 25,
    minStock: 5,
    unitPrice: 12.00,
    category: 'légume'
  },
  {
    id: 'ingredient-5',
    name: 'Laitue',
    unit: 'kg',
    stock: 15,
    minStock: 3,
    unitPrice: 10.00,
    category: 'légume'
  },
  {
    id: 'ingredient-6',
    name: 'Sauce ketchup',
    unit: 'kg',
    stock: 10,
    minStock: 2,
    unitPrice: 20.00,
    category: 'sauce'
  },
  {
    id: 'ingredient-7',
    name: 'Sauce mayonnaise',
    unit: 'kg',
    stock: 10,
    minStock: 2,
    unitPrice: 22.00,
    category: 'sauce'
  },
  {
    id: 'ingredient-8',
    name: 'Farine à pizza',
    unit: 'kg',
    stock: 50,
    minStock: 10,
    unitPrice: 8.00,
    category: 'épicerie'
  },
  {
    id: 'ingredient-9',
    name: 'Sauce tomate',
    unit: 'kg',
    stock: 30,
    minStock: 5,
    unitPrice: 15.00,
    category: 'sauce'
  },
  {
    id: 'ingredient-10',
    name: 'Mozzarella',
    unit: 'kg',
    stock: 20,
    minStock: 4,
    unitPrice: 40.00,
    category: 'produit frais'
  },
  {
    id: 'ingredient-11',
    name: 'Thon',
    unit: 'kg',
    stock: 15,
    minStock: 3,
    unitPrice: 60.00,
    category: 'poisson'
  },
  {
    id: 'ingredient-12',
    name: 'Poulet',
    unit: 'kg',
    stock: 20,
    minStock: 4,
    unitPrice: 45.00,
    category: 'viande'
  },
  {
    id: 'ingredient-13',
    name: 'Viande hachée',
    unit: 'kg',
    stock: 25,
    minStock: 5,
    unitPrice: 50.00,
    category: 'viande'
  },
  {
    id: 'ingredient-14',
    name: 'Orange',
    unit: 'kg',
    stock: 30,
    minStock: 10,
    unitPrice: 12.00,
    category: 'fruit'
  },
  {
    id: 'ingredient-15',
    name: 'Spaghetti',
    unit: 'kg',
    stock: 40,
    minStock: 10,
    unitPrice: 15.00,
    category: 'pâtes'
  }
];

// Initial recipes
export const recipes: Recipe[] = [
  // Burger recipes
  {
    productId: 'burger-cheese',
    ingredients: [
      { ingredientId: 'ingredient-1', quantity: 1 },  // Pain à burger
      { ingredientId: 'ingredient-2', quantity: 1 },  // Steak de bœuf
      { ingredientId: 'ingredient-3', quantity: 2 },  // Fromage Cheddar
      { ingredientId: 'ingredient-4', quantity: 0.05 },  // Tomate
      { ingredientId: 'ingredient-5', quantity: 0.03 },  // Laitue
      { ingredientId: 'ingredient-6', quantity: 0.02 },  // Ketchup
      { ingredientId: 'ingredient-7', quantity: 0.02 },  // Mayonnaise
    ]
  },
  // Pizza recipe
  {
    productId: 'pizza-margherita',
    ingredients: [
      { ingredientId: 'ingredient-8', quantity: 0.2 },  // Farine à pizza
      { ingredientId: 'ingredient-9', quantity: 0.1 },  // Sauce tomate
      { ingredientId: 'ingredient-10', quantity: 0.15 },  // Mozzarella
    ]
  },
  // Thon pizza
  {
    productId: 'pizza-thon',
    ingredients: [
      { ingredientId: 'ingredient-8', quantity: 0.2 },  // Farine à pizza
      { ingredientId: 'ingredient-9', quantity: 0.1 },  // Sauce tomate
      { ingredientId: 'ingredient-10', quantity: 0.12 },  // Mozzarella
      { ingredientId: 'ingredient-11', quantity: 0.1 },  // Thon
    ]
  },
  // Orange juice
  {
    productId: 'drink-orange',
    ingredients: [
      { ingredientId: 'ingredient-14', quantity: 0.4 },  // Orange
    ]
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
  ingredients: ingredients,
  recipes: recipes,
};
