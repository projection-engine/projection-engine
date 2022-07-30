export default function handleDropNode(dataToPush, event, ref, hook) {
    const doIt = (n) => {
        if (n.unique && !hook.nodes.find(node => node.constructor.name === n.constructor.name) || !n.unique) {
            const bounding = {
                x: ref.current.scrollLeft - ref.current.getBoundingClientRect().left,
                y: ref.current.scrollTop - ref.current.getBoundingClientRect().top
            }
            const mousePlacement = {
                x: event.clientX + bounding.x,
                y: event.clientY + bounding.y
            }
            const current = {
                x: mousePlacement.x,
                y: mousePlacement.y
            }
            n.x = (current.x - 100) / window.blueprints.scale
            n.y = (current.y - 25) / window.blueprints.scale
            return n
        } else
            alert.pushAlert("Cannot add two instances of " + n.name, "error")
    }
    if (Array.isArray(dataToPush)) {
        const result = dataToPush.map(d => doIt(d)).flat()
        hook.setChanged(true)
        hook.setNodes(prev => {
            return [...prev, ...result]
        })
    } else {
        hook.setChanged(true)
        hook.setNodes(prev => {
            return [...prev, doIt(dataToPush)]
        })
    }
}