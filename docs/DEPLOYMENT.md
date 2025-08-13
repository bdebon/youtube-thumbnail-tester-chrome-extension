# Guide de Déploiement Automatique sur Chrome Web Store

## Vue d'ensemble

Ce projet utilise GitHub Actions pour automatiser le déploiement de l'extension sur le Chrome Web Store. À chaque push sur la branche `main`, l'extension est automatiquement publiée avec une nouvelle version.

## Configuration Initiale (À faire une seule fois)

### 1. Obtenir les Credentials du Chrome Web Store

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Chrome Web Store
4. Créez des credentials OAuth 2.0 :
   - Type d'application : Application de bureau
   - Téléchargez le JSON des credentials

### 2. Obtenir le Refresh Token

#### Méthode Recommandée (avec Script Node.js)

1. **Configurez vos credentials** dans le fichier `.env` :
```bash
# Copiez le fichier exemple
cp .env.example .env

# Éditez .env avec vos valeurs
CHROME_CLIENT_ID=votre_id.apps.googleusercontent.com
CHROME_CLIENT_SECRET=GOCSPX-votre_secret
```

2. **Lancez le script** :
```bash
node scripts/get-refresh-token.js
```

3. **Suivez les étapes** :
   - Le script ouvre automatiquement Chrome
   - Connectez-vous avec `b1jam1...`
   - Autorisez l'accès à l'application
   - Copiez le code d'autorisation affiché
   - Collez-le dans le terminal
   - Le refresh token s'affiche

#### Méthode Alternative (CLI)
```bash
# Installez le Chrome Web Store CLI
npm install -g chrome-webstore-upload-cli

# Obtenez le refresh token
chrome-webstore-upload get-refresh-token --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
```

### 3. Configurer les Secrets GitHub

Dans votre repository GitHub, allez dans Settings → Secrets and variables → Actions et ajoutez :

- `CHROME_EXTENSION_ID` : L'ID de votre extension (trouvable dans le Chrome Web Store Developer Dashboard)
- `CHROME_CLIENT_ID` : Le Client ID de vos credentials OAuth
- `CHROME_CLIENT_SECRET` : Le Client Secret de vos credentials OAuth
- `CHROME_REFRESH_TOKEN` : Le Refresh Token obtenu à l'étape précédente

## Utilisation

### Déploiement Automatique

Chaque commit sur la branche `main` déclenche automatiquement :
1. Incrémentation de la version (minor)
2. Création du package ZIP
3. Upload sur le Chrome Web Store
4. Commit de la nouvelle version
5. Création d'une release GitHub

### Déploiement Manuel Local

Pour tester localement avant de pusher :

```bash
# Synchroniser les versions entre manifest.json et package.json
npm run sync-version

# Incrémenter la version et créer le package
npm run release

# Ou manuellement :
npm run bump:patch  # Pour une version patch (1.6 → 1.7)
npm run bump:minor  # Même chose que patch dans notre cas
npm run bump:major  # Pour une version majeure (1.6 → 2.0)
npm run build       # Créer le ZIP
```

## Workflow CI/CD

Le workflow `.github/workflows/publish.yml` :

1. **Trigger** : Push sur `main` (ignore les fichiers markdown et config)
2. **Version Bump** : Incrémente automatiquement la version mineure
3. **Build** : Crée le package ZIP avec tous les fichiers nécessaires
4. **Publish** : Upload sur le Chrome Web Store via l'API
5. **Commit** : Sauvegarde la nouvelle version dans le repo
6. **Release** : Crée une release GitHub avec le ZIP en pièce jointe

## Structure des Versions

- **manifest.json** : Version Chrome (ex: `1.6`, `1.7`)
- **package.json** : Version NPM avec préfixe 0 (ex: `0.1.6`, `0.1.7`)

Les versions sont synchronisées automatiquement.

## Renouvellement du Refresh Token (Tous les 6 mois)

Le refresh token expire après 6 mois d'inactivité. Voici comment le renouveler :

### Procédure Rapide de Renouvellement

1. **Vérifiez que votre `.env` est à jour** :
   - Les credentials doivent être présents
   - Si pas de `.env`, créez-le depuis `.env.example`

2. **Lancez le script de renouvellement** :
   ```bash
   node scripts/get-refresh-token.js
   ```

3. **Dans la fenêtre Chrome qui s'ouvre** :
   - Sélectionnez le compte `b1jam1...`
   - Cliquez sur "Continuer" pour autoriser l'accès
   - Un code s'affiche (format: 4/0AeanS...)

4. **Copiez-collez le code** dans le terminal

5. **Récupérez le nouveau refresh token** qui s'affiche

6. **Mettez à jour le secret GitHub** :
   - Allez sur GitHub → Settings → Secrets → Actions
   - Cliquez sur `CHROME_REFRESH_TOKEN`
   - Update avec la nouvelle valeur
   - Save

C'est fait ! Le déploiement automatique fonctionnera à nouveau.

## Debugging

Si le déploiement échoue :

1. Vérifiez les logs de GitHub Actions
2. Assurez-vous que tous les secrets sont correctement configurés
3. Si erreur "invalid_grant", le refresh token a expiré → suivez la procédure de renouvellement ci-dessus

## Notes Importantes

- Les commits de version bump incluent `[skip ci]` pour éviter les boucles infinies
- Le workflow ignore les changements sur les fichiers markdown
- L'extension doit être créée manuellement la première fois dans le Chrome Web Store
- Les mises à jour peuvent prendre quelques minutes pour apparaître dans le store