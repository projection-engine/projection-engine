import ProjectLoader from "../templates/ProjectLoader"
import FILE_TYPES from "../../../public/project/glTF/FILE_TYPES"
import FileSystem from "./files/FileSystem"


export default async function refreshData(type, registryID,  engine) {
    if(type === FILE_TYPES.SCRIPT) {
        const newScript = await ProjectLoader.loadScripts([registryID],  [], false)
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
        const res = await document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + "levelBlueprint" + FILE_TYPES.SCRIPT, "json")
        engine.setScripts(prev => {
            return prev.map(p => {
                if (p.id === document.fileSystem.projectID)
                    return {
                        id: document.fileSystem.projectID,
                        executors: res.response,
                        name: res.name
                    }
                return p
            })
        })
    }
}