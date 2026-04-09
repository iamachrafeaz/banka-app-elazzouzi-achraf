# BankaApp : Simulation de Gestion Bancaire

## Contexte & Mise en Situation

**BankaApp** est une application mobile de simulation bancaire. Elle permet à un utilisateur de consulter plusieurs comptes bancaires, d’effectuer des opérations de **débit**, de **crédit** et de **virement** entre comptes, avec rejet automatique si le solde est insuffisant.

Toutes les données sont gérées **en mémoire** (pas de backend, pas de base de données). L’objectif pédagogique est de maîtriser les fondamentaux de React Native : composants natifs, `useState`, navigation Stack + Tabs, et gestion de règles métier simples.

## Structure du Projet

```
banka-app-elazzouzi-achraf/
├── App.js                          ← Point d'entrée + navigation
├── src/
│   ├── data/
│   │   └── accounts.js             ← Données initiales des 3 comptes
│   ├── screens/
│   │   ├── DashboardScreen.js      ← Liste des comptes + soldes
│   │   ├── AccountDetailScreen.js  ← Détail d'un compte + opérations
│   │   ├── TransferScreen.js       ← Formulaire de virement
│   │   └── HistoryScreen.js        ← Historique de toutes les opérations
│   ├── components/
│   │   ├── AccountCard.js          ← Carte de compte réutilisable
│   │   └── TransactionItem.js      ← Ligne d'historique réutilisable
│   └── theme/
│       └── colors.js               ← Constantes de couleurs
└── assets/
```

## Installation 

```bash
# Installer Expo CLI (une seule fois)
npm install -g expo-cli

# Cloner le project 
git clone https://github.com/iamachrafeaz/banka-app-elazzouzi-achraf

# Entrer dans le dossier
cd banka-app-elazzouzi-achraf

# Installer React Navigation
npm install

# Lancer le serveur de développement
npx expo start
```

## Screenshots

![](./screenshots/Frame%2059.png)