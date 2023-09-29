# kivi
A Node wrapper around [@strawmelonjuice/bananen](https://github.com/strawmelonjuice/bananen) written in Typescript.



## Usage

> [!note]
>
> <span style="background-color: #f6ccff; color: #57b370">Kivi! 🥝</span> is highly experimental and currently solely in development to see what is possible. <span style="background-color: #24273a; color: #ffcc00">Bananen! 🍌</span> is in alpha stage (however, testing by usage is confirming it is quite stable).
>
> This package is subject to change and may break unexpectedly.

First, install it into the current project.

```bash
npm install kivi-bananen
```

###### JavaScript/Typescript

```js
const path = require("path")
const kivi = new (require("./dist/main.js").KiviBananen)(path.join(__dirname, "../yes"));
```

then you can use <span style="background-color: #f6ccff; color: #57b370">Kivi 🥝</span> from your scripts as you would use <span style="background-color: #24273a; color: #ffcc00">Bananen 🍌</span>.

```js
kivi.init();
kivi.add(1, false, "testing ..");
kivi.add(4, false, "testing.  ");
kivi.add(2, true, "testing. .");
kivi.add(2, false, "tested!");
kivi.regen();
kivi.dub("Completed test!");
```

