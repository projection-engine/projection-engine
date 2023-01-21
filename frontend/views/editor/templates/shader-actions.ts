import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools";
import addComment from "../views/shader-editor/utils/add-comment";

import SettingsStore from "../stores/SettingsStore";
import Canvas from "../views/shader-editor/libs/Canvas";
import type ShaderNode from "../views/shader-editor/templates/ShaderNode";
import ShaderComment from "../views/shader-editor/templates/ShaderComment";
import ALL_NODES from "../views/shader-editor/static/ALL_NODES";
import ContextMenuController from "../../../lib/context-menu/ContextMenuController";
import NODE_MAP from "../views/shader-editor/static/NODE_MAP";

export function selectAllNodes(canvasAPI:Canvas){
    let last: ShaderNode | ShaderComment
    canvasAPI.nodes.forEach(n => {
        canvasAPI.selectionMap.set(n.id, n)
        last = n
    })
    canvasAPI.comments.forEach(n => {
        canvasAPI.selectionMap.set(n.id, n)
        last = n
    })
    canvasAPI.lastSelection = last
    canvasAPI.clear()
}
export default function shaderActions( canvasAPI: Canvas) {
    const settings = SettingsStore.data

    const options = {
        SELECT_ALL: {
            label: "Select all",
            require: settings.shaderEditorHotkeys.SELECT_ALL,
            callback: () => selectAllNodes(canvasAPI)
        },
        CREATE_COMMENT: {
            label: "Create comment",
            require: settings.shaderEditorHotkeys.CREATE_COMMENT,
            callback: () => addComment(canvasAPI)
        },
        SAVE: {
            label: "Save",
            require: settings.shaderEditorHotkeys.SAVE,
            callback: () => ShaderEditorTools.save( canvasAPI).catch()
        },
        COPY: {
            label: "Copy",
            require: settings.shaderEditorHotkeys.COPY,
            callback: () => {
                const toCopy = []
                canvasAPI.selectionMap.forEach(s => toCopy.push(s))
                ShaderEditorTools.copy(toCopy)
            }
        },
        DELETE: {
            label: "Delete selected",
            require: settings.shaderEditorHotkeys.DELETE,
            callback: () => {
                const toRemoveFromSelection = []
                canvasAPI.selectionMap.forEach(s => {
                    toRemoveFromSelection.push(s.id)
                    if (s instanceof ShaderComment)
                        canvasAPI.comments.splice(canvasAPI.comments.indexOf(s), 1)
                    else {
                        if(s instanceof NODE_MAP.Material)
                            return
                        canvasAPI.nodes.splice(canvasAPI.nodes.indexOf(s), 1);
                        const copy = [...canvasAPI.links]
                        copy.forEach(l => {
                            if (l.sourceNode === s || l.targetNode === s)
                                canvasAPI.links.splice(canvasAPI.links.indexOf(l), 1)
                        })
                    }
                })
                canvasAPI.clear()
            }
        },
        PASTE: {
            label: "Paste",

            require: settings.shaderEditorHotkeys.PASTE,
            callback: () => ShaderEditorTools.paste(canvasAPI)
        }
    }
    return {
        hotkeys: Object.values(options),
        contextMenu: [
            options.SELECT_ALL,
            options.DELETE,
            {
                label: "New node",
                children: ALL_NODES.map(data => ({
                    ...data,
                    callback: () => canvasAPI.onDrop(data.dataTransfer, ContextMenuController.currentX, ContextMenuController.currentY)
                }))
            }
        ]
    }
}