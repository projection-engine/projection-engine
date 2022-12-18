import ShaderEditorTools from "../libs/ShaderEditorTools";
import LOCALIZATION_EN from "../../../templates/LOCALIZATION_EN";
import ConsoleAPI from "../../../../../engine-core/lib/utils/ConsoleAPI";

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
            n.x = (current.x - 100) / ShaderEditorTools.scale
            n.y = (current.y - 25) / ShaderEditorTools.scale
            return n
        }
        else
            console.error(LOCALIZATION_EN.SOME_ERROR_OCCURRED)
    }
    if (Array.isArray(dataToPush)) {
        const result = dataToPush.map(d => doIt(d)).flat()
        setNodes([...nodes, ...result])
    } else
        setNodes([...nodes, doIt(dataToPush)])

}