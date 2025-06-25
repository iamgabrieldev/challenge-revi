import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  Swords, 
  Trophy,
  Home,
  Sparkles
} from 'lucide-react';
import { MonsterProvider } from './contexts/MonsterContext';
import { MonsterForm } from './components/MonsterForm/MonsterForm';
import { MonsterList } from './components/MonsterList/MonsterList';
import { BattleSetup } from './components/BattleSetup/BattleSetup';
import { BattleArena } from './components/BattleArena/BattleArena';
import { BattleResult } from './components/BattleResult/BattleResult';
import { Monster, BattleResult as BattleResultType } from './types';
import './App.css';

type AppScreen = 
  | 'home'
  | 'monsters'
  | 'add-monster'
  | 'battle-setup'
  | 'battle-arena'
  | 'battle-result';

interface BattleData {
  monster1: Monster;
  monster2: Monster;
  result?: BattleResultType;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [battleData, setBattleData] = useState<BattleData | null>(null);

  const handleStartBattle = (monster1: Monster, monster2: Monster) => {
    setBattleData({ monster1, monster2 });
    setCurrentScreen('battle-arena');
  };

  const handleBattleComplete = (result: BattleResultType) => {
    setBattleData(prev => prev ? { ...prev, result } : null);
    setCurrentScreen('battle-result');
  };

  const handleNewBattle = () => {
    setBattleData(null);
    setCurrentScreen('battle-setup');
  };

  const handleBackToHome = () => {
    setBattleData(null);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      
      case 'monsters':
        return <MonsterList />;
      
      case 'add-monster':
        return (
          <MonsterForm 
            onSuccess={() => setCurrentScreen('monsters')}
            onCancel={() => setCurrentScreen('home')}
          />
        );
      
      case 'battle-setup':
        return <BattleSetup onStartBattle={handleStartBattle} />;
      
      case 'battle-arena':
        return battleData ? (
          <BattleArena
            monster1={battleData.monster1}
            monster2={battleData.monster2}
            onBattleComplete={handleBattleComplete}
            onReset={() => setCurrentScreen('battle-setup')}
          />
        ) : null;
      
      case 'battle-result':
        return battleData?.result ? (
          <BattleResult
            result={battleData.result}
            onNewBattle={handleNewBattle}
            onBackToHome={handleBackToHome}
          />
        ) : null;
      
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <MonsterProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setCurrentScreen('home')}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Monster Battle
                  </h1>
                  <p className="text-xs text-gray-500">Arena de Batalhas</p>
                </div>
              </div>

              {/* Navigation */}
              {currentScreen !== 'home' && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentScreen('home')}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Início
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {renderScreen()}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p className="text-sm">
              Desenvolvido com ❤️ para o Desafio Técnico Revi
            </p>
          </div>
        </footer>
      </div>
    </MonsterProvider>
  );
}

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
          Monster Battle Arena
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Crie monstros únicos, configure batalhas épicas e assista combates emocionantes 
          na arena mais avançada do mundo!
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <ActionCard
          icon={<Plus className="w-8 h-8" />}
          title="Criar Monstro"
          description="Cadastre novos monstros com estatísticas únicas"
          color="from-green-500 to-emerald-600"
          onClick={() => onNavigate('add-monster')}
        />
        
        <ActionCard
          icon={<Users className="w-8 h-8" />}
          title="Meus Monstros"
          description="Gerencie sua coleção de monstros"
          color="from-blue-500 to-cyan-600"
          onClick={() => onNavigate('monsters')}
        />
        
        <ActionCard
          icon={<Swords className="w-8 h-8" />}
          title="Iniciar Batalha"
          description="Configure e assista batalhas épicas"
          color="from-red-500 to-pink-600"
          onClick={() => onNavigate('battle-setup')}
        />
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Recursos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            title="Sistema de Batalha Avançado"
            description="Algoritmo complexo que considera velocidade, ataque, defesa e HP para determinar o vencedor"
          />
          
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-purple-500" />}
            title="Interface Moderna"
            description="Design responsivo e intuitivo com animações suaves e feedback visual"
          />
          
          <FeatureCard
            icon={<Users className="w-6 h-6 text-blue-500" />}
            title="Gerenciamento Completo"
            description="Cadastre, edite e organize seus monstros com facilidade"
          />
          
          <FeatureCard
            icon={<Swords className="w-6 h-6 text-red-500" />}
            title="Batalhas Visualizadas"
            description="Assista as batalhas round por round com estatísticas detalhadas"
          />
        </div>
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

function ActionCard({ icon, title, description, color, onClick }: ActionCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 hover:border-gray-300"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-full text-white`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;

