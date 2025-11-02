# Portfolio Manon

Portfolio minimaliste et élégant pour présenter des créations artisanales de couture. Un espace intime pour partager le travail artistique avec la famille et les proches.

## 🎨 À propos du projet

Ce portfolio est conçu pour être simple et épuré, mettant en valeur les créations artisanales sans distractions. Il n'y a pas de boutique en ligne, pas de formulaires de contact, pas de réseaux sociaux - juste une belle galerie pour admirer le travail créatif.

## ✨ Fonctionnalités

### 📱 Interface publique
- **Hero section épuré** : Design centré et minimaliste mettant l'accent sur le message principal
- **Galerie de créations** : Affichage élégant des œuvres avec images en carrousel
- **Catégories** : Organisation des créations par thème
- **Design responsive** : Expérience optimale sur mobile, tablette et desktop
- **Orientation d'images optimisée** : Affichage correct des images sur tous les appareils
- **Menu burger mobile** : Navigation intuitive avec fond opaque sur mobile/tablette
- **Accès Admin direct** : Lien "Admin" accessible depuis le menu principal
- **Performances optimales** : Chargement rapide avec Next.js 14

### 🛠️ Panel d'administration
- **Interface intuitive** : Gestion complète du contenu sans toucher au code
- **Upload d'images par drag & drop** : Interface moderne et fluide
- **Validation stricte des images** :
  - Formats autorisés : **JPG, PNG, WebP uniquement**
  - Taille maximale : **5MB par image**
  - Validation côté client ET serveur
  - Messages d'erreur clairs et détaillés
- **Gestion des créations** :
  - Création, édition et suppression complète
  - Organisation des images (ordre, image principale)
  - Statut brouillon/publié
  - Badge "featured" pour les créations en vedette
- **Gestion des catégories** :
  - Création, édition et suppression
  - Image d'illustration par catégorie
  - Ordre d'affichage personnalisable
- **Suppression sécurisée** :
  - Suppression complète en base de données
  - Nettoyage automatique du storage Supabase
  - Confirmations avant suppression
- **Dashboard responsive** :
  - Sidebar cachée sur mobile/tablette (menu burger)
  - Adaptation parfaite à toutes les tailles d'écran
  - Pas de scroll horizontal sur tablette

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui components
- **Base de données** : Supabase (PostgreSQL)
- **Stockage d'images** : Supabase Storage
- **Authentification** : Supabase Auth
- **Validation** : Zod, React Hook Form
- **Notifications** : Sonner (toasts)
- **Icônes** : Lucide React
- **Déploiement** : Netlify

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Un compte Supabase (gratuit)
- Un compte Netlify (gratuit)

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Lucdidi3514/manon-portfolio.git
cd manon-portfolio
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 4. Configurer la base de données Supabase

Exécuter les migrations SQL dans votre projet Supabase (voir dossier `supabase/sql/`)

#### Tables principales :
- `categories` : Catégories de créations
- `creations` : Créations avec statut (draft/published)
- `creation_images` : Images associées aux créations

#### Storage :
- Créer un bucket nommé `photos-article`
- Configurer les permissions publiques pour la lecture
- Activer les politiques RLS appropriées

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 👤 Utilisation de l'admin

### Accès à l'admin

**3 façons d'accéder au panel d'administration :**
1. Via le menu principal : Cliquer sur **Admin** (desktop, mobile, tablette)
2. Via le footer : Lien discret en bas de page
3. Directement : `/admin/login`

### Connexion
1. Se connecter avec vos identifiants Supabase
2. Accès automatique au dashboard

### Créer une nouvelle création

1. Aller dans **Kreationen** (Créations)
2. Cliquer sur **Neue Kreation** (Nouvelle création)
3. Remplir les informations :
   - **Titre** : Nom de la création (requis)
   - **Catégorie** : Optionnel
   - **Description** : Description détaillée
4. **Ajouter des images** :
   - Glisser-déposer les images ou cliquer pour sélectionner
   - Formats acceptés : **JPG, PNG, WebP** (max 5MB)
   - Définir l'image principale (étoile)
   - Réorganiser l'ordre avec les flèches
   - Ajouter un texte alternatif pour chaque image
