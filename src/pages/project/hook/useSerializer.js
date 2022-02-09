import {useCallback, useContext, useEffect} from "react";

import LoadProvider from "./LoadProvider";
import EVENTS from "../utils/misc/EVENTS";
import ProjectLoader from "../../../services/workers/ProjectLoader";
import cloneClass from "../utils/misc/cloneClass";
import {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";

export default function useSerializer(engine, setAlert, settings, id, quickAccess) {

    const load = useContext(LoadProvider)
    const fileSystem = quickAccess.fileSystem
    let interval


    const saveSettings = useCallback(() => {
        let promise = []

        if (id) {
            promise.push(new Promise((resolve) => {
                load.pushEvent(EVENTS.PROJECT_SAVE)
                const canvas = document.getElementById(id + '-canvas')

                fileSystem
                    .updateProject(
                        {
                            name: settings.projectName,
                            preview: canvas.toDataURL(),
                            entities: engine.entities.length,
                            meshes: engine.meshes.length,
                            materials: engine.materials.length,
                            lastModification: (new Date()).toDateString(),
                            creation: settings.creationDate
                        },
                        settings)
                    .then(() => {
                        resolve()
                    })
            }))
        }

        return Promise.all(promise)
    }, [settings, id])

    const save = useCallback(() => {
        let promise = []
        const fs = window.require('fs')
        load.pushEvent(EVENTS.PROJECT_SAVE)
        if (id)
            promise = [new Promise(resolve => {
                saveSettings()
                    .then(() => {
                        ProjectLoader.getEntities(fileSystem)
                            .then(all => {
                                const cleanUp = all.map(a => {
                                    return new Promise(((resolve1, reject) => {
                                        if (!engine.entities.find(e => e.id === a.data.id)) {

                                            fileSystem.deleteFile('/logic/' + a.data.id + '.entity', false)
                                                .then((er) => resolve1(er))
                                        } else
                                            resolve1()
                                    }))
                                })
                                const newEntities = engine.entities.map(e => {
                                    const foundExisting = all.find(a => a.data.id === e.id)
                                    const clone = cloneClass(e)
                                    if (foundExisting) {
                                        if (clone.components.MeshComponent && !fs.existsSync(clone.components.MeshComponent.meshID))
                                            clone.components.MeshComponent.meshID = foundExisting.data.components.MeshComponent.meshID
                                        if (clone.components.SkyboxComponent && clone.components.SkyboxComponent.imageID && !fs.existsSync(clone.components.SkyboxComponent.imageID))
                                            clone.components.SkyboxComponent.imageID = foundExisting.data.components.SkyboxComponent._imageID
                                        if (clone.components.MaterialComponent && clone.components.MaterialComponent.materialID && !fs.existsSync(clone.components.MaterialComponent.materialID))
                                            clone.components.MaterialComponent.materialID = foundExisting.data.components.MaterialComponent.materialID
                                    }

                                    return clone
                                })
                                Promise.all(cleanUp)
                                    .then((er) => {
                                        console.trace(er)
                                        saveEntities(newEntities, fileSystem)
                                            .then(r => {
                                                setAlert({
                                                    type: 'success',
                                                    message: 'Project saved.'
                                                })
                                                load.finishEvent(EVENTS.PROJECT_SAVE)
                                                resolve()
                                                engine.dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: newEntities})
                                            }).catch(() => resolve())
                                    })


                            })

                    }).catch(() => resolve())
            })]

        return Promise.all(promise)
    }, [engine.entities, settings, id])

    useEffect(() => {
        interval = setInterval(save, 300000)
        return () => {
            clearInterval(interval)
        }
    }, [settings.timestamp, engine.entities])

    return {
        saveSettings,

        save,
    }
}

export const saveEntities = (entities, fileSystem) => {
    let promises = []
    entities.filter(e => !e.components.GridComponent).forEach(e => {
        promises.push(new Promise((resolve) => {
            let blob = {...e.components}


            if (e.components.TransformComponent)
                blob.TransformComponent = {
                    scaling: e.components.TransformComponent.scaling,
                    rotation: e.components.TransformComponent.rotation,
                    translation: e.components.TransformComponent.translation
                }
            fileSystem
                .updateEntity({
                    ...e,
                    components: blob
                })
                .then(() => resolve())
        }))
    })

    return Promise.all(promises)
}