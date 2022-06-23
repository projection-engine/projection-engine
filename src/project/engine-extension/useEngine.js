import {useCallback, useEffect, useMemo, useReducer, useState} from "react"
import entityReducer, {ENTITY_ACTIONS} from "./entityReducer"
import useHistory from "../hooks/useHistory"
import {HISTORY_ACTIONS} from "../hooks/historyReducer"
import COMPONENTS from "../engine/templates/COMPONENTS"
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
export default function useEngine(settings) {
    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [entities, dispatchEntities] = useReducer(entityReducer, [])
    const {returnChanges, forwardChanges, dispatchChanges, changes} = useHistory(entities, dispatchEntities)
    const [levelScript, setLevelScript] = useState()
    const [selected, setSelected] = useState([])
    const [lockedEntity, setLockedEntity] = useState()
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
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
        if (initialized) {
            window.renderer.gizmo = settings.gizmo
            window.renderer.updatePackage(
                executingAnimation,
                cursor,
                entities,
                materials,
                meshes,
                {selected, setSelected, ...settings},
                onGizmoStart,
                onGizmoEnd,
                levelScript
            )
        }
    }, [
        initialized,
        executingAnimation,
        selected, materials, meshes,
        entities, settings
    ])
    useEffect(update, [update])
    const selectedEntity = useMemo(() => entities.find(e => !lockedEntity && e.id === selected[0] || lockedEntity === e.id), [selected, entities, lockedEntity])

    return {
        selectedEntity,
        executingAnimation,
        setExecutingAnimation,
        cursor, setCursor,
        initialized,
        setInitialized,
        update,
        changes,
        returnChanges,
        forwardChanges,
        dispatchChanges,
        lockedEntity,

        entities,
        meshes,
        materials,
        selected,

        dispatchEntities,
        setMaterials,
        setMeshes,
        setLockedEntity,
        setSelected,
        levelScript,
        setLevelScript
    }
}

