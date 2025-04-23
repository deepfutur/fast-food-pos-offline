
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, POSState, Product } from '../types/pos';
import { initialState } from '../data/mockData';

type POSAction = 
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'COMPLETE_ORDER'; payload: { paymentMethod: 'cash' | 'card' | 'voucher'; cashReceived?: number } }
  | { type: 'LOGIN'; payload: { pin: string } }
  | { type: 'LOGOUT' };

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
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const posReducer = (state: POSState, action: POSAction): POSState => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'ADD_TO_CART': {
      const product = action.payload;
      
      // Check if product already exists in cart
      const existingItem = state.cart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if product already in cart
        return {
          ...state,
          cart: state.cart.map(item => 
            item.productId === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        // Add new item to cart
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
      
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: []
      };
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
      
    default:
      return state;
  }
};

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);
  
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
      getCartTax
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
