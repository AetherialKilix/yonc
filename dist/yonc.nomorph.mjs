var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/YFragment.mjs
var nodeRegex = /^@(\d+)$/;
var attributeRegex = /^<!--@(\d+)-->$/;
var compiledEvent = "/* compiled */";
var YFragment = class {
  constructor(template, ...args) {
    const html = template.reduce((acc, str, i) => {
      return acc + str + (i < args.length ? `<!--@${i}-->` : "");
    }, "");
    const element = document.createElement("root");
    element.innerHTML = html;
    const commentWalker = document.createTreeWalker(element, NodeFilter.SHOW_COMMENT);
    let node;
    const nodes = [];
    while (node = commentWalker.nextNode()) {
      const match = node.nodeValue.match(nodeRegex);
      if (!match) continue;
      const value = args[match[1]];
      nodes.push([node, value]);
    }
    const attributes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
    while (node = walker.nextNode()) {
      const attributes2 = [...node.attributes];
      for (const attr of attributes2) {
        const { name, nodeValue } = attr;
        const match = nodeValue.match(attributeRegex);
        if (!match) continue;
        const value = args[match[1]];
        if (name.startsWith("on") && typeof value === "function") {
          node.setAttribute(name, compiledEvent);
          node.addEventListener(name.substring(2), value);
        } else {
          attributes2.push([node, name, String(value)]);
        }
      }
    }
    for (const pair of nodes) {
      const [node2, value] = pair;
      const template2 = document.createElement("template");
      template2.innerHTML = value;
      node2.parentNode.replaceChild(template2.content, node2);
    }
    attributes.forEach(([node2, attribute, value]) => {
      node2.setAttribute(attribute, value);
    });
    return element;
  }
};

// src/YComponent.mjs
import morphdom from "morphdom";
var _shadow, _isRendering, _connected, _states, _useState, _effects, _useEffect, _YComponent_instances, doRender_fn;
var _YComponent = class _YComponent extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _YComponent_instances);
    __privateAdd(this, _shadow);
    __privateAdd(this, _isRendering, false);
    __privateAdd(this, _connected, false);
    __privateAdd(this, _states, []);
    __privateAdd(this, _useState, (initial, index, invalidate) => {
      if (typeof __privateGet(this, _states)[index] === "undefined") __privateGet(this, _states)[index] = initial;
      const states = __privateGet(this, _states);
      return [
        new Proxy(wrap(__privateGet(this, _states)[index]), { get() {
          return () => states[index];
        } }),
        (newValue) => {
          if (typeof newValue === "function") newValue = newValue(__privateGet(this, _states)[index]);
          __privateGet(this, _states)[index] = newValue;
          if (__privateGet(this, _isRendering)) invalidate();
          else __privateMethod(this, _YComponent_instances, doRender_fn).call(this);
        }
      ];
    });
    __privateAdd(this, _effects, []);
    __privateAdd(this, _useEffect, (block, deps, index) => {
      const lastDeps = __privateGet(this, _effects)[index];
      if (typeof lastDeps === "undefined" || !shallowEquals(lastDeps, deps)) {
        __privateGet(this, _effects)[index] = deps;
        if (typeof block === "function") block();
      }
    });
    __privateSet(this, _shadow, this.attachShadow({ mode: "closed" }));
  }
  connectedCallback() {
    __privateGet(this, _shadow).innerHTML = "<template></template>";
    __privateMethod(this, _YComponent_instances, doRender_fn).call(this);
    __privateSet(this, _connected, true);
  }
  disconnectedCallback() {
    __privateSet(this, _connected, false);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback", name, oldValue, newValue);
    if (!__privateGet(this, _connected)) {
      console.log("skipped rendering attribute changed:", name);
      return;
    }
    console.log("rendering attribute changed:", name);
    __privateMethod(this, _YComponent_instances, doRender_fn).call(this);
  }
  // == abstract methods == \\
  render(attributes) {
    return "<!-- empty -->";
  }
};
_shadow = new WeakMap();
_isRendering = new WeakMap();
_connected = new WeakMap();
_states = new WeakMap();
_useState = new WeakMap();
_effects = new WeakMap();
_useEffect = new WeakMap();
_YComponent_instances = new WeakSet();
doRender_fn = function() {
  __privateSet(this, _isRendering, true);
  try {
    let renders = _YComponent.maxReRenders;
    let invalid = false;
    let body = void 0;
    do {
      invalid = false;
      let effect = 0, state = 0;
      body = this.render.call(this, {
        useState: (initialValue) => __privateGet(this, _useState).call(this, initialValue, state++, () => {
          invalid = true;
        }),
        useEffect: (block, deps = []) => __privateGet(this, _useEffect).call(this, block, deps, effect++),
        children: Array.from(this.children),
        $: (...args) => new YFragment(...args)
      });
      if (!renders--) {
        __privateSet(this, _isRendering, false);
        throw new Error("too many re-renders!");
      }
    } while (invalid);
    morphdom(__privateGet(this, _shadow).firstChild, body);
  } finally {
    __privateSet(this, _isRendering, false);
  }
};
// if we actually hit 100, then it's likely an infinite loop anyway
__publicField(_YComponent, "maxReRenders", 100);
var YComponent = _YComponent;
function shallowEquals(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
  return true;
}
function wrap(primitive) {
  switch (typeof primitive) {
    case "boolean":
      return new Boolean(primitive);
    case "number":
      return new Number(primitive);
    case "string":
      return new String(primitive);
    case "function":
      return new Function(primitive);
    case "bigint":
      return new BigInt(primitive);
    // symbols, objects and "undefined"
    default:
      return primitive;
  }
}

// src/YFunctionComponent.mjs
function FunctionComponent(render) {
  if (typeof render !== "function") throw Error("Render callback must be of type function!");
  return class YonaFunctionComponent extends YComponent {
    render(attributes) {
      return render(attributes);
    }
  };
}

// src/YFormComponent.mjs
var _internals, _formValue;
var YFormComponent = class extends YComponent {
  constructor() {
    super();
    __privateAdd(this, _internals);
    // == utility for sub-classes == \\
    __privateAdd(this, _formValue, null);
    __privateSet(this, _internals, this.attachInternals());
  }
  get formValue() {
    return __privateGet(this, _formValue);
  }
  set formValue(newValue) {
    __privateSet(this, _formValue, newValue);
    __privateGet(this, _internals).setFormValue(newValue);
  }
};
_internals = new WeakMap();
_formValue = new WeakMap();
__publicField(YFormComponent, "formAssociated", true);
export {
  YComponent,
  YFormComponent,
  FunctionComponent as YFunctionComponent
};
