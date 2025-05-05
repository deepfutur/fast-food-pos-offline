
import React, { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import CategoryTabs from '../components/POS/CategoryTabs';
import ProductGrid from '../components/POS/ProductGrid';
import ShoppingCart from '../components/POS/ShoppingCart';
import Header from '../components/Layout/Header';
import { Product } from '../types/pos';
import { toast } from '@/components/ui/use-toast';

const POS: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { products, selectedCategory } = state;
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  
  // Vérifier si les catégories ont des produits au chargement
  useEffect(() => {
    const pizzaProducts = products.filter(p => p.category === 'pizza');
    const tacosProducts = products.filter(p => p.category === 'tacos');
    
    console.log('Catégories disponibles:', state.categories.map(c => c.id));
    console.log('Produits disponibles:', products.length);
    console.log('Produits pizza:', pizzaProducts.length);
    console.log('Détails produits pizza:', pizzaProducts.map(p => p.name));
    console.log('Produits tacos:', tacosProducts.length);
    console.log('Détails produits tacos:', tacosProducts.map(p => p.name));
    
    if (pizzaProducts.length === 0 && tacosProducts.length === 0) {
      console.warn('Les produits pizza et tacos sont définis mais ne sont pas chargés correctement.');
      
      // Ajouter les produits manquants
      const defaultImage = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9';
      
      const newPizzas: Product[] = [
        {
          id: 'pizza-1',
          name: 'Pizza Margherita',
          price: 30,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, mozzarella'
        },
        {
          id: 'pizza-2',
          name: 'Pizza Thon',
          price: 40,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, thon, oignon, mozzarella'
        },
        {
          id: 'pizza-3',
          name: 'Pizza Poulet',
          price: 45,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, thon, oignon, mozzarella'
        },
        {
          id: 'pizza-4',
          name: 'Pizza Viande Hachée',
          price: 50,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, viande hachée, mozzarella'
        },
        {
          id: 'pizza-5',
          name: 'Pizza 4 Saisons',
          price: 55,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, viande hachée, thon, poulet, charcuterie, mozzarella'
        },
        {
          id: 'pizza-6',
          name: 'Pizza 4 Fromages',
          price: 40,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, edam cheese, mozzarella, gouda, parmesan'
        },
        {
          id: 'pizza-7',
          name: 'Pizza Pepperoni',
          price: 45,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, pepperoni, mozzarella'
        },
        {
          id: 'pizza-8',
          name: 'Pizza Fruits de Mer',
          price: 60,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, fruits de mer, mozzarella'
        },
        {
          id: 'pizza-9',
          name: 'Pizza Deli in the Box',
          price: 60,
          category: 'pizza',
          image: defaultImage,
          description: 'sauce tomate, pepperoni, viande hachée, mozzarella'
        }
      ];
      
      const newTacos: Product[] = [
        {
          id: 'tacos-1',
          name: 'Tacos Poulet',
          price: 35,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
          description: 'Délicieux tacos au poulet'
        },
        {
          id: 'tacos-2',
          name: 'Tacos Viande Hachée',
          price: 35,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
          description: 'Tacos avec viande hachée savoureuse'
        },
        {
          id: 'tacos-3',
          name: 'Tacos Mixte',
          price: 35,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
          description: 'Tacos mixte poulet et viande hachée'
        },
        {
          id: 'tacos-4',
          name: 'Tacos Saucisse',
          price: 35,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
          description: 'Tacos à la saucisse'
        },
        {
          id: 'tacos-5',
          name: 'Tacos Nuggets',
          price: 40,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
          description: 'Tacos avec nuggets'
        },
        {
          id: 'tacos-6',
          name: 'Tacos Cordon Bleu',
          price: 40,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
          description: 'Tacos avec cordon bleu'
        },
        {
          id: 'tacos-7',
          name: 'Tacos Deli in the Box',
          price: 40,
          category: 'tacos',
          image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
          description: 'Tacos spécial Deli in the Box'
        }
      ];
      
      // Fusionner les produits locaux avec les produits existants
      const updatedProducts = [...products, ...newPizzas, ...newTacos];
      setDisplayProducts(updatedProducts);
      
      // Mettre à jour l'état global avec ces nouveaux produits
      newPizzas.forEach(product => {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
      });
      
      newTacos.forEach(product => {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
      });
      
      toast({
        title: "Produits ajoutés",
        description: "Les produits pizza et tacos ont été ajoutés avec succès",
      });
    } else {
      // Utiliser les produits existants
      setDisplayProducts(products);
    }
  }, [state.categories, products, dispatch]);
  
  // Sort products by category when no category is selected
  const filteredProducts = selectedCategory
    ? displayProducts.filter(product => product.category === selectedCategory)
    : displayProducts.sort((a, b) => a.category.localeCompare(b.category));
  
  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-4 flex flex-col">
        <CategoryTabs />
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="w-2/3 overflow-auto pb-4">
            <ProductGrid products={filteredProducts} />
          </div>
          
          <div className="w-1/3">
            <ShoppingCart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
