import EVENTS from "../../../services/utils/misc/EVENTS";
import ProjectLoader from "../../../services/workers/ProjectLoader";

export default function handleTabChange(filesLoaded, tabIndex, fileSystem, engine, load) {
    const toRemove = filesLoaded[tabIndex - 1]
    console.log(toRemove)
    if(toRemove) {
        if (toRemove?.type === 'flow') {
            load.pushEvent(EVENTS.LOADING)
            ProjectLoader.loadScripts([toRemove.registryID], fileSystem, [], false)
                .then(newScript => {

                    engine.setScripts(prev => {
                        return prev.map(p => {
                            if (p.id === newScript[0].script.id)
                                return newScript[0].script
                            return p
                        })
                    })
                    load.finishEvent(EVENTS.LOADING)
                })
        } else if (toRemove.type === 'material') {
            load.pushEvent(EVENTS.LOADING)
            ProjectLoader.loadMaterials([toRemove.registryID], fileSystem, engine.gpu, engine.materials)
                .then(newMat => {
                    if (newMat[0])
                        engine.setMaterials(prev => {
                            return prev.map(p => {
                                if (p.id === toRemove.registryID)
                                    return newMat[0]
                                return p
                            })
                        })
                    load.finishEvent(EVENTS.LOADING)
                })
        } else if (toRemove.isLevelBlueprint) {
            fileSystem.readFile(fileSystem.path + '\\levelBlueprint.flow', 'json')
                .then(res => {
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
                })

        }
    }
}