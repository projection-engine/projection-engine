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
import ProbeComponent from "../engine/components/ProbeComponent"
import COMPONENTS from "../engine/templates/COMPONENTS"
import CameraComponent from "../engine/components/CameraComponent"
import Transformation from "../engine/utils/Transformation"
import {DATA_TYPES} from "../engine/templates/DATA_TYPES"
import TextureInstance from "../engine/instances/TextureInstance"
import FileSystem from "./files/FileSystem"

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
            newMat = new MaterialInstance({
                vertex: vertexShader,
                fragment: shader,
                cubeMapShaderCode: cubeMapShader?.code,
                onCompiled:  () => resolve(),
                settings,
                uniformData,
                id
            })
        })
        newMat.uniforms = uniforms
        return newMat
    }

    static async mapEntity(entity) {
        const parsedEntity = new Entity(entity.id, entity.name, entity.active)
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

                if(k === COMPONENTS.DIRECTIONAL_LIGHT)
                    component.update()
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
        const toLoad = [],
            toLoop = entity.components[k].uniforms ? entity.components[k].uniforms : []

        for(let index= 0; index < toLoop.length; index++){
            const u = toLoad[index]
            if(u){
                if (u.type === DATA_TYPES.TEXTURE && u.modified){
                    const fileData = await ProjectLoader.readFromRegistry(u.value)
                    if (fileData) {
                        let texture
                        await new Promise(r => {
                            const k = u.format
                            texture = new TextureInstance(
                                fileData,
                                k.yFlip,
                                window.gpu[k.internalFormat],
                                window.gpu[k.format],
                                true,
                                false,
                                window.gpu.UNSIGNED_BYTE,
                                undefined,
                                undefined,
                                0,
                                () => r()
                            )
                        })
                        toLoad.push({key: u.key, value: texture.texture, changed: true})
                    }
                    else
                        toLoad.push(u)
                }
                else
                    toLoad.push(u)
            }
        }
        newMat.uniforms = entity.components[k].uniforms
        newMat.overrideMaterial = entity.components[k].overrideMaterial
        newMat.uniformValues = {...entity.components[k].uniformValues}

        toLoad.forEach(dd => {
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
    [COMPONENTS.PROBE]: async (entity, k) => new ProbeComponent(entity.components[k].id),
    [COMPONENTS.CAMERA]: async (entity, k) => new CameraComponent(entity.components[k].id)

}