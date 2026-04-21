# 🌌 FocusGrind.sys - Forgez votre Productivité

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-blue?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-green?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**FocusGrind** n'est pas une simple application de productivité. C'est votre interface vers la discipline ultime. Dans un univers Cyberpunk immersif, transformez chaque minute de concentration en points d'expérience, améliorez vos stats, et survivez au raid hebdomadaire du Kraken.

---

## 📸 Aperçu de l'Interface

<div align="center">
  <img src="public/images/logo.png" alt="FocusGrind Logo" width="200" />
  <br />
  <p><i>"Protocol_Focus_Active // GRID_V.2.0"</i></p>
</div>

<div align="center">
  <img src="public/images/timer.webp" alt="Timer Neon UI" width="300" style="border-radius: 20px; margin: 10px;" />
  <img src="public/images/stats.webp" alt="Stats Dashboard" width="300" style="border-radius: 20px; margin: 10px;" />
</div>

---

## 🛠️ Caractéristiques de l'Agent

### ⚔️ Gamification RPG Immersive
- **Système de Niveaux & XP** : Montez en grade à chaque session réussie.
- **Arbre de Talents** : Débloquez des compétences (Berserker, Discipline du Matin) pour optimiser vos gains.
- **Raid de Boss** : Un défi hebdomadaire où seule votre concentration peut vaincre le Kraken.
- **Boutique Cyber** : Achetez des boucliers de streak et des consommables rares avec vos Pomocoins.

### ⚡ Technologie de Pointe
- **Offline-First Excellence** : Grâce à **Dexie.js**, l'app fonctionne partout, même sans réseau.
- **Synchronisation Cloud Asynchrone** : Vos données sont sauvegardées sur **Supabase** dès que le réseau revient.
- **PWA (Progressive Web App)** : Installez FocusGrind sur votre mobile ou desktop comme une application native.
- **Design Cyberpunk** : Une UI OLED-black avec des effets de néon haute performance propulsés par **Framer Motion**.

---

## 🧬 Stack Technique

| Technologie | Usage |
| :--- | :--- |
| **Next.js 14** | Framework React avec App Router |
| **Supabase** | Authentification JWT & Base de données Cloud |
| **Dexie.js** | Persistance locale robuste (IndexedDB) |
| **Zustand** | Gestion d'état globale ultra-légère |
| **Framer Motion** | Animations fluides et micro-interactions |
| **Lucide Icons** | Iconographie minimaliste et technique |

---

## 🚀 Installation de la Grille

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/NguetchuissiBrunel/Pre_Hackverse_UBUNTU.git
   cd Pre_Hackverse_UBUNTU
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   ```

4. **Lancer le protocole de développement**
   ```bash
   npm run dev
   ```

---

## 🛡️ Architecture & Sécurité

L'application utilise un système de **Synchronisation à double sens** :
1. Les actions utilisateur sont immédiatement écrites en local (zéro latence).
2. Un service worker en arrière-plan tente de synchroniser les données avec Supabase.
3. En cas de conflit, les données locales sont prioritaires pour garantir l'expérience utilisateur.

---

## 👨‍💻 Développé par la Division FocusGrind

*"La distraction est une erreur système. Le Focus est le correctif."*

---
<p align="center">Made with ⚡ for the Hackverse Hackathon</p>
