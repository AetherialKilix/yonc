# Yonc

**Yonc** is a lightweight, zero-compilation UI library built on top of native Web Components.  
It brings a tiny slice of the React experience — like hooks and function components — without any build tools, frameworks, or magic. (well, actually quite a bit of magic, but like... a different kind)  
Just `<script type="module">` and go.

---

## Features

- **Fully native**: Built on the WebComponent standard (extends `HTMLElement`)
- **React-like state & effect hooks** (`useState`, `useEffect`)
- **Supports JSX-style templating** using tagged template literals
- **Supports both class and function components**
- **Form-aware components** using the standard `FormAssociated` API
- **No build step required** for consumers
- **Just import and go**

---

## Getting Started

### Import via script tag (CDN)
Use the prebuilt version hosted on jsDelivr:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/aetherialkilix/yonc@v1.0.0/dist/yonc.min.js"></script>
```

### or install via npm

```bash
npm install yonc
```

Then:

```js
import { YComponent, YFunctionComponent, YFormComponent } from 'yonc';
```

---

## Examples
Check out the examples here:
https://github.com/AetherialKilix/yonc/blob/main/examples/


## 📄 License

MIT © 2024 Your Name (your-handle)

