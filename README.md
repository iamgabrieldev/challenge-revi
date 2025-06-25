# Monster Battle Arena 🎮

Uma aplicação web moderna para batalhas de monstros desenvolvida em React com TypeScript, criada como parte do desafio técnico da Revi.

## 📋 Sobre o Projeto

Monster Battle Arena é uma aplicação completa que permite aos usuários criar monstros únicos com diferentes estatísticas e fazê-los batalhar em uma arena virtual. O projeto implementa um algoritmo sofisticado de batalha que considera múltiplos fatores como velocidade, ataque, defesa e pontos de vida para determinar o vencedor.

### 🎯 Funcionalidades Principais

- **Cadastro de Monstros**: Sistema completo para criar monstros com estatísticas personalizadas
- **Gerenciamento de Coleção**: Interface intuitiva para visualizar e gerenciar seus monstros
- **Sistema de Batalha**: Algoritmo avançado que simula combates realistas
- **Visualização de Batalhas**: Acompanhe as batalhas round por round em tempo real
- **Persistência Local**: Dados salvos automaticamente no navegador
- **Interface Responsiva**: Design moderno que funciona em desktop e mobile

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (recomendado) ou npm

### Instalação

1. **Clone o repositório**

   ```bash
   git clone git@github.com:iamgabrieldev/challenge-revi.git
   cd monster-battle
   ```
2. **Instale as dependências**

   ```bash
   pnpm install
   # ou
   npm install
   ```
3. **Execute o servidor de desenvolvimento**

   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```
4. **Acesse a aplicação**

   Abra seu navegador e acesse: `http://localhost:5173`

### Scripts Disponíveis

- `pnpm run dev` - Inicia o servidor de desenvolvimento
- `pnpm run build` - Gera a build de produção
- `pnpm run preview` - Visualiza a build de produção localmente
- `pnpm run lint` - Executa o linter para verificar o código

## 🎮 Como Usar

### 1. Criando Monstros

1. Na tela inicial, clique em **"Criar Monstro"**
2. Preencha as informações do monstro:
   - **Nome**: Identificação única do monstro
   - **Ataque**: Poder ofensivo (1-200)
   - **Defesa**: Capacidade defensiva (1-200)
   - **Velocidade**: Determina ordem de ataque (1-200)
   - **HP**: Pontos de vida (1-1000)
   - **URL da Imagem**: Link para imagem do monstro
3. Clique em **"Criar Monstro"** para salvar

### 2. Gerenciando Monstros

- Acesse **"Meus Monstros"** para ver sua coleção
- Use o botão **"Curar"** para restaurar HP de monstros feridos
- Use o botão **"Excluir"** para remover monstros (com confirmação)

### 3. Iniciando Batalhas

1. Clique em **"Iniciar Batalha"**
2. Selecione dois monstros diferentes da sua coleção
3. Clique em **"Iniciar Batalha!"** para começar o combate
4. Acompanhe a batalha em tempo real
5. Veja o resultado detalhado com estatísticas completas

## ⚔️ Algoritmo de Batalha

O sistema de batalha segue regras específicas para garantir combates equilibrados e estratégicos:

### Ordem de Ataque

1. **Velocidade**: O monstro com maior velocidade ataca primeiro
2. **Empate**: Se as velocidades forem iguais, o monstro com maior ataque vai primeiro

### Cálculo de Dano

```
Dano = Ataque do Atacante - Defesa do Defensor
Dano Mínimo = 1 (sempre causa pelo menos 1 de dano)
```

### Aplicação de Dano

```
HP Atual = HP Atual - Dano Calculado
```

### Condição de Vitória

- A batalha continua em rounds alternados
- O primeiro monstro a ter seu HP reduzido a zero perde
- O monstro sobrevivente é declarado vencedor

### Exemplo de Batalha

**Monstro A**: Dragão de Fogo (ATK: 85, DEF: 60, SPD: 70, HP: 120)
**Monstro B**: Lobo Sombrio (ATK: 75, DEF: 45, SPD: 95, HP: 80)

1. **Round 1**: Lobo Sombrio ataca primeiro (SPD 95 > 70)

   - Dano: 75 - 60 = 15
   - HP do Dragão: 120 → 105
2. **Round 2**: Dragão de Fogo contra-ataca

   - Dano: 85 - 45 = 40
   - HP do Lobo: 80 → 40
3. **Batalha continua** até um dos monstros ser derrotado...

## 🏗️ Arquitetura Técnica

### Tecnologias Utilizadas