5. **Options de publication** :
   - Cocher **Veröffentlicht** pour publier immédiatement
   - Cocher **Als hervorgehoben markieren** pour mettre en vedette
6. Cliquer sur **Kreation erstellen**

### Modifier une création

1. Aller dans **Kreationen**
2. Cliquer sur **Bearbeiten** sur la création souhaitée
3. Modifier les informations
4. **Gérer les images** :
   - Supprimer des images existantes (X rouge)
   - Ajouter de nouvelles images
   - Réorganiser l'ordre
5. Cliquer sur **Änderungen speichern**

⚠️ **Important** : La suppression d'images est définitive et supprime également les fichiers du storage.

### Supprimer une création

1. Aller dans **Kreationen**
2. Cliquer sur l'icône **poubelle** (rouge)
3. Confirmer la suppression

⚠️ **Attention** : Cette action supprime :
- La création de la base de données
- Toutes les images associées
- Tous les fichiers du storage Supabase
- Cette action est **irréversible**

### Gérer les catégories

1. Aller dans **Kategorien** (Catégories)
2. **Créer** : Cliquer sur **Neue Kategorie**
   - Nom de la catégorie
   - Description
   - Image d'illustration (JPG, PNG, WebP - max 5MB)
   - Ordre d'affichage
3. **Modifier** : Cliquer sur l'icône crayon
4. **Supprimer** : Cliquer sur l'icône poubelle

⚠️ **Note** : Impossible de supprimer une catégorie contenant des créations.

## 🌐 Déploiement sur Netlify

