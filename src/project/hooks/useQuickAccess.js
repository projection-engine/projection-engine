import {useState} from "react"
import FileSystem from "../utils/files/FileSystem"
import FILE_TYPES from "../../../public/static/FILE_TYPES"

export default function useQuickAccess( ) {
    const [state, setState] = useState({
        images: [],
        meshes: [],
        materials: [],
        scripts: []
    })
    const refresh = () => {
        window.fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.IMAGE)),
                    meshesReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MESH)),
                    materialsReg = reg.filter(r => r.path && r.path.includes(FILE_TYPES.MATERIAL)),
                    scriptReg = reg.filter(r =>r.path &&  r.path.includes(FILE_TYPES.SCRIPT)),
                    promises = []

                promises.push(...imagesReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: FILE_TYPES.IMAGE,
                            registryID: i.id,
                            name: split[split.length - 1]
                        })
                    })
                }))

                promises.push(...meshesReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: FILE_TYPES.MESH,
                            registryID: i.id,
                            name: split[split.length - 1]
                        })

                    })
                }))
                promises.push(...materialsReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep )
                        resolve({
                            type: FILE_TYPES.MATERIAL,
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))
                promises.push(...scriptReg.map(i => {
                    return new Promise(resolve => {
                        const split = i.path.split(FileSystem.sep)
                        resolve({
                            type: FILE_TYPES.SCRIPT,
                            registryID: i.id,
                            name: split[split.length - 1].split(".")[0]
                        })
                    })
                }))


                Promise.all(promises)
                    .then(res => {
                        setState({
                            images: res.filter(f => f.type === FILE_TYPES.IMAGE),
                            meshes: res.filter(f => f.type === FILE_TYPES.MESH),
                            materials: res.filter(f => f.type ===  FILE_TYPES.MATERIAL),
                            scripts: res.filter(f => f.type === FILE_TYPES.SCRIPT)
                        })
                    })
            })
    }


    return [refresh, state]
}