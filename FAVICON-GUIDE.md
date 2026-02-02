# 🎨 Guide : Favicon et Image Preview

## 📋 À FAIRE

### ✅ Étape 1 : Créer le Favicon

**Outil recommandé :** https://favicon.io/

#### Options :

**Option A : Favicon à partir de texte**
1. Va sur https://favicon.io/favicon-generator/
2. Paramètres suggérés :
   - **Texte** : `HL` ou `H`
   - **Background** : `#00f3ff` (cyan)
   - **Font Family** : JetBrains Mono ou Outfit
   - **Font Size** : 80
   - **Shape** : Square
   - **Font Color** : `#000000` (noir)
3. Télécharge le package
4. Décompresse et place les fichiers dans `/assets/favicon/`

**Option B : Favicon à partir d'une image**
1. Crée un logo 512x512px (Canva, Figma, Photoshop)
2. Utilise https://realfavicongenerator.net/
3. Upload ton logo
4. Télécharge le package complet
5. Place les fichiers dans `/assets/favicon/`

---

### ✅ Étape 2 : Créer l'Image Preview (Open Graph)

**Dimensions requises :** 1200x630px

**Contenu suggéré :**
```
┌────────────────────────────────────┐
│  Background: Dégradé noir/cyan     │
│  Matrix rain en arrière-plan       │
│                                    │
│     < HUGO LOUREIRO />             │
│     Master Cyber & Réseaux         │
│                                    │
│  🔒 Cybersécurité                  │
│  🌐 Réseaux & DevOps               │
│  ⚙️  Administration Système         │
│                                    │
│     hloureiro.fr                   │
└────────────────────────────────────┘
```

**Outils recommandés :**
- **Canva** : https://www.canva.com/ (templates gratuits)
- **Figma** : https://www.figma.com/ (design pro)
- **Adobe Express** : https://www.adobe.com/express/

**Template Canva :**
1. Recherche "Open Graph Image" ou "LinkedIn Post"
2. Utilise les dimensions 1200x630px
3. Style cyberpunk avec :
   - Background sombre (#020202)
   - Accents cyan (#00f3ff) et vert (#39ff14)
   - Effet matrix/tech
   - Police JetBrains Mono

**Export :**
- Format : PNG
- Qualité : Élevée
- Nom : `preview.png`
- Emplacement : `/assets/preview.png`

---

### ✅ Étape 3 : Intégration dans le site

**Une fois les fichiers créés, remplace dans `index.html` :**

#### Pour le Favicon :
Décommente les lignes 29-31 et ajuste les chemins :
```html
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
```

#### Pour l'Image Preview :
Remplace la ligne 20 :
```html
<!-- AVANT (commenté) -->
<!-- <meta property="og:image" content="https://hloureiro.fr/assets/preview.png"> -->

<!-- APRÈS (actif) -->
<meta property="og:image" content="https://hloureiro.fr/assets/preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
```

Et ligne 26 pour Twitter :
```html
<!-- AVANT (commenté) -->
<!-- <meta name="twitter:image" content="https://hloureiro.fr/assets/preview.png"> -->

<!-- APRÈS (actif) -->
<meta name="twitter:image" content="https://hloureiro.fr/assets/preview.png">
```

---

### ✅ Étape 4 : Tester

**Favicon :**
1. Ouvre ton site
2. Vérifie l'icône dans l'onglet du navigateur
3. Teste sur mobile (icône d'accueil)

**Image Preview :**
1. Teste avec Facebook Debugger : https://developers.facebook.com/tools/debug/
2. Teste avec Twitter Card Validator : https://cards-dev.twitter.com/validator
3. Teste avec LinkedIn Post Inspector : https://www.linkedin.com/post-inspector/

---

## 📂 Structure des fichiers finale

```
Portofolio/
├── assets/
│   ├── favicon/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── apple-touch-icon.png
│   └── preview.png (1200x630px)
├── index.html
├── robots.txt ✅
├── sitemap.xml ✅
└── ...
```

---

## 🎯 Checklist

- [ ] Favicon créé et placé dans `/assets/favicon/`
- [ ] Liens favicon décommentés dans `index.html`
- [ ] Image preview créée (1200x630px)
- [ ] Preview placée dans `/assets/preview.png`
- [ ] Meta og:image décommenté dans `index.html`
- [ ] Meta twitter:image décommenté dans `index.html`
- [ ] Testé sur Facebook Debugger
- [ ] Testé sur Twitter Card Validator
- [ ] Testé l'affichage du favicon dans le navigateur

---

**Temps estimé :** 30-45 minutes pour tout faire ! 🚀