- **React 19** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática e melhor experiência de desenvolvimento
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface pré-construídos
- **Lucide React** - Ícones modernos e consistentes
- **Context API** - Gerenciamento de estado global
- **LocalStorage** - Persistência de dados local

### Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── common/          # Componentes reutilizáveis
│   ├── MonsterForm/     # Formulário de cadastro
│   ├── MonsterList/     # Listagem de monstros
│   ├── BattleSetup/     # Configuração de batalha
│   ├── BattleArena/     # Arena de batalha
│   ├── BattleResult/    # Resultado da batalha
│   └── ui/              # Componentes shadcn/ui
├── contexts/            # Contextos React
│   └── MonsterContext.tsx
├── types/               # Definições TypeScript
│   └── index.ts
├── utils/               # Funções utilitárias
│   ├── battleUtils.ts   # Lógica de batalha
│   └── monsterUtils.ts  # Utilitários de monstros
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── App.css             # Estilos globais
```

### Padrões de Design

- **Component-Based Architecture**: Componentes modulares e reutilizáveis
- **Context Pattern**: Gerenciamento de estado centralizado
- **Custom Hooks**: Lógica reutilizável encapsulada
- **TypeScript First**: Tipagem forte em todo o projeto
- **Responsive Design**: Interface adaptável a diferentes telas

## 🎨 Design e UX

### Princípios de Design

- **Hierarquia Visual**: Uso de tamanhos, cores e espaçamento para guiar o usuário
- **Consistência**: Padrões visuais uniformes em toda a aplicação
- **Feedback Visual**: Animações e estados que informam sobre ações
- **Acessibilidade**: Contraste adequado e navegação por teclado

### Paleta de Cores

- **Primária**: Gradiente azul-roxo para elementos principais
- **Secundária**: Verde para ações positivas, vermelho para ações destrutivas
- **Neutra**: Tons de cinza para texto e backgrounds
- **Destaque**: Amarelo/dourado para elementos de vitória

### Componentes de Interface

- **Cards**: Containers elegantes para monstros e informações
- **Botões**: Estados hover, loading e disabled bem definidos
- **Formulários**: Validação em tempo real com feedback visual
- **Barras de Progresso**: Visualização clara de HP e progresso de batalha

## 📊 Funcionalidades Avançadas

### Sistema de Validação

- Validação em tempo real nos formulários
- Mensagens de erro contextuais
- Prevenção de dados inválidos

### Persistência de Dados

- Salvamento automático no LocalStorage
- Carregamento de dados na inicialização
- Monstros de exemplo para novos usuários

### Gerenciamento de Estado

- Context API para estado global
- useReducer para lógica complexa
- Estados locais para componentes específicos

### Responsividade

- Design mobile-first
- Grid system flexível
- Componentes adaptativos

## 🧪 Testes e Qualidade

### Práticas de Código

- **TypeScript**: Tipagem forte previne erros em runtime
- **ESLint**: Linting automático para consistência
- **Prettier**: Formatação automática de código
- **Component Isolation**: Componentes independentes e testáveis

### Validação Manual

- Testes de funcionalidade em diferentes navegadores
- Verificação de responsividade em múltiplos dispositivos
- Validação de fluxos de usuário completos

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- **Sistema de Níveis**: Monstros ganham experiência e evoluem
- **Tipos de Monstros**: Sistema de vantagens/desvantagens
- **Torneios**: Competições com múltiplos monstros
- **Histórico de Batalhas**: Registro permanente de combates
- **Multiplayer**: Batalhas entre diferentes usuários
- **Animações Avançadas**: Efeitos visuais durante as batalhas

### Melhorias Técnicas

- **Testes Automatizados**: Jest + Testing Library
- **PWA**: Funcionalidade offline
- **Backend**: API para sincronização de dados
- **Performance**: Lazy loading e otimizações
- **Acessibilidade**: Conformidade com WCAG 2.1

## 👥 Contribuição

Este projeto foi desenvolvido como parte do desafio técnico da Revi. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de avaliação técnica.

## 🙏 Agradecimentos

- **Revi** pela oportunidade do desafio técnico
- **Comunidade React** pelas ferramentas e bibliotecas
- **shadcn/ui** pelos componentes de interface elegantes
- **Unsplash** pelas imagens de exemplo utilizadas

---

**Desenvolvido com ❤️ para o Desafio Técnico Revi**

*Demonstrando habilidades em React, TypeScript, Design de Interface e Arquitetura de Software*
