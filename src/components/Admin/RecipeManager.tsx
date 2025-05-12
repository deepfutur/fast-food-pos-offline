
import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Ingredient, Product, Recipe, RecipeItem } from '../../types/pos';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Plus, Save, Trash } from 'lucide-react';

const RecipeManager: React.FC = () => {
  const { state, dispatch } = usePOS();
  const { products, ingredients, recipes } = state;
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: `ingredient-${Date.now()}`,
    name: '',
    unit: 'unité',
    stock: 0,
    minStock: 10,
    unitPrice: 0,
    category: 'ingrédient'
  });

  // Load recipe when product selection changes
  useEffect(() => {
    if (selectedProductId) {
      const existingRecipe = recipes.find(recipe => recipe.productId === selectedProductId);
      if (existingRecipe) {
        setRecipeItems([...existingRecipe.ingredients]);
      } else {
        setRecipeItems([]);
      }
    } else {
      setRecipeItems([]);
    }
  }, [selectedProductId, recipes]);

  const handleAddIngredient = () => {
    if (!newIngredient.name || newIngredient.unitPrice <= 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    dispatch({
      type: 'ADD_INGREDIENT',
      payload: newIngredient
    });

    toast({
      title: "Ingrédient ajouté",
      description: `L'ingrédient ${newIngredient.name} a été ajouté avec succès`,
    });

    setNewIngredient({
      id: `ingredient-${Date.now()}`,
      name: '',
      unit: 'unité',
      stock: 0,
      minStock: 10,
      unitPrice: 0,
      category: 'ingrédient'
    });
  };

  const addRecipeItem = () => {
    if (ingredients.length === 0) {
      toast({
        title: "Aucun ingrédient",
        description: "Veuillez d'abord ajouter des ingrédients",
        variant: "destructive",
      });
      return;
    }
    
    const firstIngredient = ingredients[0];
    setRecipeItems([
      ...recipeItems,
      { ingredientId: firstIngredient.id, quantity: 1 }
    ]);
  };

  const updateRecipeItem = (index: number, field: keyof RecipeItem, value: any) => {
    const updatedItems = [...recipeItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setRecipeItems(updatedItems);
  };

  const removeRecipeItem = (index: number) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index));
  };

  const saveRecipe = () => {
    if (!selectedProductId) {
      toast({
        title: "Aucun produit sélectionné",
        description: "Veuillez sélectionner un produit pour cette recette",
        variant: "destructive",
      });
      return;
    }

    if (recipeItems.length === 0) {
      toast({
        title: "Recette vide",
        description: "Veuillez ajouter au moins un ingrédient à la recette",
        variant: "destructive",
      });
      return;
    }

    const newRecipe: Recipe = {
      productId: selectedProductId,
      ingredients: recipeItems,
    };

    dispatch({
      type: 'SET_RECIPE',
      payload: newRecipe
    });

    toast({
      title: "Recette enregistrée",
      description: `La recette pour ${products.find(p => p.id === selectedProductId)?.name} a été enregistrée`,
    });
  };

  const getIngredientName = (ingredientId: string) => {
    return ingredients.find(ing => ing.id === ingredientId)?.name || 'Ingrédient inconnu';
  };

  const getIngredientUnit = (ingredientId: string) => {
    return ingredients.find(ing => ing.id === ingredientId)?.unit || 'unité';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des Recettes</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un ingrédient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input 
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                    placeholder="Nom de l'ingrédient"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unité</label>
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Grammes (g)</SelectItem>
                      <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                      <SelectItem value="ml">Millilitres (ml)</SelectItem>
                      <SelectItem value="l">Litres (l)</SelectItem>
                      <SelectItem value="unité">Unité</SelectItem>
                      <SelectItem value="pièce">Pièce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock initial</label>
                  <Input 
                    type="number"
                    min="0"
                    value={newIngredient.stock}
                    onChange={(e) => setNewIngredient({...newIngredient, stock: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock minimum</label>
                  <Input 
                    type="number"
                    min="0"
                    value={newIngredient.minStock}
                    onChange={(e) => setNewIngredient({...newIngredient, minStock: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix unitaire</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={newIngredient.unitPrice}
                    onChange={(e) => setNewIngredient({...newIngredient, unitPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <Select
                  value={newIngredient.category}
                  onValueChange={(value) => setNewIngredient({...newIngredient, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingrédient">Ingrédient</SelectItem>
                    <SelectItem value="produit frais">Produit frais</SelectItem>
                    <SelectItem value="épicerie">Épicerie</SelectItem>
                    <SelectItem value="boisson">Boisson</SelectItem>
                    <SelectItem value="emballage">Emballage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddIngredient} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Ajouter l'ingrédient
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des ingrédients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Prix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        Aucun ingrédient disponible
                      </TableCell>
                    </TableRow>
                  ) : (
                    ingredients.map((ingredient) => (
                      <TableRow key={ingredient.id}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>
                          {ingredient.stock} 
                          {ingredient.stock <= (ingredient.minStock || 0) && (
                            <span className="ml-2 text-red-500 font-bold">!</span>
                          )}
                        </TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        <TableCell>{ingredient.unitPrice.toFixed(2)} MAD</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une recette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Produit</label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrédient</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipeItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        Aucun ingrédient dans cette recette
                      </TableCell>
                    </TableRow>
                  ) : (
                    recipeItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.ingredientId}
                            onValueChange={(value) => updateRecipeItem(index, 'ingredientId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue>{getIngredientName(item.ingredientId)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {ingredients.map((ing) => (
                                <SelectItem key={ing.id} value={ing.id}>
                                  {ing.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateRecipeItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          {getIngredientUnit(item.ingredientId)}
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => removeRecipeItem(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button onClick={addRecipeItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un ingrédient
              </Button>
              <Button onClick={saveRecipe}>
                <Save className="h-4 w-4 mr-2" /> Enregistrer la recette
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeManager;
