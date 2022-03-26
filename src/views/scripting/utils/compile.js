import cloneClass from "../../../services/utils/misc/cloneClass";
import EventTick from "../nodes/EventTick";
import {TYPES} from "../templates/TYPES";

export default function compile(n, links) {
    let order = [], nodes = n.map(node => cloneClass(node))
    const startPoint = nodes.find(n => n instanceof EventTick)

    const resolveDependencies = (currentNode) => {
        const linksToResolve = links.filter(l => l.target.id === currentNode.id)
        let applied = 0

        for (let i = 0; i < linksToResolve.length; i++) {
            const source = nodes.find(n => n.id === linksToResolve[i].source.id)

            if (!source.ready) {
                resolveDependencies(source)
                applied++
            }
        }

        if (applied > 0 || !currentNode.ready) {
            if (!currentNode.ready)
                order.push(currentNode.id)
            currentNode.ready = true
        }
    }

    resolveDependencies(startPoint)


    for (let exec = 0; exec < nodes.length; exec++) {
        const forwardLinks = links.filter(l => l.source.id === nodes[exec].id)
        let linkToExecute
        for (let liExec = 0; liExec < forwardLinks.length; liExec++) {
            if (nodes[exec].inputs[liExec].type === TYPES.EXECUTION) {
                linkToExecute = forwardLinks[liExec]
                break
            }
        }

        if (linkToExecute)
            resolveDependencies(nodes.find(n => n.id === linkToExecute.target.id))
    }

    return order
}