import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import entityReducer from "./entityReducer"
import COMPONENTS from "../engine/data/COMPONENTS"
import Entity from "../engine/basic/Entity"
import TransformComponent from "../engine/components/TransformComponent"
import Transformation from "../engine/utils/Transformation"
import toObject from "../engine/utils/toObject"
import MaterialInstance from "../engine/instances/MaterialInstance"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import FALLBACK_MATERIAL from "../../static/misc/FALLBACK_MATERIAL"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
import GIZMOS from "../../static/misc/GIZMOS"


function getCursor() {
    const entity = new Entity()
    const t = new TransformComponent()
    t.lockedRotation = true
    t.lockedScaling = true
    t.transformationMatrix = Transformation.transform(t.translation, [0, 0, 0, 1], t.scaling)
    entity.components[COMPONENTS.TRANSFORM] = t

    return entity
}

const localActionID = v4()
export default function useEngine(settings) {
    const entities = useRef(new Map())
    const meshes = useRef(new Map())

    const [executingAnimation, setExecutingAnimation] = useState(false)
    const [viewportInitialized, setViewportInitialized] = useState(false)
    const [levelScript, setLevelScript] = useState()
    const [selected, setSelected] = useState([])
    const [lockedEntity, setLockedEntity] = useState()

    // TODO - USE MAP
    const [materials, setMaterials] = useState([])

    const [fallbackMaterial, setFallbackMaterial] = useState()
    const [entitiesChangeID, setChangeID] = useState(v4())

    const workerListener = (payload) => {
        const {meshesFiltered, materialsFiltered} = payload
        // if (Object.keys(meshesFiltered).length > 0)
        //     setMeshes(prev => {
        //         const filtered = []
        //         for (let i = 0; i < prev.length; i++) {
        //             if (!meshesFiltered[prev[i].id]) filtered.push(prev[i])
        //             else prev[i].delete()
        //         }
        //
        //         return filtered
        //     })
        // if (Object.keys(materialsFiltered).length > 0)
        //     setMaterials(prev => {
        //         const filtered = []
        //         for (let i = 0; i < prev.length; i++) {
        //             if (!materialsFiltered[prev[i].id]) filtered.push(prev[i])
        //             else prev[i].delete()
        //         }
        //         return filtered
        //     })
    }

    useEffect(() => {
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_UNUSED_DATA,
            actionID: localActionID,
            payload: {
                meshes: Array.from(meshes.current.keys()),
                materials: toObject(materials, true)
            }
        })
        window.addEntityWorkerListener(workerListener, localActionID)
    }, [meshes, materials])

    function bindGizmo() {
        const gizmoSystem = window.renderer.editorSystem.gizmoSystem
        gizmoSystem.selectedEntities = selected
            .map(s => entities.current.get(s))
            .filter(c => (settings.gizmo === GIZMOS.TRANSLATION || c.components[COMPONENTS.TRANSFORM] && (settings.gizmo === GIZMOS.ROTATION && !c.components[COMPONENTS.TRANSFORM].lockedRotation || settings.gizmo === GIZMOS.SCALE && !c.components[COMPONENTS.TRANSFORM]?.lockedScaling)))

        if (gizmoSystem.selectedEntities.length > 0) {
            switch (settings.gizmo) {
            case GIZMOS.TRANSLATION:
                gizmoSystem.targetGizmo = gizmoSystem.translationGizmo
                break
            case GIZMOS.ROTATION:
                gizmoSystem.targetGizmo = gizmoSystem.rotationGizmo
                break
            case GIZMOS.SCALE:
                gizmoSystem.targetGizmo = gizmoSystem.scaleGizmo
                break
            }
        }else if(gizmoSystem.targetGizmo){

            gizmoSystem.targetGizmo.exit()
            gizmoSystem.targetGizmo = undefined
        }
    }

    const cameraInitialized = useRef(false)
    const update = useCallback(() => {
        const renderer = window.renderer

        if (viewportInitialized && renderer) {
            let fMat = fallbackMaterial
            if (!fallbackMaterial) {
                fMat = new MaterialInstance({
                    vertex: shaderCode.fallbackVertex,
                    fragment: shaderCode.fragment,
                    settings: {isForward: false},
                    cubeMapShaderCode: shaderCode.cubeMapShader,
                    id: FALLBACK_MATERIAL
                })
                setFallbackMaterial(fMat)

            }
            if (settings.INITIALIZED && !cameraInitialized.current) {
                cameraInitialized.current = true
                if (settings.cameraPosition)
                    renderer.camera.centerOn = settings.cameraPosition
                if (typeof settings.yaw === "number")
                    renderer.camera.yaw = settings.yaw
                if (typeof settings.pitch === "number")
                    renderer.camera.pitch = settings.pitch

                renderer.camera.updateViewMatrix()
            }

            bindGizmo()
            renderer.camera.updateProjection()
            renderer.entitiesMap = entities.current
            renderer.meshes = meshes.current
            renderer.materials = materials
            renderer.camera.animated = settings.cameraAnimation
            renderer.gizmo = settings.gizmo
            if (!renderer.cursor)
                renderer.cursor = getCursor()

            renderer.updatePackage(
                executingAnimation,
                {selected, ...settings},
                levelScript,
                fMat
            )
        }
    }, [
        fallbackMaterial, viewportInitialized,
        executingAnimation,
        selected, materials,
        settings, entitiesChangeID
    ])


    useEffect(update, [update])

    const selectedEntity = useMemo(() => {
        if (selected[0])
            return entities.current.get(selected[0])
        return entities.current.get(lockedEntity)
    }, [selected, entitiesChangeID, lockedEntity])


    return {
        selectedEntity,
        executingAnimation,
        setExecutingAnimation,
        viewportInitialized,
        setViewportInitialized,
        update,
        updateHierarchy: () => {
            window.entityWorker.postMessage({
                type: ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES,
                payload: window.renderer.entitiesMap
            })
            setChangeID(v4())
        },
        lockedEntity,
        entitiesChangeID,

        materials,
        selected,
        setMaterials,
        dispatchMeshes: (newMeshes) => {
            for (let i = 0; i < newMeshes.length; i++)
                meshes.current.set(newMeshes[i].id, newMeshes[i])
        },
        setLockedEntity,
        setSelected,
        setLevelScript,

        dispatchEntities: packageData => entityReducer(packageData, entities.current, setChangeID),

    }
}


