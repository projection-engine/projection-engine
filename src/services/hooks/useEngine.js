import {useEffect, useMemo, useReducer, useRef, useState} from "react";
import {enableBasics} from "../engine/utils/utils";
import entityReducer, {ENTITY_ACTIONS} from "../engine/utils/entityReducer";
import PostProcessingSystem from "../engine/ecs/systems/PostProcessingSystem";
import DeferredSystem from "../engine/ecs/systems/DeferredSystem";
import TransformSystem from "../engine/ecs/systems/TransformSystem";
import PhysicsSystem from "../engine/ecs/systems/PhysicsSystem";
import ShadowMapSystem from "../engine/ecs/systems/ShadowMapSystem";
import PickSystem from "../engine/ecs/systems/PickSystem";
import Entity from "../engine/ecs/basic/Entity";
import Engine from "../engine/Engine";
import GridComponent from "../engine/ecs/components/GridComponent";
import EVENTS from "../../pages/project/utils/misc/EVENTS";


export default function useEngine(id, canExecutePhysicsAnimation, settings, load) {
    const [canRender, setCanRender] = useState(true)
    const [gpu, setGpu] = useState()
    const [selectedElement, setSelectedElement] = useState(null)
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

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

    const [entities, dispatchEntities] = useReducer(entityReducer, [])
    const [initialized, setInitialized] = useState(false)

    const renderer = useRef()
    let resizeObserver

    const renderingProps = useMemo(() => {

        return {

            canExecutePhysicsAnimation, meshes,
            selectedElement, setSelectedElement,
            materials, cameraType: settings.cameraType,
            shadingModel: settings.shadingModel,
            fxaa: settings.fxaa,
            iconsVisibility: settings.iconsVisibility,
            gridVisibility: settings.gridVisibility
        }
    }, [
        canExecutePhysicsAnimation,
        meshes, selectedElement,
        setSelectedElement, materials,
        settings.cameraType,
        settings.shadingModel,
        settings.fxaa,
        settings.iconsVisibility,
        settings.gridVisibility
    ])


    const updateSystems = (callback) => {
        load.pushEvent(EVENTS.UPDATING_SYSTEMS)
        const postProcessing = new PostProcessingSystem(gpu, settings.resolutionMultiplier)
        const deferred = new DeferredSystem(gpu, settings.resolutionMultiplier)

        Promise.all([postProcessing.initializeTextures(),deferred.initializeTextures()])
            .then(() => {
                renderer.current.systems = [
                    new PhysicsSystem(),
                    new TransformSystem(),
                    new ShadowMapSystem(gpu),
                    new PickSystem(gpu),
                    deferred,
                    postProcessing
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
        if (initialized) {
            renderer.current?.stop()
            updateSystems(() =>     renderer.current?.start(entities))

        }
    }, [settings.resolutionMultiplier])

    useEffect(() => {
        if (gpu && !initialized && id) {
            const gridEntity = new Entity(undefined, 'Grid')

            renderer.current = new Engine(id, gpu)
            setInitialized(true)
            updateSystems(() => {


                dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: gridEntity})
                dispatchEntities({
                    type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                        entityID: gridEntity.id,
                        data: new GridComponent(gpu)
                    }
                })

                renderer.current?.prepareData(renderingProps, entities, renderingProps.materials, renderingProps.meshes)
            })

        } else if (gpu && id) {
            resizeObserver = new ResizeObserver(() => {
                if (gpu && initialized)
                    renderer.current.camera.aspectRatio = gpu.canvas.width / gpu.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))

            renderer.current?.prepareData(renderingProps, entities, renderingProps.materials, renderingProps.meshes)
            if (!canRender)
                renderer.current?.stop()
            else
                renderer.current?.start(entities)
        }


        return () => {
            renderer.current?.stop()
        }
    }, [renderingProps, entities, gpu, id, canRender])


    return {
        entities, dispatchEntities,
        meshes, setMeshes,
        gpu, materials, setMaterials,
        selectedElement, setSelectedElement,
        canRender, setCanRender,
        renderer: renderer.current
    }
}
