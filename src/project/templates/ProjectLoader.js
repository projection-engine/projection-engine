import DirectionalLightComponent from "../engine/components/DirectionalLightComponent"

import MeshComponent from "../engine/components/MeshComponent"
import PointLightComponent from "../engine/components/PointLightComponent"
import SpotLightComponent from "../engine/components/SpotLightComponent"
import TransformComponent from "../engine/components/TransformComponent"
import FolderComponent from "../engine/components/FolderComponent"
import PhysicsBodyComponent from "../engine/components/PhysicsBodyComponent"
import Entity from "../engine/basic/Entity"
import MaterialInstance from "../engine/instances/MaterialInstance"
import MaterialComponent from "../engine/components/MaterialComponent"
import CubeMapComponent from "../engine/components/CubeMapComponent"
import CubeMapInstance from "../engine/instances/CubeMapInstance"
import COMPONENTS from "../engine/templates/COMPONENTS"
import CameraComponent from "../engine/components/CameraComponent"
import Transformation from "../engine/templates/Transformation"
import {DATA_TYPES} from "../engine/templates/DATA_TYPES"
import TextureInstance from "../engine/instances/TextureInstance"
import FileSystem from "../utils/files/FileSystem"

export default class ProjectLoader {


    static async getEntities() {
        const entities = await window.fileSystem.fromDirectory(window.fileSystem.path + FileSystem.sep + "logic", ".entity")
        return await Promise.all(entities.map(e =>window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep +  "logic" +  FileSystem.sep + e, "json", true)))
    }

    static async readFromRegistry(fileID) {
        return new Promise(resolve => {
            window.fileSystem.readRegistryFile(fileID)
                .then(lookUpTable => {

                    if (lookUpTable) {
                        window.fileSystem.readFile(window.fileSystem.path +  FileSystem.sep + "assets" + FileSystem.sep +  lookUpTable.path)
                            .then(fileData => {
                                if (fileData) resolve(fileData)
                                else resolve(null)
                            }).catch(() => resolve(null))
                    } else resolve(null)
                }).catch(() => resolve(null))
        })
    }
 
    static async mapMaterial({cubeMapShader, shader, vertexShader, uniforms, uniformData, settings}, id) {
        let newMat
        await new Promise(resolve => {
            newMat = new MaterialInstance(vertexShader, shader, uniformData, settings, () => resolve(), id, cubeMapShader?.code)
        })
        newMat.uniforms = uniforms
        return newMat
    }

    static async mapEntity(entity) {
        const parsedEntity = new Entity(entity.id, entity.name, entity.active, entity.linkedTo)
        Object.keys(entity).forEach(k => {
            if(k !== "components")
                parsedEntity[k] = entity[k]
        })

        for (const k in entity.components) {
            if (typeof ENTITIES[k] === "function") {
                let component = await ENTITIES[k](entity, k)
                if (component) {

                    if (k !== COMPONENTS.MATERIAL) Object.keys(entity.components[k]).forEach(oK => {
                        if (!oK.includes("__") && !oK.includes("#")) component[oK] = entity.components[k][oK]
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
    [COMPONENTS.MESH]: async (entity, k) => new MeshComponent(entity.components[k].id),

    [COMPONENTS.POINT_LIGHT]: async (entity, k) => new PointLightComponent(entity.components[k].id),
    [COMPONENTS.SPOT_LIGHT]: async (entity, k) => new SpotLightComponent(entity.components[k].id),
    [COMPONENTS.MATERIAL]: async (entity, k) => {
        const newMat = new MaterialComponent(entity.components[k].id)

        newMat.materialID = entity.components[k].materialID
        const toLoad = (entity.components[k].uniforms ? entity.components[k].uniforms : []).map(u => {
            if (u.type === DATA_TYPES.TEXTURE && u.modified) return new Promise(async resolve => {
                const fileData = await ProjectLoader.readFromRegistry(u.value)
                if (fileData) {
                    let texture
                    await new Promise(r => {
                        const k = u.format
                        texture = new TextureInstance(fileData, k.yFlip, window.gpu[k.internalFormat], window.gpu[k.format], true, false, window.gpu.UNSIGNED_BYTE, undefined, undefined, 0, () => {
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
            console.error(e)
        }
        return component
    },
    [COMPONENTS.FOLDER]: async (entity, k) => new FolderComponent(entity.components[k].id),
    [COMPONENTS.PHYSICS]: async (entity, k) => new PhysicsBodyComponent(entity.components[k].id),
    [COMPONENTS.CUBE_MAP]: async (entity, k) => {
        const component = new CubeMapComponent(entity.components[k].id)
        component.cubeMap = new CubeMapInstance(component.resolution)

        return component
    },
    // [COMPONENTS.COLLIDER]: (entity, k, meshes) => new ColliderComponent(entity.components[k].id, meshes.find(m => m.id === entity.components.MeshComponent.meshID)),
    [COMPONENTS.CAMERA]: async (entity, k) => new CameraComponent(entity.components[k].id)

}