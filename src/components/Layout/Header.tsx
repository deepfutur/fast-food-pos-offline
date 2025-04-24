
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePOS } from '@/context/POSContext';

const Header: React.FC = () => {
  const { state, logout } = usePOS();
  const { currentUser } = state;
  const navigate = useNavigate();
  
  const toggleInterface = () => {
    if (window.location.pathname === '/admin') {
      navigate('/pos');
    } else {
      navigate('/admin');
    }
  };

  return (
    <header className="bg-pos-dark text-pos-light p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Fast Food Express POS</h1>
          {currentUser?.role === 'admin' && (
            <Button 
              variant="outline"
              onClick={toggleInterface}
              className="text-pos-light hover:text-white border-pos-light hover:border-white"
            >
              {window.location.pathname === '/admin' ? 'Mode Caisse' : 'Mode Admin'}
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="opacity-75">Utilisateur:</span>{' '}
            <span className="font-semibold">{currentUser?.name}</span>{' '}
            <span className="bg-pos-primary text-white text-xs px-2 py-1 rounded-full ml-1">
              {currentUser?.role === 'admin' ? 'Admin' : 'Caissier'}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-pos-light hover:text-white hover:bg-pos-primary"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
