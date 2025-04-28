
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePOS } from '@/context/POSContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

const Header: React.FC = () => {
  const { state, logout, login } = usePOS();
  const { currentUser } = state;
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [pin, setPin] = useState('');
  
  const handleUserChange = () => {
    const user = state.users.find(u => u.id === selectedUserId);
    if (user && pin === user.pin) {
      const success = login(pin);
      if (success) {
        toast.success("Utilisateur changé avec succès");
        setPin('');
        setSelectedUserId('');
      }
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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Sélectionner un utilisateur</Label>
                  <select 
                    className="w-full p-2 rounded-md border bg-background"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Choisir un utilisateur</option>
                    {state.users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role === 'admin' ? 'Admin' : 'Caissier'})
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedUserId && (
                  <div className="space-y-2">
                    <Label>Code PIN</Label>
                    <Input 
                      type="password" 
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Entrez le code PIN"
                    />
                    <Button 
                      className="w-full mt-2"
                      onClick={handleUserChange}
                      disabled={!pin || pin.length !== 4}
                    >
                      Confirmer
                    </Button>
                  </div>
                )}
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
