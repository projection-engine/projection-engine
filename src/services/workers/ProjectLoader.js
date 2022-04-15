import DirectionalLightComponent from "../engine/ecs/components/DirectionalLightComponent";

import MeshComponent from "../engine/ecs/components/MeshComponent";
import PickComponent from "../engine/ecs/components/PickComponent";
import PointLightComponent from "../engine/ecs/components/PointLightComponent";
import SkyboxComponent from "../engine/ecs/components/SkyboxComponent";
import SpotLightComponent from "../engine/ecs/components/SpotLightComponent";
import TransformComponent from "../engine/ecs/components/TransformComponent";
import FolderComponent from "../engine/ecs/components/FolderComponent";
import PhysicsBodyComponent from "../engine/ecs/components/PhysicsBodyComponent";
import ColliderComponent from "../engine/ecs/components/ColliderComponent";
import Entity from "../engine/ecs/basic/Entity";
import MaterialInstance from "../engine/instances/MaterialInstance";
import MeshInstance from "../engine/instances/MeshInstance";
import MaterialComponent from "../engine/ecs/components/MaterialComponent";
import SkylightComponent from "../engine/ecs/components/SkyLightComponent";
import CubeMapComponent from "../engine/ecs/components/CubeMapComponent";
import CubeMapInstance from "../engine/instances/CubeMapInstance";
import COMPONENTS from "../engine/templates/COMPONENTS";
import ScriptComponent from "../engine/ecs/components/ScriptComponent";
import CameraComponent from "../engine/ecs/components/CameraComponent";
import Transformation from "../engine/utils/workers/Transformation";
import ImageProcessor from "./image/ImageProcessor";


export default class ProjectLoader {
    static async getEntities(fileSystem) {
        let settings = new Promise(resolve => {
                fileSystem.readFile(fileSystem.path + '\\.settings', 'json')
                    .then(res => {
                        resolve({
                            type: 'settings',
                            data: res
                        })
                    })
            }),
            meta = new Promise(resolve => {
                fileSystem.readFile(fileSystem.path + '\\.meta', 'json')
                    .then(res => {
                        resolve({
                            type: 'meta',
                            data: res
                        })
                    })

            }),
            entities = fileSystem.fromDirectory(fileSystem.path + '\\logic', '.entity')

        return Promise
            .all([settings, meta, ...entities.map(e => {
                return new Promise(resolve => {
                    fileSystem.readFile(fileSystem.path + '\\logic\\' + e)
                        .then(res => {
                            resolve({
                                type: 'entity',
                                data: JSON.parse(res)
                            })
                        })
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
                                resolve(fileData)
                            })
                    } else
                        resolve(null)
                })
        })
    }

    static async cleanUpRegistry(fileSystem) {
        const fs = window.require('fs')
        new Promise(resolve => {
            fileSystem.readRegistry()
                .then(files => {
                    let deletePromises = []
                    files
                        .forEach(f => {
                            const path = fileSystem.path + '\\assets\\' + f.path
                            if (!fs.existsSync(path))
                                deletePromises.push(new Promise(resolve2 => {
                                    fs.rm(f.registryPath, () => {
                                        resolve2()
                                    })
                                }))
                        })
                    Promise.all(deletePromises)
                        .then(() => {
                            resolve()
                        })
                })
        })
    }

    static async loadProject(gpu, fileSystem) {
        await ProjectLoader.cleanUpRegistry(fileSystem)
        const projectData = await ProjectLoader.getEntities(fileSystem)

        let settings = projectData[0]
        let meta = projectData[1]
        let entitiesFound = projectData.filter(e => e.type === 'entity')
        let entities

        let meshes = [...new Set(entitiesFound.filter(e => e.data.components[COMPONENTS.MESH]).map(e => e.data.components.MeshComponent?.meshID))],
            skyboxes = [...new Set(
                entitiesFound
                    .filter(e => e.data.components?.SkyboxComponent)
                    .map(e => e.data.components.SkyboxComponent?.imageID)
            )
            ].map(e => new Promise(r => {
                ProjectLoader.readFromRegistry(e, fileSystem)
                    .then(fileData => {
                        if (fileData)
                            ImageProcessor.getImageBitmap(fileData)
                                .then(img => {
                                    r({
                                        type: 'skybox',
                                        data: img,
                                        id: e
                                    })
                                })
                         else
                            r(undefined)
                    })
            }))

        const entitiesWithMaterials = entitiesFound.map(e => e.data.components[COMPONENTS.MATERIAL]?.materialID).filter(e => e !== undefined)
        const entitiesWithScripts = entitiesFound.map(e => {
            if (e.data.components[COMPONENTS.SCRIPT])
                return e.data.components[COMPONENTS.SCRIPT]?.registryID
            else
                return e.data.blueprintID
        }).filter(e => e !== undefined)

        const scriptsToLoad = (await ProjectLoader.loadScripts([...new Set(entitiesWithScripts)], fileSystem, entitiesFound.length)).filter(e => e !== undefined)

        const levelBlueprint = await fileSystem.readFile(fileSystem.path + '\\levelBlueprint.flow', 'json')

        let meshData = (await ProjectLoader.loadMeshes(meshes, fileSystem, gpu)).filter(e => e !== undefined),
            skyboxData = (await Promise.all(skyboxes)).filter(e => e && e.type === 'skybox').map(e => e)

        const materialsToLoad = (await ProjectLoader.loadMaterials([...new Set(entitiesWithMaterials)], fileSystem, gpu)).filter(e => e !== undefined)

        try {
            entities = entitiesFound.map((entity, index) => ProjectLoader.mapEntity(entity.data, index, meshData, skyboxData, gpu, materialsToLoad))
        } catch (e) {
        }

        if (levelBlueprint)
            scriptsToLoad.push({
                script: {
                    id: fileSystem.projectID,
                    executors: levelBlueprint.response,
                    name: levelBlueprint.name
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
                                })
                            )
                        } else
                            r(undefined)
                    })
            })
        })

        return await Promise.all(promises)
    }

    static async loadScripts(toLoad, fileSystem, meshesLoaded, mapEntities = true, gpu, materials) {

        const promises = toLoad.map(m => {
            return new Promise(r => {

                ProjectLoader.readFromRegistry(m, fileSystem)
                    .then(fileData => {

                        if (fileData)
                            try {
                                const d = JSON.parse(fileData)
                                r({
                                    script: {
                                        id: m,
                                        executors: d.response,
                                        name: d.name
                                    },
                                    entities: mapEntities ? d.entities.map((e, i) => {
                                        return ProjectLoader.mapEntity(e, i + meshesLoaded, [], [], gpu, materials)
                                    }) : []
                                })
                            } catch (e) {
                                r()
                            }
                        else
                            r()
                    }).catch(() => r())
            })
        })

        return await Promise.all(promises)
    }

    static async loadMaterials(toLoad, fileSystem, gpu) {
        const promises = toLoad.map(m => {
            return new Promise(r => {

                ProjectLoader.readFromRegistry(m, fileSystem)
                    .then(fileData => {
                        if (fileData) {
                            let fileParsed
                            try {
                                fileParsed = JSON.parse(fileData)

                                if(fileParsed && Object.keys(fileParsed).length > 0)
                                    r(ProjectLoader.mapMaterial(fileParsed.response, gpu, m))
                                else
                                    r()

                            } catch (e) {
                                r()
                            }
                        } else
                            r()
                    }).catch(() => r())

            })
        })

        return await Promise.all(promises)
    }

    static mapMaterial({shader, uniforms, uniformData}, gpu, id) {
        const newD =  new MaterialInstance(gpu, id, shader, uniformData)
        newD.uniforms = uniforms
        return newD
    }

    static mapEntity(entity, index, meshes, skyboxes, gpu, materials) {

        const parsedEntity = new Entity(entity.id, entity.name, entity.active, entity.linkedTo)
        parsedEntity.blueprintID = entity.blueprintID

        Object.keys(entity.components).forEach(k => {
            let component = ENTITIES[k](entity, k, meshes, skyboxes, gpu, index, materials)
            if (component) {
                Object.keys(entity.components[k]).forEach(oK => {
                    if (!oK.includes("__"))
                        component[oK] = entity.components[k][oK]
                })
                parsedEntity.components[k] = component
            }
        })
        return parsedEntity
    }
}

