# youtube-thumbnail-tester-chrome-extension

## Installation
- Clone the repo
- Go to chrome://extensions
- Enable the developer options if not already enabled
- Click "Load unpacked extension..." (FR: "Charger l'extension non empaquetée")
- Navigate and select the repo's root directory


Then you should see the extension was installed

## Linter - ESLint

To install ESLint launch 

```
npm install
```

To execute and fix all syntaxes error launch

```
npm run lint
```

#### Configuration

La configuration est dans le fichier ``.eslintrc.json``

- [Disallow semicolons instead of ASI](https://eslint.org/docs/rules/semi)
- [Use of single quotes wherever possible](https://eslint.org/docs/rules/quotes)
- [2-space or 1 tab for indentation](https://eslint.org/docs/rules/indent)
- [Disallow Unused Variables](https://eslint.org/docs/rules/no-unused-vars)

## Things to improve
- [x] Dark mode
- [ ] The app needs an icon because for now we use the default google one...
- [ ] Install a linter on the project so that we all can collaborate without having so many useless changes to review
- [ ] Creating tests ? (even if @liior tried for one hour without any success)
- [ ] Animation on the YouTube Homepage to show where the thumbnail is updated. Like a scale up scale down on the thumbnail for example.
- [ ] Integrating the V2.0 of the design made by BastiUI

## Credits
Made by benjamincode live on Twitch :
- [Youtube : Benjamin Code](https://www.youtube.com/channel/UCLOAPb7ATQUs_nDs9ViLcMw)
- [Twitch : benjamincode](https://www.twitch.tv/benjamincode)
- [Twitter : @benjamincodeYT](https://twitter.com/benjamincodeYT)
