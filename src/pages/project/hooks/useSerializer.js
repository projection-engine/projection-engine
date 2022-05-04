import {useCallback, useContext, useEffect} from "react";


import EVENTS from "../utils/EVENTS";
import ProjectLoader from "../workers/ProjectLoader";
import LoaderProvider from "../../../components/loader/LoaderProvider";
import COMPONENTS from "../../../engine/templates/COMPONENTS";

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

                        await Promise.all(all.map(a => {
                            return new Promise(async (resolve1) => {
                                console.log(a, engine.entities.find(e => e.id === a?.data?.id))
                                if (a && a.data && a.type === 'entity' && !engine.entities.find(e => e.id === a.data.id)){
                                    console.trace('awaiting')
                                    resolve1(await fileSystem.deleteFile(fileSystem.path + '\\logic\\' + a.data.id + '.entity', true))
                                }
                                else
                                    resolve1()
                            })
                        }))
                        console.log(engine.entities.map(e => {
                            return {
                                u: e.components[COMPONENTS.MATERIAL]?.uniformValues,
                                id: e.id
                            }
                        }))
                        await Promise.all(engine.entities.map(e => {
                            return new Promise((resolve) => {

                                const str = JSON.stringify(structuredClone(e))
                                if(e.id === "09f311c0-15f6-4bdf-866c-cd5b444eb8c6") {
                                    console.log(e.components[COMPONENTS.MATERIAL])
                                    console.dir(str)
                                }
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
        return new Promise(resolve => resolve())
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

