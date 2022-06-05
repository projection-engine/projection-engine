import COMPONENTS from "../../../engine/templates/COMPONENTS"
import FileSystem from "../../../utils/files/FileSystem"
import {ENTITY_ACTIONS} from "../../../engine/useEngineEssentials"

export default async function loadScript(setAlert, selected, engine, value, quickAccess, add){
    if (add && !selected.components[COMPONENTS.SCRIPT].scripts.find(s => s === value)) {
        selected.components[COMPONENTS.SCRIPT].scripts.push(value)
        if (!engine.scripts.find(s => s.id === value)) {
            const rs = await quickAccess.fileSystem.readRegistryFile(value)
            if (rs) {
                const file = await quickAccess.fileSystem.readFile(quickAccess.fileSystem.path + FileSystem.sep + "assets" +FileSystem.sep +  rs.path)
                if (file)
                    engine.setScripts(prev => {
                        return [...prev, {
                            id: value,
                            executors: file
                        }]
                    })
                else {
                    setAlert({
                        type: "error",
                        message: "Error loading file."
                    })
                    return null
                }
            }
        }
    } else if (!add)
        selected.components[COMPONENTS.SCRIPT].scripts = selected.components[COMPONENTS.SCRIPT].scripts.filter(s => s !== value)
    engine.dispatchEntities({
        type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
            entityID: engine.selected[0],
            data: selected.components[COMPONENTS.SCRIPT],
            key: COMPONENTS.SCRIPT
        }
    })
}