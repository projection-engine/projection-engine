import importMesh from "./importMesh";
import EVENTS from "./EVENTS";
import MaterialInstance from "../../../../engine/shared/instances/MaterialInstance";
import {ENTITY_ACTIONS} from "../../../../engine/utils/entityReducer";
import ProjectLoader from "../workers/ProjectLoader";
import COMPONENTS from "../../../../engine/shared/templates/COMPONENTS";
import Entity from "../../../../engine/shared/ecs/basic/Entity";
import FolderComponent from "../../../../engine/shared/ecs/components/FolderComponent";
import ScriptComponent from "../../../../engine/shared/ecs/components/ScriptComponent";
import {HISTORY_ACTIONS} from "../hooks/historyReducer";

export default function handleDrop(event, fileSystem, engine, setAlert, load, asID, isBlueprint) {
    let entities = []
    load.pushEvent(EVENTS.LOADING_MESHES)

    try {
        entities = asID ? [event] : JSON.parse(event.dataTransfer.getData("text"))
    } catch (e) {
    }

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
                                        importMesh(mesh, engine, data, i, fileSystem, isBlueprint)
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
                                        }, engine, data, i, fileSystem, isBlueprint)
                                            .then(loadedData => {
                                                resolve(loadedData)
                                            })
                                })
                        else if (res && res.path.includes('.flow')) {
                            fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                                .then(script => {
                                    const meshesToLoad = script.entities.map(e => e.components[COMPONENTS.MESH]?.meshID).filter(e => e)
                                    ProjectLoader.loadMeshes(meshesToLoad, fileSystem, engine.gpu)
                                        .then(m => {
                                            const folder = new Entity()
                                            folder.id = res.id
                                            folder.name = script.name
                                            folder.isBlueprint = true
                                            folder.addComponent(new FolderComponent(undefined, script.name))

                                            const entities = script.entities.map((e, index) => {
                                                const ee = ProjectLoader.mapEntity(e, index, m, [], engine.gpu)
                                                ee.id = e.id
                                                ee.linkedTo = res.id
                                                ee.components[COMPONENTS.MESH].meshID = m[0].id
                                                ee.addComponent(new ScriptComponent())
                                                ee.components[COMPONENTS.SCRIPT].registryID = res.id
                                                return ee
                                            })


                                            engine.setScripts(prev => {
                                                return [...prev, {
                                                    executors: script.response,
                                                    id: res.id,
                                                    name: script.name
                                                }]
                                            })
                                            engine.setMeshes([...engine.meshes, ...m])
                                            engine.dispatchChanges({
                                                type: HISTORY_ACTIONS.PUSHING_DATA,
                                                payload: [...entities, folder]
                                            })
                                            engine.dispatchEntities({
                                                type: ENTITY_ACTIONS.PUSH_BLOCK,
                                                payload: [...entities, folder]
                                            })
                                            resolve()
                                        })
                                })
                        } else {
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
                const toApply = loadedData.filter(d => d?.mesh)

                let materialsIDs = removeDuplicated(toApply.map(m => m.material?.id).filter(m => m))

                const notRepeatedMaterials = toApply.map(m => {
                    const matIndex = m.material ? materialsIDs.indexOf(m.material.id) : -1
                    if (matIndex > -1) {
                        materialsIDs.splice(matIndex, 1)
                        const newMaterial = new MaterialInstance(engine.gpu, m.material.id)
                        newMaterial.initializeTextures(
                            m.material
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
                    engine.dispatchChanges({
                        type: HISTORY_ACTIONS.PUSHING_DATA,
                        payload: entities
                    })
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