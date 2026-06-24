# 🌟 SteadyGo
Bienvenue dans le dépôt de **SteadyGo**, une application web moderne, interactive et responsive conçue pour répertorier et réserver des événements culturels, sportifs et musicaux à Marseille.

L'application arbore un design rétro-futuriste soigné combinant des effets de néon, de glassmorphisme et une palette de couleurs harmonieuse et vibrante.

---

## 🚀 Fonctionnalités Clés

*   **Carte Interactive (Leaflet.js) :** Une carte dynamique affichant les différents lieux d'événements à Marseille avec des badges de catégorie de couleur et des popups de réservation personnalisés.
*   **Filtres par Catégorie :** Filtrage instantané des événements, actualités et partenaires par thématique (*Sportif, Concert, Famille, Festival*).
*   **Sélecteur de Date & Calendrier :** Un carrousel de navigation par date combiné à un modal de calendrier interactif pour choisir un jour précis.
*   **Actualités Thématiques :** Une section actualités interactive avec sélection multiple de catégories par boutons-pills et formulaire d'inscription/désinscription à la newsletter.
*   **Thème Sombre / Clair dynamique :** Un commutateur (Toggle Switch) en en-tête permettant de basculer instantanément l'ensemble du site entre le mode sombre rétro-néon et le mode clair épuré.
*   **Navigation Mobile Optimisée :** Un menu burger en overlay plein écran sur mobile se transformant en barre de navigation classique sur grand écran.

---

## 🛠️ Stack Technique

*   **Structure :** HTML5 (balises sémantiques, accessibilité WAI-ARIA).
*   **Styles :** SASS / SCSS (structuré par modules) compilé en CSS.
*   **Logique interactive :** JavaScript (ES6+ Vanilla JS).
*   **Cartographie :** Leaflet.js (API de cartes OpenStreetMap).
*   **Icônes :** FontAwesome 6.4.0.
*   **Typographie :** Google Fonts (Outfit).

---

## 📂 Structure du Projet

```text
SteadyGo/
├── main.html               # Page d'accueil principale (Carte + Événements du jour)
├── assets/                 # Ressources statiques
│   ├── img/                # Images et logos (dont SG Logo.png, concert.jpg, etc.)
│   └── fonts/              # Polices locales éventuelles
├── html/                   # Pages secondaires de l'application
│   ├── event.html          # Liste et carrousel complet des événements
│   ├── news.html           # Fil d'actualités et newsletter
│   └── partner.html        # Liste et redirection vers nos partenaires
├── js/                     # Fichiers de script JavaScript
│   ├── calendar.js         # Gestion logique du calendrier modal
│   ├── event_page.js       # Logique de chargement des événements et des filtres
│   ├── map.js              # Initialisation et marqueurs Leaflet
│   ├── menu.js             # Comportement du menu burger responsive
│   ├── news_page.js        # Gestion des actualités et filtres thématiques
│   └── carousel.js         # Carrousel et navigation journalière
└── sass/                   # Fichiers sources SASS pour le design system
    ├── global.sass         # Styles globaux et animations
    ├── variables.sass      # Variables de couleurs, polices et mixins
    ├── header.sass         # En-tête de page, logo et commutateur de thème
    ├── footer.sass         # Navigation basse mobile / pied de page
    ├── events.sass         # Cartes événements et calendrier
    ├── news.sass           # Cartes actualités et newsletter
    ├── partners.sass       # Grille des partenaires
    ├── style_main.sass     # Point d'entrée SASS important tous les fichiers
    └── style_main.css      # CSS compilé (utilisé directement par le HTML)
```

---

## 💻 Installation et Lancement

### 1. Prérequis
Vous devez avoir **Node.js** installé sur votre machine pour compiler les fichiers de style SASS.

### 2. Compilation des fichiers SASS (Watcher)
Pour que les modifications de style dans le dossier `sass/` soient prises en compte en direct dans l'application, lancez la commande suivante à la racine du projet :

```bash
npx sass --watch sass/style_main.sass sass/style_main.css
```

### 3. Exécuter l'application localement
L'application étant statique, vous pouvez double-cliquer sur `main.html` pour l'ouvrir dans votre navigateur. Cependant, pour éviter certains blocages CORS de navigateurs, il est recommandé de lancer un mini-serveur HTTP local.

Par exemple avec Python :
```bash
python -m http.server 8000
```
Ou avec Node.js :
```bash
npx http-server -p 8000
```
Puis accédez à l'adresse suivante : [http://localhost:8000](http://localhost:8000).
