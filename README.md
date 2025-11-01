# Portfolio Manon

Portfolio minimaliste et élégant pour présenter des créations artisanales de couture. Un espace intime pour partager le travail artistique avec la famille et les proches.

## 🎨 À propos du projet

Ce portfolio est conçu pour être simple et épuré, mettant en valeur les créations artisanales sans distractions. Il n'y a pas de boutique en ligne, pas de formulaires de contact, pas de réseaux sociaux - juste une belle galerie pour admirer le travail créatif.

## ✨ Fonctionnalités

- **Galerie de créations** : Affichage élégant des œuvres avec images en carrousel
- **Catégories** : Organisation des créations par thème
- **Admin Panel** : Interface simple pour gérer le contenu sans toucher au code
- **Responsive** : Fonctionne parfaitement sur mobile, tablette et desktop
- **Rapide** : Optimisé avec Next.js 14 pour des performances maximales

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **Stockage d'images** : Supabase Storage
- **Authentification** : Supabase Auth
- **Déploiement** : Netlify

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Un compte Supabase (gratuit)
- Un compte Netlify (gratuit)

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Lucdidi3514/manon-portfolio.git
cd manon-portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

4. **Configurer la base de données Supabase**

Exécuter les migrations SQL dans votre projet Supabase (voir dossier `supabase/sql/`)

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 👤 Utilisation de l'admin

1. Accéder à `/admin/login`
2. Se connecter avec vos identifiants Supabase
3. Gérer vos créations et catégories depuis le panneau d'administration

### Créer une nouvelle création

1. Aller dans **Kreationen** (Créations)
2. Cliquer sur **Neue Kreation** (Nouvelle création)
3. Remplir :
   - **Titre** : Nom de la création
   - **Catégorie** : Optionnel
   - **Description** : Quelques mots pour décrire l'œuvre
   - **Images** : Ajouter les URLs des images hébergées sur Supabase
4. Cocher **Veröffentlichen** pour publier immédiatement
5. Cliquer sur **Kreation erstellen**

### Gérer les catégories

1. Aller dans **Kategorien** (Catégories)
2. Créer, modifier ou supprimer des catégories
3. Les catégories aident à organiser les créations

## 🌐 Déploiement sur Netlify

1. **Connecter le repository GitHub à Netlify**
   - Se connecter sur [Netlify](https://netlify.com)
   - Cliquer sur "Add new site" → "Import an existing project"
   - Choisir GitHub et sélectionner le repository

2. **Configurer les variables d'environnement**
   - Dans Netlify → Site settings → Environment variables
   - Ajouter les mêmes variables que dans `.env.local`

3. **Déployer**
   - Netlify déploie automatiquement à chaque push sur `main`
   - Le site sera accessible sur `votre-site.netlify.app`

4. **Configurer un domaine personnalisé** (optionnel)
   - Dans Netlify → Domain settings
   - Ajouter votre domaine personnalisé

## 📁 Structure du projet

```
portfolio-manon/
├── app/                          # Pages et routes Next.js
│   ├── admin/                    # Panel d'administration
│   │   ├── categories/           # Gestion des catégories
│   │   ├── creations/            # Gestion des créations
│   │   └── page.tsx              # Dashboard admin
│   ├── creations/                # Pages publiques des créations
│   ├── category/                 # Pages des catégories
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants React réutilisables
│   ├── admin/                    # Composants de l'admin
│   ├── categories/               # Composants des catégories
│   ├── creations/                # Composants des créations
│   ├── layout/                   # Header, Footer, etc.
│   └── ui/                       # Composants UI de base
├── lib/                          # Bibliothèques et utilitaires
│   └── supabase/                 # Configuration et actions Supabase
├── public/                       # Fichiers statiques
└── supabase/                     # Migrations SQL

```

## 🔒 Sécurité

- L'admin est protégé par l'authentification Supabase
- Les Row Level Security (RLS) policies sont activées sur Supabase
- Les variables d'environnement ne sont jamais exposées côté client

## 🤝 Contribution

Ce projet est personnel et n'accepte pas de contributions externes.

## 📄 Licence

Tous droits réservés © 2025 Luc Didion

## 💡 Support

Pour toute question ou assistance, consulter la [documentation Next.js](https://nextjs.org/docs) ou [documentation Supabase](https://supabase.com/docs).

---

Fait avec ❤️ par Luc et [Claude Code](https://claude.com/claude-code)
