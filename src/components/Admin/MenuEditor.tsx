
import React, { useState, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, Category } from '../../types/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, Upload, Image } from 'lucide-react';

const MenuEditor: React.FC = () => {
  const { state } = usePOS();
  const { products, categories } = state;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageType, setImageType] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    setImageType(product.image.startsWith('http') ? 'url' : 'upload');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En attendant l'intégration de Supabase pour le stockage des fichiers
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const fileInput = document.getElementById('imageUrl') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = reader.result;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cette fonctionnalité nécessite Supabase pour persister les modifications
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Menu</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-pos-primary hover:bg-pos-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Produit
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input 
                    defaultValue={editingProduct?.name} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prix</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    defaultValue={editingProduct?.price}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <select className="w-full p-2 border rounded-md">
                    {categories.map(category => (
                      <option 
                        key={category.id} 
                        value={category.id}
                        selected={editingProduct?.category === category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label>Image</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant={imageType === 'url' ? 'default' : 'outline'}
                      onClick={() => setImageType('url')}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      URL Image
                    </Button>
                    <Button
                      type="button"
                      variant={imageType === 'upload' ? 'default' : 'outline'}
                      onClick={() => setImageType('upload')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger Image
                    </Button>
                  </div>
                  
                  {imageType === 'url' ? (
                    <Input 
                      id="imageUrl"
                      type="url" 
                      placeholder="https://..."
                      defaultValue={editingProduct?.image}
                      required
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Sélectionner un fichier
                      </Button>
                      <Input 
                        id="imageUrl"
                        type="hidden"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  className="w-full p-2 border rounded-md" 
                  defaultValue={editingProduct?.description}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
                <span className="font-bold">{product.price.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuEditor;
