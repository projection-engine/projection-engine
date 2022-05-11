import DirectionalLightComponent from "../../engine/components/DirectionalLightComponent";

import MeshComponent from "../../engine/components/MeshComponent";
import PointLightComponent from "../../engine/components/PointLightComponent";
import SkyboxComponent from "../../engine/components/SkyboxComponent";
import SpotLightComponent from "../../engine/components/SpotLightComponent";
import TransformComponent from "../../engine/components/TransformComponent";
import FolderComponent from "../../engine/components/FolderComponent";
import PhysicsBodyComponent from "../../engine/components/PhysicsBodyComponent";
import Entity from "../../engine/basic/Entity";
import MaterialInstance from "../../engine/instances/MaterialInstance";
import MeshInstance from "../../engine/instances/MeshInstance";
import MaterialComponent from "../../engine/components/MaterialComponent";
import SkylightComponent from "../../engine/components/SkyLightComponent";
import CubeMapComponent from "../../engine/components/CubeMapComponent";
import CubeMapInstance from "../../engine/instances/CubeMapInstance";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import ScriptComponent from "../../engine/components/ScriptComponent";
import CameraComponent from "../../engine/components/CameraComponent";
import Transformation from "../../engine/instances/Transformation";
import ImageProcessor from "../../engine/utils/image/ImageProcessor";
import {DATA_TYPES} from "../../engine/templates/DATA_TYPES";
import TextureInstance from "../../engine/instances/TextureInstance";
import AsyncFS from "../../../components/AsyncFS";

export default class ProjectLoader {
    static async loadProject(gpu, fileSystem) {
        await ProjectLoader.cleanUpRegistry(fileSystem)
        let projectData = await ProjectLoader.getEntities(fileSystem)

        let settings = projectData[0]
        let meta = projectData[1]
        let entitiesFound = projectData.filter(e => e.type === 'entity')
        let entities
        let meshes = [...new Set(entitiesFound.filter(e => e.data.components[COMPONENTS.MESH]).map(e => e.data.components.MeshComponent?.meshID))]
        const entitiesWithMaterials = entitiesFound.map(e => e.data.components[COMPONENTS.MATERIAL]?.materialID).filter(e => e !== undefined)
        const entitiesWithScripts = entitiesFound.map(e => {
            const comp = e.data.components[COMPONENTS.SCRIPT]
            if (comp) {
                if (comp.registryID) return comp.registryID
                return comp.scripts
            } else return e.data.blueprintID
        }).filter(e => e !== undefined)

        const toLoadScripts = [...new Set(entitiesWithScripts.flat())],
            scriptsToLoad = (await ProjectLoader.loadScripts(toLoadScripts, fileSystem, entitiesFound.length)).filter(e => e !== undefined),
            levelBlueprint = await fileSystem.readFile(fileSystem.path + '\\levelBlueprint.flow', 'json'),
            meshData = (await ProjectLoader.loadMeshes(meshes, fileSystem, gpu)).filter(e => e !== undefined),
            materialsToLoad = (await ProjectLoader.loadMaterials([...new Set(entitiesWithMaterials)], fileSystem, gpu)).filter(e => e !== undefined)


        try {
            entities = await Promise.all(entitiesFound.map((entity) => ProjectLoader.mapEntity(entity.data, gpu, fileSystem)))
        } catch (e) {
        }

        if (levelBlueprint) scriptsToLoad.push({
            script: {
                id: fileSystem.projectID, executors: levelBlueprint.response, name: levelBlueprint.name
            }
        })

        return {
            meta,
            settings,
            entities,
            scripts: scriptsToLoad.map(s => s.script),
            materials: materialsToLoad,
            meshes: meshData
        }
    }

    static async getEntities(fileSystem) {
        let settings = new Promise(async resolve => {
                try {
                    const res = await fileSystem.readFile(fileSystem.path + '\\.settings', 'json', true)
                    resolve({
                        type: 'settings', data: res ? res : {}
                    })
                } catch (e) {
                    resolve()
                }
            }), meta = new Promise(async resolve => {
                try {
                    const res = await fileSystem.readFile(fileSystem.path + '\\.meta', 'json', true)
                    resolve({
                        type: 'meta', data: res ? res : {}
                    })
                } catch (e) {
                    resolve()
                }
            }),
            entities = await fileSystem.fromDirectory(fileSystem.path + '\\logic', '.entity')

        return Promise
            .all([settings, meta, ...entities.map(e => {

                return new Promise(async resolve => {
                    try {
                        const res = await fileSystem.readFile(fileSystem.path + '\\logic\\' + e, 'json', true)
                        resolve({
                            type: 'entity', data: res
                        })
                    } catch (e) {
                        resolve()
                    }
                })
            })])
    }

