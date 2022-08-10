import FileSystem from "../../../libs/FileSystem"
import Entity from "../libs/engine/templates/basic/Entity"
import COMPONENTS from "../libs/engine/data/COMPONENTS"
import DirectionalLightComponent from "../libs/engine/templates/components/DirectionalLightComponent"
import MeshComponent from "../libs/engine/templates/components/MeshComponent"
import DATA_TYPES from "../libs/engine/data/DATA_TYPES"
import TextureInstance from "../libs/engine/libs/instances/TextureInstance"
import PointLightComponent from "../libs/engine/templates/components/PointLightComponent"

import TransformComponent from "../libs/engine/templates/components/TransformComponent"
import Transformation from "../libs/engine/services/Transformation"
import ProbeComponent from "../libs/engine/templates/components/ProbeComponent"
import CameraComponent from "../libs/engine/templates/components/CameraComponent"
import componentConstructor from "../libs/component-constructor";

async function readFromRegistry(fileID) {
    return new Promise(resolve => {
        window.fileSystem.readRegistryFile(fileID)
            .then(lookUpTable => {

                if (lookUpTable) {
                    window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + lookUpTable.path)
                        .then(fileData => {
                            if (fileData) resolve(fileData)
                            else resolve(null)
                        }).catch(() => resolve(null))
                } else resolve(null)
            }).catch(() => resolve(null))
    })
}

const ENTITIES = {
    [COMPONENTS.DIRECTIONAL_LIGHT]: async (entity, k) => new DirectionalLightComponent(entity.components[k].id, entity),
    [COMPONENTS.MESH]: async (entity, k) => {
        const component = new MeshComponent(entity.components[k].id, entity.components[k].meshID, entity.components[k].materialID)
        const toLoad = [],
            toLoop = entity.components[k].uniforms ? entity.components[k].uniforms : []

        for (let index = 0; index < toLoop.length; index++) {
            const u = toLoad[index]
            if (u) {
                if (u.type === DATA_TYPES.TEXTURE && u.modified) {
                    const fileData = await readFromRegistry(u.value)
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
                    } else
                        toLoad.push(u)
                } else
                    toLoad.push(u)
            }
        }
        component.uniforms = entity.components[k].uniforms
        component.overrideMaterial = entity.components[k].overrideMaterial
        component.uniformValues = {...entity.components[k].uniformValues}

        toLoad.forEach(dd => {
            if (dd.changed) component.uniformValues[dd.key] = dd.value
        })

        component.doubleSided = entity.components[k].doubleSided
        component.overrideMaterial = entity.components[k].overrideMaterial
        return component
    },

    [COMPONENTS.POINT_LIGHT]: async (entity, k) => new PointLightComponent(entity.components[k].id),
    [COMPONENTS.TRANSFORM]: async (entity, k) => {
        const component = new TransformComponent(entity.components[k].id, true)

        try {
            component.updateQuatOnEulerChange = false
            component.rotation = Transformation.getEuler(entity.components[k]._rotationQuat)
            component.updateQuatOnEulerChange = true
        } catch (e) {
            console.error(e)
        }
        return component
    },
    [COMPONENTS.PROBE]: async (entity, k) => new ProbeComponent(entity.components[k].id),
    [COMPONENTS.CAMERA]: async (entity, k) => new CameraComponent(entity.components[k].id)

}

export default async function parseEntityObject(entity) {
    const parsedEntity = new Entity(entity.id, entity.name, entity.active)
    Object.keys(entity)
        .forEach(k => {
            if (k !== "components" && k !== parent)
                parsedEntity[k] = entity[k]
        })

    parsedEntity.parent = undefined
    parsedEntity.parentCache = entity.parent
    for (const k in entity.components) {
        if (typeof ENTITIES[k] === "function") {
            let component = await ENTITIES[k](entity, k)

            if (component) {
                const keys = Object.keys(entity.components[k])
                for (let i = 0; i < keys.length; i++) {
                    const oK = keys[i]

                    if (k === COMPONENTS.TRANSFORM && oK === "_transformationMatrix")
                        continue
                    if (!oK.includes("__") && !oK.includes("#")) component[oK] = entity.components[k][oK]
                }
                parsedEntity.components[k] = component
                if (k === COMPONENTS.TRANSFORM || k === COMPONENTS.DIRECTIONAL_LIGHT)
                    component.changed = true
            }
        }

    }
    for (let i = 0; i < parsedEntity.scripts.length; i++)
        await componentConstructor(parsedEntity, parsedEntity.scripts[i].id, false)
    return parsedEntity
}