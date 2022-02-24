import {useContext, useEffect, useLayoutEffect, useReducer, useRef, useState} from "react";

import entityReducer, {ENTITY_ACTIONS} from "../engine/utils/entityReducer";
import {enableBasics} from "../engine/utils/utils";
import Entity from "../engine/ecs/basic/Entity";

import planeMesh from '../../static/meshes/plane.json'
import sphereMesh from '../../static/meshes/sphere.json'

import Engine from "../engine/Engine";
import TransformSystem from "../engine/ecs/systems/TransformSystem";
import ShadowMapSystem from "../engine/ecs/systems/ShadowMapSystem";
import MeshSystem from "../engine/ecs/systems/MeshSystem";
import PostProcessingSystem from "../engine/ecs/systems/PostProcessingSystem";
import SkyboxComponent from "../engine/ecs/components/SkyboxComponent";
import DirectionalLightComponent from "../engine/ecs/components/DirectionalLightComponent";

import MeshComponent from "../engine/ecs/components/MeshComponent";
import TransformComponent from "../engine/ecs/components/TransformComponent";
import Mesh from "../engine/renderer/elements/Mesh";

import skybox from '../../static/default_skybox.jpg'
import {LoaderProvider} from "@f-ui/core";

import randomID from "../utils/misc/randomID";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";
import EVENTS from "../utils/misc/EVENTS";
import CAMERA_TYPES from "../engine/utils/CAMERA_TYPES";


export default function useVisualizer(initializePlane, initializeSphere) {
    const [id, setId] = useState()
    const [gpu, setGpu] = useState()
    const [meshes, setMeshes] = useState([])
    const [material, setMaterial] = useState()
    const [entities, dispatchEntities] = useReducer(entityReducer, [], () => [])
    const [initialized, setInitialized] = useState(false)
    const [canRender, setCanRender] = useState(true)
    const [finished, setFinished] = useState(false)

    const load = useContext(LoaderProvider)
    const renderer = useRef()
    let resizeObserver

    useLayoutEffect(() => {
        setId(randomID())
    }, [])


    useEffect(() => {
        if (id && !gpu && !initialized) {
            const newGPU = document.getElementById(id + '-canvas').getContext('webgl2', {
                antialias: false,
                preserveDrawingBuffer: true
            })
            enableBasics(newGPU)
            setGpu(newGPU)
        }

        if (gpu && !initialized && id) {

            initializeSkybox(dispatchEntities, gpu)
            initializeLight(dispatchEntities)

            if (initializePlane)
                initializeMesh(planeMesh, gpu, IDS.PLANE, 'Plane', dispatchEntities, setMeshes)
            if (initializeSphere)
                initializeMesh(sphereMesh, gpu, IDS.SPHERE, 'Sphere', dispatchEntities, setMeshes)

            renderer.current = new Engine(id, gpu)

            const deferred = new MeshSystem(gpu, 1)
            load.pushEvent(EVENTS.UPDATING_SYSTEMS)
            setInitialized(true)
            deferred.initializeTextures()
                .then(() => {
                    renderer.current.systems = [
                        new TransformSystem(),
                        new ShadowMapSystem(gpu),
                        deferred,
                        new PostProcessingSystem(gpu, 1)
                    ]
                    renderer.current.camera.radius = 2
                    load.finishEvent(EVENTS.UPDATING_SYSTEMS)

                    setFinished(true)
                })
        } else if (gpu && id && initialized && finished) {

            resizeObserver = new ResizeObserver(() => {
                if (initialized)
                    renderer.current.camera.aspectRatio = gpu?.canvas.width / gpu?.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))


            if (!canRender)
                renderer.current?.stop()
            else
                renderer.current?.start(entities, [], meshes, {
                    fxaa: true,
                    meshes,
                    materials: [],
                    shadingModel: SHADING_MODELS.DETAIL,
                    cameraType: CAMERA_TYPES.SPHERICAL,
                    injectMaterial: material
                })
        }

        return () => {
            renderer.current?.stop()
        }
    }, [
        meshes,
        material,
        finished,
        initialized,
        entities,
        gpu,
        id,
        canRender
    ])


    return {
        id, load,
        entities, dispatchEntities,
        meshes, setMeshes, gpu,
        material, setMaterial,
        initialized, renderer: renderer.current,
        canRender, setCanRender
    }
}

function initializeSkybox(dispatch, gpu) {
    const newEntity = new Entity(undefined, 'sky')
    const sky = new SkyboxComponent(undefined, gpu)
    const img = new Image()
    img.src = skybox

    img.onload = () => {
        sky.hdrTexture = {blob: img, imageID: undefined, type: 'jpg'}
        dispatch({
            type: ENTITY_ACTIONS.ADD,
            payload: newEntity
        })
        dispatch({
            type: ENTITY_ACTIONS.ADD_COMPONENT,
            payload: {
                entityID: newEntity.id,
                data: sky
            }
        })
    }


}

function initializeLight(dispatch) {
    const newEntity = new Entity(undefined, 'light')
    const light = new DirectionalLightComponent()
    light.direction = [0, 100, 100]
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            entityID: newEntity.id,
            data: light
        }
    })
}

export function initializeMesh(data, gpu, id, name, dispatch, setMeshes, noTranslation) {
    let mesh = new Mesh({
        ...data,
        id: randomID(),
        gpu: gpu,
        maxBoundingBox: data.boundingBoxMax,
        minBoundingBox: data.boundingBoxMin
    })
    setMeshes(prev => [...prev, mesh])

    const newEntity = new Entity(id, name)

    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotation = data.rotation
    if (!noTranslation)
        transformation.translation = data.translation
    newEntity.components.MeshComponent =  new MeshComponent(undefined, mesh.id)
    newEntity.components.TransformComponent =  transformation


    console.log(mesh, newEntity)
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
}

export const IDS = {
    SPHERE: 'SPHERE-0',
    PLANE: 'PLANE-0',
    TARGET: 'TARGET'
}