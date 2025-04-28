import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, POSState, Product, User } from '../types/pos';
import { initialState } from '../data/mockData';

type POSAction = 
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'COMPLETE_ORDER'; payload: { paymentMethod: 'cash' | 'card' | 'voucher'; cashReceived?: number } }
  | { type: 'LOGIN'; payload: { pin: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_USER_PIN'; payload: { userId: string; newPin: string } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_SETTINGS'; payload: { businessInfo: POSState['businessInfo']; tax: number; currency: POSState['currency'] } };

interface POSContextType {
  state: POSState;
  dispatch: React.Dispatch<POSAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  completeOrder: (paymentMethod: 'cash' | 'card' | 'voucher', cashReceived?: number) => void;
  login: (pin: string) => boolean;
  logout: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  updateUserPin: (userId: string, newPin: string) => boolean;
  addUser: (user: User) => boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const saveToLocalStorage = (state: POSState) => {
  try {
    localStorage.setItem('pos_products', JSON.stringify(state.products));
    localStorage.setItem('pos_categories', JSON.stringify(state.categories));
    localStorage.setItem('pos_users', JSON.stringify(state.users));
    localStorage.setItem('pos_orders', JSON.stringify(state.orders));
    localStorage.setItem('pos_businessInfo', JSON.stringify(state.businessInfo));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage:", error);
  }
};

const loadFromLocalStorage = (): Partial<POSState> => {
  try {
    const products = localStorage.getItem('pos_products');
    const categories = localStorage.getItem('pos_categories');
    const users = localStorage.getItem('pos_users');
    const orders = localStorage.getItem('pos_orders');
    const businessInfo = localStorage.getItem('pos_businessInfo');
    
    return {
      products: products ? JSON.parse(products) : initialState.products,
      categories: categories ? JSON.parse(categories) : initialState.categories,
      users: users ? JSON.parse(users) : initialState.users,
      orders: orders ? JSON.parse(orders) : initialState.orders,
      businessInfo: businessInfo ? JSON.parse(businessInfo) : initialState.businessInfo,
    };
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage:", error);
    return {};
  }
};

const initialStateWithLocalStorage = {
  ...initialState,
  ...loadFromLocalStorage(),
  users: [
    {
      id: 'admin-1',
      name: 'Admin',
      pin: '2387',
      role: 'admin' as const
    },
    {
      id: 'cashier-1',
      name: 'Caissier 1',
      pin: '9876',
      role: 'cashier' as const
    },
    {
      id: 'cashier-2',
      name: 'Caissier 2',
      pin: '5432',
      role: 'cashier' as const
    }
  ]
};

const posReducer = (state: POSState, action: POSAction): POSState => {
  let newState: POSState;
  
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'ADD_TO_CART': {
      const product = action.payload;
      
      const existingItem = state.cart.find(item => item.productId === product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item => 
            item.productId === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        };
        
        return {
          ...state,
          cart: [...state.cart, newItem]
        };
      }
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    case 'COMPLETE_ORDER': {
      if (!state.currentUser || state.cart.length === 0) return state;
      
      const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * state.tax;
      const total = subtotal + tax;
      
      const newOrder = {
        id: `order-${Date.now()}`,
        items: [...state.cart],
        subtotal,
        tax,
        total,
        paymentMethod: action.payload.paymentMethod,
        cashReceived: action.payload.cashReceived,
        changeDue: action.payload.cashReceived ? action.payload.cashReceived - total : undefined,
        status: 'completed' as const,
        timestamp: Date.now(),
        cashierId: state.currentUser.id
      };
      
      newState = {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: []
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'LOGIN': {
      const { pin } = action.payload;
      const user = state.users.find(user => user.pin === pin);
      
      if (user) {
        return {
          ...state,
          currentUser: user
        };
      }
      
      return state;
    }
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        cart: []
      };
    
    case 'ADD_PRODUCT': {
      const newProduct = action.payload;
      newState = {
        ...state,
        products: [...state.products, newProduct]
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'UPDATE_PRODUCT': {
      const updatedProduct = action.payload;
      newState = {
        ...state,
        products: state.products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'DELETE_PRODUCT': {
      const productId = action.payload;
      newState = {
        ...state,
        products: state.products.filter(product => product.id !== productId)
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'UPDATE_USER_PIN': {
      const { userId, newPin } = action.payload;
      
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        return state;
      }
      
      newState = {
        ...state,
        users: state.users.map(user => 
          user.id === userId 
            ? { ...user, pin: newPin }
            : user
        )
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'ADD_USER': {
      const newUser = action.payload;
      
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        return state;
      }
      
      newState = {
        ...state,
        users: [...state.users, newUser]
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    case 'UPDATE_SETTINGS': {
      const { businessInfo, tax, currency } = action.payload;
      
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        return state;
      }
      
      newState = {
        ...state,
        businessInfo,
        tax,
        currency
      };
      
      saveToLocalStorage(newState);
      return newState;
    }
    
    default:
      return state;
  }
};

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(posReducer, initialStateWithLocalStorage);
  
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const completeOrder = (paymentMethod: 'cash' | 'card' | 'voucher', cashReceived?: number) => {
    dispatch({ type: 'COMPLETE_ORDER', payload: { paymentMethod, cashReceived } });
  };
  
  const login = (pin: string): boolean => {
    const user = state.users.find(user => user.pin === pin);
    
    if (user) {
      dispatch({ type: 'LOGIN', payload: { pin } });
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const getCartSubtotal = () => {
    return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const getCartTax = () => {
    return getCartSubtotal() * state.tax;
  };
  
  const getCartTotal = () => {
    return getCartSubtotal() + getCartTax();
  };
  
  const updateUserPin = (userId: string, newPin: string): boolean => {
    if (!/^\d{4}$/.test(newPin)) {
      return false;
    }
    
    dispatch({ type: 'UPDATE_USER_PIN', payload: { userId, newPin } });
    return true;
  };
  
  const addUser = (user: User): boolean => {
    dispatch({ type: 'ADD_USER', payload: user });
    return true;
  };
  
  return (
    <POSContext.Provider value={{ 
      state, 
      dispatch, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      completeOrder,
      login,
      logout,
      getCartTotal,
      getCartSubtotal,
      getCartTax,
      updateUserPin,
      addUser
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  
  return context;
};