### 1. Connecter le repository GitHub à Netlify
- Se connecter sur [Netlify](https://netlify.com)
- Cliquer sur "Add new site" → "Import an existing project"
- Choisir GitHub et sélectionner le repository

### 2. Configurer les paramètres de build
```
Build command: npm run build
Publish directory: .next
```

### 3. Configurer les variables d'environnement
Dans Netlify → Site settings → Environment variables, ajouter :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Déployer
- Netlify déploie automatiquement à chaque push sur `main`
- Le site sera accessible sur `votre-site.netlify.app`

### 5. Configurer un domaine personnalisé (optionnel)
- Dans Netlify → Domain settings
- Ajouter votre domaine personnalisé

## 📁 Structure du projet

```
portfolio-manon/
├── app/                              # Pages et routes Next.js
│   ├── admin/                        # Panel d'administration
│   │   ├── categories/               # Gestion des catégories
│   │   │   ├── [id]/edit/           # Édition de catégorie
│   │   │   ├── new/                 # Nouvelle catégorie
│   │   │   └── page.tsx             # Liste des catégories
│   │   ├── creations/                # Gestion des créations
│   │   │   ├── [id]/edit/           # Édition de création
│   │   │   ├── new/                 # Nouvelle création
│   │   │   └── page.tsx             # Liste des créations
│   │   ├── login/                    # Page de connexion
│   │   ├── layout.tsx                # Layout admin (sidebar)
│   │   └── page.tsx                  # Dashboard admin
│   ├── creations/                    # Pages publiques
│   │   ├── [slug]/                   # Détail d'une création
│   │   └── page.tsx                  # Liste de toutes les créations
│   ├── category/                     # Pages des catégories
│   │   └── [slug]/                   # Créations par catégorie
│   ├── layout.tsx                    # Layout principal
│   └── page.tsx                      # Page d'accueil
├── components/                       # Composants React
│   ├── admin/                        # Composants admin
│   │   ├── admin-sidebar.tsx         # Navigation admin responsive
│   │   ├── delete-category-button.tsx
│   │   ├── delete-creation-button.tsx
│   │   ├── edit-creation-form.tsx
│   │   ├── image-upload-drag.tsx     # Upload drag & drop
│   │   └── single-image-upload.tsx
│   ├── categories/                   # Composants catégories
│   │   └── category-card.tsx
│   ├── creations/                    # Composants créations
│   │   ├── creation-card.tsx
│   │   └── creations-grid.tsx
│   ├── layout/                       # Layout components
│   │   ├── container.tsx
│   │   ├── footer.tsx
│   │   └── header.tsx                # Header avec menu responsive
│   └── ui/                           # shadcn/ui components
├── lib/                              # Bibliothèques
│   └── supabase/                     # Supabase client et actions
│       ├── admin-actions.ts          # Actions CRUD admin
│       ├── auth-actions.ts           # Authentification
│       ├── category-actions.ts       # Actions catégories
│       ├── queries.ts                # Requêtes publiques
│       ├── server.ts                 # Client serveur
│       ├── storage-actions.ts        # Upload/suppression images
│       └── types.ts                  # Types TypeScript
├── public/                           # Fichiers statiques
└── supabase/                         # Migrations SQL
```

## 🎯 Fonctionnalités détaillées

### Validation des images

**Formats acceptés** :
- JPG / JPEG
- PNG
- WebP

**Taille maximale** : 5MB par image

**Validation multi-niveaux** :
1. **Client** : Vérification immédiate avant upload
2. **Serveur** : Double vérification lors de l'upload
3. **Messages d'erreur clairs** :
   - Format invalide
   - Fichier trop volumineux (avec taille en MB)
   - Extension non autorisée

### Suppression complète

**Suppression de création** :
- ✅ Suppression de l'enregistrement en base
- ✅ Suppression de toutes les images associées
- ✅ Nettoyage automatique du storage Supabase
- ✅ Revalidation des caches Next.js
- ✅ Confirmation avant suppression

**Suppression d'image** :
- ✅ Suppression de l'enregistrement en base
- ✅ Suppression du fichier du storage
- ✅ Mise à jour immédiate de l'interface
- ✅ Persistance garantie après rafraîchissement

### Design responsive

**Mobile (< 768px)** :
- Menu burger avec fond blanc opaque
- Navigation verticale
- Admin sidebar cachée avec overlay
- Boutons pleine largeur

**Tablette (768px - 1023px)** :
- Menu burger optimisé
- Admin sidebar en overlay
- Mise en page adaptée
- Pas de scroll horizontal

**Desktop (≥ 1024px)** :
- Menu horizontal
- Admin sidebar fixe visible
- Mise en page large
- Optimisation maximale

## 🔒 Sécurité

- ✅ Admin protégé par Supabase Auth
- ✅ Row Level Security (RLS) activées
- ✅ Validation côté serveur obligatoire
- ✅ Variables d'environnement sécurisées
- ✅ Tokens d'authentification gérés automatiquement
- ✅ Upload limité aux formats et tailles autorisés

## 🚀 Performances

- ✅ Next.js 14 avec App Router
- ✅ Server Components par défaut
- ✅ Images optimisées avec next/image
- ✅ Revalidation intelligente des caches
- ✅ Lazy loading des images
- ✅ Minification et compression automatiques

## 🤝 Contribution

Ce projet est personnel et n'accepte pas de contributions externes.

## 📄 Licence

Tous droits réservés © 2025 Luc Didion

## 💡 Support et documentation

### Ressources utiles
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Problèmes connus et solutions

**Images qui reviennent après suppression** : ✅ Corrigé
- Solution implémentée avec suppression en DB et storage

**Menu burger transparent sur mobile** : ✅ Corrigé
- Fond blanc opaque avec z-index maximum

**Dashboard non responsive sur tablette** : ✅ Corrigé
- Menu burger activé jusqu'à 1024px
- Pas de scroll horizontal

**Erreur de compilation avec variable `extension`** : ✅ Corrigé
- Variable renommée pour éviter les conflits

**Images qui tournent sur mobile/tablette** : ✅ Corrigé
- Implémentation de `image-orientation: from-image` en CSS
- Respect des métadonnées EXIF d'orientation sur tous les appareils
- Recommandation : Convertir les images HEIC en WebP pour une meilleure compatibilité

**Hero section avec image inutile** : ✅ Amélioré
- Suppression de l'image featured du hero section
- Design centré et épuré mettant l'accent sur le message
- Meilleure hiérarchie visuelle et focus sur le CTA
- Chargement plus rapide (moins d'images à fetcher)

## 🎉 Remerciements

Développé avec passion par Luc Didion avec l'assistance de [Claude Code](https://claude.com/claude-code).

---

**Version actuelle** : 2.1.0
**Dernière mise à jour** : Novembre 2025
