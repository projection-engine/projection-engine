import DirectionalLightComponent from "../engine/ecs/components/DirectionalLightComponent";
import MaterialComponent from "../engine/ecs/components/MaterialComponent";
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
import MaterialInstance from "../engine/renderer/elements/MaterialInstance";
import Mesh from "../engine/renderer/elements/Mesh";


export default class ProjectLoader {
    static async getEntities(fileSystem) {
        let settings = new Promise(resolve => {
                fileSystem.readFile(fileSystem.path + '/.settings', 'json')
                    .then(res => {
                        resolve({
                            type: 'settings',
                            data: res
                        })
                    })
            }),
            meta = new Promise(resolve => {
                fileSystem.readFile(fileSystem.path + '/.meta', 'json')
                    .then(res => {
                        resolve({
                            type: 'meta',
                            data: res
                        })
                    })
            }),
            entities = fileSystem.fromDirectory(fileSystem.path + '/logic', '.entity')

        return Promise
            .all([settings, meta, ...entities.map(e => {
                return new Promise(resolve => {
                    fileSystem.readFile(fileSystem.path + '/logic/' + e)
                        .then(res => {
                            resolve({
                                type: 'entity',
                                data: JSON.parse(res)
                            })
                        })
                })
            })])
    }

    static async loadProject(gpu, fileSystem) {
        return new Promise(rootResolve => {
            ProjectLoader
                .getEntities(fileSystem)
                .then(res => {
                    let settings = res[0]
                    let meta = res[1]
                    let entities = res.filter(e => e.type === 'entity')

                    let meshes = entities
                            .filter(e => {

                                return e.data.components?.MeshComponent
                            })
                            .map(e => new Promise(r => {

                                fileSystem.readFile(e.data.components.MeshComponent?.meshID, 'json')
                                    .then(d => {
                                        r({
                                            type: 'mesh',
                                            data: d,
                                            id: e.data.components.MeshComponent?.meshID
                                        })
                                    })
                            })),
                        skyboxes = entities
                            .filter(e => e.data.components?.SkyboxComponent)
                            .map(e => new Promise(r => {
                                fileSystem.readFile(e.data.components.SkyboxComponent._imageID)
                                    .then(d => r({
                                        type: 'skybox',
                                        data: d,
                                        id: e.data.components.SkyboxComponent._imageID
                                    }))
                            })),
                        materials = entities
                            .filter(e => e.data.components?.MaterialComponent && e.data.components.MaterialComponent.materialID !== undefined)
                            .map(e => new Promise((r, discard) => {

                                fileSystem.readFile(e.data.components.MaterialComponent.materialID, 'json')
                                    .then((d) => {

                                        if (d !== null)
                                            r({
                                                type: 'material',
                                                data: d,
                                                id: e.data.components.MaterialComponent.materialID
                                            })
                                        else
                                            discard()
                                    })
                            }))

                    Promise.all([...meshes, ...skyboxes, ...materials])
                        .then(loaded => {

                            let meshData = loaded.filter(e => e.type === 'mesh' && e.data !== null),
                                skyboxData = loaded.filter(e => e.type === 'skybox').map(e => e.data),
                                materialData = loaded.filter(e => e.type === 'material').map(e => e.data)

                            entities = entities.map((entity, index) => {
                                return ProjectLoader.mapEntity(entity.data, index, meshData, skyboxData, materialData, gpu)
                            })
                            materials = materials.map((mat) => {
                                return ProjectLoader.mapMaterial(mat.data, gpu)
                            })

                            rootResolve({
                                meta,
                                settings,
                                entities,
                                materials,
                                meshes: meshData.map(m => {
                                    return new Mesh({
                                        vertices: m.data.vertices,
                                        indices: m.data.indices,
                                        normals: m.data.normals,
                                        uvs: m.data.uvs,
                                        id: m.id,
                                        maxBoundingBox: m.data.maxBoundingBox,
                                        minBoundingBox: m.data.minBoundingBox,
                                        gpu: gpu,
                                        tangents: m.data.tangents
                                    })
                                })
                            })
                        })
                })
        })
    }

    static mapMaterial(material, gpu) {
        return new MaterialInstance(
            gpu,
            material.id,
            material.albedo,
            material.metallic,
            material.roughness,
            material.height,
            material.ao)
    }

    static mapEntity(entity, index, meshes, skyboxes, materials, gpu) {

        const parsedEntity = new Entity(entity.id, entity.name, entity.active, entity.linkedTo)
        Object.keys(entity.components).forEach(k => {
            let component
            switch (k) {
                case 'DirectionalLightComponent':
                    component = new DirectionalLightComponent(entity.components[k].id)
                    break
                case 'MaterialComponent':
                    component = new MaterialComponent(entity.components[k].id)
                    break

                case 'MeshComponent':
                    component = new MeshComponent(entity.components[k].id)
                    break
                case 'PickComponent':
                    component = new PickComponent(entity.components[k].id, index)
                    break
                case 'PointLightComponent':
                    component = new PointLightComponent(entity.components[k].id)
                    break
                case 'SkyboxComponent':
                    component = new SkyboxComponent(entity.components[k].id, gpu)
                    const foundImage = skyboxes.find(i => i.id === entity.components[k]._imageID)
                    if (foundImage)
                        component.hdrTexture = {blob: foundImage.data, imageID: foundImage.id}
                    break
                case 'SpotLightComponent':
                    component = new SpotLightComponent(entity.components[k].id)
                    break
                case 'TransformComponent':
                    component = new TransformComponent(entity.components[k].id)
                    break
                case 'FolderComponent':
                    component = new FolderComponent(entity.components[k].id)
                    break
                case 'PhysicsComponent':
                    component = new PhysicsBodyComponent(entity.components[k].id)
                    break
                case 'SphereCollider':
                    component = new ColliderComponent(entity.components[k].id, meshes.find(m => m.id === entity.components.MeshComponent.meshID))
                    break
                default:
                    break
            }

            if (k === 'SpotLightComponent' || k === 'PointLightComponent')
                component.position = entity.components[k]._position
            if (k === 'SpotLightComponent' || k === 'DirectionalLightComponent')
                component.direction = entity.components[k]._direction

            if (component) {
                if (!(component instanceof SkyboxComponent))
                    Object.keys(entity.components[k]).forEach(oK => {
                        if (!oK.includes("_") && oK !== 'gpu')
                            component[oK] = entity.components[k][oK]
                    })
                parsedEntity.components[k] = component
            }
        })
        return parsedEntity
    }
}