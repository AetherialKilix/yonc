export default class Input extends HTMLElement {

    static observedAttributes = ["value", "label", "placeholder"];

    constructor() {
        super();
        this._internals = this.attachInternals();
        this.#initDOM();
    }

    get value() { return this.#elements.value.innerText }
    set value(newValue) { return this.#elements.value.innerText = newValue }

    #elements = {};
    #initDOM() {
        const shadow = this.attachShadow({ mode: "open" });
        YonaWebUtils.loadCSS(shadow, "/css/components/Input.css");
        this.#elements = {
            value: YonaWebUtils.appendElement(shadow, "span", { id: "value", contenteditable: "true" }, { input: (e) => {
                if (e.target.innerText.trim().length === 0) e.target.innerText = ""
            } }),
            placeholder: YonaWebUtils.appendElement(shadow, "span", { id: "placeholder" }),
            label: YonaWebUtils.appendElement(shadow, "span", { id: "label" }),
        }
    }


    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value": this.#elements.value.innerText = newValue; break;
            case "label": this.#elements.label.innerText = newValue; break;
            case "placeholder": this.#elements.placeholder.innerText = newValue; break;
        }
    }

}
