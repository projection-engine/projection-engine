import importMesh from "./parsers/importMesh";
import EVENTS from "./misc/EVENTS";

export default function handleDrop(event, fileSystem, engine, setAlert, load) {
    let entities = []
    load.pushEvent(EVENTS.LOADING_MESHES)

    try {
        entities = JSON.parse(event.dataTransfer.getData("text"))
    } catch (e) {
    }
    let promises = []
    for (let i = 0; i < entities.length; i++) {
        promises.push(
            new Promise(resolve => {
                const data = entities[i]
                fileSystem.readRegistryFile(data)
                    .then(res => {
                        if (res && res.path.includes('.mesh'))
                            fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                                .then(mesh => {
                                    importMesh(mesh, engine, setAlert, data, i)
                                    resolve()
                                })
                        else {
                            setAlert({
                                type: 'info',
                                message: 'Not a mesh file.'
                            })
                            resolve()
                        }
                    })
            })
        )
    }
    Promise.all(promises)
        .then(() => {
            load.finishEvent(EVENTS.LOADING_MESHES)
        })
}