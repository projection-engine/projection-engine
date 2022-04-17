import {useCallback, useContext, useEffect} from "react";
import {LoaderProvider} from "@f-ui/core";

import EVENTS from "../utils/EVENTS";
import ProjectLoader from "../workers/ProjectLoader";

const fs = window.require('fs')
export default function useSerializer(engine, setAlert, settings, id, quickAccess, currentTab) {

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
                    if (res) {
                        const old = JSON.parse(res.toString())

                        fileSystem
                            .updateProject(
                                {
                                    ...old,
                                    preview: currentTab === 0 ? preview : old.preview,
                                    entities: engine.entities.length,
                                    meshes: engine.meshes.length,
                                    materials: engine.materials.length,
                                    lastModification: (new Date()).toDateString(),
                                    creation: settings.creationDate
                                },
                                settings)
                            .then(() => resolve())
                    } else
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
                    .then(async () => {
                        const all = await ProjectLoader.getEntities(fileSystem)

                        let cleanUp = all.map(a => {
                            return new Promise(async (resolve1) => {
                                if (a && a.data && !engine.entities.find(e => e.id === a.data.id))
                                    resolve1(await fileSystem.deleteFile(fileSystem.path + '\\logic\\' + a.data.id + '.entity', true))
                                else
                                    resolve1()
                            })
                        })
                        console.log(cleanUp)
                        await Promise.all(cleanUp)
                        await Promise.all(engine.entities.map(e => {
                            return new Promise((resolve) => {
                                const str = JSON.stringify(e)
                                fileSystem
                                    .updateEntity(str, e.id)
                                    .then(() => resolve())
                            })
                        }))
                        setAlert({
                            type: 'success',
                            message: 'Project saved.'
                        })
                        load.finishEvent(EVENTS.PROJECT_SAVE)
                        resolve()

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

