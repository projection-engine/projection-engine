import {useEffect, useState} from "react";
import FileSystem from "../workers/files/FileSystem";
import EVENTS from "../utils/EVENTS";

const fs = window.require('fs')
export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [scripts, setScripts] = useState([])

    const fileSystem = new FileSystem(projectID)


    const refresh = () => {
        load.pushEvent(EVENTS.REFRESHING)
        fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = (reg.filter(r => r.path.includes('.pimg')))
                const meshesReg = (reg.filter(r => r.path.includes('.mesh')))
                const materialsReg = (reg.filter(r => r.path.includes('.material')))
                const scriptReg = (reg.filter(r => r.path.includes('.flow')))

                let promises = []

                promises.push(...imagesReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        resolve({
                            type: 'image',
                            registryID: i.id,
                            name: split[split.length - 1]
                        })
                    })
                }))

                promises.push(...meshesReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        resolve({
                            type: 'mesh',
                            registryID: i.id,
                            name: split[split.length - 1]
                        })

                    })
                }))
                promises.push(...materialsReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        resolve({
                            type: 'material',
                            registryID: i.id,
                            name: split[split.length - 1].split('.')[0]
                        })
                    })
                }))
                promises.push(...scriptReg.map(i => {
                    return new Promise(resolve => {
                        const split = (i.path.split('\\'))
                        resolve({
                            type: 'flow',
                            registryID: i.id,
                            name: split[split.length - 1].split('.')[0]
                        })
                    })
                }))
                Promise.all(promises)
                    .then(res => {
                        setMeshes(res.filter(f => f.type === 'mesh'))
                        setMaterials(res.filter(f => f.type === 'material'))
                        setImages(res.filter(f => f.type === 'image'))
                        setScripts(res.filter(f => f.type === 'flow'))
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