import SELECTION_TYPES from "../static/SELECT_ACTIONS"
import {selectAllNodes} from "../../../templates/shader-actions";
import type Canvas from "../libs/Canvas";
import type ShaderNode from "../templates/ShaderNode";
import type ShaderComment from "../templates/ShaderComment";

export default function selection(type: number, canvasAPI: Canvas) {
    switch (type) {
        case SELECTION_TYPES.INVERT: {
            const nodes = [...canvasAPI.nodes, ...canvasAPI.comments]
            let last: ShaderNode | ShaderComment
            for (let i = 0; i < nodes.length; i++) {
                if (!canvasAPI.selectionMap.get(nodes[i].id)) {
                    canvasAPI.selectionMap.set(nodes[i].id, nodes[i])
                    last = nodes[i]
                } else
                    canvasAPI.selectionMap.delete(nodes[i].id)
            }
            canvasAPI.lastSelection = last
            break
        }
        case SELECTION_TYPES.NONE:
            canvasAPI.selectionMap.clear()
            canvasAPI.lastSelection = undefined
            break
        case SELECTION_TYPES.ALL:
            selectAllNodes(canvasAPI)
    }
}