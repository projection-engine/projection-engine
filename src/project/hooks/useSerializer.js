import {useCallback, useContext, useEffect} from "react"


import EVENTS from "../../static/misc/EVENTS"
import ProjectLoader from "../templates/ProjectLoader"
import LoaderProvider from "../../components/loader/LoaderProvider"
import GPUContextProvider from "../components/viewport/hooks/GPUContextProvider"
import FileSystem from "../utils/files/FileSystem"


export default function useSerializer(engine, settings, id, quickAccess) {

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
        alert.pushAlert("Saving project", "info")
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
            alert.pushAlert(
                "Project saved.",
                "success"
            )
            load.finishEvent(EVENTS.PROJECT_SAVE)
        } else
            alert.pushAlert("Error saving project", "error")
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

