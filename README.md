# 🎮 VGames - Jogos com Amigos
    
Plataforma para jogar jogos em tempo real com amigos online.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- Conta Firebase (https://firebase.google.com)

### 1️⃣ Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto (qualquer nome)
3. Ative **Authentication** (Email/Password)
4. Crie um banco de dados **Firestore**
5. Na aba "Project Settings", copie as credenciais

#### Frontend - Configurar `frontend/src/config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "SEU_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

#### Backend - Configurar `backend/.env`:
1. Em Firebase → Project Settings → Service Accounts → Generate new private key
2. Copie as credenciais para `backend/.env`:
```
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
PORT=3001
```

### 2️⃣ Instalar dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3️⃣ Rodar localmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Deve mostrar: `🚀 Backend rodando em http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Deve mostrar: `VITE v5.0.0 ready in ... ms`

Abra **http://localhost:5173** no navegador.

---

## 📁 Estrutura do Projeto

```
VGames/
├── backend/                    # Node.js + Express + Socket.io
│   ├── server.js              # Servidor principal
│   ├── package.json
│   ├── .env                   # Credenciais Firebase (não commitar)
│   └── .env.example           # Exemplo de .env
│
└── frontend/                   # React + Vite
    ├── src/
    │   ├── App.jsx            # Componente principal
    │   ├── firebase.js        # Inicializar Firebase
    │   ├── config.js          # Variáveis de configuração
    │   ├── components/
    │   │   ├── Login.jsx      # Tela de login/registro
    │   │   ├── Profile.jsx    # Perfil do usuário
    │   │   ├── Lobby.jsx      # Salas de espera
    │   │   └── Game.jsx       # Tela do jogo
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🎮 Funcionalidades Implementadas

✅ **Autenticação** - Login/Registro com Firebase Auth  
✅ **Perfil de Usuário** - Nome, email, avatar  
✅ **Sistema de Lobbys** - Criar/Entrar salas de jogo  
✅ **Socket.io Real-time** - Conexão em tempo real entre jogadores  
✅ **Interface Bonita** - UI com Tailwind CSS  

---

## 🎯 Próximas Etapas

### Fase 2 - Adicionar Jogos
- [ ] Adivinha Nota (identificar música por nota musical)
- [ ] Wavelength (adivinhar palavra na onda)
- [ ] The Chameleon (encontrar o camaleão)
- [ ] ITO (pensar em números)

### Fase 3 - Melhorias
- [ ] Sistema de amigos
- [ ] Chat in-game
- [ ] Ranking de vitórias
- [ ] Convites personalizados

---

## 🌐 Deploy

### Deploy Frontend (Vercel)
```bash
cd frontend
npm run build
# Fazer upload em https://vercel.com
```

### Deploy Backend (Render)
1. Acesse https://render.com
2. Conecte seu GitHub
3. Crie um novo "Web Service"
4. Configure as variáveis de ambiente (mesmo do `.env`)
5. Start command: `npm start`

---

## 🔧 Troubleshooting

**Firebase não inicializa**
- Verificar `frontend/src/config.js` tem todas as chaves
- Firestore precisa estar criado em Firebase

**Socket.io não conecta**
- Backend deve estar rodando em `http://localhost:3001`
- Frontend deve estar em `http://localhost:5173`

**Erro de CORS**
- Verificar `backend/server.js` - CORS configurado para `localhost:5173`

---

## 📞 Suporte

Qualquer dúvida, é só chamar! 🚀
