
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePOS } from '@/context/POSContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

const Header: React.FC = () => {
  const { state, logout, login } = usePOS();
  const { currentUser } = state;
  const navigate = useNavigate();
  
  const handleUserChange = (pin: string) => {
    const success = login(pin);
    if (success) {
      toast.success("Utilisateur changé avec succès");
    } else {
      toast.error("Code PIN invalide");
    }
  };
  
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
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-pos-light hover:text-white hover:bg-pos-primary"
              >
                <UserCog className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Changer d'utilisateur</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Select onValueChange={handleUserChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.users.map(user => (
                      <SelectItem key={user.id} value={user.pin}>
                        {user.name} ({user.role === 'admin' ? 'Admin' : 'Caissier'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogContent>
          </Dialog>
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
