# 🚀 Deploy Rápido - VGames

## **Em 10 minutos:**

### **1. Render.com (Backend)**
```
1. Acesse render.com → New Web Service
2. Selecione repositório vghames
3. Root Directory: backend
4. Start Command: npm start
5. Environment:
   - Copie todo conteúdo do seu .env local (FIREBASE_*)
   - Adicione: CORS_ORIGIN=https://vghames.vercel.app
6. Deploy → Aguarde URL: https://vghames-backend.onrender.com
```

### **2. Vercel (Frontend)**
```
1. Acesse vercel.com → New Project
2. Selecione repositório vghames
3. Root Directory: frontend
4. Build Command: npm run build
5. Environment Variable:
   - VITE_BACKEND_URL=https://vghames-backend.onrender.com
6. Deploy → Aguarde URL: https://vghames.vercel.app
```

### **3. Testar**
```
1. Abra https://vghames.vercel.app em 2 abas
2. Crie conta na primeira aba
3. Faça login como outro usuário na segunda aba
4. Jogar → Criar Lobby → Iniciar Jogo
5. Abra a segunda aba e entre no lobby
6. Teste o jogo completo!
```

---

## **Status Atual** ✅

- ✅ Backend rodando em localhost:3001
- ✅ Frontend rodando em localhost:5173
- ✅ Adivinha Nota implementado e funcional
- ✅ Socket.io multiplayer funcionando
- ⏳ Aguardando deploy online

**Próximo passo:** Executar os 3 passos acima e confirmar que está funcionando!
