<p align="center">
  <img src="./public/logo.png" alt="FocusGrind Logo" width="120" />
</p>

<h1 align="center">⚡ FOCUSGRIND</h1>
<h3 align="center">Solo Max Anti-Procrastination Engine</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-Cloud-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/PWA-Ready-7B4FEA?style=for-the-badge&logo=googlechrome" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 🧠 L'Idée Derrière le Projet

La productivité est ennuyeuse. Les applications de timer sont statiques. Les jeux vidéo sont addictifs.

**FocusGrind fusionne les deux.**

L'idée est simple mais puissante : transformer chaque minute de travail réel en **progression RPG**. Au lieu de cocher des cases dans une liste ToDo sans âme, vous **combattez des boss**, **montez en niveau**, **débloquez des talents** et **affrontez vos rivaux** dans un classement mondial — tout cela simplement en travaillant.

FocusGrind adopte les mécaniques psychologiques qui rendent les jeux vidéo addictifs (progression, récompenses, compétition sociale) et les applique à la productivité personnelle.

> **Mission** : Rendre le travail profond aussi engageant qu'un jeu de rôle.

---

## ✨ Plus-Value & Différenciation

| Fonctionnalité | FocusGrind | Applications classiques |
|---|---|---|
| Gamification RPG complète | ✅ | ❌ |
| Mode Offline-First | ✅ | Partiel |
| Boss hebdomadaire | ✅ | ❌ |
| Arbre de Talents | ✅ | ❌ |
| Classement social | ✅ | Rare |
| PWA installable | ✅ | Rare |
| Synchronisation Cloud | ✅ | Payant |
| Penalty Box anti-abandon | ✅ | ❌ |

---

## 🎮 Fonctionnalités en Détail

### ⏱️ Moteur de Timer Haute Précision
- **4 modes** : Pomodoro (20 min), Deep Work (90 min), Sprint (15 min), Flow (illimité)
- Timer basé sur des **timestamps absolus** pour une précision parfaite, même en arrière-plan
- **Synchronisation multi-onglets** via `BroadcastChannel` — lancez sur un écran, tout se met à jour en temps réel
- **Wake Lock API** pour empêcher l'écran de se mettre en veille pendant une session
- Notifications système à la fin de chaque session

### 🦑 Raid de Boss Hebdomadaire
- Chaque semaine, un nouveau **boss légendaire** apparaît (ex: le Kraken de la Procrastination)
- Chaque minute de focus inflige des **points de dégât** au boss
- Vainquez le boss avant dimanche minuit pour réclamer un **butin légendaire** (XP + Coins)
- La barre de vie du boss se met à jour en temps réel selon vos sessions

### 🌳 Arbre de Talents (3 Branches)
Dépensez vos **Points de Talent** (gagnés à chaque montée de niveau) pour débloquer des améliorations permanentes :

| Branche | Talents | Effets |
|---|---|---|
| 🔵 **Focus** | Endurant, Concentré, Ultra-Focus | +XP sur sessions longues, moins de pénalités |
| 🟠 **Discipline** | Matinal, Gardien, Rattrapage | Bonus XP le matin, protection de streak |
| 🔴 **Power** | Berserker, Pause Gratuite | ×2 XP en mode risque, pauses supplémentaires |

### 🏪 Marché & Inventaire
- **Boutique** : Achetez des consommables avec vos Pomocoins
  - 🛡️ Bouclier Streak : Sauve votre streak pendant 1 jour d'absence
  - ❄️ Gèle Streak : Protection manuelle d'un jour
  - 🔄 Reset Talents : Redistribue tous vos points de talent
  - ➕ Slot de Preset : Dépasse la limite de presets sauvegardés
- **Sac à Dos** : Gérez et utilisez vos objets achetés en temps réel

### 📊 Tableau de Bord & Statistiques
- **HeatMap** annuelle de vos sessions (inspirée de GitHub)
- Graphiques de distribution de l'XP et des Pomocoins
- Historique complet des sessions avec filtres par type
- Statistiques globales : temps total, streak, sessions accomplies

### 🏆 Classement Social (Mode En Ligne)
- Classement mondial des joueurs par XP
- **Rivaux IA** (NPC) pour simuler la compétition en mode hors-ligne
- Votre position en temps réel parmi les autres héros

