
import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const NumberPad: React.FC<{ onDigitPress: (digit: string) => void, onClear: () => void, onSubmit: () => void }> = ({ 
  onDigitPress, 
  onClear, 
  onSubmit 
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {digits.map(digit => (
        <Button
          key={digit}
          className="h-16 text-2xl font-bold bg-pos-dark hover:bg-pos-primary"
          onClick={() => onDigitPress(digit)}
        >
          {digit}
        </Button>
      ))}
      <Button 
        className="h-16 text-xl font-bold bg-pos-danger hover:bg-red-700"
        onClick={onClear}
      >
        Clear
      </Button>
      <Button 
        className="h-16 text-xl font-bold bg-pos-success hover:bg-green-700"
        onClick={onSubmit}
      >
        Enter
      </Button>
    </div>
  );
};

const LoginScreen: React.FC = () => {
  const { login } = usePOS();
  const [pin, setPin] = useState('');
  
  const handleDigitPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };
  
  const handleClear = () => {
    setPin('');
  };
  
  const handleSubmit = () => {
    const success = login(pin);
    
    if (!success) {
      toast.error("Code PIN invalide. Veuillez réessayer.");
      setPin('');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-pos-background">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-pos-dark mb-4">
          Fast Food Express POS
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Entrez votre code PIN pour accéder au système
        </p>
        
        <div className="mb-6">
          <div className="bg-gray-100 h-16 flex items-center justify-center rounded-md">
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-pos-primary' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <NumberPad
          onDigitPress={handleDigitPress}
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>PIN par défaut: 1234 (Admin) ou 5678 (Caissier)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
