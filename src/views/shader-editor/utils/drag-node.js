import ShaderEditorTools from "../ShaderEditorTools";
import SelectionStore from "../../../stores/SelectionStore";

function listenTo(event, target, parent) {
    const nodeBbox = target.getBoundingClientRect(),
        parentBBox = parent.getBoundingClientRect(),
        bounding = {
            x: parent.scrollLeft - parentBBox.left + nodeBbox.x - event.clientX,
            y: parent.scrollTop - parentBBox.top + nodeBbox.y - event.clientY
        },
        current = {}
    return [
        () => {
            if (current.x === undefined)
                return
            if ((nodeBbox.top - parentBBox.top) < 0)
                current.y = 0
            if ((nodeBbox.left - parentBBox.left) < 0)
                current.x = 0
            if ((nodeBbox.top - parentBBox.top) > parentBBox.height)
                current.y = parentBBox.height - nodeBbox.height
            if ((nodeBbox.left - parentBBox.left) > parentBBox.width)
                current.x = parentBBox.width - nodeBbox.width
            target.setAttribute("transform", `translate(${current.x} ${current.y})`)
        },
        ev => {
            current.x = Math.round(((ev.clientX + bounding.x) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid
            current.y = Math.round(((ev.clientY + bounding.y) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid

            target.setAttribute("transform", `translate(${current.x} ${current.y})`)
        }
    ]
}

export default function dragNode(event, parent) {
    let targets = SelectionStore.shaderEditorSelected.map(v => document.getElementById(v)?.parentElement)
    const callbacks = targets.map(t => listenTo(event, t, parent))

    const handleMouseMove = (ev) => {
        for (let i = 0; i < callbacks.length; i++)
            callbacks[i][1](ev)
    }

    const handleMouseUp = () => {
        for (let i = 0; i < callbacks.length; i++)
            callbacks[i][0]()
        document.removeEventListener("mousemove", handleMouseMove)
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp, {once: true})
}

