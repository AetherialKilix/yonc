const YonaWebUtils = {
    log: document.currentScript.hasAttribute("data-debug") ? console.log : () => {},
    createElement: (tagName, properties = {}, events = {}) => {
        const tag = document.createElement(tagName);
        Object.entries(properties).forEach(([key, value]) => tag.setAttribute(key, value));
        Object.entries(events).forEach(([key, value]) => tag.addEventListener(key, value));
        return tag;
    },
    appendElement: (parent, ...attributes) => {
        const tag = YonaWebUtils.createElement(...attributes);
        parent.append(tag);
        return tag;
    },
    loadCSS: (parent, href) => {
        YonaWebUtils.appendElement(parent, "link", { href, rel: "stylesheet" })
    }
}

const YonaWebComponents = new Proxy({}, {
    get(self, prop) {
        // convert camel to kebab case (any uppercase letter is prefixed by a hyphen, then everything is lowercased)
        const kebab = prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const tagName = "y-" + kebab;
        // this is the relative path to the component
        const path = `./components/${prop}.mjs`;
        // check if we already registered this component, and if so, return it
        if (customElements.get(tagName)) return customElements.get(tagName);
        // check that the component was not already loaded
        if (!self[prop]) {
            // importing the component results in the class
            YonaWebUtils.log("Loading Component:", prop);
            // kick off async loading
            self[prop] = import(path).then(mod => {
                const clazz = mod.default;
                if (!customElements.get(tagName)) {
                    customElements.define(tagName, clazz);
                    YonaWebUtils.log("Registered component ", prop, "as", tagName)
                } else YonaWebUtils.log("Skipped registering component", prop, "as", tagName, "was already registered!")
                Object.defineProperty(self, prop, {
                    value: clazz,
                    writable: false,
                    enumerable: true,
                    configurable: false
                });
                return clazz;
            }).catch(error => YonaWebUtils.log("Unable to load component:", prop));
        }
        return function DeferredConstructor(...args) {
            if (self[prop] instanceof Promise) return null;
            else return new self[prop](...args);
        };
    }
});