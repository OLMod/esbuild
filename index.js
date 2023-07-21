import * as esbuild from "esbuild";

function camelCase(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

/**
 * @param {string} path
 */
function parse(path) {
    var parts = path.split("/").map(part => camelCase(part));
    parts.splice(0, 1);
    return parts.join(".");
}

export const Namespaces = {
    OLNamespace: "ol-resolve-plugin-ns"
}

export default function olResolvePlugin() {
    /**
     * @type {esbuild.Plugin}
     */
    const pl = {
        name: "ol-resolve-plugin",
        setup(build) {
            build.onResolve({ filter: /@ol\/(.*)/ }, args => ({
                path: args.path,
                namespace: Namespaces.OLNamespace
            }));
            build.onLoad({ filter: /.*/, namespace: Namespaces.OLNamespace }, args => ({
                contents: "export default window.OL." + parse(args.path),
                loader: "js"
            }));
        }
    }
    return pl
}