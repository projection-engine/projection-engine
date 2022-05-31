import {useEffect, useState} from "react"
import FileSystem from "../files/FileSystem"
import EVENTS from "../EVENTS"
import FILE_TYPES from "../../../../public/project/glTF/FILE_TYPES"

export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [scripts, setScripts] = useState([])
    const fileSystem = new FileSystem(projectID)
    const refresh = () => {
        fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = (reg.filter(r => r.path && r.path.includes(FILE_TYPES.IMAGE)))
                const meshesReg = (reg.filter(r => r.path && r.path.includes(FILE_TYPES.MESH)))
                const materialsReg = (reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)))
                const scriptReg = (reg.filter(r =>r.path &&  r.path.includes(FILE_TYPES.RAW_SCRIPT)))
                const promises = []

                promises.push(...imagesReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: "image",
                            registryID: i.id,
                            name: split[split.length - 1]
                        })
                    })
                }))

                promises.push(...meshesReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split(FileSystem.sep))
                        resolve({
                            type: "mesh",
                            registryID: i.id,
                            name: split[split.length - 1]
                        })

                    })
                }))
                promises.push(...materialsReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split(FileSystem.sep ))
                        resolve({
                            type: "material",
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))
                promises.push(...scriptReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split(FileSystem.sep))
                        resolve({
                            type: "flowRaw",
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))
                Promise.all(promises)
                    .then(res => {
                        setMeshes(res.filter(f => f.type === "mesh"))
                        setMaterials(res.filter(f => f.type === "material"))
                        setImages(res.filter(f => f.type === "image"))
                        setScripts(res.filter(f => f.type === "flowRaw"))
                        load.finishEvent(EVENTS.REFRESHING)
                    })

            })
    }
    useEffect(() => {
        refresh()
    }, [])
    return {
        fileSystem,
        images,
        meshes,
        materials,
        scripts,
        refresh
    }
}