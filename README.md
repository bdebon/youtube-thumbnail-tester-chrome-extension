# youtube-thumbnail-tester-chrome-extension

## Installation
- Clone the repo
- Go to chrome://extensions
- Enable the *developer options* if it's not already
- Click *Load unpacked extension...* (FR: "Charger l'extension non empaquetée")
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

The main config file is ``.eslintrc.json``

- [Disallow semicolons instead of ASI](https://eslint.org/docs/rules/semi)
- [Use of single quotes wherever possible](https://eslint.org/docs/rules/quotes)
- [2-space or 1 tab for indentation](https://eslint.org/docs/rules/indent)
- [Disallow Unused Variables](https://eslint.org/docs/rules/no-unused-vars)

## Things to improve
- [x] Dark mode
- [ ] The app needs an icon because as of now we are using the default google one...
- [x] Install a linter on the project so that we all can collaborate without having so many useless changes to review
- [ ] Animation on the YouTube Homepage to show where the thumbnail is updated. Like a scale up scale down on the thumbnail for example.
- [ ] Drag and drop thumbnail should work. For now the integration is done and if you hover the dropzone with a file, you'll see the good animation. But once you release the click, it does not work. It's a small thing to fix.
- [x] People would also like to be able to use this extension on the *subscribe feed* of YouTube. And it is really a good feature that needs to be done
- [x] Integrating the V2.0 of the design made by BastiUI ([Figma Link](https://www.figma.com/file/lceF92oVJ4QRAbnfddO5FL/BastiUi-%E2%80%A2-PrevYou?node-id=116%3A56))
- [ ] Creating tests ? (even if @liior after many tried, realised that it may not be that good of an idea. Follow the discussion [here](https://twitter.com/LiiorC/status/1378610942498508802))


## Credits
Made by benjamincode live on Twitch :
- [Youtube : Benjamin Code](https://www.youtube.com/channel/UCLOAPb7ATQUs_nDs9ViLcMw)
- [Twitch : benjamincode](https://www.twitch.tv/benjamincode)
- [Twitter : @benjamincodeYT](https://twitter.com/benjamincodeYT)
