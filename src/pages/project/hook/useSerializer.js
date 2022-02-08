import {useCallback, useContext, useEffect, useState} from "react";

import LoadProvider from "./LoadProvider";
import EVENTS from "../utils/misc/EVENTS";

export default function useSerializer(engine, setAlert, settings, id, quickAccess) {
    const [savingAlert, setSavingAlert] = useState(false)
    const load = useContext(LoadProvider)
    const fileSystem = quickAccess.fileSystem
    let interval

    const saveEntities = () => {
        let promises = []
        engine.entities.filter(e => !e.components.GridComponent).forEach(e => {
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

    const saveSettings = useCallback(() => {
        let promise = []

        if (id) {
            promise.push(new Promise((resolve) => {
                load.pushEvent(EVENTS.PROJECT_SAVE)
                setSavingAlert(false)
                setAlert({
                    type: 'info',
                    message: 'Saving project.'
                })

                const canvas = document.getElementById(id + '-canvas')

                fileSystem
                    .updateProject(
                        {
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
        load.pushEvent(EVENTS.PROJECT_SAVE)
        if (id)
            promise = [new Promise(resolve => {
                saveSettings()
                    .then(() => {
                        saveEntities()
                            .then(r => {
                            setAlert({
                                type: 'success',
                                message: 'Project saved.'
                            })
                            load.finishEvent(EVENTS.PROJECT_SAVE)
                            resolve()
                        }).catch(() => resolve())
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
        savingAlert,
        setSavingAlert,
        save,
    }
}