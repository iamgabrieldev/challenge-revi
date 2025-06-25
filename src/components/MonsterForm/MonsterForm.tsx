import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { MonsterFormData, ValidationErrors } from '../../types';
import { validateMonsterForm, createMonsterFromForm } from '../../utils/monsterUtils';
import { useMonsters } from '../../contexts/MonsterContext';

interface MonsterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MonsterForm({ onSuccess, onCancel }: MonsterFormProps) {
  const { addMonster } = useMonsters();
  const [formData, setFormData] = useState<MonsterFormData>({
    name: '',
    attack: '',
    defense: '',
    speed: '',
    hp: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (field: keyof MonsterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Preview da imagem
    if (field === 'imageUrl' && value) {
      setImageLoading(true);
      setImagePreview(value);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateMonsterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Criar monstro
      const newMonster = createMonsterFromForm(formData);
      
      // Adicionar ao contexto
      addMonster(newMonster);
      
      // Limpar formulário
      setFormData({
        name: '',
        attack: '',
        defense: '',
        speed: '',
        hp: '',
        imageUrl: ''
      });
      setImagePreview('');
      setErrors({});
      
      // Callback de sucesso
      onSuccess?.();
      
    } catch (error) {
      console.error('Erro ao criar monstro:', error);
      setErrors({ general: 'Erro ao criar monstro. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      attack: '',
      defense: '',
      speed: '',
      hp: '',
      imageUrl: ''
    });
    setImagePreview('');
    setErrors({});
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Cadastrar Novo Monstro
        </CardTitle>
        <CardDescription>
          Preencha as informações do monstro para adicioná-lo à sua coleção
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Monstro</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Dragão de Fogo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attack">Ataque</Label>
              <Input
                id="attack"
                type="number"
                min="1"
                max="200"
                value={formData.attack}
                onChange={(e) => handleInputChange('attack', e.target.value)}
                placeholder="85"
                className={errors.attack ? 'border-red-500' : ''}
              />
              {errors.attack && (
                <p className="text-sm text-red-500">{errors.attack}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defense">Defesa</Label>
              <Input
                id="defense"
                type="number"
                min="1"
                max="200"
                value={formData.defense}
                onChange={(e) => handleInputChange('defense', e.target.value)}
                placeholder="60"
                className={errors.defense ? 'border-red-500' : ''}
              />
              {errors.defense && (
                <p className="text-sm text-red-500">{errors.defense}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Velocidade</Label>
              <Input
                id="speed"
                type="number"
                min="1"
                max="200"
                value={formData.speed}
                onChange={(e) => handleInputChange('speed', e.target.value)}
                placeholder="70"
                className={errors.speed ? 'border-red-500' : ''}
              />
              {errors.speed && (
                <p className="text-sm text-red-500">{errors.speed}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hp">HP</Label>
              <Input
                id="hp"
                type="number"
                min="1"
                max="1000"
                value={formData.hp}
                onChange={(e) => handleInputChange('hp', e.target.value)}
                placeholder="120"
                className={errors.hp ? 'border-red-500' : ''}
              />
              {errors.hp && (
                <p className="text-sm text-red-500">{errors.hp}</p>
              )}
            </div>
          </div>

          {/* URL da Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://exemplo.com/imagem-do-monstro.jpg"
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl}</p>
            )}
          </div>

          {/* Preview da Imagem */}
          {formData.imageUrl && (
            <div className="space-y-2">
              <Label>Preview da Imagem</Label>
              <div className="flex justify-center">
                {imageLoading ? (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview do monstro"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Monstro
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Limpar
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

