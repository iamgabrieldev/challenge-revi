import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Crown,
  Users
} from 'lucide-react';
import { Monster } from '../../types';
import { useMonsters } from '../../contexts/MonsterContext';
import { calculateMonsterPower } from '../../utils/monsterUtils';

interface MonsterListProps {
  onSelectMonster?: (monster: Monster, position: 1 | 2) => void;
  selectionMode?: boolean;
  selectedMonsters?: [Monster | null, Monster | null];
}

export function MonsterList({ 
  onSelectMonster, 
  selectionMode = false, 
  selectedMonsters = [null, null] 
}: MonsterListProps) {
  const { state, removeMonster, resetMonsterHp } = useMonsters();
  const { monsters } = state;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir ${name}?`)) {
      removeMonster(id);
    }
  };

  const handleResetHp = (id: string) => {
    resetMonsterHp(id);
  };

  const isMonsterSelected = (monster: Monster): 1 | 2 | null => {
    if (selectedMonsters[0]?.id === monster.id) return 1;
    if (selectedMonsters[1]?.id === monster.id) return 2;
    return null;
  };

  const canSelectMonster = (monster: Monster): boolean => {
    if (!selectionMode) return false;
    const selectedPosition = isMonsterSelected(monster);
    return selectedPosition === null;
  };

  if (monsters.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhum monstro cadastrado
        </h3>
        <p className="text-gray-500">
          Cadastre seu primeiro monstro para começar as batalhas!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Monstros ({monsters.length})
        </h2>
        {selectionMode && (
          <div className="text-sm text-gray-600">
            Selecione dois monstros para batalha
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monsters.map((monster) => {
          const selectedPosition = isMonsterSelected(monster);
          const canSelect = canSelectMonster(monster);
          const power = calculateMonsterPower(monster);
          const isInjured = monster.hp < monster.maxHp;

          return (
            <Card 
              key={monster.id} 
              className={`relative transition-all duration-200 ${
                selectedPosition 
                  ? selectedPosition === 1 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'ring-2 ring-red-500 bg-red-50'
                  : canSelect 
                    ? 'hover:shadow-lg cursor-pointer hover:scale-105' 
                    : ''
              }`}
              onClick={() => {
                if (canSelect && onSelectMonster) {
                  const nextPosition = selectedMonsters[0] === null ? 1 : 2;
                  onSelectMonster(monster, nextPosition);
                }
              }}
            >
              {selectedPosition && (
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  selectedPosition === 1 ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  {selectedPosition}
                </div>
              )}

              <CardContent className="p-4">
                {/* Imagem e Nome */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={monster.imageUrl}
                      alt={monster.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=?';
                      }}
                    />
                    {isInjured && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <Heart className="w-2 h-2 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {monster.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        {power}
                      </Badge>
                      {isInjured && (
                        <Badge variant="destructive" className="text-xs">
                          Ferido
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Sword className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">ATK:</span>
                    <span className="font-semibold">{monster.attack}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">DEF:</span>
                    <span className="font-semibold">{monster.defense}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">SPD:</span>
                    <span className="font-semibold">{monster.speed}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Heart className={`w-4 h-4 ${isInjured ? 'text-red-500' : 'text-green-500'}`} />
                    <span className="text-gray-600">HP:</span>
                    <span className={`font-semibold ${isInjured ? 'text-red-600' : ''}`}>
                      {monster.hp}/{monster.maxHp}
                    </span>
                  </div>
                </div>

                {/* Barra de HP */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        monster.hp > monster.maxHp * 0.6
                          ? 'bg-green-500'
                          : monster.hp > monster.maxHp * 0.3
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(monster.hp / monster.maxHp) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Ações */}
                {!selectionMode && (
                  <div className="flex gap-2 mt-4">
                    {isInjured && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetHp(monster.id)}
                        className="flex-1"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Curar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(monster.id, monster.name)}
                      className={isInjured ? '' : 'flex-1'}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                )}

                {/* Indicador de seleção */}
                {selectionMode && canSelect && (
                  <div className="mt-4 text-center">
                    <Button size="sm" variant="outline" className="w-full">
                      Selecionar para Batalha
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

