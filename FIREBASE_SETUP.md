# 🔥 Guia de Setup Firebase

## Passo 1: Criar Projeto Firebase

1. Acesse https://console.firebase.google.com
2. Clique em "Add project" ou "Criar novo projeto"
3. Digite o nome: `vghames`
4. Clique em "Continue"
5. Desabilite "Enable Google Analytics" (não precisa)
6. Clique em "Create project"
7. Aguarde alguns segundos até o projeto ser criado

## Passo 2: Configurar Authentication (Firebase Auth)

1. No console, vá em **Authentication** → **Get started**
2. Clique em **Email/Password**
3. Habilite **Email/Password**
4. Clique em **Save**

✅ **Auth configurado!**

## Passo 3: Criar Firestore Database

1. Vá em **Firestore Database** → **Create database**
2. Escolha localização: `europe-west1` ou a mais próxima
3. Modo de segurança: **Start in test mode**
4. Clique em **Enable**
5. Aguarde criação...

✅ **Firestore criado!**

## Passo 4: Copiar Credenciais do Frontend

1. Vá em **Project Settings** (ícone de engrenagem)
2. Abra a aba **Your apps**
3. Clique em **</>** (Web)
4. Copie o objeto `firebaseConfig`

Exemplo (SEUS VALORES SERÃO DIFERENTES):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vghames-12345.firebaseapp.com",
  projectId: "vghames-12345",
  storageBucket: "vghames-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

5. Abra `frontend/src/config.js` e substitua pelos seus valores

## Passo 5: Copiar Credenciais do Backend

1. **Project Settings** → Aba **Service Accounts**
2. Clique em **Generate New Private Key**
3. Será feito download de um arquivo JSON com algo assim:

```json
{
  "type": "service_account",
  "project_id": "vghames-12345",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...",
  "client_email": "firebase-adminsdk-abc@vghames-12345.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

4. Abra `backend/.env` e preencha:
```
FIREBASE_PROJECT_ID=vghames-12345
FIREBASE_PRIVATE_KEY_ID=abc123def456...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@vghames-12345.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
```

⚠️ **IMPORTANTE**: `FIREBASE_PRIVATE_KEY` tem quebras de linha (`\n`). Deixe como está no arquivo JSON.

## Passo 6: Verificar no Console

1. Vá em **Firestore Database**
2. Deve estar vazio (normal)
3. Quando você registrar um usuário, aparecerá uma collection `users`

✅ **Tudo pronto!**

---

## ❓ Dúvidas Comuns

**P: Onde pego o apiKey?**  
R: Project Settings → Your apps → Copiar firebaseConfig

**P: Qual é a diferença entre Frontend Config e Backend .env?**  
R: Frontend usa `apiKey` (público), Backend usa `privateKey` (seguro no servidor)

**P: Posso deixar a Private Key em um arquivo?**  
R: NÃO! Use variáveis de ambiente ou `.env` (nunca commitar)

**P: E se perder minha Private Key?**  
R: Gera outra em Service Accounts → Generate New Private Key

---

Quando terminar, volta aqui e avisa! 🚀
