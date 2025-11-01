# 📸 Guide de Gestion des Images - Portfolio Manon

## Comment ça fonctionne actuellement

Votre portfolio utilise un système de **liens d'images externes** (URLs). Les images ne sont pas uploadées directement dans votre projet.

### Architecture Actuelle

```
┌─────────────────┐
│  Formulaire     │  Vous entrez: "https://example.com/photo.jpg"
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Base Supabase  │  Stocke: { url: "https://example.com/photo.jpg" }
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Next.js        │  Affiche l'image depuis l'URL externe
└─────────────────┘
```

**Les images elles-mêmes sont hébergées ailleurs!**

---

## 🧪 Pour les Tests en Local (3 Options)

### Option 1: Unsplash (Images de Test Gratuites) ⭐ RECOMMANDÉ

**Avantages:**
- ✅ Gratuit et illimité
- ✅ Belles photos professionnelles
- ✅ Pas besoin de compte
- ✅ URLs stables

**Comment faire:**

1. Allez sur https://unsplash.com
2. Cherchez une catégorie (ex: "sewing", "fabric", "handmade")
3. Cliquez sur une image
4. Clic droit sur l'image → "Copier l'adresse de l'image"
5. Collez l'URL dans votre formulaire

**Exemple d'URL:**
```
https://images.unsplash.com/photo-1234567890?w=800&q=80
```

**Test rapide - URLs d'images prêtes à utiliser:**
```
Couture/Textile:
https://images.unsplash.com/photo-1558769132-cb1aea672c5e?w=800
https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800
https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800

Accessoires:
https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800
https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800
```

---

### Option 2: Imgur (Upload Simple)

**Avantages:**
- ✅ Gratuit
- ✅ Upload direct d'images
- ✅ Pas besoin de compte (avec compte = mieux)

**Comment faire:**

1. Allez sur https://imgur.com
2. Cliquez "New post" ou glissez une image
3. Une fois uploadée, clic droit → "Copier l'adresse de l'image"
4. Utilisez l'URL qui finit par `.jpg` ou `.png`

**Exemple d'URL:**
```
https://i.imgur.com/AbCd123.jpg
```

---

### Option 3: Images Locales (Dossier Public)

**Pour tester avec VOS propres images:**

1. **Placez vos images dans le dossier `/public/images/`**

```bash
/Users/lucdidion/Desktop/Projets/Portfolio-Manon/
└── public/
    └── images/
        ├── tasche-1.jpg
        ├── tasche-2.jpg
        └── schmuck-1.jpg
```

2. **Dans le formulaire, utilisez l'URL relative:**

```
/images/tasche-1.jpg
/images/tasche-2.jpg
/images/schmuck-1.jpg
```

**⚠️ Important:** Cette méthode fonctionne seulement en local! Quand vous déployez sur Netlify, ces images seront déployées avec le site.

---

## 🚀 Pour la Production (Options Professionnelles)

### Option A: Supabase Storage (RECOMMANDÉ pour production) ⭐

**Avantages:**
- ✅ Intégré avec votre base de données
- ✅ Gratuit jusqu'à 1 GB
- ✅ CDN rapide
- ✅ URLs permanentes

**Configuration nécessaire:**
1. Créer un bucket "creation-images" dans Supabase
2. Configurer les permissions
3. Ajouter le code d'upload dans le formulaire

**Status actuel:** ❌ Pas encore implémenté (nécessite code supplémentaire)

---

### Option B: Cloudinary

**Avantages:**
- ✅ Gratuit jusqu'à 25 GB
- ✅ Optimisation automatique
- ✅ Redimensionnement dynamique

**Website:** https://cloudinary.com

---

### Option C: Votre propre hébergement d'images

Si vous avez déjà un site web ou un serveur, vous pouvez y héberger vos images et utiliser les URLs.

---

## 📋 Workflow Recommandé

### Pour les Tests (Maintenant)

1. ✅ **Utilisez Unsplash** pour avoir de belles images immédiatement
2. Copiez 2-3 URLs d'images
3. Créez votre première création avec ces images
4. Testez que le carousel fonctionne

### Pour le Lancement

**Option Simple:**
1. ✅ Uploadez vos vraies photos sur **Imgur** (gratuit)
2. Copiez les URLs
3. Créez vos créations réelles

