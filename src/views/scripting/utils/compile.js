import cloneClass from "../../../services/utils/misc/cloneClass";
import EventTick from "../nodes/EventTick";
import {TYPES} from "../../../components/flow/TYPES";
import Getter from "../nodes/Getter";


export default function compile(n, links, variables) {
    let order = [], executors = {}, nodes = n.map(node => cloneClass(node))
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

            if (!currentNode.ready) {
                let inputs = []
                linksToResolve.forEach(l => {
                    if (l.source.attribute.type !== TYPES.EXECUTION)
                        inputs.push({
                            localKey: l.target.attribute.key,
                            sourceKey: l.source.attribute.key,
                            sourceID: l.source.id
                        })
                })

                if (currentNode instanceof Getter)
                    executors[currentNode.id.split('/')[0]] = {
                        value: variables.find(v => v.id === currentNode.id.split('/')[0])?.value
                    }
                order.push({
                    nodeID: currentNode.id,
                    inputs,
                    classExecutor: currentNode.constructor.name,

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

            if (n && n.inputs.find(i => i.key === forwardLinks[liExec].target.attribute.key).accept.includes(TYPES.EXECUTION)) {
                linkToExecute = forwardLinks[liExec]
                break
            }
        }

        if (linkToExecute)
            resolveDependencies(nodes.find(n => n.id === linkToExecute.target.id))
    }

    return {
        executors,
        order
    }
}