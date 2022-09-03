import KEYS from "../../../libs/engine/production/data/KEYS";
import ShaderEditorController from "../ShaderEditorController";
import SelectionStore from "../../../stores/SelectionStore";
import addComment from "./add-comment";

export default function getShortcuts(openFile, nodes, setNodes, links, setLinks, setSelected) {
    return [
        { // create group
            require: [KEYS.KeyA],
            callback: () => setSelected(nodes.map(n => n.id))
        },
        { // create group
            require: [KEYS.KeyG],
            callback: () => addComment(nodes, setNodes)
        },
        {// SAVE
            require: [KEYS.ControlLeft, KEYS.KeyS],
            callback: () => ShaderEditorController.save(openFile, nodes, links).catch()
        },
        {// COPY
            require: [KEYS.ControlLeft, KEYS.KeyC],
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const toCopy = []
                for (let i = 0; i < SelectionStore.array.length; i++) {
                    toCopy.push(nodes.find(n => n.id === SelectionStore.array[i]))
                }
                ShaderEditorController.copy(toCopy)

            }
        },
        { // DELETE SELECTED
            require: [KEYS.Delete],
            callback: () => {
                if (SelectionStore.TARGET !== SelectionStore.TYPES.SHADER_EDITOR)
                    return
                const newNodes = [], newLinks = [], map = new Map()
                for (let i = 0; i < nodes.length; i++){
                    const current = nodes[i]
                    if(!SelectionStore.map.get(current.id)) {
                        newNodes.push(current)
                        map.set(current.id, true)
                    }
                }
                for(let i = 0; i < links.length; i++){
                    const current  = links[i]
                    const target = current.target.id
                    const source = current.source.id
                    if(map.get(target) && map.get(source))
                        newLinks.push(current)
                }

                setLinks(newLinks)
                setNodes(newNodes)
            }
        },
        { // PASTE
            require: [KEYS.ControlLeft, KEYS.KeyV],
            callback: () => ShaderEditorController.paste(v => setNodes([...v, ...nodes]))
        }
    ]
}