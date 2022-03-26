import cloneClass from "../../../services/utils/misc/cloneClass";
import EventTick from "../nodes/EventTick";
import {TYPES} from "../../../components/flow/TYPES";


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
            console.log(currentNode)
            if (!currentNode.ready) {
                let inputs = {}
                linksToResolve.forEach(l => {
                    inputs[l.target.attribute.key] = l.source.id + '/' + l.source.attribute.key
                })
                order.push({
                    nodeID: currentNode.id,
                    inputs,
                    executor: currentNode.constructor.name
                })
            }
            currentNode.ready = true
        }
    }

    resolveDependencies(startPoint)


    for (let exec = 0; exec < nodes.length; exec++) {
        const forwardLinks = links.filter(l => l.source.id === nodes[exec].id)
        let linkToExecute
        for (let liExec = 0; liExec < forwardLinks.length; liExec++) {
            const n = nodes.find(no => no.id === forwardLinks[liExec].target.id)
            console.log(n.inputs, forwardLinks[liExec].target)
            if (n && n.inputs.find(i => i.key === forwardLinks[liExec].target.attribute.key).accept.includes(TYPES.EXECUTION) ) {
                linkToExecute = forwardLinks[liExec]
                break
            }
        }

        if (linkToExecute)
            resolveDependencies(nodes.find(n => n.id === linkToExecute.target.id))
    }

    return order
}