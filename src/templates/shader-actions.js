import ShaderEditorTools from "../views/shader-editor/libs/ShaderEditorTools";
import SelectionStore from "../stores/SelectionStore";
import addComment from "../views/shader-editor/utils/add-comment";
import Material from "../views/shader-editor/libs/nodes/Material";
import SEContextController from "../views/shader-editor/libs/SEContextController";
import SettingsStore from "../stores/SettingsStore";

export default function shaderActions(openFile) {
    const settings = SettingsStore.data
    const context = SEContextController.getContext(openFile.registryID)
    const options = {
        SELECT_ALL: {
            label: "Select all",
            require: settings.shaderEditorHotkeys.SELECT_ALL,
            callback: () => SelectionStore.shaderEditorSelected = context.getNodes().map(n => n.id)
        },
        CREATE_GROUP: {
            label: "Create Group",
            require: settings.shaderEditorHotkeys.CREATE_GROUP,
            callback: () => addComment(context.getNodes(), context.updateNodes)
        },
        SAVE: {
            label: "Save",
            require: settings.shaderEditorHotkeys.SAVE,
            callback: () => ShaderEditorTools.save(openFile, context.getNodes(), context.getLinks()).catch()
        },
        COPY: {
            label: "Copy",
            require: settings.shaderEditorHotkeys.COPY,
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const toCopy = [], selected = SelectionStore.shaderEditorSelected
                for (let i = 0; i < selected.length; i++)
                    toCopy.push(context.getNodes().find(n => n.id === selected[i]))

                ShaderEditorTools.copy(toCopy)

            }
        },
        DELETE: {
            label: "Delete selected",
            require: settings.shaderEditorHotkeys.DELETE,
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const newNodes = [], newLinks = [], map = new Map()
                const nodes = context.getNodes(), links = context.getLinks()
                for (let i = 0; i < nodes.length; i++) {
                    const current = nodes[i]
                    if (!SelectionStore.map.get(current?.id) || nodes[i] instanceof Material) {
                        newNodes.push(current)
                        map.set(current.id, true)
                    }
                }
                for (let i = 0; i < links.length; i++) {
                    const current = links[i]
                    const target = current.targetRef.id
                    const source = current.sourceRef.id
                    if (!SelectionStore.map.get(current.identifier) && map.get(target) && map.get(source))
                        newLinks.push(current)
                }

                context.updateLinks(newLinks)
                context.updateNodes(newNodes)
            }
        },
        PASTE: {
            label: "Paste",

            require: settings.shaderEditorHotkeys.PASTE,
            callback: () => ShaderEditorTools.paste(v => context.updateNodes([...v, ...context.getNodes()]))
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

                const reference = document.getElementById(openFile.registryID)
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
                    if (!node)
                        return
                    const toTest = node.getAttribute("data-link")
                    context.updateLinks(context.getLinks().filter(l => l.identifier !== toTest))
                }
            }
        ]
    }
}