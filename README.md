# Yonc

**Yonc** is a lightweight, zero-compilation UI library built on top of native Web Components.  
It brings a tiny slice of the React experience — like hooks and function components — without any build tools, frameworks, or magic. (well, actually quite a bit of magic, but like... a different kind)  
Just `<script type="module">` and go.

---

## Features

- 💡 **Fully native**: Built on the WebComponent standard (extends `HTMLElement`)
- 🧠 **React-like state & effect hooks** (`useState`, `useEffect`)
- 🔌 **Supports JSX-style templating** using tagged template literals
- 🧹 **Supports both class and function components**
- 💾 **Form-aware components** using the standard `FormAssociated` API
- 📆 **No build step required** for consumers
- ⚡ **Just import and go**

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

## Example: Form Component with Custom Input

This shows how to build a full WebComponent that supports reactive state, dynamic attributes, and native HTML form integration:

[ SHOW INPUT.MJS HERE]

💡 This component:
- Updates its own internal state using `useState`
- Uses `useEffect` to respond to changes in the `value` attribute
- Sets its `formValue` so it works with standard HTML `<form>` submissions

---

## Example: Function Components

Yonc also supports a function component model (like React) via YFunctionComponent. This lets you create components with minimal boilerplate:

[ SHOW YFUNCTIONCOMPONENTS.HTML HERE ]

---

## 📄 License

MIT © 2024 Your Name (your-handle)

