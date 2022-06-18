import {useCallback, useContext, useEffect} from "react"
import ProjectLoader from "../templates/ProjectLoader"
import GPUContextProvider from "../components/viewport/hooks/GPUContextProvider"
import FileSystem from "../utils/files/FileSystem"


export default function useSerializer(engine, settings, id) {
    let interval
    const {renderer} = useContext(GPUContextProvider)


    const saveSettings = async () => {
        let promise = []

        if (id) {
            const canvas = engine.gpu.canvas
            const preview = canvas.toDataURL()
            const res = await document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + ".meta")
            if (res) {
                const old = JSON.parse(res.toString())
                await document.fileSystem
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
        if (id) {
            await saveSettings()
            const all = await ProjectLoader.getEntities( )
            await Promise.all(all.map(a => {
                if (a && !engine.entities.find(e => e.id === a.id))
                    return document.fileSystem.deleteFile(document.fileSystem.path + FileSystem.sep + "logic" + FileSystem.sep + a.id + ".entity", true)
            }).filter(e => e))

            try {
                await Promise.all(engine.entities.map(e => {
                    const str = JSON.stringify(e)
                    return document.fileSystem.updateEntity(str, e.id)
                }))
            } catch (err) {
                console.error(err)
                alert.pushAlert("Error saving project", "error")
            }
            alert.pushAlert(
                "Project saved.",
                "success"
            )
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

