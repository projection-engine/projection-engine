import {useCallback, useContext, useEffect, useState} from "react";

import LoadProvider from "./LoadProvider";
import EVENTS from "../utils/misc/EVENTS";

export default function useSerializer(engine, database, setAlert, settings, id) {
    const [savingAlert, setSavingAlert] = useState(false)
    const load = useContext(LoadProvider)
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
                const blobData = JSON.stringify({...e, components: blob})

                database
                    .updateEntity(e.id, {linkedTo: e.linkedTo, blob: blobData})
                    .then(res => {
                        if (res === 0)
                            database.table('entity').add({
                                id: e.id, linkedTo: e.linkedTo, project: id, blob: blobData
                            }).then(() => resolve()).catch(() => resolve())
                        else
                            resolve()
                    })
            }))
        })

        if (promises.length === 0)
            load.finishEvent(EVENTS.PROJECT_SAVE)
        return Promise.all(promises)
    }

    const saveSettings = useCallback((isLast) => {
        let promise = []

        if (database && id) {
            promise.push(new Promise((resolve) => {
                load.pushEvent(EVENTS.PROJECT_SAVE)
                setSavingAlert(false)
                setAlert({
                    type: 'info',
                    message: 'Saving project.'
                })

                const canvas = document.getElementById(id + '-canvas')

                database.updateProject(id, {
                    id,
                    meta: JSON.stringify({
                        preview: canvas.toDataURL(),
                        entities: engine.entities.length,
                        meshes: engine.meshes.length,
                        materials: engine.materials.length,
                        lastModification: (new Date()).toDateString(),
                        creation: settings.creationDate
                    }),
                    settings: JSON.stringify(settings)
                }).then(() => {
                    if (isLast) {
                        setAlert({
                            type: 'success',
                            message: 'Project saved.'
                        })
                        load.finishEvent(EVENTS.PROJECT_SAVE)
                    }
                    resolve()
                }).catch(() => resolve())
            }))
        }

        return Promise.all(promise)
    }, [settings, database, id])

    const save = useCallback(() => {
        let promise = []

        if (database && id)
            promise = [new Promise(resolve => {
                saveSettings(false).then(() => {
                    saveEntities().then(r => {
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
    }, [engine.entities, settings, database, id])

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