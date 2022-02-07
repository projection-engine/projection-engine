import Mesh from "../../../../services/engine/renderer/elements/Mesh";
import Entity from "../../../../services/engine/ecs/basic/Entity";
import TransformComponent from "../../../../services/engine/ecs/components/TransformComponent";
import {ENTITY_ACTIONS} from "../../../../services/engine/ecs/utils/entityReducer";
import MaterialComponent from "../../../../services/engine/ecs/components/MaterialComponent";
import MeshComponent from "../../../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../../../services/engine/ecs/components/PickComponent";

export default function importMesh(file, engine, setAlert) {

    try {
        if (file.type === 'mesh') {
            console.trace(file.blob)
            const objLoaded = JSON.parse(file.blob)
            console.log(objLoaded)

            let mesh = engine.meshes.find(m => m.id === file.id)
            if (!mesh) {
                const newMesh = new Mesh({
                    ...objLoaded,
                    id: file.id,
                    gpu: engine.gpu,
                    maxBoundingBox: objLoaded.boundingBoxMax,
                    minBoundingBox: objLoaded.boundingBoxMin
                })
                engine.setMeshes(prev => [...prev, newMesh])
                mesh = newMesh
            }

            const newEntity = new Entity(undefined, file.name)
            const transformation = new TransformComponent()
            transformation.scaling = objLoaded.scaling
            transformation.rotation = objLoaded.rotation
            transformation.translation = objLoaded.translation

            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD,
                payload: newEntity
            })
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT,
                payload: {
                    data: new MeshComponent(undefined, mesh.id),
                    entityID: newEntity.id
                }
            })
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT,
                payload: {
                    data: new MaterialComponent(),
                    entityID: newEntity.id
                }
            })
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT,
                payload: {
                    data: new PickComponent(undefined, engine.entities.length),
                    entityID: newEntity.id
                }
            })
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT,
                payload: {
                    data: transformation,
                    entityID: newEntity.id
                }
            })

            setAlert({
                type: 'success',
                message: 'Loaded successfully.'
            })
        }
    } catch (e) {

        setAlert({
            type: 'error',
            message: 'Error loading mesh.'
        })
    }
}