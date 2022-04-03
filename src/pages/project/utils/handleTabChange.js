import EVENTS from "../../../services/utils/misc/EVENTS";
import ProjectLoader from "../../../services/workers/ProjectLoader";

export default function handleTabChange(filesLoaded, tabIndex, fileSystem, engine, load){
    const toRemove = filesLoaded[tabIndex-1]
    switch (toRemove.type){
        case 'flow': {
            load.pushEvent(EVENTS.LOADING)
            ProjectLoader.loadScripts([toRemove.registryID], fileSystem, [], false)
                .then(newScript => {
                    engine.setScripts(prev => {
                        return prev.map(p => {
                            if(p.id === toRemove.registryID)
                                p = newScript[0].script

                            return p
                        })
                    })
                    load.finishEvent(EVENTS.LOADING)
                })
            break
        }
        case 'material':{
            load.pushEvent(EVENTS.LOADING)
            ProjectLoader.loadMaterials([toRemove.registryID], fileSystem, engine.gpu, engine.materials)
                .then(newMat => {
                    console.log(newMat, toRemove)
                    engine.setMaterials(prev => {
                        return prev.map(p => {
                            if(p.id === toRemove.registryID)
                                p = newMat[0]

                            return p
                        })
                    })
                    load.finishEvent(EVENTS.LOADING)
                })

            break
        }
        default:
            break
    }
}