import {useEffect, useReducer, useRef, useState} from "react";
import {enableBasics} from "../engine/utils/misc/utils";
import entityReducer, {ENTITY_ACTIONS} from "../utils/entityReducer";
import PostProcessingSystem from "../engine/ecs/systems/PostProcessingSystem";
import MeshSystem from "../engine/ecs/systems/MeshSystem";
import TransformSystem from "../engine/ecs/systems/TransformSystem";
import PhysicsSystem from "../engine/ecs/systems/PhysicsSystem";
import ShadowMapSystem from "../engine/ecs/systems/ShadowMapSystem";
import PickSystem from "../engine/ecs/systems/PickSystem";
import Engine from "../engine/Engine";
import EVENTS from "../utils/misc/EVENTS";
import PerformanceSystem from "../engine/ecs/systems/PerformanceSystem";
import SYSTEMS from "../engine/utils/misc/SYSTEMS";
import CubeMapSystem from "../engine/ecs/systems/CubeMapSystem";
import COMPONENTS from "../utils/misc/COMPONENTS";


export default function useEngine(id, canExecutePhysicsAnimation, settings, load, canStart) {
    const [canRender, setCanRender] = useState(true)
    const [gpu, setGpu] = useState()
    const [selected, setSelected] = useState([])

    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [finished, setFinished] = useState(false)
    const [entities, dispatchEntities] = useReducer(entityReducer, [])
    const [initialized, setInitialized] = useState(false)
    const [lockedEntity, setLockedEntity] = useState()

    useEffect(() => {
        if (id) {
            const newGPU = document.getElementById(id + '-canvas').getContext('webgl2', {
                antialias: false,
                preserveDrawingBuffer: true,
                premultipliedAlpha: false
            })
            enableBasics(newGPU)
            setGpu(newGPU)
        }
    }, [id])


    const renderer = useRef()
    let resizeObserver


    const updateSystems = (callback) => {
        load.pushEvent(EVENTS.UPDATING_SYSTEMS)
        const deferred = new MeshSystem(gpu, settings.resolutionMultiplier)
        deferred.initializeTextures()
            .then(() => {
                const shadows = renderer.current.systems[SYSTEMS.SHADOWS],
                    transformation = renderer.current.systems[SYSTEMS.TRANSFORMATION],
                    physics = renderer.current.systems[SYSTEMS.PHYSICS],
                    perf = renderer.current.systems[SYSTEMS.PERF],
                    pick = renderer.current.systems[SYSTEMS.PICK],
                    cubeMap = renderer.current.systems[SYSTEMS.CUBE_MAP]


                renderer.current.systems = [
                    perf ? perf : new PerformanceSystem(gpu),
                    physics ? physics : new PhysicsSystem(),
                    transformation ? transformation : new TransformSystem(),

                    cubeMap ? cubeMap : new CubeMapSystem(gpu),

                    shadows ? shadows : new ShadowMapSystem(gpu),
                    pick ? pick : new PickSystem(gpu),
                    deferred,
                    // new AOSystem(gpu),
                    new PostProcessingSystem(gpu, settings.resolutionMultiplier)
                ]
                load.finishEvent(EVENTS.UPDATING_SYSTEMS)
                callback()
            })
    }


    useEffect(() => {
        if (renderer.current)
            renderer.current.camera.fov = settings.fov
    }, [settings.fov])

    useEffect(() => {
        if (initialized && canStart)
            updateSystems(() => null)
    }, [settings.resolutionMultiplier, initialized, canStart])

    useEffect(() => {
        if (gpu && !initialized && id && !finished) {
            renderer.current = new Engine(id, gpu)
            setInitialized(true)
            updateSystems(() => {
                setFinished(true)
            })

        } else if (finished && canStart) {
            resizeObserver = new ResizeObserver(() => {
                if (gpu && initialized)
                    renderer.current.camera.aspectRatio = gpu.canvas.width / gpu.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))
            renderer.current?.updateCamera(settings.cameraType)
            renderer.current.gizmo = settings.gizmo

            if (!canRender)
                renderer.current?.stop()
            else
                renderer.current?.start(entities, materials, meshes, {
                    canExecutePhysicsAnimation,
                    onGizmoChange: () => {
                        const found = entities.find(e => e.id === selected[0])
                        if (found && found[COMPONENTS.POINT_LIGHT]) {
                            found.components[COMPONENTS.POINT_LIGHT].changed = true
                            dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selected[0],
                                    data: found.components[COMPONENTS.POINT_LIGHT],
                                    key: COMPONENTS.POINT_LIGHT
                                }
                            })
                        } else if(found){

                            dispatchEntities({
                                type: ENTITY_ACTIONS.UPDATE_COMPONENT, payload: {
                                    entityID: selected[0],
                                    data: found.components[COMPONENTS.TRANSFORM],
                                    key: COMPONENTS.TRANSFORM
                                }
                            })
                        }
                    },
                    selected,
                    setSelected: d => {
                        setSelected(d)
                    },
                    ...settings
                })
        }
        return () => {
            renderer.current?.stop()
        }
    }, [
        canExecutePhysicsAnimation,
        selected, setSelected,
        materials, meshes,
        initialized, entities, gpu, id, canRender,
        settings, finished, canStart
    ])


    return {
        lockedEntity, setLockedEntity,
        entities, dispatchEntities,
        meshes, setMeshes,
        gpu, materials, setMaterials,
        selected, setSelected,
        canRender, setCanRender,
        renderer: renderer.current
    }
}
