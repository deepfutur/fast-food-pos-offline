
import React, { useState, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product, Category } from '../../types/pos';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, Upload, Image } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const MenuEditor: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { products, categories } = state;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageType, setImageType] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description || ''
    });
    setShowForm(true);
    setImageType(product.image.startsWith('http') ? 'url' : 'upload');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormValues({
            ...formValues,
            image: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer un objet product avec les valeurs du formulaire
    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `product-${Date.now()}`,
      name: formValues.name,
      price: parseFloat(formValues.price),
      category: formValues.category,
      image: formValues.image,
      description: formValues.description
    };

    // Dispatch action pour mettre à jour ou ajouter le produit
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      toast({
        title: "Produit mis à jour",
        description: `Le produit ${updatedProduct.name} a été mis à jour avec succès.`,
      });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: updatedProduct });
      toast({
        title: "Produit ajouté",
        description: `Le produit ${updatedProduct.name} a été ajouté avec succès.`,
      });
    }
    
    setShowForm(false);
    setEditingProduct(null);
    setFormValues({
      name: '',
      price: '',
      category: '',
      image: '',
      description: ''
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormValues({
      name: '',
      price: '',
      category: categories[0]?.id || '',
      image: '',
      description: ''
    });
    setShowForm(true);
    setImageType('url');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Menu</h2>
        <Button 
          onClick={handleNewProduct}
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
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name"
                    value={formValues.name} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input 
                    id="price"
                    type="number" 
                    step="0.01" 
                    value={formValues.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select 
                    id="category" 
                    className="w-full p-2 border rounded-md"
                    value={formValues.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option 
                        key={category.id} 
                        value={category.id}
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
                      id="image"
                      type="url" 
                      placeholder="https://..."
                      value={formValues.image}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <div className="space-y-2">
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
                      {formValues.image && (
                        <div className="mt-2 border rounded-md overflow-hidden">
                          <img 
                            src={formValues.image} 
                            alt="Prévisualisation" 
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description"
                  className="w-full p-2 border rounded-md" 
                  value={formValues.description}
                  onChange={handleInputChange}
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
                  onClick={() => handleDeleteProduct(product.id)}
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
