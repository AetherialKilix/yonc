import YComponent from "./YComponent.mjs";

export default class YFormComponent extends YComponent {
    static formAssociated = true;
    #internals;
    constructor() {
        super();
        this.#internals = this.attachInternals();
    }

    // == utility for sub-classes == \\
    #formValue = null;
    get formValue() { return this.#formValue; }
    set formValue(newValue) { this.#formValue = newValue; this.#internals.setFormValue(newValue); }
}