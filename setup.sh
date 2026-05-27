#!/bin/bash
# Script para instalar dependências e rodar o projeto localmente

echo "🚀 VGames Setup"
echo "==============="
echo ""

# Instalar backend
echo "📦 Instalando dependências do Backend..."
cd backend
npm install
echo "✅ Backend pronto!"
echo ""

# Instalar frontend
echo "📦 Instalando dependências do Frontend..."
cd ../frontend
npm install
echo "✅ Frontend pronto!"
echo ""

# Adicionar Tailwind ao frontend
echo "🎨 Adicionando Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
echo "✅ Tailwind configurado!"
echo ""

echo "🎉 Setup completo!"
echo ""
echo "Para rodar localmente:"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Abra http://localhost:5173 no navegador"
