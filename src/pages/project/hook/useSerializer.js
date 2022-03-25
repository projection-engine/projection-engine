import {useCallback, useContext, useEffect} from "react";
import {LoaderProvider} from "@f-ui/core";

import EVENTS from "../../../services/utils/misc/EVENTS";
import ProjectLoader from "../../../services/workers/ProjectLoader";

const fs = window.require('fs')
export default function useSerializer(engine, setAlert, settings, id, quickAccess) {

    const load = useContext(LoaderProvider)
    const fileSystem = quickAccess.fileSystem
    let interval


    const saveSettings = useCallback(() => {
        let promise = []

        if (id) {
            promise.push(new Promise((resolve) => {
                load.pushEvent(EVENTS.PROJECT_SAVE)
                const canvas = document.getElementById(id + '-canvas')
                const preview = canvas.toDataURL()
                fs.readFile(fileSystem.path + '\\.meta', (e, res) => {
                    if(res) {
                        const old = JSON.parse(res.toString())

                        fileSystem
                            .updateProject(
                                {
                                    ...old,
                                    preview,
                                    entities: engine.entities.length,
                                    meshes: engine.meshes.length,
                                    materials: engine.materials.length,
                                    lastModification: (new Date()).toDateString(),
                                    creation: settings.creationDate
                                },
                                settings)
                            .then(() => resolve())
                    }
                    else
                        resolve()
                })

            }))
        }

        return Promise.all(promise)
    }, [settings, id])

    const save = useCallback(() => {
        load.pushEvent(EVENTS.PROJECT_SAVE)
        if (id)
            return new Promise(resolve => {
                saveSettings()
                    .then(() => {
                        ProjectLoader.getEntities(fileSystem)
                            .then(all => {
                                let cleanUp = all.map(a => {
                                    return new Promise(((resolve1) => {

                                        if (!engine.entities.find(e => e.id === a.data.id)) {
                                            fileSystem.deleteFile(fileSystem.path + '\\logic\\' + a.data.id + '.entity', true)
                                                .then((er) => resolve1(er))
                                        } else
                                            resolve1()
                                    }))
                                })

                                Promise.all(cleanUp)
                                    .then((er) => {
                                        saveEntities(engine.entities, fileSystem)
                                            .then(r => {
                                                setAlert({
                                                    type: 'success',
                                                    message: 'Project saved.'
                                                })
                                                load.finishEvent(EVENTS.PROJECT_SAVE)
                                                resolve()
                                            }).catch(() => resolve())
                                    })


                            })
                    }).catch(() => resolve())
            })
        else return new Promise(resolve => resolve())
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
    entities.filter(e => !e.components.Grid).forEach(e => {
        promises.push(new Promise((resolve) => {
            let blob = {...e.components}


            if (e.components.TransformComponent)
                blob.TransformComponent = {
                    scaling: e.components.TransformComponent.scaling,
                    rotation: e.components.TransformComponent.rotation,
                    translation: e.components.TransformComponent.translation,
                    lockedRotation: e.components.TransformComponent.lockedRotation,
                    lockedScaling: e.components.TransformComponent.lockedScaling
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