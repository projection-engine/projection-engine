import ShaderEditorTools from "../libs/ShaderEditorTools";
import SelectionStore from "../../../stores/SelectionStore";
import BOARD_SIZE from "../static/BOARD_SIZE";
import SEContextController from "../libs/SEContextController";


function listenTo(event, target, parent) {
    const nodeBbox = target.getBoundingClientRect(),
        parentBBox = parent.getBoundingClientRect(),
        bounding = {
            x: parent.scrollLeft - parentBBox.left + nodeBbox.x - event.clientX,
            y: parent.scrollTop - parentBBox.top + nodeBbox.y - event.clientY
        },
        current = {}
    return {
        current,
        onMouseUp: () => {
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
        onMouseMove: ev => {
            current.x = Math.round(((ev.clientX + bounding.x) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid
            current.y = Math.round(((ev.clientY + bounding.y) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid

            target.setAttribute("transform", `translate(${current.x} ${current.y})`)
        }
    }
}

export default function dragNode(event, parent, contextID) {
    let tooltip, ctx
    ctx = SEContextController.getContext(contextID)

    if (ctx)
        ctx.dragStateUpdate(true)
    tooltip = document.getElementById(contextID + "-T")
    try {
        const targets = SelectionStore.shaderEditorSelected.map(v => {
            const t = document.getElementById(v.id).parentElement
            return {element: t, callback: listenTo(event, t, parent)}
        })

        const handleMouseMove = (ev) => {
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i]
                try {
                    target.callback.onMouseMove(ev)
                    if (i === 0) {
                        if (tooltip)
                            tooltip.textContent = "X: " + (target.callback.current.x - BOARD_SIZE/2) + " | Y: " + (target.callback.current.y - BOARD_SIZE/2)
                    }
                    const links = target.element.linksToUpdate

                    if (links) {
                        for (let j = 0; j < links.length; j++)
                            links[j].updatePath()
                    }
                } catch (err) {
                    console.warn(err)
                }
            }
        }

        const handleMouseUp = () => {
            if (ctx)
                ctx.dragStateUpdate(false)
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i]
                try {
                    target.callback.onMouseUp()
                    const links = target.element.linksToUpdate
                    if (links) {
                        for (let j = 0; j < links.length; j++)
                            links[j].updatePath()
                    }
                } catch (err) {
                    console.warn(err)
                }
            }
            document.removeEventListener("mousemove", handleMouseMove)
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp, {once: true})
    } catch (err) {
        console.warn(err)
    }
}

