import resolveLinks from "./utils/resolve-links";

export default class SEContextController {
    static #contexts = new Map()

    static registerContext(contextID, updateNodes, updateLinks, getNodes, getLinks) {
        SEContextController.#contexts.set(
            contextID,
            {
                updateLinks(v){
                    updateLinks(v)
                    if(this.onUpdate)
                        this.onUpdate()
                },
                updateNodes(v){
                    updateNodes(v)
                    console.log(this)
                    if(this.onUpdate)
                        this.onUpdate()
                },
                getNodes,
                getLinks,
                resolvedLinks: resolveLinks(getLinks())
            }
        )
    }

    static deleteContext(contextID) {
        if (contextID != null)
            SEContextController.#contexts.delete(contextID)
    }

    static getContext(contextID) {
        return SEContextController.#contexts.get(contextID)
    }

    static submitNodeVariable(value, attr, node) {
        const ctx = SEContextController.#contexts.get(node.CONTEXT_ID)
        if (!ctx)
            return
        node[attr.key] = value
        const input = node.inputs.find(i => i.key === attr.key)
        if (input.onChange)
            input.onChange(value)
        ctx.updateNodes(ctx.getNodes)
    }

    static updateNode(key, value, node) {
        const ctx = SEContextController.#contexts.get(node.CONTEXT_ID)
        if (!ctx)
            return
        node[key] = value
        ctx.updateNodes(ctx.getNodes)
    }
}