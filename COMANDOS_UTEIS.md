## 🛠️ Comandos Úteis

### 🚀 Desenvolvimento Local

```bash
# Terminal 1: Backend
cd backend
npm run dev          # Inicia servidor com auto-reload

# Terminal 2: Frontend
cd frontend
npm run dev          # Inicia Vite dev server
```

### 🏗️ Build para Produção

```bash
# Frontend
cd frontend
npm run build        # Gera pasta /dist (pronto para Vercel)

# Backend
npm start            # No Render, usa este comando
```

### 📦 Instalar Pacotes Novos

```bash
# Backend
cd backend
npm install nome-do-pacote

# Frontend
cd frontend
npm install nome-do-pacote
```

### 🔍 Debug

```bash
# Ver logs do Backend
# Terminal Backend mostra tudo

# Ver logs do Frontend (DevTools do Navegador)
Ctrl+Shift+I ou F12 → Console

# Testar API direto
curl http://localhost:3001/api/lobbys
curl http://localhost:3001/health
```

### 🧹 Limpeza

```bash
# Remover node_modules se der problema
cd backend && rm -r node_modules && npm install
cd frontend && rm -r node_modules && npm install

# Windows PowerShell
rm -r node_modules
npm install
```

---

## 📊 Estrutura Final do Projeto

```
VGames/
│
├── 📄 README.md                     # Guia principal
├── 📄 PASSO_A_PASSO.md              # Este arquivo
├── 📄 FIREBASE_SETUP.md             # Setup Firebase
├── 📄 COMANDOS_UTEIS.md             # Comandos
├── 📄 .gitignore
├── 🔧 setup.bat                     # Script setup (Windows)
├── 🔧 setup.sh                      # Script setup (MacOS/Linux)
│
├── 📁 backend/
│   ├── 📄 server.js                 # Servidor principal
│   ├── 📄 package.json              # Dependências
│   ├── 📄 .env                      # Variáveis de ambiente (NÃO commitar)
│   └── 📄 .env.example              # Exemplo do .env
│
└── 📁 frontend/
    ├── 📄 package.json              # Dependências
    ├── 📄 vite.config.js            # Config Vite
    ├── 📄 tailwind.config.js        # Config Tailwind CSS
    ├── 📄 postcss.config.js         # Config PostCSS
    ├── 📄 index.html                # HTML principal
    │
    └── 📁 src/
        ├── 📄 App.jsx               # Componente raiz
        ├── 📄 main.jsx              # Entry point React
        ├── 📄 index.css             # Estilos globais
        ├── 📄 firebase.js           # Init Firebase
        ├── 📄 config.js             # Configurações
        │
        └── 📁 components/
            ├── 📄 Login.jsx         # Tela de login
            ├── 📄 Profile.jsx       # Perfil do usuário
            ├── 📄 Lobby.jsx         # Salas de jogo
            └── 📄 Game.jsx          # Tela do jogo
```

---

## 🌍 Variáveis de Ambiente

### Backend (.env)
```
FIREBASE_PROJECT_ID=vghames-xyz
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@vghames-xyz.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
PORT=3001
NODE_ENV=development
```

### Frontend (src/config.js)
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "vghames-xyz.firebaseapp.com",
  projectId: "vghames-xyz",
  storageBucket: "vghames-xyz.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef..."
};

export const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'
  : 'https://seu-backend.onrender.com';
```

---

## 🔌 API Endpoints (Backend)

### REST API

```bash
# Healthcheck
GET http://localhost:3001/health

# Listar lobbys disponíveis
GET http://localhost:3001/api/lobbys

# Criar novo lobby
POST http://localhost:3001/api/lobbys
Body: {
  "userId": "uid-do-usuario",
  "gameName": "adivinha-nota"
}

# Exemplo com curl
curl -X POST http://localhost:3001/api/lobbys \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","gameName":"adivinha-nota"}'
```

### WebSocket Events (Socket.io)

**Cliente → Servidor:**
```javascript
// Entrar em um lobby
socket.emit('join-lobby', { 
  lobbyId: 'ABC123', 
  userId: 'user-uid' 
});

// Iniciar o jogo
socket.emit('start-game', { 
  lobbyId: 'ABC123', 
  userId: 'user-uid' 
});

// Enviar evento do jogo
socket.emit('game-event', { 
  lobbyId: 'ABC123', 
  event: 'guess', 
  payload: { answer: 'nota-dó' } 
});

// Sair do lobby
socket.emit('leave-lobby', { 
  userId: 'user-uid' 
});
```

**Servidor → Cliente (escuta):**
```javascript
// Lista de jogadores atualizada
socket.on('players-updated', (data) => {
  console.log('Jogadores:', data.players);
  console.log('Total:', data.count);
});

// Jogo iniciado
socket.on('game-started', (data) => {
  console.log('Jogo:', data.game);
});

// Evento do jogo
socket.on('game-event', (data) => {
  console.log('Evento:', data.event);
  console.log('Dados:', data.payload);
});

// Erro
socket.on('error', (data) => {
  console.error('Erro:', data.message);
});
```

---

## 📱 Fluxo de Uso

```
Login/Registro
     ↓
Perfil do Usuário
     ↓
Jogar
     ├→ Criar Novo Lobby → Códi ABCXYZ
     └→ Entrar em Lobby Existente
     ↓
Lobby (Sala de Espera)
     ├→ Esperando jogadores
     └→ Host clica "Iniciar Jogo"
     ↓
Jogo Em Progresso
     ├→ Adivinha Nota
     ├→ Wavelength
     ├→ The Chameleon
     └→ ITO
     ↓
Resultado/Placar
     ↓
Voltar ao Perfil
```

---

## 🚀 Dicas de Performance

1. **Frontend**: Use React DevTools (`npm install react-devtools`)
2. **Backend**: Logs em cores com Winston (`npm install winston`)
3. **Real-time**: Socket.io com Redis se escalar muito (`npm install redis`)
4. **Banco**: Indexar campos frequentemente usados no Firestore

---

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca commitar `.env` no Git

```bash
# .gitignore já tem isso, mas confirme:
node_modules/
.env
.env.local
```

✅ Sempre usar `.env.example` para documentar quais variáveis existem

---

## 📚 Links Úteis

- Firebase Console: https://console.firebase.google.com
- Firebase Docs: https://firebase.google.com/docs
- Socket.io Docs: https://socket.io/docs
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- React: https://react.dev

---

**Bom desenvolvimento! 🚀**