    static async readFromRegistry(fileID, fileSystem) {
        return new Promise(resolve => {
            fileSystem.readRegistryFile(fileID)
                .then(lookUpTable => {

                    if (lookUpTable) {
                        fileSystem.readFile(fileSystem.path + '\\assets\\' + lookUpTable.path)
                            .then(fileData => {
                                if (fileData) resolve(fileData)
                                else resolve(null)
                            }).catch(() => resolve(null))
                    } else resolve(null)
                }).catch(() => resolve(null))
        })
    }

    static async cleanUpRegistry(fileSystem) {
        const files = await fileSystem.readRegistry()
        for (let i in files) {
            const f = files[i]
            const path = fileSystem.path + '\\assets\\' + f.path
            if (!(await AsyncFS.exists(path)))
                await AsyncFS.rm(f.registryPath)
        }
    }


    static async loadMeshes(toLoad, fileSystem, gpu) {
        const promises = toLoad.map(m => {
            return new Promise(r => {
                ProjectLoader.readFromRegistry(m, fileSystem)
                    .then(fileData => {
                        if (fileData) {
                            const parsed = JSON.parse(fileData)
                            r(new MeshInstance({
                                vertices: parsed.vertices,
                                indices: parsed.indices,
                                normals: parsed.normals,
                                uvs: parsed.uvs,
                                id: m,
                                maxBoundingBox: parsed.maxBoundingBox,
                                minBoundingBox: parsed.minBoundingBox,
                                gpu: gpu,
                                tangents: parsed.tangents,
                                wireframeBuffer: true,
                                material: parsed.material
                            }))
                        } else r(undefined)
                    }).catch(() => r())
            })
        })

        return await Promise.all(promises)
    }

    static async loadScripts(toLoad, fileSystem, meshesLoaded, mapEntities = true, gpu, materials) {

        const promises = toLoad.map(m => {
            return new Promise(async r => {
                const fileData = await ProjectLoader.readFromRegistry(m, fileSystem)

                if (fileData) try {
                    const d = JSON.parse(fileData)

                    r({
                        script: {
                            id: m, executors: d.response, name: d.name
                        }, entities: mapEntities ? await Promise.all(d.entities.map((e, i) => {
                            return ProjectLoader.mapEntity(e, gpu, fileSystem)
                        })) : []
                    })
                } catch (e) {
                    r({
                        script: {
                            id: m, executors: fileData
                        }, entities: []
                    })
                } else r()
            })
        })

        return await Promise.all(promises)
    }

    static async loadMaterials(toLoad, fileSystem, gpu) {
        const result = []
        for (let i in toLoad) {
            const m = toLoad[i]
            const fileData = await ProjectLoader.readFromRegistry(m, fileSystem)
            if (fileData) {
                let fileParsed
                try {
                    fileParsed = JSON.parse(fileData)
                    if (fileParsed && Object.keys(fileParsed).length > 0)
                        result.push(await ProjectLoader.mapMaterial(fileParsed.response, gpu, m))
                } catch (e) {
                }
            }
        }
        return result
    }

    static async mapMaterial({cubeMapShader, shader, vertexShader, uniforms, uniformData, settings}, gpu, id) {
        let newMat
        await new Promise(resolve => {
            newMat = new MaterialInstance(gpu, vertexShader, shader, uniformData, settings, () => resolve(), id, cubeMapShader?.code)
        })
        newMat.uniforms = uniforms
        return newMat
    }

