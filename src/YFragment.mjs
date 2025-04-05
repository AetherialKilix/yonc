const nodeRegex = /^@(\d+)$/;
const attributeRegex = /^<!--@(\d+)-->$/;
const compiledEvent = "/* compiled */";

export default class YFragment {

    constructor(template, ...args) {
        // stitch together some html
        const html = template.reduce((acc, str, i) => { return acc + str + (i < args.length ? `<!--@${i}-->` : ""); }, "");

        // convert to DOM fragment
        const element = document.createElement("root");
        element.innerHTML = html;

        // find comment nodes (like text nodes)
        const commentWalker = document.createTreeWalker(element, NodeFilter.SHOW_COMMENT);
        let node; const nodes = [];
        while ((node = commentWalker.nextNode())) {
            const match = node.nodeValue.match(nodeRegex);
            if (!match) continue;
            const value = args[match[1]];
            nodes.push([node, value]);
        }

        // find attributes
        const attributes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
        while ((node = walker.nextNode())) {
            const attributes = [...node.attributes];
            for (const attr of attributes) {
                const { name, nodeValue } = attr;
                const match = nodeValue.match(attributeRegex);
                if (!match) continue;
                const value = args[match[1]];
                if (name.startsWith("on") && typeof value === "function") {
                    node.setAttribute(name, compiledEvent);
                    node.addEventListener(name.substring(2), value);
                } else {
                    attributes.push([node, name, String(value)]);
                }
            }
        }

        for (const pair of nodes) {
            const [node, value] = pair;
            const template = document.createElement("template");
            template.innerHTML = value;
            node.parentNode.replaceChild(template.content, node);
        }
        attributes.forEach(([node, attribute, value]) => {
            node.setAttribute(attribute, value);
        });
        return element
    }


}