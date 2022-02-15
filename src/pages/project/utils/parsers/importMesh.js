import Mesh from "../../../../services/engine/renderer/elements/Mesh";
import Entity from "../../../../services/engine/ecs/basic/Entity";
import TransformComponent from "../../../../services/engine/ecs/components/TransformComponent";
import {ENTITY_ACTIONS} from "../../../../services/engine/utils/entityReducer";
import MaterialComponent from "../../../../services/engine/ecs/components/MaterialComponent";
import MeshComponent from "../../../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../../../services/engine/ecs/components/PickComponent";

export default function importMesh(objLoaded, engine, setAlert, id) {

    try {

        let mesh = engine.meshes.find(m => m.id === objLoaded.id)
        if (!mesh) {
            const newMesh = new Mesh({
                ...objLoaded,
                id: id,
                gpu: engine.gpu,
                maxBoundingBox: objLoaded.maxBoundingBox,
                minBoundingBox: objLoaded.minBoundingBox,
                wireframeBuffer: true
            })
            engine.setMeshes(prev => [...prev, newMesh])
            mesh = newMesh
        }

        const newEntity = new Entity(undefined, objLoaded.name)
        const transformation = new TransformComponent()
        transformation.scaling = objLoaded.scaling
        transformation.rotation = objLoaded.rotation
        transformation.translation = objLoaded.translation

        newEntity.components.MeshComponent = new MeshComponent(undefined, mesh.id)
        newEntity.components.TransformComponent = transformation
        newEntity.components.PickComponent = new PickComponent(undefined, engine.entities.length)
        newEntity.components.MaterialComponent = new MaterialComponent()


        engine.dispatchEntities({
            type: ENTITY_ACTIONS.ADD,
            payload: newEntity
        })
        setAlert({
            type: 'success',
            message: 'Loaded successfully.'
        })

    } catch (e) {

        setAlert({
            type: 'error',
            message: 'Error loading mesh.'
        })
    }
}