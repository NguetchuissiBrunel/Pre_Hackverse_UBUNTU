# Cahier des Charges — FocusGrind : App Anti-Procrastination Solo Max

**Version** : 1.0  
**Date** : Avril 2025  
**Statut** : Spécifications complètes — prêt pour développement  
**Paradigme** : 100% solo — zéro IA, zéro social, zéro invitation d'amis

---

## Table des matières

1. [Vision & Concept](#1-vision--concept)
2. [Roadmap de développement](#2-roadmap-de-développement)
3. [Spécifications fonctionnelles](#3-spécifications-fonctionnelles)
4. [Spécifications PWA](#4-spécifications-pwa)
5. [Spécifications de données](#5-spécifications-de-données)
6. [Stack technique](#6-stack-technique)
7. [Spécifications non-fonctionnelles](#7-spécifications-non-fonctionnelles)

---

## 1. Vision & Concept

### Philosophie

**Toi vs Toi-même.** Zéro IA, zéro ami, zéro excuse. L'utilisateur grinde ses statistiques et débloque des récompenses comme dans un jeu solo. Chaque action produit un feedback immédiat (son + vibration + animation) pour créer une boucle dopaminergique ancrée dans le travail réel.

> **Secret de l'addiction** : Les gens deviennent accros au feedback, pas au travail. Chaque start → son + vibration + pulse d'écran. Chaque fin → confettis + son épique + XP animé. Chaque niveau up → plein écran + nouveau titre.

### Périmètre

- Application web progressive (PWA) installable sur Android, iOS, desktop
- Extension navigateur optionnelle pour le blocage de sites
- 100% offline-first — IndexedDB comme source de vérité
- Sync cloud optionnelle via Supabase (non bloquante)
- Aucune collecte de données distante en mode local

---

## 2. Roadmap de développement

### Semaine 1 — V1 : Core Timer God-Tier (✅ TERMINÉ)

Objectif : timer parfait + sons + statistiques + PWA installable. Base utilisable H24.

- [x] Moteur de timer multi-modes
- [x] Bibliothèque de sons offline
- [x] Tableau de bord statistiques complet
- [x] PWA installable avec mode offline total

### Semaine 2 — V2 : Gamification Solo Addictive (✅ TERMINÉ)

Objectif : transformer l'app en jeu. L'utilisateur farme IRL.

- [x] Système XP & Niveaux
- [x] Arbre de talents (3 branches)
- [x] Streak de feu avec multiplicateurs
- [x] Quêtes quotidiennes et hebdomadaires
- [x] Boss hebdomadaire (Le Kraken)
- [x] Boutique (skins, consommables)

### Semaine 3 — V3 : Outils de Productivité Hardcore (EN COURS)

Objectif : cockpit de pilote de chasse.

- [x] Mode Coffre-fort (friction maximale à l'abandon : 20 mots)
- [ ] Extension navigateur (liste noire de sites)
- [x] Penalty Box (blocage en cas d'abandon répété)
- [ ] Time blocking sur grille horaire
- [ ] Routines prédéfinies
- [x] Terminal de Tâches intégré au timer
- [ ] Bilans hebdomadaires automatiques
- [ ] Export CSV / JSON / PDF

### Semaine 4 — Polish & Juice (EN COURS)

Objectif : game feel x10 dopamine.

- [x] Animations Framer Motion sur toutes les transitions
- [x] Mixeur d'Atmosphères (Pluie, Feu, Café) intégré au timer
- [x] Consolidation de l'onglet unique "Objectifs"
- [ ] Sons UI sur chaque micro-interaction (partiel)
- [ ] Haptic feedback (mobile)
- [x] Thèmes visuels (Default & Cyberpunk)
- [ ] 20 sons de victoire
- [ ] Fonds animés débloquables

---

## 3. Spécifications fonctionnelles

### 3.1 Module Timer

#### Modes de session

| Mode | Durée travail | Durée pause | Notes |
|------|--------------|-------------|-------|
| Pomodoro | 25 min | 5 min | Mode par défaut |
| Deep Work | 90 min | 20 min | +XP bonus |
| Sprint | 15 min | 3 min | Mode rapide |
| Flow | Infini | — | Pas de pause forcée |
| Custom | 1–180 min | 1–60 min | Sauvegarde les 5 derniers |

#### Contrôles

- **Start** — démarre le timer avec son + vibration + animation pulse
- **Pause** — maximum 3 pauses par session (au-delà : pénalité XP)
- **Reset** — remet à zéro avec confirmation
- **Skip pause** — passe directement à la session de travail
- **+5 min** — ajoute 5 minutes au timer en cours

#### Détection d'inactivité

- `Page Visibility API` : onglet caché > 10 secondes → pause automatique
- `Accelerometer` : téléphone retourné ou écran verrouillé → pause automatique
- Mode **"Confiance"** : désactive toutes les détections (opt-in)

#### Focus Mode

- Plein écran forcé
- `Wake Lock API` actif (empêche la veille)
- Désactive le pull-to-refresh
- Bloque le bouton retour navigateur
- **Sortie** : confirmation par saisie d'une phrase de 20 mots minimum

#### Audio

- Lecteur multi-pistes : 1 bruit de fond + 1 musique simultanément
- Fondu (fade) de 2 secondes entre les pistes
- Volume séparé par piste
- Fichiers MP3/OGG pré-cachés pour usage offline
- Maximum 2 pistes simultanées

**Bibliothèque de sons (offline) :** Pluie, Feu de camp, Café ambiant, Bruit blanc, Lo-fi

**Sons de victoire (déblocables) :** Mario coin, Wilhelm scream, FUS RO DAH, Sabre laser, Gong, Applaudissements

#### Notifications système

- Fin de session → notif + actions : "Lancer pause" / "+5 min" / "Stop"
- Fin de pause → notif + actions : "Reprendre" / "Stop"
- Fonctionne application fermée via Service Worker
- Requiert permission explicite de l'utilisateur

#### Presets de sessions

- Enchaînement enregistrable : ex. `Matin = 25T + 5P + 50T + 10P`
- Lancement en 1 clic
- Maximum 10 presets stockés en IndexedDB

---

### 3.2 Module Sessions & Tags

#### Enregistrement automatique

Chaque session terminée enregistre :

```
id, dateStart, dateEnd, durée réelle, type, tag, XP gagné, interrompue (bool)
```

> Sessions < 60 secondes : non enregistrées.

#### Tags projet

- Champ libre saisi au démarrage
- Autocomplétion sur les tags existants
- Couleur générée automatiquement par tag
- Maximum 50 tags actifs — 1 tag par session

#### Interruption

- Pause > 5 min ou abandon = `interrompue: true` + XP = 0
- 3 interruptions dans la journée → **Penalty Box** : bouton Start bloqué 15 min

#### Règles d'édition

- Modification d'une session passée : **impossible**
- Suppression : autorisée — entraîne la perte de l'XP associé

---

### 3.3 Module Gamification

#### Calcul XP

```
XP_session = floor(durée_min / 2.5) + bonus_fin_parfaite
Bonus_fin_parfaite = +5 XP si |temps_restant| < 1 seconde
```

Exemples :
- Pomodoro 25 min = 10 XP base
- Deep Work 90 min = 36 XP base
- Deep Work 90 min terminé exactement = 41 XP

#### Niveaux

```
XP_requis(n) = 100 × n^1.3
Niveau actuel = max n tel que Σ(i=1..n) XP_requis(i) ≤ XP_total
```

- Niveau maximum : 100
- L'XP n'est pas perdu au passage de niveau

**Titres débloqués :**

| Niveau | Titre |
|--------|-------|
| 1 | Disciple |
| 5 | Guerrier |
| 10 | Vétéran |
| 15 | Maître |
| 20 | Expert |
| 30 | Légende |
| 50 | Transcendé |
| 100 | Dieu du Focus |

#### Streak

- +1 si au moins 1 session terminée dans la journée
- Reset à 0 si journée sans session
- La journée démarre à **04h00 heure locale**

**Multiplicateurs de streak :**

| Streak | Multiplicateur XP |
|--------|-----------------|
| 0–6 jours | ×1.0 |
| 7–29 jours | ×1.5 |
| ≥ 30 jours | ×2.0 |

**Autres multiplicateurs :**
- Énergie 5/5 avant session : ×1.2
- Cap global : ×3.0 (multiplicateurs multiplicatifs)

#### Monnaie : Pomocoin (PC)

- 1 minute de focus terminée = 1 PC
- Bonus supplémentaires via quêtes
- Dépensée en boutique — non remboursable

#### Arbre de talents

- 1 point de talent par niveau atteint — maximum 30 points

**Branche Focus :**

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| T1 | Endurant | 1 pt | +10% XP sessions > 60 min |
| T2 | Concentré | 1 pt | -1 pénalité de pause par session |
| T3 | Ultra-Focus | 2 pt | +20% XP sessions > 60 min |

**Branche Discipline :**

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| T1 | Matinal | 1 pt | ×1.3 XP avant 9h |
| T2 | Gardien | 2 pt | 1 gèle streak gratuit par mois |
| T3 | Rattrapage | 2 pt | 2h un dimanche = +1 jour de streak |

**Branche Power :**

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| T1 | Berserker | 3 pt | Actif = ×2 XP, abandon = -100 XP |
| T2 | Pause gratuite | 2 pt | 1 pause/jour sans casser le streak |

#### Quêtes

**Quotidiennes** (3 par jour, générées à 04h00) :
- "3 Pomodoros avant midi" → 50 XP
- "1 Deep Work complet" → 40 XP
- "Tagger 2 projets différents" → 30 XP + 20 PC

**Hebdomadaires** (1 par semaine) :
- "10h de focus total" → skin rare
- "5 jours consécutifs" → 200 XP + 100 PC
- "Tester le mode 52/17" → 150 XP

> Expiration : 03h59 le lendemain (quotidiennes), dimanche suivant 03h59 (hebdo).

#### Donjons thématiques

Suite de sessions liées à un thème. Abandon en cours = donjon raté, recommencer à zéro.

Exemple — **Donjon des Maths** :
- 4 sessions × 45 min, toutes taguées "Maths"
- Récompense : skin "Calculatrice Dorée"

#### Boss hebdomadaire — "Le Kraken & Co"

- Le Boss change chaque semaine
- PV du boss élevés — nécessite plusieurs sessions pour le vaincre
- Le vaincre en accumulant des heures de focus
- Récompense : Pomocoins + XP massif + trophée de raid

#### Trophées (40+)

Achievements binaires débloqués sur triggers.

Exemples :
- "100 Pomodoros" — accumuler 100 Pomodoros terminés
- "Marathon 5h" — 5h de focus en une seule journée
- "Lève-tôt" — 10 sessions démarrées avant 8h00
- "Semaine parfaite" — 7 jours de streak consécutifs
- "Berserker survivant" — 10 sessions en mode Berserker sans abandon

> Notification + son spécifique lors du déblocage. Galerie consultable en tout temps.

---

### 3.4 Module Statistiques

#### Heatmap annuelle (style GitHub)

- 1 case = 1 jour — intensité = somme des minutes focus
- Filtre par année et par tag
- Objectif psychologique : ne pas casser la chaîne

#### Calendrier de sessions

- Clic sur un jour → liste détaillée des sessions du jour
- Affiche : type, durée, tag, XP gagné, statut (complète/interrompue)
- Filtre par tag et par type de session

#### Graphiques

| Vue | Type | Période |
|-----|------|---------|
| Focus/jour | Barres | 30 derniers jours |
| Focus/semaine | Courbe | 12 dernières semaines |
| Répartition projets | Camembert | Période filtrée |
| Distribution horaire | Courbe | Toujours |

#### Métriques clés

- Temps total de focus
- Moyenne journalière
- Streak actuel + streak record
- Meilleure session (durée sans interruption)
- **Heure dorée** : créneau horaire statistiquement le plus productif
- Taux de complétion (sessions terminées / démarrées)

#### Corrélations pré-calculées (règles codées en dur, sans IA)

Exemples affichés automatiquement :
- "Tes jours à +4 Pomodoros coïncident à 80% avec une session avant 10h"
- "Tu procrastines statistiquement après 17h"
- "Ton XP moyen est ×1.4 quand ton énergie est ≥ 4"

---

### 3.5 Module Planification

#### Time Blocking

- Grille horaire 00h–24h (colonne par jour)
- Glisser pour créer un bloc temporel
- Association bloc → preset ou tag
- Notification au début du bloc : "Début du bloc Deep Work – Lancer ?"
- Lancement automatique optionnel

#### Routines

- Enchaînement enregistrable : ex. `Réveil = 15T + 5P + 45T`
- Bouton "Lancer la routine" → démarre l'enchaînement automatiquement

#### Estimation vs Réel

- Objectif en heures par tag projet : ex. "Projet X = 20h estimées"
- Barre de progression mise à jour après chaque session
- Bilan final : "Prévu 5h → Réel 8h20"

#### Suivi d'énergie

- Popup avant démarrage : "Énergie 1–5 ?"
- Impact : multiplicateur XP × 1.2 si énergie = 5
- Utilisé dans les corrélations statistiques

---

### 3.6 Module Blocage & Friction

#### Mode Coffre-fort

- Actif automatiquement pendant tout timer
- Pour quitter avant la fin : saisir une phrase exacte de 20 mots minimum, sans faute
- Phrase générée via `crypto.getRandomValues` (non reproductible)
- Erreur de frappe = rester bloqué, recommencer

#### Extension Navigateur (opt-in, installation séparée)

- Stack : WXT + React
- Liste noire de domaines configurée dans l'app
- Pendant timer actif : onglet correspondant → fermeture automatique
- Communication PWA → son d'alarme déclenché via `BroadcastChannel`

#### Penalty Box

- Compteur d'abandons réinitialisé chaque jour à 04h00
- Seuil de déclenchement : 3 abandons ou plus
- Durée de blocage : `X = 10 × 2^(nb_abandons - 3)` minutes

| Abandons | Blocage |
|----------|---------|
| 3 | 10 min |
| 4 | 20 min |
| 5 | 40 min |
| 6 | 80 min |

- Bouton Start visuellement désactivé avec compte à rebours

---

### 3.7 Module Boutique & Personnalisation

> Toutes les dépenses en Pomocoin sont définitives (non remboursables).

#### Thèmes UI (12 thèmes)

| Thème | Prix | Débloquage |
|-------|------|-----------|
| Default Light | Gratuit | Dès le départ |
| OLED Black | 0 PC | Niveau 5 |
| Dark Standard | 100 PC | Achat |
| Synthwave | 300 PC | Achat |
| Papier ancien | 200 PC | Achat |
| Néon Cyber | 400 PC | Niveau 15 |
| ... (12 total) | 0–800 PC | — |

#### Skins de timer (15 cadrans)

| Skin | Prix |
|------|------|
| Cadran Rolex | 300 PC |
| Néon Cyber | 200 PC |
| Minimal bois | 150 PC |
| CRT rétro | 250 PC |
| Analogique classique | 100 PC |
| ... (15 total) | 100–500 PC |

#### Sons de victoire (20 effets)

Exemples : Mario coin (50 PC), Wilhelm scream (50 PC), FUS RO DAH (100 PC), Sabre laser (75 PC) — prix : 50–200 PC.

#### Fonds animés (8 fonds)

| Fond | Prix | Niveau requis |
|------|------|--------------|
| Feu de camp | 300 PC | 10 |
| Pluie nuit | 400 PC | 20 |
| Espace étoilé | 500 PC | 30 |
| Particules | 600 PC | 40 |
| ... (8 total) | 300–1000 PC | — |

> Feu de camp : taille des flammes augmente d'1 cran par niveau. Récompense visuelle du grind.

#### Consommables

| Objet | Prix | Effet |
|-------|------|-------|
| Bouclier streak | 200 PC | Utilisation auto si 1 jour manqué |
| Gèle streak | 200 PC | Protection manuelle du streak |
| Reset talents | 500 PC | Redistribue tous les points |
| +1 slot preset | 300 PC | Dépasse la limite de 10 presets |

---

## 4. Spécifications PWA

### Manifest

```json
{
  "name": "FocusGrind",
  "short_name": "FocusGrind",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#EF9F27",
  "icons": [
    { "src": "/icons/72.png",  "sizes": "72x72",   "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/96.png",  "sizes": "96x96" },
    { "src": "/icons/128.png", "sizes": "128x128" },
    { "src": "/icons/144.png", "sizes": "144x144" },
    { "src": "/icons/192.png", "sizes": "192x192", "purpose": "maskable" },
    { "src": "/icons/256.png", "sizes": "256x256" },
    { "src": "/icons/384.png", "sizes": "384x384" },
    { "src": "/icons/512.png", "sizes": "512x512", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Deep Work 90",    "url": "/?mode=deepwork" },
    { "name": "Pomodoro rapide", "url": "/?mode=pomodoro" },
    { "name": "Stats",           "url": "/stats" },
    { "name": "Dernière routine","url": "/?action=last_routine" }
  ]
}
```

### Service Worker

| Type de ressource | Stratégie |
|-------------------|-----------|
| Assets statiques (JS, CSS, icônes) | CacheFirst |
| Données dynamiques / API | NetworkFirst |
| Fonts | StaleWhileRevalidate |

**Pré-cache obligatoire :** app shell complet, sons de base (5 ambiances), 3 thèmes UI, icônes manifest.

### Fonctionnement offline

- 100% des fonctionnalités sans réseau
- IndexedDB = source de vérité unique
- File Background Sync pour upload futur Supabase
- Aucun message d'erreur réseau affiché

### Widgets Android

- **Widget 1** : Bouton "Start 25 min" + streak actuel
- **Widget 2** : Stats du jour (temps focus + Pomodoros restants)

### Badges

```javascript
// Affiche le nombre de Pomodoros restants aujourd'hui
navigator.setAppBadge(nb_pomodoros_restants);
navigator.clearAppBadge(); // si 0 ou app ouverte
```

### Raccourcis OS (appui long sur l'icône)

- "Deep Work 90"
- "Pomodoro rapide"
- "Stats du jour"
- "Lancer dernière routine"

---

## 5. Spécifications de données

### 5.1 Schéma IndexedDB — Dexie.js

```javascript
db.version(1).stores({
  sessions:  '++id, dateStart, dateEnd, duration, type, tag, xp, interrupted',
  tags:      '++id, &name, color, totalMinutes, goalMinutes',
  user:      'id, xp, level, coins, streak, lastSessionDate, talentPoints, talents',
  quests:    'id, type, description, target, progress, rewardXp, rewardCoins, expiresAt, done',
  presets:   '++id, name, steps',      // steps = [{type, duration}]
  routines:  '++id, name, sessionIds',
  trophies:  'id, unlockedAt',
  settings:  'key, value'
});
```

### 5.2 Modèle XP / Niveau

```
XP_session = floor(durée_min / 2.5) + bonus_fin_parfaite
Bonus_fin_parfaite = 5 si |temps_restant| < 1s, sinon 0

XP_total = Σ XP_session (toutes sessions terminées, non interrompues)

Niveau = max n tel que Σ_{i=1}^{n} (100 × i^1.3) ≤ XP_total
```

### 5.3 Structure d'une session

```typescript
interface Session {
  id:            number;
  dateStart:     Date;
  dateEnd:       Date;
  duration:      number;      // secondes
  type:          'pomodoro' | 'deepwork' | 'sprint' | 'flow' | 'custom';
  tag:           string;
  xp:            number;
  interrupted:   boolean;
  energy?:       1 | 2 | 3 | 4 | 5;
  pomodoroIndex?: number;     // position dans un preset
}
```

### 5.4 Structure d'un talent

```typescript
interface Talent {
  id:            string;
  name:          string;
  branch:        'focus' | 'discipline' | 'power';
  cost:          number;
  prerequisites: string[];
  effect: {
    type:       'xp_multiplier' | 'streak_freeze' | 'penalty_reduction' | 'special';
    value:      number;
    condition?: string;
  };
}
```

### 5.5 Gestion du stockage

- Quota cible : < 50 Mo
- Purge automatique si > 80% : suppression des sessions > 2 ans (FIFO)
- Export automatique proposé avant toute purge

---

## 6. Stack technique

| Brique | Choix | Justification |
|--------|-------|---------------|
| Frontend | Next.js 14 App Router | PWA + RSC + optimisations build |
| Style | Tailwind CSS | Utility-first, cohérence design |
| Animations | Framer Motion | 60 fps, transitions fluides |
| BDD locale | Dexie.js (IndexedDB) | 10× plus rapide que localStorage, requêtes SQL-like |
| État global | Zustand | Léger, sans boilerplate Redux |
| Graphiques | Recharts + react-calendar-heatmap | Heatmap GitHub style inclus |
| Audio | Howler.js | Préchargement + fondu entre sons |
| PWA | next-pwa | Service Worker + manifest automatisés |
| Extension | WXT + React | Même stack, build multi-navigateur |
| Sync cloud (opt.) | Supabase | Backend minimal si backup activé |

### Architecture des données

```
[Dexie.js / IndexedDB] ←→ [Zustand Store] ←→ [React Components]
          ↕
[Service Worker Cache]
          ↕
[Supabase — optionnel, background sync]
```

### Structure de dossiers (Next.js)

```
/app
  /(timer)        — page principale + focus mode
  /stats          — heatmap, graphiques, métriques
  /quests         — quêtes, donjons, boss mensuel
  /shop           — boutique et personnalisation
  /settings       — préférences, export, reset

/lib
  /db             — schéma Dexie + helpers
  /store          — stores Zustand
  /gamification   — logique XP, niveaux, streak, quêtes
  /audio          — wrappers Howler.js

/public
  /sounds         — fichiers audio pré-cachés (MP3 + OGG)
  /icons          — icônes PWA maskables (72px → 512px)
```

---

## 7. Spécifications non-fonctionnelles

### Performance

| Métrique | Cible |
|----------|-------|
| First Contentful Paint | < 2s sur 4G |
| Animations | 60 fps constants |
| Démarrage d'un timer | < 100 ms |
| Rendu heatmap 365 jours | < 200 ms |
| Time to Interactive | < 3s sur 4G |

### Sécurité

- 100% client-side — aucune clé API exposée côté client
- Phrase coffre-fort générée via `crypto.getRandomValues` (non prédictible)
- Aucun tracking, aucun analytics tiers en mode local
- Données stockées uniquement sur l'appareil (hors sync cloud opt-in)

### Accessibilité (WCAG AA)

- Navigation clavier complète (Tab, Entrée, Espace, Échap)
- `aria-label` sur tous les contrôles du timer
- `aria-live` sur l'affichage du timer (annonces lecteurs d'écran)
- Contraste minimum 4.5:1 sur tous les textes

### Compatibilité navigateurs

| Navigateur | Version minimale |
|------------|-----------------|
| Chrome / Chromium | 110+ |
| Safari iOS | 16.4+ |
| Firefox | 120+ |
| Edge | 110+ |

**Fallbacks :**
- `Wake Lock API` absent → avertissement discret, pas de blocage
- `Notification API` refusée → timer fonctionne sans notifs
- `Accelerometer` absent → désactivation silencieuse

### Gestion des données utilisateur

| Action | Description |
|--------|-------------|
| Export JSON | Toutes les tables IndexedDB |
| Export CSV | Sessions uniquement, format tableur |
| Export PDF | Rapport mensuel avec graphiques (html2canvas, client-side) |
| Import | Merge intelligent (gestion des conflits d'IDs) |
| Reset usine | Suppression complète — confirmation en deux étapes |

### Bilans automatiques

**Bilan hebdomadaire** — Dimanche à 20h00, popup automatique :

> "Semaine : 14h30 · +12% vs semaine dernière · Meilleur jour : Mardi · Tu procrastines après 17h"

Contenu du bilan :
- Temps total + comparaison semaine précédente
- Meilleur et pire jour de la semaine
- Tag projet le plus travaillé
- Corrélation détectée (ex. énergie vs XP)
- Streak actuel

---

*Document produit à partir des spécifications complètes — LandryNG, Avril 2025*

---

**Note de mise à jour (22 Avril 2026)** : 
- Phase d'optimisation de la cohérence globale terminée.
- Build de production stabilisé et vérifié.
- Mixeur audio et gestion des tâches consolidée.
- Prochaine étape : Extension navigateur et bilans automatiques.
