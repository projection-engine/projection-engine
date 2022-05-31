import EVENTS from "./EVENTS"
import ProjectLoader from "./workers/ProjectLoader"
import FILE_TYPES from "../../../public/project/glTF/FILE_TYPES"
import FileSystem from "./files/FileSystem"


export default async function refreshData(type, registryID, fileSystem, engine, load) {
    switch (type) {
    case FILE_TYPES.SCRIPT:
        load.pushEvent(EVENTS.LOADING)
        const newScript = await ProjectLoader.loadScripts([registryID], fileSystem, [], false)
        if (newScript[0])
            engine.setScripts(prev => {
                return prev.map(p => {
                    if (p.id === newScript[0].script.id)
                        return newScript[0].script
                    return p
                })
            })
        load.finishEvent(EVENTS.LOADING)
        break
    case FILE_TYPES.MATERIAL:
        load.pushEvent(EVENTS.LOADING)
        const newMat = await ProjectLoader.loadMaterials([registryID], fileSystem, engine.gpu, engine.materials)
        if (newMat[0])
            engine.setMaterials(prev => {
                return prev.map(p => {
                    if (p.id === registryID)
                        return newMat[0]
                    return p
                })
            })
        load.finishEvent(EVENTS.LOADING)
        break
    default:
        const res = await fileSystem.readFile(fileSystem.path + FileSystem.sep + "levelBlueprint" + FILE_TYPES.SCRIPT, "json")
        engine.setScripts(prev => {
            return prev.map(p => {
                if (p.id === fileSystem.projectID)
                    return {
                        id: fileSystem.projectID,
                        executors: res.response,
                        name: res.name
                    }
                return p
            })
        })
    }
}