const ENTITIES = {
    [COMPONENTS.DIRECTIONAL_LIGHT]: (entity, k) => new DirectionalLightComponent(entity.components[k].id),
    [COMPONENTS.SKYLIGHT]: (entity, k) => new SkylightComponent(entity.components[k].id),
    [COMPONENTS.MESH]: (entity, k) => new MeshComponent(entity.components[k].id),
    [COMPONENTS.PICK]: (entity, k, meshes, skyboxes, gpu, index) => new PickComponent(entity.components[k].id, index),
    [COMPONENTS.POINT_LIGHT]: (entity, k) => new PointLightComponent(entity.components[k].id),
    [COMPONENTS.SKYBOX]: (entity, k, _, skyboxes, gpu) => {
        const component = new SkyboxComponent(entity.components[k].id, gpu)
        const foundImage = skyboxes.find(i => i.id === entity.components[k].imageID)
        if (foundImage) {
            component.imageID = foundImage.id
            component.blob = foundImage.data
        }
        return component
    },
    [COMPONENTS.SPOT_LIGHT]: (entity, k) => new SpotLightComponent(entity.components[k].id),
    [COMPONENTS.MATERIAL]: (entity, k,meshes, skyboxes, gpu, index, materials) => {
        const newMat = new MaterialComponent(entity.components[k].id)
        const matFound = materials.find(m => m.id === entity.components[k].materialID)

        if(matFound)
            newMat.uniforms = matFound.uniforms
        return newMat
    },
    [COMPONENTS.TRANSFORM]: (entity, k) => {
        const component = new TransformComponent(entity.components[k].id, true)
        component.changed = true

        try{
            component.updateQuatOnEulerChange = false
            component.rotation = Transformation.getEuler(entity.components[k]._rotationQuat)
            component.updateQuatOnEulerChange = true
        }catch (e){ }

        return component
    },
    [COMPONENTS.FOLDER]: (entity, k) => new FolderComponent(entity.components[k].id),
    [COMPONENTS.PHYSICS]: (entity, k) => new PhysicsBodyComponent(entity.components[k].id),
    [COMPONENTS.CUBE_MAP]: (entity, k, meshes, skyboxes, gpu) => {
        const component = new CubeMapComponent(entity.components[k].id)
        component.cubeMap = new CubeMapInstance(gpu, component.resolution)

        return component
    },
    [COMPONENTS.COLLIDER]: (entity, k, meshes) => new ColliderComponent(entity.components[k].id, meshes.find(m => m.id === entity.components.MeshComponent.meshID)),
    [COMPONENTS.CAMERA]: (entity, k) => new CameraComponent(entity.components[k].id),
    [COMPONENTS.SCRIPT]: (entity, k) => new ScriptComponent(entity.components[k].id),

}