# 🚀 HORIZON-4 Mission Control — App Cross-Platform

**Disciplina:** Cross-Platform Application Development  
**Curso:** Ciência da Computação — 2º Ano | FIAP  
**Entrega:** Global Solution GS2026.1

---

## Integrantes

| Nome | RM |
|------|----|
| Bruno Soares Sanntanna | RM562235 |
| Enzo Yokura Araujo | RM564177 |
| Marco Antonio Ferreira Fonseca | RM566434 |

---

## Sobre o Projeto

Aplicativo mobile desenvolvido em **React Native + Expo** que simula uma **central de monitoramento de missões espaciais**. O app exibe dados de telemetria em tempo real, gera alertas automáticos, permite o registro de eventos e persiste as configurações localmente.

---

## Funcionalidades Implementadas

| Requisito | Implementado |
|-----------|-------------|
| Dashboard com sensores, energia, comunicação | ✅ `app/index.tsx` |
| Alertas automáticos em nível crítico | ✅ `MissaoContext.tsx` |
| Formulário com validação de campos | ✅ `app/formulario.tsx` |
| Navegação entre telas — Expo Router | ✅ `app/_layout.tsx` |
| Persistência local — AsyncStorage | ✅ `MissaoContext.tsx` |
| Gerenciamento de estado global — Context API | ✅ `src/context/MissaoContext.tsx` |

---

## Estrutura de Pastas

```
HORIZON-4-mobile/
├── app/                        # Rotas do Expo Router
│   ├── _layout.tsx             # Layout raiz + MissaoProvider + TabNavigator
│   ├── index.tsx               # Tela: Dashboard (sensores em tempo real)
│   ├── alertas.tsx             # Tela: Alertas ativos e histórico
│   ├── formulario.tsx          # Tela: Registro de eventos com validação
│   └── configuracoes.tsx       # Tela: Configurações persistidas
│
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── SensorCard.tsx      # Card de sensor individual
│   │   ├── AlertaBanner.tsx    # Banner de alerta com botão resolver
│   │   └── index.ts            # Barrel export
│   │
│   ├── context/
│   │   └── MissaoContext.tsx   # Context API + AsyncStorage + telemetria
│   │
│   ├── interfaces/             # Contratos de dados (usados em vários lugares)
│   │   ├── sensor.ts           # Interface Sensor
│   │   └── missao.ts           # Interfaces Missao, Alerta, ConfiguracaoMissao
│   │
│   ├── types/                  # Union types simples
│   │   ├── statusSensor.ts     # "nominal" | "alerta" | "critico" | "offline"
│   │   └── tipoAlerta.ts       # Tipos de alerta possíveis
│   │
│   └── utils/
│       ├── tema.ts             # Design tokens (cores do HORIZON-4)
│       └── formatadores.ts     # Funções puras reutilizáveis
│
├── assets/                     # Ícones e imagens
├── app.json                    # Configuração Expo
├── package.json
└── tsconfig.json
```

---

##  Como Executar
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start
```

---

##  Conceitos Aplicados

- **Context API** — estado compartilhado entre as 4 telas sem prop drilling
- **AsyncStorage** — missão e configurações persistem entre sessões
- **Expo Router** — roteamento por arquivos (file-based routing)
- **TypeScript** — interfaces, union types, tipagem de props e estado
- **Componentização** — `SensorCard` e `AlertaBanner` reutilizáveis
- **Alertas automáticos** — gerados pelo Context quando sensores ultrapassam limites
- **Validação de formulário** — campos obrigatórios, formato de data, limite de caracteres

---