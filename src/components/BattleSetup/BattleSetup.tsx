import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Crown,
  Swords,
  RotateCcw,
  Play
} from 'lucide-react';
import { Monster } from '../../types';
import { useMonsters } from '../../contexts/MonsterContext';
import { calculateMonsterPower } from '../../utils/monsterUtils';
import { MonsterList } from '../MonsterList/MonsterList';

interface BattleSetupProps {
  onStartBattle: (monster1: Monster, monster2: Monster) => void;
}

export function BattleSetup({ onStartBattle }: BattleSetupProps) {
  const { state, selectMonster1, selectMonster2, clearSelection } = useMonsters();
  const { selectedMonsters } = state;
  const [monster1, monster2] = selectedMonsters;

  const handleSelectMonster = (monster: Monster, position: 1 | 2) => {
    if (position === 1) {
      selectMonster1(monster);
    } else {
      selectMonster2(monster);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleStartBattle = () => {
    if (monster1 && monster2) {
      onStartBattle(monster1, monster2);
    }
  };

  const canStartBattle = monster1 && monster2 && monster1.id !== monster2.id;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Configurar Batalha</h1>
        <p className="text-gray-600">
          Selecione dois monstros para iniciar uma batalha épica!
        </p>
      </div>

      {/* Arena de Seleção */}
      {(monster1 || monster2) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Arena de Batalha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lutador 1 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-600">
                  Lutador 1
                </h3>
                {monster1 ? (
                  <MonsterCard monster={monster1} color="blue" />
                ) : (
                  <EmptySlot text="Selecione o primeiro monstro" />
                )}
              </div>

              {/* VS */}
              <div className="hidden md:flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-400">VS</div>
              </div>
              <div className="md:hidden text-center">
                <div className="text-2xl font-bold text-gray-400">VS</div>
              </div>

              {/* Lutador 2 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600">
                  Lutador 2
                </h3>
                {monster2 ? (
                  <MonsterCard monster={monster2} color="red" />
                ) : (
                  <EmptySlot text="Selecione o segundo monstro" />
                )}
              </div>
            </div>

            {/* Controles da Batalha */}
            <div className="flex gap-3 mt-6 justify-center">
              <Button
                onClick={handleClearSelection}
                variant="outline"
                disabled={!monster1 && !monster2}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar Seleção
              </Button>
              
              <Button
                onClick={handleStartBattle}
                disabled={!canStartBattle}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Batalha!
              </Button>
            </div>

            {/* Aviso */}
            {monster1 && monster2 && monster1.id === monster2.id && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm text-center">
                  ⚠️ Você não pode selecionar o mesmo monstro duas vezes!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Monstros */}
      <MonsterList
        onSelectMonster={handleSelectMonster}
        selectionMode={true}
        selectedMonsters={selectedMonsters}
      />
    </div>
  );
}

interface MonsterCardProps {
  monster: Monster;
  color: 'blue' | 'red';
}

function MonsterCard({ monster, color }: MonsterCardProps) {
  const power = calculateMonsterPower(monster);
  const isInjured = monster.hp < monster.maxHp;
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    red: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      {/* Cabeçalho */}
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
        
        <div className="flex-1">
          <h4 className="font-bold text-lg">{monster.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Poder: {power}
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
    </div>
  );
}

function EmptySlot({ text }: { text: string }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-gray-400 mb-2">
        <Swords className="w-8 h-8 mx-auto" />
      </div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

