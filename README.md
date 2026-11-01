# Steading plugins

The source of every plugin listed in [Steading](https://steading.gg/plugins.html), the home for your tabletop campaign. A person at Steading read each one before listing it. Read them yourself before you add one, or to learn how to write your own.

| Plugin | By | Version | sha256 of main.js |
|---|---|---|---|
| [Tavern maker](tavern-maker/main.js) | Steading examples | 1.0.0 | `134dfc5932ab6375aaa50cdf3f5eed79f8be3aa7c38065e6b5bc0d5a5a8f9ea6` |
| [Weather](weather/main.js) | Steading examples | 1.0.0 | `c8bfcbd24a38db2cf86006ed5b0532e84220b241090a7304c08a8730a4d05a02` |
| [Who's who](whos-who/main.js) | Steading examples | 1.0.0 | `4a2477105814d464efd2591b83b5463fae6c54878177398915aee4aa7efc6025` |

Each folder holds `main.js`, the code, and `manifest.json`, what the plugin says it is and what it asks for.

## Check what you are reading

Steading only marks a plugin as reviewed when its code matches the sha256 we listed. To compare a copy with the table:

```
shasum -a 256 weather/main.js
```

A version newer than the one in your campaign can appear here before it reaches the app. Steading never updates a plugin on its own: a GM is offered the new version and reads what it asks for first.

## Write your own

A plugin is one file of plain JavaScript that runs walled off from everything else. [The docs](https://steading.gg/plugin-docs.html) go from the first line to getting it listed, and these are the real examples they point to.

## Changing something here

This repo is published from Steading's own source, so pull requests and issues are off. To have a plugin listed, or to report a problem with one, follow [Get it listed](https://steading.gg/plugin-docs.html#publish) or write to hello@steading.gg.
