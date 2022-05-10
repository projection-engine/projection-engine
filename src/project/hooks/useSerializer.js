import {useCallback, useContext, useEffect} from "react";


import EVENTS from "../utils/EVENTS";
import ProjectLoader from "../utils/workers/ProjectLoader";
import LoaderProvider from "../../components/loader/LoaderProvider";


export default function useSerializer(engine, setAlert, settings, id, quickAccess, currentTab) {

    const load = useContext(LoaderProvider)
    const fileSystem = quickAccess.fileSystem
    let interval


    const saveSettings = useCallback(() => {
        let promise = []

        if (id) {
            promise.push(new Promise(async (resolve) => {
                load.pushEvent(EVENTS.PROJECT_SAVE)
                const canvas = engine.gpu.canvas
                const preview = canvas.toDataURL()
                const res = await fileSystem.readFile(fileSystem.path + '\\.meta')
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
                                if (a && a.data && a.type === 'entity' && !engine.entities.find(e => e.id === a.data.id)) {
                                    resolve1(await fileSystem.deleteFile(fileSystem.path + '\\logic\\' + a.data.id + '.entity', true))
                                } else
                                    resolve1()
                            })
                        }))

                        try {
                            await Promise.all(engine.entities.map(e => {
                                return new Promise((resolve) => {
                                    const str = JSON.stringify(e)
                                    fileSystem
                                        .updateEntity(str, e.id)
                                        .then(() => resolve())
                                })
                            }))
                        } catch (err) {
                            console.log(err)
                        }
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

