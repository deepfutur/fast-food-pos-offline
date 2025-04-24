
import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UpdatePinForm: React.FC = () => {
  const { state, updateUserPin } = usePOS();
  const [newPin, setNewPin] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(state.currentUser?.id || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) return;
    
    if (!/^\d{4}$/.test(newPin)) {
      toast.error("Le code PIN doit contenir exactement 4 chiffres");
      return;
    }
    
    const success = updateUserPin(selectedUserId, newPin);
    
    if (success) {
      toast.success("Code PIN mis à jour avec succès");
      setNewPin('');
    } else {
      toast.error("Erreur lors de la mise à jour du code PIN");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
          Utilisateur
        </label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger id="user-select">
            <SelectValue placeholder="Sélectionner un utilisateur" />
          </SelectTrigger>
          <SelectContent>
            {state.users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="new-pin" className="block text-sm font-medium text-gray-700 mb-1">
          Nouveau code PIN (4 chiffres)
        </label>
        <Input
          id="new-pin"
          type="password"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          placeholder="****"
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Mettre à jour le code PIN
      </Button>
    </form>
  );
};

export default UpdatePinForm;
