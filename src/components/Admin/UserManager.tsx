import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';

const UserManager: React.FC = () => {
  const { state, addUser } = usePOS();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    pin: '',
    role: 'cashier' as 'admin' | 'cashier'
  });
  
  const handleAddUser = () => {
    if (newUser.name.trim() === '') {
      toast.error("Le nom est obligatoire");
      return;
    }
    
    if (!/^\d{4}$/.test(newUser.pin)) {
      toast.error("Le code PIN doit contenir exactement 4 chiffres");
      return;
    }
    
    const userExists = state.users.some(user => user.name === newUser.name);
    if (userExists) {
      toast.error("Un utilisateur avec ce nom existe déjà");
      return;
    }
    
    const pinExists = state.users.some(user => user.pin === newUser.pin);
    if (pinExists) {
      toast.error("Ce code PIN est déjà utilisé par un autre utilisateur");
      return;
    }
    
    const success = addUser({
      id: `user-${Date.now()}`,
      name: newUser.name,
      pin: newUser.pin,
      role: newUser.role
    });
    
    if (success) {
      toast.success("Utilisateur ajouté avec succès");
      setNewUser({
        name: '',
        pin: '',
        role: 'cashier'
      });
      setIsDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un utilisateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <Input
                  id="user-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nom de l'utilisateur"
                />
              </div>
              <div>
                <label htmlFor="user-pin" className="block text-sm font-medium mb-1">
                  Code PIN (4 chiffres)
                </label>
                <Input
                  id="user-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={newUser.pin}
                  onChange={(e) => setNewUser({...newUser, pin: e.target.value})}
                  placeholder="****"
                />
              </div>
              <div>
                <label htmlFor="user-role" className="block text-sm font-medium mb-1">
                  Rôle
                </label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'cashier') => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="cashier">Caissier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button className="w-full" onClick={handleAddUser}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Rôle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.role === 'admin' ? 'Administrateur' : 'Caissier'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManager;