### 🔐 Anti-Procrastination (Penalty Box)
- Trop d'abandons = **verrou temporaire** sur le timer
- Une phrase de confirmation obligatoire pour abandonner une session
- Système de comptage des abandons quotidiens

### 🌐 Mode Hybride (Offline-First + Cloud)
- **Dexie.js** (IndexedDB) pour un stockage local ultra-rapide
- **Supabase** pour la synchronisation Cloud et l'authentification
- Fonctionnement complet **sans connexion internet**
- Fusion intelligente des données lors de la reconnexion (priorité au score le plus élevé)

---

## 🛠️ Stack Technologique

```
📦 FocusGrind
├── 🖥️  Frontend
│   ├── Next.js 14 (App Router)
│   ├── TypeScript 5
│   ├── TailwindCSS (Design System Cyberpunk)
│   └── Framer Motion (Animations)
│
├── 🗃️  État & Stockage
│   ├── Zustand (State Management + BroadcastChannel sync)
│   ├── Dexie.js (IndexedDB - Base locale)
│   └── Dexie React Hooks (Live Queries)
│
├── ☁️  Cloud & Auth
│   ├── Supabase (PostgreSQL + Auth)
│   └── Row Level Security (RLS)
│
├── 🎵  Audio
│   └── Howler.js
│
└── 📱  PWA
    ├── @ducanh2912/next-pwa
    ├── Service Worker (Cache offline)
    └── Web App Manifest
```

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- Un projet [Supabase](https://supabase.com) (gratuit)

### 1. Cloner le projet
```bash
git clone https://github.com/NguetchuissiBrunel/Pre_Hackverse_UBUNTU.git
cd Pre_Hackverse_UBUNTU
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_public
```

### 3. Initialiser la base de données Supabase
Exécutez ce script dans l'éditeur SQL de votre projet Supabase :
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique, level int default 1, xp int default 0,
  coins int default 0, streak int default 0, talents text[] default '{}',
  title text default 'Recrue', updated_at timestamptz default now()
);
create table sessions (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade,
  date_start timestamptz, date_end timestamptz, duration int,
  type text, xp int, interrupted boolean, tag text
);
alter table profiles enable row level security;
alter table sessions enable row level security;
create policy "Profils publics" on profiles for select using (true);
create policy "Créer profil" on profiles for insert with check (auth.uid() = id);
create policy "Modifier profil" on profiles for update using (auth.uid() = id);
create policy "Sessions publiques" on sessions for select using (true);
create policy "Créer sessions" on sessions for insert with check (auth.uid() = user_id);
```

### 4. Lancer l'application
```bash
npm run dev      # Mode développement
npm run build    # Build de production
npm run start    # Serveur de production
```

---

## 📁 Structure du Projet

```
app/
├── page.tsx          # Dashboard principal (Timer + Raid Banner)
├── boss/             # Page Raid de Boss hebdomadaire
├── quests/           # Contrats & Quêtes journalières
├── shop/             # Arbre de Talents & Boutique
├── stats/            # Statistiques & Heatmap
├── leaderboard/      # Classement social mondial
├── profile/          # Gestion du compte
└── auth/             # Authentification Supabase

components/
├── TimerDisplay.tsx  # Timer circulaire avec contrôles
├── Navigation.tsx    # Barre de navigation PWA
└── PenaltyModal.tsx  # Modal anti-abandon

hooks/
├── useUser.ts        # Données & progression du joueur
├── useQuests.ts      # Logique des quêtes
├── useSync.ts        # Synchronisation Cloud
└── useInventory.ts   # Gestion de l'inventaire

lib/
├── store/            # Zustand stores (Timer, Sync)
├── db/dexie.ts       # Schéma de la base locale
├── gamification/     # Moteurs RPG (boss, niveaux, shop)
└── audio/            # Gestionnaire audio (Howler)
```

---

## 🎯 Comment Gagner des Points de Talent ?

Chaque **montée de niveau** vous octroie **1 Point de Talent**. Pour monter en niveau :
1. Lancez une session de focus
2. Complétez des quêtes journalières (Menu "Contrats")
3. Plus la session est longue, plus l'XP est importante

Dépensez vos points dans **Menu "Marché" → Arbre de Talents**.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

<p align="center">
  Fait avec ⚡ rage et ☕ café par <strong>NguetchuissiBrunel</strong> pour le Hackathon.
</p>
