import loadPromises from "./loadMaterial";
import Mesh from "../../../../services/engine/renderer/elements/Mesh";
import Entity from "../../../../services/engine/ecs/basic/Entity";
import {ENTITY_ACTIONS} from "../../../../services/engine/ecs/utils/entityReducer";
import DirectionalLightComponent from "../../../../services/engine/ecs/components/DirectionalLightComponent";
import MaterialComponent from "../../../../services/engine/ecs/components/MaterialComponent";
import MeshComponent from "../../../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../../../services/engine/ecs/components/PickComponent";
import PointLightComponent from "../../../../services/engine/ecs/components/PointLightComponent";
import SkyboxComponent from "../../../../services/engine/ecs/components/SkyboxComponent";
import SpotLightComponent from "../../../../services/engine/ecs/components/SpotLightComponent";
import TransformComponent from "../../../../services/engine/ecs/components/TransformComponent";
import FolderComponent from "../../../../services/engine/ecs/components/FolderComponent";
import PhysicsBodyComponent from "../../../../services/engine/ecs/components/PhysicsBodyComponent";
import ColliderComponent from "../../../../services/engine/ecs/components/ColliderComponent";
import MaterialInstance from "../../../../services/engine/renderer/elements/MaterialInstance";


export default function loadProject(database, engine, settings, setAlert, id, redirect, callback) {

    database.getProject(id)
        .then(res => {
            try{
                const s = typeof res.settings === 'string' ? JSON.parse(res.settings) : res.settings
                if(s !== undefined && typeof s === 'object' && Object.keys(s).length > 0)
                    settings = s
                callback()
            }catch (e){}

        }).catch(e => {
        redirect()
    })

}


export function loadEntities(database, engine, id, callback) {
    database
        .listEntities(id)
        .then(entities => {
            console.log(entities)
            loadData(
                entities,
                (skyboxImages,
                 meshesToLoad) => {
                    entities.forEach((c, index) => {
                        parseEntity(c, engine, skyboxImages, index, meshesToLoad)
                    })
                    callback()
                },
                engine,
                database
            )
        })
}

function createPromise(database, fileID) {
    return new Promise(resolve => {
        database.getFileWithBlob(fileID).then(res => {
            resolve(res)
        })
    })
}

function loadData(entities, callback, engine, database) {

    const meshesToLoad = entities.map(e => {
        const body = JSON.parse(e.blob)

        return body.components.MeshComponent?.meshID
    }).filter(e => e !== undefined)

    const materialsToLoad = entities.map(e => {
        const body = JSON.parse(e.blob)
        return body.components.MaterialComponent?.materialID
    }).filter(e => e !== undefined)
    const skyboxes = entities.map(e => {
        const body = JSON.parse(e.blob)
        return body.components.SkyboxComponent?._imageID
    }).filter(e => e !== undefined)

    let promises = []

    meshesToLoad
        .filter((item, i) => meshesToLoad.indexOf(item) === i)
        .forEach(m => {
            promises.push(createPromise(database, m))
        })

    materialsToLoad
        .filter((item, i) => materialsToLoad.indexOf(item) === i)
        .forEach(m => {
            promises.push(createPromise(database, m))
        })
    skyboxes
        .filter((item, i) => skyboxes.indexOf(item) === i)
        .forEach(m => {
            promises.push(createPromise(database, m))
        })

    Promise.all(promises).then(r => {
        let meshes = []
        r.forEach(file => {

            if (file && file.type === 'mesh') {

                const objLoaded = JSON.parse(file.blob)
                const newMesh = new Mesh({
                    ...objLoaded,
                    id: file.id,
                    gpu: engine.gpu,
                    maxBoundingBox: objLoaded.boundingBoxMax,
                    minBoundingBox: objLoaded.boundingBoxMin
                })
                meshes.push(newMesh)
            }
            if (file && file.type === 'material') {
                loadPromises(
                    file,
                    database,
                    engine.gpu,
                    (mat, textures) => engine.setMaterials(prev => [...prev, new MaterialInstance(engine.gpu, mat.id, textures[0], textures[1], textures[2], textures[3], textures[4], textures[5])])
                )
            }
        })
        engine.setMeshes(meshes)
        callback(r.map(file => {
                if (file?.type !== 'mesh') return file
                else
                    return undefined
            }).filter(i => i !== undefined),
            meshes
        )
    })
}

function parseEntity(entity, engine, skyboxImages, index, meshes) {

    const body = JSON.parse(entity.blob)

    if (!body.components.GridComponent) {
        const newEntity = new Entity(entity.id, body.name, body.active, entity.linkedTo)

        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: newEntity})
        const components = body.components

        Object.keys(components).forEach(k => {
            let component
            switch (k) {
                case 'DirectionalLightComponent':
                    component = new DirectionalLightComponent(components[k].id)
                    break
                case 'MaterialComponent':
                    component = new MaterialComponent(components[k].id)
                    break

                case 'MeshComponent':
                    component = new MeshComponent(components[k].id)
                    break
                case 'PickComponent':
                    component = new PickComponent(components[k].id, index)
                    break
                case 'PointLightComponent':
                    component = new PointLightComponent(components[k].id)
                    break
                case 'SkyboxComponent':
                    component = new SkyboxComponent(components[k].id, engine.gpu)
                    const foundImage = skyboxImages.find(i => i.id === components[k]._imageID)
                    if (foundImage)
                        component.hdrTexture = {blob: foundImage.blob, imageID: foundImage.id, type: foundImage.type}
                    break
                case 'SpotLightComponent':
                    component = new SpotLightComponent(components[k].id)
                    break
                case 'TransformComponent':
                    component = new TransformComponent(components[k].id)
                    break
                case 'FolderComponent':
                    component = new FolderComponent(components[k].id)
                    break
                case 'PhysicsComponent':
                    component = new PhysicsBodyComponent(components[k].id)
                    break
                case 'SphereCollider':
                    component = new ColliderComponent(components[k].id, meshes.find(m => m.id === components.MeshComponent.meshID))
                    break
                default:
                    break
            }

            if (k === 'SpotLightComponent' || k === 'PointLightComponent')
                component.position = components[k]._position
            if (k === 'SpotLightComponent' || k === 'DirectionalLightComponent')
                component.direction = components[k]._direction

            if (component) {

                if (!(component instanceof SkyboxComponent))
                    Object.keys(components[k]).forEach(oK => {
                        if (!oK.includes("_") && oK !== 'gpu')
                            component[oK] = components[k][oK]
                    })

                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                        entityID: newEntity.id,
                        data: component
                    }
                })
            }
        })
    }
}
