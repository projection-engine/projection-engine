import {useState} from "react"
import FileSystem from "../utils/files/FileSystem"
import FILE_TYPES from "../../../public/project/glTF/FILE_TYPES"

export default function useQuickAccess( ) {
    const [state, setState] = useState({
        images: [],
        meshes: [],
        materials: [],
        scripts: []
    })
    const refresh = () => {
        document.fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.IMAGE)),
                    meshesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MESH)),
                    materialsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)),
                    scriptReg = reg.filter(r =>r.path &&  r.path.includes(FILE_TYPES.RAW_SCRIPT)),
                    bpReg = reg.filter(r =>r.path &&  r.path.includes(FILE_TYPES.SCRIPT) && !r.path.includes(FILE_TYPES.RAW_SCRIPT)),
                    promises = []

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
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: "mesh",
                            registryID: i.id,
                            name: split[split.length - 1]
                        })

                    })
                }))
                promises.push(...materialsReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep )
                        resolve({
                            type: "material",
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))
                promises.push(...scriptReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: "flowRaw",
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))
                promises.push(...bpReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)

                        resolve({
                            type: "flow",
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))

                Promise.all(promises)
                    .then(res => {
                        setState({
                            images: res.filter(f => f.type === "image"),
                            meshes: res.filter(f => f.type === "mesh"),
                            materials: res.filter(f => f.type === "material"),
                            scripts: [...res.filter(f => f.type === "flowRaw"), ...res.filter(f => f.type === "flow")]
                        })
                    })
            })
    }


    return [refresh, state]
}