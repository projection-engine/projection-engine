import {useEffect, useRef, useState} from "react";
import TransformSystem from "../../../../engine/ecs/systems/TransformSystem";
import ShadowMapSystem from "../../../../engine/ecs/systems/ShadowMapSystem";
import PickSystem from "../../../../engine/ecs/systems/PickSystem";
import EditorEngine from "../../../../engine/editor/EditorEngine";
import EVENTS from "../utils/EVENTS";
import PerformanceSystem from "../../../../engine/ecs/systems/PerformanceSystem";
import SYSTEMS from "../../../../engine/templates/SYSTEMS";
import CubeMapSystem from "../../../../engine/ecs/systems/CubeMapSystem";
import ScriptSystem from "../../../../engine/ecs/systems/ScriptSystem";
import useEngineEssentials from "../../../../engine/useEngineEssentials";
import useHistory from "./useHistory";
import {HISTORY_ACTIONS} from "./historyReducer";
import COMPONENTS from "../../../../engine/templates/COMPONENTS";
import CameraCubeSystem from "../../../../engine/ecs/systems/CameraCubeSystem";
import {ENTITY_ACTIONS} from "../../../../engine/useEngineEssentials";


export default function useEditorEngine(id, canExecutePhysicsAnimation, settings, load, canStart, setAlert) {
    const {
        meshes, setMeshes,
        materials, setMaterials,
        entities, dispatchEntities,
        scripts, setScripts,
        gpu
    } = useEngineEssentials(id + '-canvas')

    const {
        returnChanges,
        forwardChanges,
        dispatchChanges
    } = useHistory(entities, dispatchEntities, setAlert)
    const [canRender, setCanRender] = useState(true)

    const [selected, setSelected] = useState([])
    const [finished, setFinished] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [lockedEntity, setLockedEntity] = useState()

    const renderer = useRef()


    const updateSystems = (callback) => {
        load.pushEvent(EVENTS.UPDATING_SYSTEMS)
        const shadows = renderer.current.systems[SYSTEMS.SHADOWS],
            transformation = renderer.current.systems[SYSTEMS.TRANSFORMATION],
            // physics = renderer.current.systems[SYSTEMS.PHYSICS],
            perf = renderer.current.systems[SYSTEMS.PERF],
            pick = renderer.current.systems[SYSTEMS.PICK],
            cubeMap = renderer.current.systems[SYSTEMS.CUBE_MAP],
            s = renderer.current.systems[SYSTEMS.SCRIPT],
            c = renderer.current.systems[SYSTEMS.CAMERA_CUBE]

        renderer.current.systems = [
            s ? s : new ScriptSystem(gpu),
            perf ? perf : new PerformanceSystem(gpu),
            // physics ? physics : new PhysicsSystem(),
            transformation ? transformation : new TransformSystem(),
            shadows ? shadows : new ShadowMapSystem(gpu),
            pick ? pick : new PickSystem(gpu),
            c ? c : new CameraCubeSystem(id + '-camera'),
            cubeMap ? cubeMap : new CubeMapSystem(gpu),
        ]
        load.finishEvent(EVENTS.UPDATING_SYSTEMS)
        callback()

    }


    useEffect(() => {
        if (renderer.current)
            renderer.current.camera.fov = settings.fov
    }, [settings.fov])

    useEffect(() => {
        if (initialized && canStart && canRender)
            updateSystems(() => null)
    }, [settings.resolutionMultiplier, initialized, canStart, canRender])

    useEffect(() => {
        if (gpu && !initialized && id && !finished) {
            renderer.current = new EditorEngine(id, gpu)
            setInitialized(true)
            updateSystems(() => {
                setFinished(true)
            })

        } else if (finished && canStart) {

            renderer.current.cameraType = settings.cameraType
            renderer.current.gizmo = settings.gizmo

            if (!canRender)
                renderer.current?.stop()
            else
                renderer.current?.start(
                    entities,
                    materials,
                    meshes,
                    {
                        canExecutePhysicsAnimation,
                        selected,
                        setSelected, ...settings
                    },
                    scripts,

                    () => {
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

                    },
                    () => { // onGizmoEnd
                        const e = entities.find(e => e.id === selected[0])
                        if (e)
                            dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT,
                                payload: {
                                    key: COMPONENTS.TRANSFORM,
                                    entityID: selected[0],
                                    data: e.components[COMPONENTS.TRANSFORM]
                                }
                            })
                    }
                )

        }
        return () => {
            renderer.current?.stop()
        }
    }, [
        canExecutePhysicsAnimation,
        selected, setSelected,
        materials, meshes, scripts,
        initialized, entities, gpu, id, canRender,
        settings, finished, canStart
    ])


    return {
        returnChanges, forwardChanges,
        dispatchChanges,

        lockedEntity, setLockedEntity,
        entities, dispatchEntities: (obj) => {

            dispatchEntities(obj)
        },
        meshes, setMeshes,
        gpu, materials, setMaterials,
        selected, setSelected,
        canRender, setCanRender,
        renderer: renderer.current,
        scripts, setScripts
    }
}
