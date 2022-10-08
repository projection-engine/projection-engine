import ShaderEditorController from "../views/shader-editor/ShaderEditorController";
import SelectionStore from "../stores/SelectionStore";
import addComment from "../views/shader-editor/utils/add-comment";
import Material from "../views/shader-editor/templates/nodes/Material";

export default function shaderActions(settings, openFile, nodes, setNodes, links, setLinks, reference) {
    const options = {
        SELECT_ALL: {
            label: "Select all",
            require: settings.shaderEditorHotkeys.SELECT_ALL,
            callback: () => SelectionStore.shaderEditorSelected = nodes.map(n => n.id)
        },
        CREATE_GROUP: {
            label: "Create Group",
            require: settings.shaderEditorHotkeys.CREATE_GROUP,
            callback: () => addComment(nodes, setNodes)
        },
        SAVE: {
            label: "Save",
            require: settings.shaderEditorHotkeys.SAVE,
            callback: () => ShaderEditorController.save(openFile, nodes, links).catch()
        },
        COPY: {
            label: "Copy",
            require: settings.shaderEditorHotkeys.COPY,
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const toCopy = [], selected = SelectionStore.shaderEditorSelected
                for (let i = 0; i < selected.length; i++)
                    toCopy.push(nodes.find(n => n.id === selected[i]))

                ShaderEditorController.copy(toCopy)

            }
        },
        DELETE: {
            label: "Delete selected",
            require: settings.shaderEditorHotkeys.DELETE,
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const newNodes = [], newLinks = [], map = new Map()
                for (let i = 0; i < nodes.length; i++) {
                    const current = nodes[i]
                    if (!SelectionStore.map.get(current.id) || nodes[i] instanceof Material) {
                        newNodes.push(current)
                        map.set(current.id, true)
                    }
                }
                for (let i = 0; i < links.length; i++) {
                    const current = links[i]
                    const target = current.target.id
                    const source = current.source.id
                    const KEY = target + current.target.attribute.key + "-" + source + current.source.attribute.key
                    if (!SelectionStore.map.get(KEY) && map.get(target) && map.get(source))
                        newLinks.push(current)
                }

                setLinks(newLinks)
                setNodes(newNodes)
            }
        },
        PASTE: {
            label: "Paste",

            require: settings.shaderEditorHotkeys.PASTE,
            callback: () => ShaderEditorController.paste(v => setNodes([...v, ...nodes]))
        },
        FOCUS: {
            label: "Focus",
            require: settings.shaderEditorHotkeys.FOCUS,
            callback: () => {
                const material = document.querySelector(`[data-ismaterial="true"]`)
                if (!material)
                    return
                const transformation = material
                    .getAttribute("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .split(" ")

                reference.scrollLeft = parseInt(transformation[0]) - 10
                reference.scrollTop = parseInt(transformation[1]) - 10
            }
        }
    }
    return {
        hotkeys: Object.values(options),
        contextMenu: [
            options.SELECT_ALL,
            options.FOCUS,
            options.DELETE,
            {
                label: "Delete link",
                icon: "delete",
                onClick: (node) => {
                    const toTest = node.getAttribute("data-link")
                    setLinks(links.filter(l => {
                        if (!l?.target?.attribute || !l?.source?.attribute)
                            return false
                        const test = {
                            t: l.target.id + l.target.attribute.key,
                            s: l.source.id + l.source.attribute.key,
                        }

                        return (test.t + "-" + test.s) !== toTest
                    }))
                }
            }
        ]
    }
}