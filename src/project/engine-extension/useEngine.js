import {useCallback, useContext, useEffect, useReducer, useState} from "react"
import entityReducer, {ENTITY_ACTIONS} from "./entityReducer"
import useHistory from "../hooks/useHistory"
import {HISTORY_ACTIONS} from "../hooks/historyReducer"
import COMPONENTS from "../engine/templates/COMPONENTS"
import GPUContextProvider from "../components/viewport/hooks/GPUContextProvider"
import Entity from "../engine/basic/Entity"
import TransformComponent from "../engine/components/TransformComponent"
import Transformation from "../engine/templates/Transformation"


function getCursor(){
    const entity = new Entity()
    const t = new TransformComponent()
    t.lockedRotation = true
    t.lockedScaling = true
    t.transformationMatrix = Transformation.transform(t.translation, [0,0,0,1], t.scaling)
    entity.components[COMPONENTS.TRANSFORM] = t

    return entity
}
export default function useEngine(canExecutePhysicsAnimation, settings, canStart) {
    const {gpu, renderer} = useContext(GPUContextProvider)
    const [entities, dispatchEntities] = useReducer(entityReducer, [])
    const {returnChanges, forwardChanges, dispatchChanges, changes} = useHistory(entities, dispatchEntities)

    const [canRender, setCanRender] = useState(true)
    const [selected, setSelected] = useState([])
    const [lockedEntity, setLockedEntity] = useState()
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

    const [scripts, setScripts] = useState([])
    const [updated, setUpdated] = useState(false)
    const [cursor, setCursor] = useState(getCursor())

    const onGizmoStart = () => {
        const e = entities.find(e => e.id === selected[0])
        if (e)
            dispatchChanges({
                type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE,
                payload: {
                    key: COMPONENTS.TRANSFORM,
                    entityID: selected[0],
                    component: e.components[COMPONENTS.TRANSFORM]
                }
            })
    }
    const onGizmoEnd = () => {
        const e = entities.find(e => e.id === selected[0])
        if (e)
            dispatchEntities({
                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                payload: {key: COMPONENTS.TRANSFORM, entityID: selected[0], data: e.components[COMPONENTS.TRANSFORM]}
            })
    }

    const update = useCallback(() => {
        if (renderer && canStart && canRender) {
            if(!updated)
                setUpdated(true)
            renderer.gizmo = settings.gizmo
            renderer?.updatePackage(
                cursor,
                entities,
                materials,
                meshes,
                {canExecutePhysicsAnimation, selected, setSelected, ...settings},
                scripts,
                onGizmoStart,
                onGizmoEnd,
                false
            )
        }
    }, [
        canRender,
        canExecutePhysicsAnimation,
        selected, setSelected,
        materials, meshes, scripts,
        entities, gpu,
        settings, canStart,
        renderer, updated
    ])

    useEffect(() => {
        if (renderer && updated)
            renderer.start()
    }, [renderer, updated])

    useEffect(update, [update])

    return {
        cursor, setCursor,
        gpu,
        update,
        changes,
        returnChanges,
        forwardChanges,
        dispatchChanges,
        lockedEntity,

        canRender,
        renderer,
        scripts,
        entities,
        meshes,
        materials,
        selected,

        dispatchEntities,
        setMaterials,
        setMeshes,
        setLockedEntity,
        setSelected,
        setCanRender,
        setScripts,
    }
}


