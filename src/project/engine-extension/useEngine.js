import {useCallback, useEffect, useMemo, useReducer, useState} from "react"
import entityReducer, {ENTITY_ACTIONS} from "./entityReducer"
import useHistory from "../hooks/useHistory"
import {HISTORY_ACTIONS} from "../hooks/historyReducer"
import COMPONENTS from "../engine/templates/COMPONENTS"
import Entity from "../engine/basic/Entity"
import TransformComponent from "../engine/components/TransformComponent"
import Transformation from "../engine/utils/Transformation"
import toObject from "../engine/utils/toObject"
import MaterialInstance from "../engine/instances/MaterialInstance"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import FALLBACK_MATERIAL from "../../static/misc/FALLBACK_MATERIAL"


function getCursor(){
    const entity = new Entity()
    const t = new TransformComponent()
    t.lockedRotation = true
    t.lockedScaling = true
    t.transformationMatrix = Transformation.transform(t.translation, [0,0,0,1], t.scaling)
    entity.components[COMPONENTS.TRANSFORM] = t

    return entity
}


export default function useEngine(settings, worker) {
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
    const [fallbackMaterial, setFallbackMaterial] = useState()
    useEffect(() => {
        worker.postMessage({entities, COMPONENTS, meshes: toObject(meshes, true), materials: toObject(materials, true)})
        worker.onmessage = ({data: {meshesFiltered, materialsFiltered}}) => {
            if(Object.keys(meshesFiltered).length > 0)
                setMeshes(prev => {
                    const filtered = []
                    for(let i = 0; i < prev.length; i++){
                        if(!meshesFiltered[prev[i].id])
                            filtered.push(prev[i])
                        else
                            prev[i].delete()
                    }
                    return filtered
                })
            if(Object.keys(materialsFiltered).length > 0)
                setMaterials(prev => {
                    const filtered = []
                    for(let i = 0; i < prev.length; i++){
                        if(!materialsFiltered[prev[i].id])
                            filtered.push(prev[i])
                        else
                            prev[i].delete()
                    }
                    return filtered
                })
        }
    }, [entities])




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
            let fMat = fallbackMaterial
            if(!fallbackMaterial){
                fMat = new MaterialInstance( {
                    vertex: shaderCode.fallbackVertex,
                    fragment: shaderCode.fragment,
                    settings:{isForward: false},
                    cubeMapShaderCode:  shaderCode.cubeMapShader,
                    id: FALLBACK_MATERIAL
                })
                setFallbackMaterial(fMat)
            }
            window.renderer.camera.animated = settings.cameraAnimation
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
                levelScript,
                fMat
            )
        }
    }, [
        fallbackMaterial,
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


