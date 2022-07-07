import {useCallback, useEffect} from "react"
import ProjectLoader from "../utils/ProjectLoader"
import FileSystem from "../utils/files/FileSystem"


export default function useSerializer( settings, id) {

    const save = useCallback(async () => {
        if (id) {
            const entities = window.renderer.allEntities
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
                            cameraPosition: window.renderer.camera.position,
                            yaw: window.renderer.camera.yaw,
                            pitch: window.renderer.camera.pitch,
                        })
            }
            const all = await ProjectLoader.getEntities()
            for (let i = 0; i < all.length; i++) {
                const entity = all[i]
                if (entity && !window.renderer.entitiesMap.get(entity.id))
                    await window.fileSystem.deleteFile("logic" + FileSystem.sep + entity.id + ".entity")
            }
            try {
                for(let i = 0; i < entities.length; i++){
                    const entity = entities[i]
                    const str = JSON.stringify(entity)
                    await window.fileSystem.updateEntity(str, entity.id)
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

