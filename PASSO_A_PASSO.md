## 🎮 VGames - Passo a Passo Completo

### ✅ Checklist Inicial

- [ ] Node.js instalado (`node --version`)
- [ ] VS Code aberto
- [ ] Projeto clonado/baixado em `D:\VGhames`

---

## 📋 ETAPA 1: Preparar Firebase

**Tempo: ~5 minutos**

### Passo 1: Criar Projeto Firebase
```
1. Abra https://console.firebase.google.com
2. Clique "Add project"
3. Nome: vghames
4. Desabilite Google Analytics
5. Clique "Create project"
6. Aguarde 30 segundos...
```

### Passo 2: Ativar Auth (Email/Password)
```
1. Lado esquerdo: "Authentication"
2. "Get started"
3. Email/Password → Enable
4. Save
```

### Passo 3: Criar Firestore
```
1. Lado esquerdo: "Firestore Database"
2. "Create Database"
3. Localização: Europe-west1
4. Modo: "Start in test mode"
5. "Enable"
```

### Passo 4: Copiar Config do Frontend
```
1. Engrenagem (⚙️) → "Project Settings"
2. Aba "Your apps"
3. Clique em </> (Web)
4. Copie o firebaseConfig inteiro

Exemplo:
{
  "apiKey": "AIzaSyD...",
  "authDomain": "vghames-xyz.firebaseapp.com",
  "projectId": "vghames-xyz",
  ...
}
```

5. Abra arquivo: `D:\VGhames\frontend\src\config.js`
6. Replace os valores de `firebaseConfig` com os seus

### Passo 5: Gerar Private Key para Backend
```
1. Mesma aba "Project Settings"
2. Clique em "Service Accounts"
3. Clique "Generate New Private Key"
4. Será baixado um arquivo JSON
```

5. Abra `D:\VGhames\backend\.env`
6. Preencha com os valores do JSON:
   - `FIREBASE_PROJECT_ID` = `project_id`
   - `FIREBASE_PRIVATE_KEY_ID` = `private_key_id`
   - `FIREBASE_PRIVATE_KEY` = `private_key` (copie tudo, inclusive os `\n`)
   - `FIREBASE_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_CLIENT_ID` = `client_id`

```env
FIREBASE_PROJECT_ID=vghames-xyz
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@vghames-xyz.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
PORT=3001
NODE_ENV=development
```

✅ **Firebase pronto!**

---

## 💻 ETAPA 2: Instalar Dependências

**Tempo: ~2 minutos**

### Windows PowerShell (Recomendado)

Abra PowerShell em `D:\VGhames` e execute:

```powershell
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install
```

Ou execute o script automático:
```powershell
.\setup.bat
```

### MacOS/Linux

```bash
cd backend
npm install

cd ../frontend
npm install
```

✅ **Dependências instaladas!**

---

## 🚀 ETAPA 3: Rodar Localmente

**Tempo: 1 minuto**

Você precisa de **2 terminais abertos**:

### Terminal 1: Backend
```powershell
cd D:\VGhames\backend
npm run dev
```

Deve aparecer:
```
✅ Firebase Admin initialized
🚀 Backend rodando em http://localhost:3001
📊 Socket.io pronto para conexões
```

### Terminal 2: Frontend
```powershell
cd D:\VGhames\frontend
npm run dev
```

Deve aparecer:
```
VITE v5.0.0 ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Abrir no Navegador
```
http://localhost:5173
```

✅ **VGames rodando! 🎮**

---

## 🧪 ETAPA 4: Testar Funcionalidades

### 1️⃣ Registrar novo usuário
```
Email: teste@gmail.com
Senha: senha123
Username: Teste
→ Clique em "Registrar"
```

Se funcionar, aparece tela de perfil com avatar 👤

### 2️⃣ Testar Lobby
```
1. Clique "🎮 Jogar"
2. Escolha um jogo (ex: "Adivinha Nota")
3. Clique "Criar Lobby"
4. Deve aparecer o código da sala
```

### 3️⃣ Testar com 2 usuários
```
1. Abra outro navegador (ou anônimo)
2. http://localhost:5173
3. Registre outro usuário
4. Clique "Jogar"
5. Deve ver o lobby criado no outro navegador
6. Clique "Entrar"
7. Deve aparecer os 2 jogadores na sala
```

✅ **Tudo funcionando!**

---

## 🚨 Troubleshooting

### ❌ "Cannot find module 'firebase'"
```
Solução: cd frontend && npm install
```

### ❌ "CORS error"
```
Solução: Verificar se backend está rodando (Terminal 1)
         Verificar se frontend está em http://localhost:5173
```

### ❌ "Firebase Admin error"
```
Solução: Verificar arquivo backend/.env
         - Checar se FIREBASE_PROJECT_ID está correto
         - Checar se FIREBASE_PRIVATE_KEY tem os \n
```

### ❌ "Conexão recusada (localhost:3001)"
```
Solução: Backend não está rodando!
         Terminal 1: cd backend && npm run dev
```

---

## 📱 Próximos Passos

Uma vez que tudo está funcionando:

✅ **Fase 1 COMPLETA**: Auth + Perfis + Lobbys

📋 **Fase 2**: Implementar jogos
   - [ ] Adivinha Nota
   - [ ] Wavelength
   - [ ] The Chameleon
   - [ ] ITO

🌐 **Fase 3**: Deploy
   - [ ] Frontend em Vercel
   - [ ] Backend em Render

---

## 💬 Precisa de Ajuda?

Se algo não funcionar:

1. Ler o erro que aparece (é bem descritivo)
2. Verificar Troubleshooting acima
3. Verificar se Firebase Config está certo em `frontend/src/config.js`
4. Verificar se Backend .env está certo
5. Reiniciar os terminais

---

**Bem-vindo ao VGames! 🎮🚀**
