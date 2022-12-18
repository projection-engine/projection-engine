import ShaderEditorTools from "../libs/ShaderEditorTools";
import SelectionStore from "../../../stores/SelectionStore";
import BOARD_SIZE from "../static/BOARD_SIZE";
import SEContextController from "../libs/SEContextController";


function listenTo(event, target, parent, id) {
    const nodeBbox = target.getBoundingClientRect(),
        parentBBox = parent.getBoundingClientRect(),
        bounding = {
            x: parent.scrollLeft - parentBBox.left + nodeBbox.x - event.clientX,
            y: parent.scrollTop - parentBBox.top + nodeBbox.y - event.clientY
        },
        current = {
            x: Math.round(((event.clientX + bounding.x) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid,
            y: Math.round(((event.clientY + bounding.y) / ShaderEditorTools.scale) / ShaderEditorTools.grid) * ShaderEditorTools.grid
        }
    return {
        id,
        current,
        target,
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
    let tooltip, ctx, initialized
    ctx = SEContextController.getContext(contextID)

    let timeout = setTimeout(() => {
        if (ctx)
            ctx.dragStateUpdate(true)
        initialized = true
    }, 250)
    tooltip = document.getElementById(contextID + "-T")
    try {
        const toSerialize = []
        const targets = SelectionStore.shaderEditorSelected.map(v => {
            const t = document.getElementById(v.id).parentElement
            const callback = listenTo(event, t, parent, v.id)
            toSerialize.push({
                ...callback,
                onMouseUp: undefined,
                onMouseMove: undefined
            })
            return {element: t, callback}
        })

        SEContextController.saveNodesPositions(contextID, toSerialize)
        const handleMouseMove = (ev) => {
            if (!initialized) {
                if (ctx)
                    ctx.dragStateUpdate(true)
            }
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i]
                try {
                    target.callback.onMouseMove(ev)
                    if (i === 0 && tooltip)
                        tooltip.textContent = "X: " + (target.callback.current.x - BOARD_SIZE / 2) + " | Y: " + (target.callback.current.y - BOARD_SIZE / 2)
                    // @ts-ignore
                    const links = target.element.linksToUpdate
                    if (!links)
                        continue
                    for (let j = 0; j < links.length; j++)
                        links[j].updatePath()

                } catch (err) {
                    console.warn(err)
                }
            }
        }

        const handleMouseUp = () => {
            clearTimeout(timeout)
            if (ctx)
                ctx.dragStateUpdate(false)
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i]
                try {
                    target.callback.onMouseUp()
                    // @ts-ignore
                    const links = target.element.linksToUpdate
                    if (links) {
                        for (let j = 0; j < links.length; j++)
                            links[j].updatePath()
                    }
                } catch (err) {
                    console.warn(err)
                }
            }
            SEContextController.saveNodesPositions(contextID, toSerialize)
            document.removeEventListener("mousemove", handleMouseMove)
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp, {once: true})
    } catch (err) {
        console.warn(err)
    }
}

