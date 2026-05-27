@echo off
REM Script para instalar dependências e rodar o projeto localmente (Windows)

echo 🚀 VGames Setup
echo ===============
echo.

REM Instalar backend
echo 📦 Instalando dependências do Backend...
cd backend
call npm install
echo ✅ Backend pronto!
echo.

REM Instalar frontend
echo 📦 Instalando dependências do Frontend...
cd ..\frontend
call npm install
echo ✅ Frontend pronto!
echo.

REM Adicionar Tailwind ao frontend
echo 🎨 Adicionando Tailwind CSS...
call npm install -D tailwindcss postcss autoprefixer
echo ✅ Tailwind configurado!
echo.

echo 🎉 Setup completo!
echo.
echo Para rodar localmente:
echo 1. Terminal 1: cd backend ^&^& npm run dev
echo 2. Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Abra http://localhost:5173 no navegador
