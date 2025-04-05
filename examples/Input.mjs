import {YFormComponent} from "../index.mjs";

// YFormComponent differs from YComponent in only one simple way:
// it defines a formValue variable (getter/setter pair to be exact) that is actually submitted in forms.
// keep in mind that T did not test this very extensively, but it should be quite straight forward.
// give the tag a name attribute, put it inside a form tag, and submit the form
export default class Input extends YFormComponent {

    // for this example I simply wrote the style into as string,
    // but it's advisable to use <link rel="stylesheet" href="/css/whatever/my-style.css">
    // since WebComponents are encapsulated using the ShadowDom this style only applies to this component
    static style = `
        :host {
            display: inline-block;
            background: color-mix(in srgb, transparent, 10% currentColor);
            border-radius: 9px;
            position: relative;
            * { transition: .2s; }
        }
        
        #label {
            display: block;
            position: absolute;
            top: 0.25rem; left: 0.5rem;
            transform: translateY(0);
            pointer-events: none;
            font-size: 0.8rem;
        }
        
        #placeholder {
            position: absolute;
            transform: translateY(-100%);
            pointer-events: none;
            opacity: 0;
            /* same padding as #value */
            padding: 1.5rem 1rem 0.75rem;
        }
        
        #value {
            all: unset;
            display: block;
            /* adding the padding here let's us click on the label as well */
            padding: 1.5rem 1rem 0.75rem;
            &:empty {
                & ~ #placeholder { opacity: 0.5; }
                &:not(:focus) ~ #placeholder:empty ~ #label {
                    top: 1.5rem; left: 1rem;
                    font-size: 1rem;
                    opacity: .5;
                }
            }
        }
        
        :host[data-label="none"], :host:has(#label:empty) {
            #value { padding-top: 0.75rem; }
            #label { display: none; }
        }
    `;

    // feature of web-components, defines which attributes invoke the callback.
    // the callback is used by YComponent to trigger an immediate re-render.
    static observedAttributes = ["value", "placeholder", "label"];

    // the render method receives an object with 4 properties:
    //         $ -> the rendering function. using the tagged template literals
    //            | it allows you to bind events defined during render to the tag. see:
    //            | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
    //  useState -> re-creates the useState hook from react as good as I could manage. see:
    //            | https://react.dev/reference/react/useState
    // useEffect -> re-creates the main use of the useEffect hook from react. specifically it accepts a code block and
    //            | a dependency array. if the values in the array change (using a shallow comparison) the code is re-executed.
    //  children -> largely untested, should simply contain the child nodes of the component as a normal js-array
    render({ $, useState, useEffect }) {
        // create an initially empty state
        const [value, setValue] = useState("");

        // create a function to change both state and form-value at once
        const updateValue = (newValue) => {
            if (newValue.trim().length === 0) newValue = ""
            setValue(newValue)
            this.formValue = newValue;
        }

        // update the value state, whenever the attribute changes, by having the valueAttribute be the sole dependency
        const valueAttribute = this.getAttribute('value');
        useEffect(() => { updateValue(valueAttribute) }, [valueAttribute]);

        // this builds a HTMLFragment (wrapped in a <root> tag)
        return $`
            <!-- we simply insert the style here, but you should use a stylesheet instead and just include it here -->
            <style>${Input.style}</style>
            <!-- this is a contenteditable span, as it's easier to work with than an input, it simply shows the value -->
            <!-- here you can also see the syntax for an event is onevent="<handler>" currently this works with any attribute that starts with "on" -->
            <!-- you should be theoretically be able to register custom event handlers like so: onmyevent, but it's not tested and you did not hear this from me. -->
            <span id="value" contenteditable="true" oninput="${(event) => updateValue(event.target.innerText)}">${value}</span>
            <!-- here I simply render the attributes from the component, no need for state or other fancy stuff -->           
            <span id="placeholder">${this.getAttribute('placeholder') || ''}</span>
            <span id="label">${this.getAttribute('label') || ''}</span>
        `;
    }
}

// this automatically defines the custom component, when the file is included.
// make sure your definitions only run once, do not collide and for maintenance reasons, you should do them in a centralized location
// note: the name must contain at least one '-' and both sides must be at least a character. see:
// https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
customElements.define("example-input", Input);


