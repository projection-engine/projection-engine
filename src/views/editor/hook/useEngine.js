import {useEffect, useMemo, useReducer, useRef, useState} from "react";
import {enableBasics} from "../../../services/engine/utils/utils";
import entityReducer, {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";
import PostProcessingSystem from "../../../services/engine/ecs/systems/PostProcessingSystem";
import DeferredSystem from "../../../services/engine/ecs/systems/DeferredSystem";
import TransformSystem from "../../../services/engine/ecs/systems/TransformSystem";
import PhysicsSystem from "../../../services/engine/ecs/systems/PhysicsSystem";
import ShadowMapSystem from "../../../services/engine/ecs/systems/ShadowMapSystem";
import PickSystem from "../../../services/engine/ecs/systems/PickSystem";
import Entity from "../../../services/engine/ecs/basic/Entity";
import Engine from "../../../services/engine/Engine";
import GridComponent from "../../../services/engine/ecs/components/GridComponent";
import parseEngineEntities from "../../../services/engine/utils/parseEngineEntities";


export default function useEngine(id, canExecutePhysicsAnimation, settings) {
    const [canRender, setCanRender] = useState(true)
    const [gpu, setGpu] = useState()
    const [selectedElement, setSelectedElement] = useState(null)
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

    useEffect(() => {
        if (id) {
            const newGPU = document.getElementById(id + '-canvas').getContext('webgl2', {
                antialias: false,
                preserveDrawingBuffer: true
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
            shadingModel: settings.shadingModel
        }
    }, [
        canExecutePhysicsAnimation,
        meshes, selectedElement,
        setSelectedElement, materials,
        settings.cameraType,
        settings.shadingModel
    ])


    const updateSystems = () => {
        console.log(settings)
        renderer.current.systems = [
            new PhysicsSystem(),
            new TransformSystem(),
            new ShadowMapSystem(gpu),
            new PickSystem(gpu),
            new DeferredSystem(gpu, settings.resolutionMultiplier),
            new PostProcessingSystem(gpu, settings.resolutionMultiplier)
        ]
    }

    useEffect(() => {
        if (renderer.current)
            renderer.current.camera.fov = settings.fov
    }, [settings.fov])

    useEffect(() => {
        if (initialized) {
            renderer.current?.stop()
            updateSystems()
            renderer.current?.start(entities)
        }
    }, [settings.resolutionMultiplier])

    useEffect(() => {
        if (gpu && !initialized && id) {
            const gridEntity = new Entity(undefined, 'Grid')

            renderer.current = new Engine(id, gpu)
            updateSystems()
            setInitialized(true)

            dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: gridEntity})
            dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                    entityID: gridEntity.id,
                    data: new GridComponent(gpu)
                }
            })

            parseEngineEntities(renderingProps, entities, renderingProps.materials, renderingProps.meshes, renderer.current)
        } else if (gpu && id) {
            resizeObserver = new ResizeObserver(() => {
                if (gpu && initialized)
                    renderer.current.camera.aspectRatio = gpu.canvas.width / gpu.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))

            parseEngineEntities(renderingProps, entities, renderingProps.materials, renderingProps.meshes, renderer.current)
            if (!canRender)
                renderer.current?.stop()
            if (canRender && !renderer.current?.keep)
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
    }
}
