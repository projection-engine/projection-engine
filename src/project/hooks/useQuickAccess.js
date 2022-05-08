import {useEffect, useState} from "react";
import FileSystem from "../utils/workers/files/FileSystem";
import EVENTS from "../utils/EVENTS";
import ImageProcessor from "../engine/utils/image/ImageProcessor";
import Entity from "../engine/basic/Entity";
import COMPONENTS from "../engine/templates/COMPONENTS";
import SkyboxComponent from "../engine/components/SkyboxComponent";

export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [scripts, setScripts] = useState([])
    const [sampleSkybox, setSampleSkybox] = useState()
    useEffect(() => {
        import('../../static/sky.json')
            .then(img => {
                ImageProcessor.getImageBitmap(img.data)
                    .then(res => {
                        const newEntity = new Entity(undefined, 'sky')
                        newEntity.components[COMPONENTS.SKYBOX] = new SkyboxComponent()
                        newEntity.components[COMPONENTS.SKYBOX].blob = res
                        newEntity.components[COMPONENTS.SKYBOX].gamma = .5
                        newEntity.components[COMPONENTS.SKYBOX].exposure = 1

                        setSampleSkybox(newEntity)
                    })
            })
    }, [])
    const fileSystem = new FileSystem(projectID)
    const refresh = () => {
        load.pushEvent(EVENTS.REFRESHING)
        fileSystem.readRegistry()
            .then(reg => {
                const imagesReg = (reg.filter(r => r.path.includes('.pimg')))
                const meshesReg = (reg.filter(r => r.path.includes('.mesh')))
                const materialsReg = (reg.filter(r => r.path.includes('.material')))
                const scriptReg = (reg.filter(r => r.path.includes('.flowRaw')))

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
                            type: 'flowRaw',
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
                        setScripts(res.filter(f => f.type === 'flowRaw'))
                        load.finishEvent(EVENTS.REFRESHING)
                    })

            })
    }
    useEffect(() => {
        refresh()
    }, [])
    return {
        sampleSkybox,
        fileSystem,
        images,
        meshes,
        materials,
        scripts,
        refresh
    }
}