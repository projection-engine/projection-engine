export default function handleDropNode(dataToPush, event, ref, nodes, setNodes) {
    const doIt = (n) => {
        if (n.unique && !nodes.find(node => node.constructor.name === n.constructor.name) || !n.unique) {
            const bBox = ref.getBoundingClientRect()
            const bounding = {
                x: ref.scrollLeft - bBox.left,
                y: ref.scrollTop - bBox.top
            }
            const mousePlacement = {
                x: event.clientX + bounding.x,
                y: event.clientY + bounding.y
            }
            const current = {
                x: mousePlacement.x,
                y: mousePlacement.y
            }
            n.x = (current.x - 100) / window.shaderEditor.scale
            n.y = (current.y - 25) / window.shaderEditor.scale
            return n
        } else
            alert.pushAlert("Cannot add two libs of " + n.name, "error")
    }
    if (Array.isArray(dataToPush)) {
        const result = dataToPush.map(d => doIt(d)).flat()
        setNodes([...nodes, ...result])
    } else
        setNodes([...nodes, doIt(dataToPush)])

}