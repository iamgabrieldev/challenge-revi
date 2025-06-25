import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Crown,
  Clock,
  Target,
  RotateCcw,
  Home
} from 'lucide-react';
import { BattleResult as BattleResultType, Monster } from '../../types';
import { calculateMonsterPower } from '../../utils/monsterUtils';

interface BattleResultProps {
  result: BattleResultType;
  onNewBattle: () => void;
  onBackToHome: () => void;
}

export function BattleResult({ result, onNewBattle, onBackToHome }: BattleResultProps) {
  const { winner, loser, rounds, totalRounds, battleDuration } = result;

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Vitória */}
      <div className="text-center">
        <div className="mb-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Vitória!
        </h1>
        <p className="text-xl text-gray-600">
          <span className="font-semibold">{winner.name}</span> venceu a batalha!
        </p>
      </div>

      {/* Resultado Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vencedor */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-green-700 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              Vencedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonsterResultCard monster={winner} isWinner={true} />
          </CardContent>
        </Card>

        {/* Perdedor */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <CardTitle className="text-red-700">
              Derrotado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonsterResultCard monster={loser} isWinner={false} />
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas da Batalha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Estatísticas da Batalha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{totalRounds}</div>
              <div className="text-sm text-gray-600">Rounds Totais</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {(battleDuration / 1000).toFixed(2)}s
              </div>
              <div className="text-sm text-gray-600">Duração</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((winner.hp / winner.maxHp) * 100)}%
              </div>
              <div className="text-sm text-gray-600">HP Restante do Vencedor</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Rounds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico da Batalha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {rounds.map((round, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    round.isKillingBlow 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      Round {round.roundNumber}
                    </span>
                    {round.isKillingBlow && (
                      <Badge variant="destructive" className="text-xs">
                        Golpe Fatal
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <strong>{round.attacker.name}</strong> atacou{' '}
                    <strong>{round.defender.name}</strong> causando{' '}
                    <span className="font-bold text-red-600">{round.damage} de dano</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    HP de {round.defender.name}: {round.defenderHpBefore} → {round.defenderHpAfter}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onNewBattle}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Nova Batalha
        </Button>
        
        <Button
          onClick={onBackToHome}
          variant="outline"
          size="lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}

interface MonsterResultCardProps {
  monster: Monster;
  isWinner: boolean;
}

function MonsterResultCard({ monster, isWinner }: MonsterResultCardProps) {
  const power = calculateMonsterPower(monster);
  const hpPercentage = (monster.hp / monster.maxHp) * 100;

  return (
    <div className="space-y-4">
      {/* Imagem e Nome */}
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={monster.imageUrl}
            alt={monster.name}
            className={`w-24 h-24 object-cover rounded-full border-4 ${
              isWinner ? 'border-yellow-400' : 'border-gray-300'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=?';
            }}
          />
          {isWinner && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-xl mt-2">{monster.name}</h3>
        <Badge variant="outline" className="mt-1">
          <Crown className="w-3 h-3 mr-1" />
          Poder: {power}
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Sword className="w-4 h-4 text-red-500" />
          <span className="text-gray-600">Ataque:</span>
          <span className="font-semibold">{monster.attack}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600">Defesa:</span>
          <span className="font-semibold">{monster.defense}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-600">Velocidade:</span>
          <span className="font-semibold">{monster.speed}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Heart className={`w-4 h-4 ${isWinner ? 'text-green-500' : 'text-red-500'}`} />
          <span className="text-gray-600">HP Final:</span>
          <span className="font-semibold">{monster.hp}/{monster.maxHp}</span>
        </div>
      </div>

      {/* Barra de HP Final */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>HP Restante</span>
          <span>{Math.round(hpPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isWinner
                ? hpPercentage > 60
                  ? 'bg-green-500'
                  : hpPercentage > 30
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                : 'bg-gray-400'
            }`}
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

