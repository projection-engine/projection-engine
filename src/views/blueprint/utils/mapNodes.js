import NODE_TYPES from "../../../components/flow/NODE_TYPES";
import {TYPES} from "../../../components/flow/TYPES";
import compile from "./compile";

export default function mapNodes (hook, engine, file) {
    const res = mapCompile(hook)
    const parsedNodes = hook.nodes.map(n => {
        const docNode = document.getElementById(n.id).parentNode
        const transformation = docNode
            .getAttribute('transform')
            .replace('translate(', '')
            .replace(')', '')
            .split(' ')


        return {
            ...n,
            x: parseFloat(transformation[0]),
            y: parseFloat(transformation[1]),

            instance: n.constructor.name
        }
    })
    const parsedGroups = hook.groups.map(n => {
        const docNode = document.getElementById(n.id).parentNode
        const transformation = docNode
            .getAttribute('transform')
            .replace('translate(', '')
            .replace(')', '')
            .split(' ')

        return {
            ...n,
            width: parseFloat(docNode.firstChild.style.width.replace('px', '')),
            height: parseFloat(docNode.firstChild.style.height.replace('px', '')),
            x: parseFloat(transformation[0]),
            y: parseFloat(transformation[1]),

        }
    })

    return JSON.stringify({
        boardResolution: hook.boardResolution,
        nodes: parsedNodes,
        links: hook.links,
        variables: hook.variables,
        response: res,
        groups: parsedGroups,
        type: res.variant,
        entities: engine.entities.map(e => {
            e.blueprintID = file.registryID
            return e
        }),
        name: file.name
    })
}
export function mapCompile (hook) {
    let executionOrder = hook.nodes.filter(n => n.type === NODE_TYPES.START_POINT)
    return executionOrder
        .map(eOrder => {
            const link = hook.links.find(l => l.source.id === eOrder.id && l.source.attribute.type === TYPES.EXECUTION)

            if(link)
                return compile(hook.nodes, hook.links, hook.variables,[], link)
            return undefined
        })
}
