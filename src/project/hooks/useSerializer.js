import {useCallback, useEffect} from "react"
import ProjectLoader from "../libs/ProjectLoader"
import FileSystem from "../libs/FileSystem"


export default function useSerializer(settings) {

    const save = useCallback(async () => {
        const entities = window.renderer.entities
        const meshes = window.renderer.meshes
        const materials = window.renderer.materials
        const metaData = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + ".meta")
        if (metaData) {
            const old = JSON.parse(metaData.toString())
            await window.fileSystem
                .updateProject(
                    {
                        ...old,
                        entities: entities.length,
                        meshes: meshes.length,
                        materials: materials.length,
                        lastModification: (new Date()).toDateString(),
                        creation: settings.creationDate
                    },
                    {
                        ...settings,
                        cameraPosition: window.renderer.camera.centerOn,
                        yaw: window.renderer.camera.yaw,
                        pitch: window.renderer.camera.pitch,
                    })
      
            const all = await ProjectLoader.getEntities()
            for (let i = 0; i < all.length; i++) {
                const entity = all[i]
                if (entity && !window.renderer.entitiesMap.get(entity.id))
                    await window.fileSystem.deleteFile("logic" + FileSystem.sep + entity.id + ".entity")
            }
            try {
                for (let i = 0; i < entities.length; i++) {

                    const jsonStr = JSON.stringify(entities[i].serializable(), (key, value) => {
                        if (value instanceof Int8Array ||
							value instanceof Uint8Array ||
							value instanceof Uint8ClampedArray ||
							value instanceof Int16Array ||
							value instanceof Uint16Array ||
							value instanceof Int32Array ||
							value instanceof Uint32Array ||
							value instanceof Float32Array ||
							value instanceof Float64Array)
                            return Array.from(value)

                        return value
                    })
                    await window.fileSystem.updateEntity(jsonStr, entities[i].id)
                }
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
    }, [settings])
    useEffect(() => {
        const interval = setInterval(save, 300000)
        return () => clearInterval(interval)
    }, [settings])
    return save
}

