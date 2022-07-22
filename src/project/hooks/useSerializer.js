import {useCallback, useEffect} from "react"
import FileSystem from "../libs/FileSystem"


export default function useSerializer(settings) {
    async function updateSettings(metaData) {
        const entities = window.renderer.entities
        const meshes = window.renderer.meshes
        const materials = window.renderer.materials
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
                }
            )
    }

    async function removeDeletedEntities() {
        const allEntities = await window.fileSystem.fromDirectory(window.fileSystem.path + FileSystem.sep + "logic", ".entity")
        const all = await Promise.all(allEntities.map(e => window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "logic" + FileSystem.sep + e, "json", true)))
        for (let i = 0; i < all.length; i++) {
            const entity = all[i]
            if (!entity || window.renderer.entitiesMap.get(entity.id))
                continue
            await window.fileSystem.deleteFile("logic" + FileSystem.sep + entity.id + ".entity")
        }
    }

    async function parseEntity(entity) {
        return JSON.stringify(
            entity.serializable(),
            (key, value) => {
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
    }

    useEffect(() => {
        const interval = setInterval(save, 300000)
        return () => clearInterval(interval)
    }, [settings])

    const save = useCallback(async () => {
        const entities = window.renderer.entities
        const metaData = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + ".meta")
        if (metaData) {
            await updateSettings(metaData)
            await removeDeletedEntities()
            try {
                for (let i = 0; i < entities.length; i++)
                    await window.fileSystem.updateEntity(parseEntity(entities[i]), entities[i].id)
            } catch (err) {
                console.error(err)
                alert.pushAlert("Error saving project", "error")
            }
            alert.pushAlert(
                "Project saved.",
                "success"
            )
            return
        }
        alert.pushAlert("Error saving project", "error")
    }, [settings])

    return save
}