    static async mapEntity(entity, gpu, fileSystem) {
        const parsedEntity = new Entity(entity.id, entity.name, entity.active, entity.linkedTo)
        parsedEntity.blueprintID = entity.blueprintID

        for (const k in entity.components) {
            if (typeof ENTITIES[k] === 'function') {
                let component = await ENTITIES[k](entity, k, gpu, fileSystem)
                if (component) {

                    if (k !== COMPONENTS.MATERIAL) Object.keys(entity.components[k]).forEach(oK => {
                        if (!oK.includes("__")) component[oK] = entity.components[k][oK]
                    })
                    parsedEntity.components[k] = component
                }
            }
        }
        return parsedEntity
    }
}

const ENTITIES = {
    [COMPONENTS.DIRECTIONAL_LIGHT]: async (entity, k) => new DirectionalLightComponent(entity.components[k].id),
    [COMPONENTS.SKYLIGHT]: async (entity, k) => new SkylightComponent(entity.components[k].id),
    [COMPONENTS.MESH]: async (entity, k) => new MeshComponent(entity.components[k].id),

    [COMPONENTS.POINT_LIGHT]: async (entity, k) => new PointLightComponent(entity.components[k].id),
    [COMPONENTS.SKYBOX]: async (entity, k, gpu, fileSystem) => {
        const component = new SkyboxComponent(entity.components[k].id, gpu)
        const fileData = await ProjectLoader.readFromRegistry(entity.components[k].imageID, fileSystem)
        if (fileData) {
            const img = await ImageProcessor.getImageBitmap(fileData)
            component.imageID = entity.components[k].imageID
            component.blob = img
        }
        return component
    },
    [COMPONENTS.SPOT_LIGHT]: async (entity, k) => new SpotLightComponent(entity.components[k].id),
    [COMPONENTS.MATERIAL]: async (entity, k, gpu, fileSystem) => {
        const newMat = new MaterialComponent(entity.components[k].id)

        newMat.materialID = entity.components[k].materialID
        const toLoad = (entity.components[k].uniforms ? entity.components[k].uniforms : []).map(u => {
            if (u.type === DATA_TYPES.TEXTURE && u.modified) return new Promise(async resolve => {
                const fileData = await ProjectLoader.readFromRegistry(u.value, fileSystem)
                if (fileData) {
                    let texture
                    await new Promise(r => {
                        const k = u.format
                        texture = new TextureInstance(fileData, k.yFlip, gpu, gpu[k.internalFormat], gpu[k.format], true, false, gpu.UNSIGNED_BYTE, undefined, undefined, 0, () => {
                            r()
                        })
                    })
                    resolve({key: u.key, value: texture.texture, changed: true})
                }
            })
            return new Promise(resolve => resolve(u))
        })
        newMat.uniforms = entity.components[k].uniforms
        newMat.overrideMaterial = entity.components[k].overrideMaterial
        newMat.uniformValues = {}
        const values = await Promise.all(toLoad)
        newMat.uniformValues = {...entity.components[k].uniformValues}
        values.forEach(dd => {
            if (dd.changed) newMat.uniformValues[dd.key] = dd.value
        })

        newMat.doubleSided = entity.components[k].doubleSided
        newMat.overrideMaterial = entity.components[k].overrideMaterial
        return newMat
    },
    [COMPONENTS.TRANSFORM]: async (entity, k) => {
        const component = new TransformComponent(entity.components[k].id, true)
        component.changed = true
        try {
            component.updateQuatOnEulerChange = false
            component.rotation = Transformation.getEuler(entity.components[k]._rotationQuat)
            component.updateQuatOnEulerChange = true
        } catch (e) {
        }
        return component
    },
    [COMPONENTS.FOLDER]: async (entity, k) => new FolderComponent(entity.components[k].id),
    [COMPONENTS.PHYSICS]: async (entity, k) => new PhysicsBodyComponent(entity.components[k].id),
    [COMPONENTS.CUBE_MAP]: async (entity, k, gpu) => {
        const component = new CubeMapComponent(entity.components[k].id)
        component.cubeMap = new CubeMapInstance(gpu, component.resolution)

        return component
    }, // [COMPONENTS.COLLIDER]: (entity, k, meshes) => new ColliderComponent(entity.components[k].id, meshes.find(m => m.id === entity.components.MeshComponent.meshID)),
    [COMPONENTS.CAMERA]: async (entity, k) => new CameraComponent(entity.components[k].id),
    [COMPONENTS.SCRIPT]: async (entity, k) => new ScriptComponent(entity.components[k].id),

}