**Option Professionnelle:**
1. ✅ Utilisez **Supabase Storage** (nécessite configuration)
2. Upload direct depuis le formulaire
3. Gestion centralisée

---

## 🛠️ Exemple Pratique: Créer Votre Première Création

### Étape 1: Préparez 2-3 images

**URLs de test prêtes à utiliser:**
```
Image 1 (principale):
https://images.unsplash.com/photo-1558769132-cb1aea672c5e?w=800&q=80

Image 2:
https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80

Image 3:
https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80
```

### Étape 2: Remplissez le Formulaire

1. Allez sur http://localhost:3000/admin/creations/new
2. Titre: "Tasche Handgefertigt mit Blumenmuster"
3. Description: "Eine wunderschöne handgefertigte Tasche..."
4. **Section Images:**
   - Cliquez "Bild hinzufügen"
   - Collez la première URL
   - Alt text: "Tasche mit Blumenmuster - Ansicht 1"
   - Cochez "Als Hauptbild"
   - Répétez pour images 2 et 3

### Étape 3: Publiez

- Cochez "Sofort veröffentlichen"
- Cliquez "Kreation erstellen"

### Étape 4: Vérifiez

- Allez sur http://localhost:3000/creations
- Cliquez sur votre création
- Le carousel devrait fonctionner avec vos 3 images!

---

## ❓ FAQ

### Q: Les images sont-elles stockées dans ma base de données?
**R:** Non! Seulement les **URLs** des images sont stockées. Les images elles-mêmes restent sur les serveurs externes (Unsplash, Imgur, etc.).

### Q: Que se passe-t-il si Unsplash supprime l'image?
**R:** L'image ne s'affichera plus. C'est pourquoi pour la production, il vaut mieux utiliser votre propre hébergement (Supabase Storage, Imgur avec compte, etc.).

### Q: Puis-je uploader mes propres images directement?
**R:** Pas pour le moment. Le système actuel nécessite des URLs. Pour un vrai upload:
- **Option 1:** Uploadez d'abord sur Imgur, puis copiez l'URL
- **Option 2:** J'implémente Supabase Storage (nécessite du développement supplémentaire)

### Q: Combien d'images puis-je ajouter par création?
**R:** Illimité! Mais je recommande 2-5 images pour une bonne expérience utilisateur.

### Q: Quel format d'image utiliser?
**R:**
- ✅ JPG (recommandé pour photos)
- ✅ PNG (si transparence nécessaire)
- ✅ WebP (meilleure compression)
- ❌ GIF (pas recommandé pour grandes images)

### Q: Quelle taille d'image recommandez-vous?
**R:**
- **Largeur:** 1200-1600px (idéal pour le web)
- **Poids:** < 500 KB par image (pour vitesse de chargement)
- **Ratio:** 4:3 ou 16:9 (le carousel s'adapte)

---

## 🔧 Configuration Actuelle - Domaines Autorisés

Dans votre `next.config.js`, ces domaines sont autorisés pour les images:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'oiyeelnxgefhocajqdfh.supabase.co' },
    { protocol: 'https', hostname: '*.supabase.co' }
  ]
}
```

**Pour ajouter d'autres sources (Unsplash, Imgur):**

Modifiez `next.config.js`:
```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'oiyeelnxgefhocajqdfh.supabase.co' },
    { protocol: 'https', hostname: '*.supabase.co' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'i.imgur.com' },
  ]
}
```

Puis redémarrez le serveur: `rm -rf .next && npm run dev`

---

## 🎯 Prochaines Étapes

### Maintenant (Tests):
1. ✅ Utilisez Unsplash pour tester
2. ✅ Créez 2-3 créations de test
3. ✅ Vérifiez que tout fonctionne

### Avant Production:
1. ⚠️ Décidez de votre solution d'hébergement d'images
2. ⚠️ Uploadez vos vraies photos
3. ⚠️ Ajoutez les domaines dans `next.config.js`

### Optionnel (Avancé):
1. 🔄 Implémenter Supabase Storage upload
2. 🔄 Ajouter optimisation d'images automatique
3. 🔄 Ajouter preview avant upload

---

## 📞 Besoin d'Aide?

Si vous avez des questions sur:
- Comment uploader des images
- Quel service choisir
- Comment implémenter Supabase Storage

Demandez-moi et je vous guiderai pas à pas!

---

**Date:** 31 Octobre 2025
**Version:** 1.0
