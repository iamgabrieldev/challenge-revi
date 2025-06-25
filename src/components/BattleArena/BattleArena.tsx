import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Crown,
  Play,
  Pause,
  SkipForward,
  RotateCcw
} from 'lucide-react';
import { Monster, BattleResult, BattleRound } from '../../types';
import { executeBattle } from '../../utils/battleUtils';
import { calculateMonsterPower } from '../../utils/monsterUtils';

interface BattleArenaProps {
  monster1: Monster;
  monster2: Monster;
  onBattleComplete: (result: BattleResult) => void;
  onReset: () => void;
}

export function BattleArena({ monster1, monster2, onBattleComplete, onReset }: BattleArenaProps) {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [currentMonster1, setCurrentMonster1] = useState<Monster>(monster1);
  const [currentMonster2, setCurrentMonster2] = useState<Monster>(monster2);

  // Executar batalha quando componente monta
  useEffect(() => {
    const result = executeBattle(monster1, monster2);
    setBattleResult(result);
  }, [monster1, monster2]);

  // Auto-play da batalha
  useEffect(() => {
    if (!isPlaying || !battleResult || currentRound >= battleResult.rounds.length) {
      return;
    }

    const timer = setTimeout(() => {
      playNextRound();
    }, 1500); // 1.5 segundos entre rounds

    return () => clearTimeout(timer);
  }, [isPlaying, currentRound, battleResult]);

  const playNextRound = () => {
    if (!battleResult || currentRound >= battleResult.rounds.length) {
      setIsPlaying(false);
      if (battleResult) {
        onBattleComplete(battleResult);
      }
      return;
    }

    const round = battleResult.rounds[currentRound];
    
    // Atualizar HP dos monstros baseado no round atual
    if (round.defender.id === monster1.id) {
      setCurrentMonster1(prev => ({ ...prev, hp: round.defenderHpAfter }));
    } else {
      setCurrentMonster2(prev => ({ ...prev, hp: round.defenderHpAfter }));
    }

    setCurrentRound(prev => prev + 1);
  };

  const handleStartBattle = () => {
    setBattleStarted(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResume = () => {
    setIsPlaying(true);
  };

  const handleSkipToEnd = () => {
    if (!battleResult) return;
    
    setIsPlaying(false);
    setCurrentRound(battleResult.rounds.length);
    setCurrentMonster1(prev => ({ 
      ...prev, 
      hp: battleResult.winner.id === monster1.id ? battleResult.winner.hp : battleResult.loser.hp 
    }));
    setCurrentMonster2(prev => ({ 
      ...prev, 
      hp: battleResult.winner.id === monster2.id ? battleResult.winner.hp : battleResult.loser.hp 
    }));
    onBattleComplete(battleResult);
  };

  const handleReset = () => {
    setCurrentRound(0);
    setIsPlaying(false);
    setBattleStarted(false);
    setCurrentMonster1(monster1);
    setCurrentMonster2(monster2);
    onReset();
  };

  const currentRoundData = battleResult?.rounds[currentRound - 1];
  const isComplete = battleResult && currentRound >= battleResult.rounds.length;
  const progress = battleResult ? (currentRound / battleResult.rounds.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Arena de Batalha</h1>
        <p className="text-gray-600">
          {!battleStarted 
            ? 'Prepare-se para a batalha!' 
            : isComplete 
              ? 'Batalha finalizada!' 
              : `Round ${currentRound} de ${battleResult?.totalRounds || 0}`
          }
        </p>
      </div>

      {/* Progresso da Batalha */}
      {battleStarted && battleResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso da Batalha</span>
                <span>{currentRound}/{battleResult.totalRounds} rounds</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arena Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {battleStarted ? 'Batalha em Andamento' : 'Preparação para Batalha'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Monstro 1 */}
            <div className="space-y-4">
              <MonsterBattleCard 
                monster={currentMonster1} 
                color="blue"
                isAttacking={currentRoundData?.attacker.id === monster1.id}
                isDefending={currentRoundData?.defender.id === monster1.id}
              />
            </div>

            {/* Centro - VS e Ação */}
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-gray-400">VS</div>
              
              {currentRoundData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Round {currentRoundData.roundNumber}</div>
                  <div className="font-semibold">
                    {currentRoundData.attacker.name} atacou!
                  </div>
                  <div className="text-red-600 font-bold">
                    -{currentRoundData.damage} HP
                  </div>
                  {currentRoundData.isKillingBlow && (
                    <Badge variant="destructive" className="mt-2">
                      Golpe Fatal!
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Monstro 2 */}
            <div className="space-y-4">
              <MonsterBattleCard 
                monster={currentMonster2} 
                color="red"
                isAttacking={currentRoundData?.attacker.id === monster2.id}
                isDefending={currentRoundData?.defender.id === monster2.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex justify-center gap-3">
        {!battleStarted ? (
          <Button
            onClick={handleStartBattle}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Batalha
          </Button>
        ) : (
          <>
            {!isComplete && (
              <>
                {isPlaying ? (
                  <Button onClick={handlePause} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                ) : (
                  <Button onClick={handleResume} variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar
                  </Button>
                )}
                
                <Button onClick={handleSkipToEnd} variant="outline">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Pular para o Final
                </Button>
              </>
            )}
            
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova Batalha
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface MonsterBattleCardProps {
  monster: Monster;
  color: 'blue' | 'red';
  isAttacking?: boolean;
  isDefending?: boolean;
}

function MonsterBattleCard({ monster, color, isAttacking, isDefending }: MonsterBattleCardProps) {
  const power = calculateMonsterPower(monster);
  const isDefeated = monster.hp <= 0;
  const hpPercentage = (monster.hp / monster.maxHp) * 100;
  
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    red: 'border-red-200 bg-red-50'
  };

  const animationClass = isAttacking 
    ? 'animate-pulse ring-4 ring-yellow-400' 
    : isDefending 
      ? 'animate-bounce ring-4 ring-red-400' 
      : '';

  return (
    <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${colorClasses[color]} ${animationClass} ${isDefeated ? 'opacity-50 grayscale' : ''}`}>
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <img
            src={monster.imageUrl}
            alt={monster.name}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=?';
            }}
          />
          {isDefeated && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">K.O.</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-lg">{monster.name}</h4>
          <Badge variant="outline" className="text-xs">
            <Crown className="w-3 h-3 mr-1" />
            {power}
          </Badge>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-1">
          <Sword className="w-4 h-4 text-red-500" />
          <span className="font-semibold">{monster.attack}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-semibold">{monster.defense}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">{monster.speed}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Heart className={`w-4 h-4 ${isDefeated ? 'text-gray-400' : 'text-green-500'}`} />
          <span className="font-semibold">{monster.hp}/{monster.maxHp}</span>
        </div>
      </div>

      {/* Barra de HP Grande */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>HP</span>
          <span>{monster.hp}/{monster.maxHp}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              hpPercentage > 60
                ? 'bg-green-500'
                : hpPercentage > 30
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

