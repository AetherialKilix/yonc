import YComponent from "./YComponent.mjs";

export default function FunctionComponent(render) {
    if (typeof render !== "function") throw Error("Render callback must be of type function!")
    return class YonaFunctionComponent extends YComponent {
        render(attributes) { return render(attributes) }
    }
}

