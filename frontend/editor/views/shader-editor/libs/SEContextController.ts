import UndoRedoAPI from "../../../lib/utils/UndoRedoAPI";
import ACTION_HISTORY_TARGETS from "../../../static/ACTION_HISTORY_TARGETS";

export default class SEContextController {
    static #contexts = new Map()

    static registerContext(contextID, updateNodes, updateLinks, getNodes, getLinks, dragStateUpdate) {
        SEContextController.#contexts.set(
            contextID,
            {
                updateLinks,
                updateNodes,
                getNodes,
                getLinks,
                dragStateUpdate
            }
        )
    }

    static initializeCallback(contextID, cb) {
        const ctx = SEContextController.#contexts.get(contextID)
        if (!ctx)
            return
        const oldUpdateLinks = ctx.updateLinks
        const oldUpdateNodes = ctx.updateNodes
        ctx.updateLinks = (v) => {
            oldUpdateLinks(v)
            cb()
        }
        ctx.updateNodes = (v) => {
            oldUpdateNodes(v)
            cb()
        }
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
        UndoRedoAPI.save({
                value: node[attr.key],
                changed: 1,
                callback() {
                    node[attr.key] = this.value
                    ctx.updateNodes(ctx.getNodes())
                }
            },
            ACTION_HISTORY_TARGETS.SHADER_EDITOR
        )
        node[attr.key] = value
        UndoRedoAPI.save({
                value,
                changed: 1,
                callback() {
                    node[attr.key] = this.value
                    ctx.updateNodes(ctx.getNodes())
                }
            },
            ACTION_HISTORY_TARGETS.SHADER_EDITOR
        )
        const input = node.inputs.find(i => i.key === attr.key)
        if (input.onChange)
            input.onChange(value)
        ctx.updateNodes(ctx.getNodes())
    }

    static updateNode(key, value, node) {
        const ctx = SEContextController.#contexts.get(node.CONTEXT_ID)
        if (!ctx)
            return

        UndoRedoAPI.save({
                value: node[key],
                changed: 1,
                callback() {
                    node[key] = this.value
                    ctx.updateNodes(ctx.getNodes())
                }
            },
            ACTION_HISTORY_TARGETS.SHADER_EDITOR
        )
        node[key] = value
        UndoRedoAPI.save({
                value,
                changed: 1,
                callback() {
                    node[key] = this.value
                    ctx.updateNodes(ctx.getNodes())
                }
            },
            ACTION_HISTORY_TARGETS.SHADER_EDITOR
        )
        ctx.updateNodes(ctx.getNodes())

    }

    static saveNodesPositions(ctxID, nodesAffected) {
        const ctx = SEContextController.#contexts.get(ctxID)
        if (!ctx)
            return
        UndoRedoAPI.save({
                cache: nodesAffected.map(n => ({...n, current: {...n.current}})),
                changed: nodesAffected.length,
                callback() {
                    const nodeMap = {}
                    ctx.getNodes().forEach(n => {
                        nodeMap[n.id] = n
                    })
                    for (let i = 0; i < this.cache.length; i++) {
                        const node = this.cache[i]
                        if (nodeMap[node.id] == null)
                            continue
                        node.target.setAttribute("transform", `translate(${node.current.x} ${node.current.y})`)
                        const links = node.target.linksToUpdate
                        if (!links)
                            continue
                        for (let j = 0; j < links.length; j++)
                            links[j].updatePath()
                    }
                }
            },
            ACTION_HISTORY_TARGETS.SHADER_EDITOR
        )

    }
}