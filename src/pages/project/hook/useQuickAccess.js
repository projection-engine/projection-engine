import {useEffect, useState} from "react";
import FileSystem from "../../../services/workers/FileSystem";
import EVENTS from "../../../services/utils/misc/EVENTS";

const fs = window.require('fs')
export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

    const fileSystem = new FileSystem(projectID)


    const refresh = () => {
        load.pushEvent(EVENTS.REFRESHING)
        fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = (reg.filter(r => r.path.includes('.pimg')))
                const meshesReg = (reg.filter(r => r.path.includes('.mesh')))
                const materialsReg = (reg.filter(r => r.path.includes('.material')))

                let promises = []

                promises.push(...imagesReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        fileSystem.readFile(fileSystem.path + '\\previews\\' + i.id + '.preview')
                            .then(preview => {
                                resolve({
                                    type: 'image',
                                    registryID: i.id,
                                    name: split[split.length  -1],
                                     preview
                                })
                            })
                    })
                }))

                promises.push(...meshesReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        fileSystem.readFile(fileSystem.path + '\\previews\\' + i.id + '.preview')
                            .then(preview => {
                                resolve({
                                    type: 'mesh',
                                    registryID: i.id,
                                    name: split[split.length  -1],
                                     preview
                                })
                            })
                    })
                }))
                promises.push(...materialsReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        fileSystem.readFile(fileSystem.path + '\\previews\\' + i.id + '.preview')
                            .then(preview => {
                                resolve({
                                    type: 'material',
                                    registryID: i.id,
                                    name: split[split.length  -1].split('.')[0],
                                     preview
                                })
                            })
                    })
                }))

               Promise.all(promises)
                    .then(res => {
                        setMeshes(res.filter(f => f.type === 'mesh'))
                        setMaterials(res.filter(f => f.type === 'material'))
                        setImages(res.filter(f => f.type === 'image'))
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
        refresh
    }
}