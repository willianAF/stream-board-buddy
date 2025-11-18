# Stream Board Buddy

Stream Board Buddy fornece uma interface simples em React para se comunicar com o StreamerBot local, reduzindo o trabalho manual do streamer ao permitir gerenciar mensagens e a fila de players através de uma UI leve.

## Visão geral
- Objetivo: simplificar interações com o StreamerBot (que roda localmente na máquina do streamer) por meio de operações como criar/editar/excluir mensagens e gerenciar a fila de players.
- Frontend: React + TypeScript.
- Dev server: Vite (rodando em localhost). Veja a configuração em [`vite.config.ts`](vite.config.ts).
- Conexão com StreamerBot: o hook [`useStreamerBotClient`](src/hooks/useStreamerBotClient.ts) encapsula conexão, chamadas (create/update/delete) e eventos do StreamerBot.

## Funcionalidades
- Listagem e edição de mensagens (pág. [`Messages`](src/pages/Messages.tsx)).
- Gerenciamento de fila de players (pág. [`Vagas`](src/pages/Vagas.tsx)) com adição/remoção via diálogos ([`AddPlayerDialog`](src/components/AddPlayerDialog.tsx)).
- Notificações/toasts integrados (UI de toasts e sonner).
- Sidebar de navegação ([`Sidebar`](src/components/Sidebar.tsx)).

## Como rodar localmente
1. Instalar dependências:
```sh
npm install
```

2. Rodar servidor de desenvolvimento (Vite):
```sh
npm run dev
```

O frontend ficará disponível em http://localhost:5174 (conforme vite.config.ts).

## Requisitos

- StreamerBot deve estar rodando localmente no PC do streamer (o projeto assume comunicação via cliente configurado em useStreamerBotClient).
- Node.js e npm instalados.
