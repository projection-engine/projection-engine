import ProjectLoader from "./workers/ProjectLoader"
import FILE_TYPES from "../../../public/project/glTF/FILE_TYPES"
import FileSystem from "./files/FileSystem"


export default async function refreshData(type, registryID, fileSystem, engine) {
    if(type === FILE_TYPES.SCRIPT) {
        const newScript = await ProjectLoader.loadScripts([registryID], fileSystem, [], false)
        if (newScript[0])
            engine.setScripts(prev => {
                return prev.map(p => {
                    if (p.id === newScript[0].script.id)
                        return newScript[0].script
                    return p
                })
            })
    }
    else {
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