#!/bin/bash

echo "🔧 Initialisation du backend Fleet Management..."

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier que Prisma est configuré
if [ ! -f "dev.db" ]; then
    echo "🗄️ Configuration de la base de données..."
    npx prisma generate
    npx prisma migrate dev --name init
fi

echo "🚀 Démarrage du serveur..."
npm run dev