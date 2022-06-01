import {useCallback, useContext, useEffect} from "react"


import EVENTS from "../EVENTS"
import ProjectLoader from "../workers/ProjectLoader"
import LoaderProvider from "../../../components/loader/LoaderProvider"
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider"
import FileSystem from "../files/FileSystem"


export default function useSerializer(engine, setAlert, settings, id, quickAccess) {

    const load = useContext(LoaderProvider)
    const fileSystem = quickAccess.fileSystem
    let interval
    const {renderer} = useContext(GPUContextProvider)


    const saveSettings = async () => {
        let promise = []

        if (id) {
            const canvas = engine.gpu.canvas
            const preview = canvas.toDataURL()
            const res = await fileSystem.readFile(fileSystem.path + FileSystem.sep + ".meta")
            if (res) {
                const old = JSON.parse(res.toString())
                await fileSystem
                    .updateProject(
                        {
                            ...old,
                            preview: preview,
                            entities: engine.entities.length,
                            meshes: engine.meshes.length,
                            materials: engine.materials.length,
                            lastModification: (new Date()).toDateString(),
                            creation: settings.creationDate
                        },
                        {
                            ...settings,
                            cameraPosition: renderer.camera.position,
                            yaw: renderer.camera.yaw,
                            pitch: renderer.camera.pitch,
                        })
            }
        }
        return Promise.all(promise)
    }

    const save = useCallback(async () => {
        setAlert({message: "Saving project", type: "info"})
        if (id) {
            await saveSettings()
            const all = await ProjectLoader.getEntities(fileSystem)
            await Promise.all(all.map(a => {
                if (a && !engine.entities.find(e => e.id === a.id))
                    return fileSystem.deleteFile(fileSystem.path + FileSystem.sep + "logic" + FileSystem.sep + a.id + ".entity", true)
            }).filter(e => e))

            try {
                await Promise.all(engine.entities.map(e => {
                    const str = JSON.stringify(e)
                    return fileSystem.updateEntity(str, e.id)
                }))
            } catch (err) {
                console.error(err)
            }
            setAlert({
                type: "success",
                message: "Project saved."
            })
            load.finishEvent(EVENTS.PROJECT_SAVE)
        } else
            setAlert({message: "Error saving project", type: "error"})
    }, [engine.entities, settings, id, renderer])


    useEffect(() => {
        interval = setInterval(save, 300000)
        return () => {
            clearInterval(interval)
        }
    }, [settings.timestamp, engine.entities])

    return {
        saveSettings,
        save
    }
}

