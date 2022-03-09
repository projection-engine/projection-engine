import importMesh from "./importMesh";
import EVENTS from "./misc/EVENTS";
import MaterialInstance from "../engine/instances/MaterialInstance";
import {ENTITY_ACTIONS} from "./entityReducer";

export default function handleDrop(event, fileSystem, engine, setAlert, load, asID) {
    let entities = []
    load.pushEvent(EVENTS.LOADING_MESHES)

    try {
        entities = asID ? [event] : JSON.parse(event.dataTransfer.getData("text"))
    } catch (e) {
    }
    console.log(entities, asID, event)
    let promises = []
    for (let i = 0; i < entities.length; i++) {
        promises.push(
            new Promise(resolve => {
                const data = entities[i]
                fileSystem.readRegistryFile(data)
                    .then(res => {
                        if (res && (res.path.includes('.mesh') || res.path.includes('.terrain')))
                            fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                                .then(mesh => {
                                    if (res.path.includes('.mesh'))
                                        importMesh(mesh, engine, data, i, fileSystem)
                                            .then(loadedData => {
                                                resolve(loadedData)
                                            })
                                    else // TODO - IMPORT ESPECIFICO PARA TERRAIN
                                        importMesh({
                                            ...mesh,
                                            id: res.id,
                                            translation: [0, 0, 0],
                                            scaling: [1, 1, 1],
                                            rotation: [0, 0, 0]
                                        }, engine, data, i, fileSystem)
                                            .then(loadedData => {
                                                resolve(loadedData)
                                            })
                                })

                        else {
                            setAlert({
                                type: 'info',
                                message: 'Not a mesh file.'
                            })
                            resolve()
                        }
                    })
            })
        )
    }
    return new Promise(resolveRoot => {
        Promise.all(promises)
            .then(loadedData => {
                const toApply = loadedData.filter(d => d.mesh)
                let materialsIDs = removeDuplicated(toApply.map(m => m.material?.id).filter(m => m))

                const notRepeatedMaterials = toApply.map(m => {
                    const matIndex = m.material ? materialsIDs.indexOf(m.material.id) : -1
                    if (matIndex > -1) {
                        materialsIDs.splice(matIndex, 1)
                        const newMaterial = new MaterialInstance(engine.gpu, m.material.id)
                        newMaterial.initializeTextures(
                            m.material.albedo,
                            m.material.metallic,
                            m.material.roughness,
                            m.material.normal,
                            m.material.height,
                            m.material.ao
                        ).catch()
                        return newMaterial
                    } else
                        return undefined
                }).filter(m => m !== undefined)
                const notRepeatedMeshes = toApply.map(m => {
                    if (!m.existsMesh)
                        return m.mesh
                    else
                        return undefined
                }).filter(m => m !== undefined)

                engine.setMaterials(prev => {
                    return [...prev, ...notRepeatedMaterials]
                })
                engine.setMeshes(prev => {
                    return [...prev, ...notRepeatedMeshes]
                })
                if (!asID) {
                    const entities = toApply.map(m => {
                        return m.entity
                    }).filter(m => m !== undefined)
                    engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
                }
                load.finishEvent(EVENTS.LOADING_MESHES)

                resolveRoot()
            })
    })
}

function removeDuplicated(ids) {
    let unique = {};
    ids.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}