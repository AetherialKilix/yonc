import YFragment from "./YFragment.mjs";
import morphdom from "morphdom";

export default class YComponent extends HTMLElement {

    // if we actually hit 100, then it's likely an infinite loop anyway
    static maxReRenders = 100;

    #shadow; #isRendering = false; #connected = false;
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "closed" });
    }
    #states = [];
    #useState = (initial, index, invalidate) => {
        if (typeof this.#states[index] === "undefined") this.#states[index] = initial;
        const states = this.#states;
        return [
            new Proxy(wrap(this.#states[index]), { get() { return () => states[index]}}),
            (newValue) => {
                // allow for the fancy syntax
                if (typeof newValue === "function") newValue = newValue(this.#states[index]);
                // update the sate
                this.#states[index] = newValue;
                // if we are currently rendering, trigger re-render after completion
                if (this.#isRendering) invalidate();
                // if not, trigger a full render
                else this.#doRender();
            }
        ]
    }

    #effects = [];
    #useEffect = (block, deps, index) => {
        const lastDeps = this.#effects[index];
        if (typeof lastDeps === "undefined" || ! shallowEquals(lastDeps, deps)) {
            this.#effects[index] = deps;
            if (typeof block === "function") block();
        }
    }

    #doRender() {
        this.#isRendering = true;
        try {
            let renders = YComponent.maxReRenders;
            let invalid = false;
            let body = undefined;
            do {
                invalid = false;
                let effect = 0, state = 0;
                body = this.render.call(this, {
                    useState: (initialValue) => this.#useState(initialValue, state++, () => { invalid = true }),
                    useEffect: (block, deps = []) => this.#useEffect(block, deps, effect++),
                    children: Array.from(this.children),
                    $: (...args) => new YFragment(...args)
                });
                if (! renders--) {
                    this.#isRendering = false;
                    throw new Error("too many re-renders!");
                }
            } while (invalid);
            morphdom(this.#shadow.firstChild, body);
        } finally {
            this.#isRendering = false;
        }
    }

    connectedCallback() {
        this.#shadow.innerHTML = "<template></template>"
        this.#doRender()
        this.#connected = true;
    }
    disconnectedCallback() { this.#connected = false; }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log("attributeChangedCallback", name, oldValue, newValue)
        if (!this.#connected) {
            console.log("skipped rendering attribute changed:", name);
            return;
        }
        console.log("rendering attribute changed:", name);
        this.#doRender();
    }

    // == abstract methods == \\
    render(attributes) { return "<!-- empty -->" }

}

function shallowEquals(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
    return true;
}

function wrap(primitive) {
    switch (typeof primitive) {
        case "boolean": return new Boolean(primitive)
        case "number": return new Number(primitive)
        case "string": return new String(primitive)
        case "function": return new Function(primitive)
        case "bigint": return new BigInt(primitive)
        // symbols, objects and "undefined"
        default: return primitive
    }
}