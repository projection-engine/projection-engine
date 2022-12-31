import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools";
import addComment from "../views/shader-editor/utils/add-comment";

import SettingsStore from "../stores/SettingsStore";
import Canvas from "../views/shader-editor/libs/Canvas";
import type ShaderNode from "../views/shader-editor/templates/ShaderNode";
import Comment from "../views/shader-editor/templates/Comment";

export function selectAllNodes(canvasAPI:Canvas){
    let last: ShaderNode | Comment
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
                console.trace("IM HERE")
                const toRemoveFromSelection = []
                canvasAPI.selectionMap.forEach(s => {
                    toRemoveFromSelection.push(s.id)
                    if (s instanceof Comment)
                        canvasAPI.comments.splice(canvasAPI.comments.indexOf(s), 1)
                    else {
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
            options.DELETE
        ]
    }
}