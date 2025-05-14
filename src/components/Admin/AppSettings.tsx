
import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/sonner';

const AppSettings: React.FC = () => {
  const { state, dispatch } = usePOS();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: state.businessInfo.name,
      address: state.businessInfo.address,
      phone: state.businessInfo.phone,
      taxId: state.businessInfo.taxId,
      tax: state.tax * 100,
      currency: state.currency
    }
  });
  
  const onSubmit = (data: any) => {
    // Convert tax from percentage to decimal
    const taxRate = Number(data.tax) / 100;
    
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: {
        businessInfo: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          taxId: data.taxId,
          logo: state.businessInfo.logo
        },
        tax: taxRate,
        currency: data.currency
      }
    });
    
    toast.success("Paramètres mis à jour avec succès");
    setIsEditing(false);
  };
  
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Paramètres de l'application</h3>
          <Button onClick={() => setIsEditing(true)}>Modifier</Button>
        </div>
        
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Nom de l'entreprise</p>
            <p>{state.businessInfo.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Adresse</p>
            <p>{state.businessInfo.address}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Téléphone</p>
            <p>{state.businessInfo.phone}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">N° d'identification fiscale</p>
            <p>{state.businessInfo.taxId}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">TVA</p>
            <p>{(state.tax * 100).toFixed(1)}%</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Devise</p>
            <p>{state.currency}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-semibold">Paramètres de l'application</h3>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'entreprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° d'identification fiscale</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TVA (%)</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.1" min="0" max="100" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devise</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="XAF">Franc CFA (XAF)</SelectItem>
                  <SelectItem value="USD">Dollar ($)</SelectItem>
                  <SelectItem value="MAD">Dirham marocain (DH)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
};

export default AppSettings;
