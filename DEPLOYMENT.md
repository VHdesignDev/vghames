# 🚀 Guia de Deployment - VGames

## Opção Recomendada: **Vercel (Frontend) + Render (Backend)**
Ambos têm tier gratuito e são muito fáceis de usar.

---

## **PASSO 1: Deploy do Backend (Render.com)**

### 1.1 Criar conta
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub (recomendado)

### 1.2 Criar um novo Web Service
1. Clique em **"New +"** → **"Web Service"**
2. Selecione o repositório `vghames` (conecte GitHub se necessário)
3. Configure:
   - **Name**: `vghames-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Escolha "Free" (inclui 750 horas/mês)

### 1.3 Adicionar variáveis de ambiente
Na aba **"Environment"**, adicione:
```
FIREBASE_PROJECT_ID=vghames-275fb
FIREBASE_PRIVATE_KEY_ID=fc539429e5d82425274c928440e5e04872362bb1
FIREBASE_PRIVATE_KEY=(copie a chave privada do seu .env)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@vghames-275fb.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=100442332665528165258
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://vghames.vercel.app
```

### 1.4 Deploy
Clique em **"Create Web Service"** e aguarde (3-5 minutos).

**Resultado**: URL como `https://vghames-backend.onrender.com`

---

## **PASSO 2: Deploy do Frontend (Vercel)**

### 2.1 Criar conta
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub

### 2.2 Importar projeto
1. Clique em **"Add New"** → **"Project"**
2. Selecione repositório `vghames`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Adicionar variáveis de ambiente
Na aba **"Environment Variables"**, adicione:
```
VITE_BACKEND_URL=https://vghames-backend.onrender.com
```

### 2.4 Deploy
Clique em **"Deploy"** e aguarde (1-2 minutos).

**Resultado**: URL como `https://vghames.vercel.app`

---

## **PASSO 3: Atualizar CORS no Backend**

Depois que tiver a URL do frontend, edite `backend/server.js`:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vghames.vercel.app' // Atualize com sua URL
  ],
  credentials: true
};
```

Faça push e o Render fará deploy automaticamente.

---

## **PASSO 4: Testar Online** ✅

1. Abra `https://vghames.vercel.app` em duas abas
2. Crie uma conta em cada aba
3. Player 1: Jogar → Criar Lobby
4. Player 2: Jogar → Entrar no lobby
5. Player 1: Iniciar Jogo
6. Teste o jogo completo!

---

## **Troubleshooting**

### ❌ "Connection refused" ao entrar no lobby
- Certifique-se que `VITE_BACKEND_URL` está correto em Vercel
- Verificar se a URL do Render está `https://` e sem `/` no final

### ❌ Firebase não funciona online
- Verificar se as credenciais estão corretas no `.env` do Render
- Adicionar URL do Vercel aos domínios autorizados do Firebase:
  1. Console do Firebase → Projeto
  2. Autenticação → Domínios autorizados
  3. Adicione `vghames.vercel.app`

### ❌ Socket.io conexão instável
- Verificar se CORS está habilitado corretamente
- Render.com suporta WebSocket nativamente

---

## **Opções Alternativas**

### **Railway** (Mais caro, mas mais fácil)
- Deploy: `railway up`
- Suporta ambos frontend e backend
- Tier gratuito: $5/mês

### **Heroku** (Descontinuado para free tier)
- Não recomendado para novo uso

### **AWS/DigitalOcean**
- Mais configuração necessária
- Não recomendado para iniciantes

---

## **Checklist Final** ✅

- [ ] Repositório pushado no GitHub com todos os arquivos
- [ ] Backend deployado no Render
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Firebase autorizando domínios
- [ ] Ambos os servidores respondendo (verificar em `/api/lobbys`)
- [ ] Multiplayer testado com 2+ abas
- [ ] Jogo completo funciona online

---

## **Próximos Passos**

1. Implementar outros jogos (Wavelength, Chameleon, ITO)
2. Re-ativar Firestore persistence (remover comentários)
3. Adicionar ranking global
4. Implementar sistema de amigos
5. Notificações push

Boa sorte! 🎮
