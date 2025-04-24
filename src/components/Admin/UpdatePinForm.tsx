
import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const UpdatePinForm: React.FC = () => {
  const { state, updateUserPin } = usePOS();
  const [newPin, setNewPin] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.currentUser?.id) return;
    
    if (!/^\d{4}$/.test(newPin)) {
      toast.error("Le code PIN doit contenir exactement 4 chiffres");
      return;
    }
    
    const success = updateUserPin(state.currentUser.id, newPin);
    
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
