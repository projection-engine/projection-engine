import {useContext, useEffect, useState} from "react";

import useEngineEssentials, {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import Entity from "../engine/basic/Entity";
import DirectionalLightComponent from "../engine/components/DirectionalLightComponent";

import MeshComponent from "../engine/components/MeshComponent";
import TransformComponent from "../engine/components/TransformComponent";
import MeshInstance from "../engine/instances/MeshInstance";

import CAMERA_TYPES from "./camera/CAMERA_TYPES";
import MaterialComponent from "../engine/components/MaterialComponent";
import COMPONENTS from "../engine/templates/COMPONENTS";
import LoaderProvider from "../../components/loader/LoaderProvider";
import QuickAccessProvider from "../hooks/QuickAccessProvider";
import SHADING_MODELS from "../engine/templates/SHADING_MODELS";
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider";

export default function useMinimalEngine(initializeSphere, centerOnSphere, loadAllMeshes) {
    const {
        meshes, setMeshes,
        materials, setMaterials,
        entities, dispatchEntities,
    } = useEngineEssentials()
    const {gpu, renderer, target} = useContext(GPUContextProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const [initialized, setInitialized] = useState(false)
    const load = useContext(LoaderProvider)
    const [focused, setFocused] = useState(true)
    useEffect(() => {
        const lightEntity = new Entity(undefined, 'light')
        const light = new DirectionalLightComponent()
        light.direction = [0, 100, 100]
        light.shadowMap = false
        lightEntity.components[COMPONENTS.DIRECTIONAL_LIGHT] = light

        const promises = []
        if (initializeSphere)
            promises.push(new Promise(async r => {
                const sphereMesh = await import('../../static/assets/Sphere.json')
                r(initializeMesh(sphereMesh, gpu, IDS.SPHERE, 'Sphere', setMeshes))
            }))
        if (loadAllMeshes)
            promises.push(new Promise(async r => {
                const cubeData = await import('../../static/assets/Cube.json')
                r(initializeMesh(cubeData, gpu, IDS.CUBE, 'Cube', setMeshes, undefined, true))
            }))

        Promise.all(promises).then(r => {
            const toLoad = [
                quickAccess.sampleSkybox,
                lightEntity,
            ]
            if (r[0])
                toLoad.push(r[0])
            if (r[1])
                toLoad.push(r[1])
            dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: toLoad})
        })
    }, [])
    useEffect(() => {
        renderer.cameraType = CAMERA_TYPES.SPHERICAL
        renderer.camera.radius = 2
        if (!initialized && focused) {
            setInitialized(true)
        }
    }, [initialized, focused])
    useEffect(() => {
        if(focused)
        renderer.updatePackage(
            entities,
            materials,
            meshes,
            {
                fxaa: true,
                meshes,
                gamma: 2.2,
                exposure: 1,
                materials: [],
                noRSM: true,
                shadingModel: SHADING_MODELS.DETAIL,
                cameraType: CAMERA_TYPES.SPHERICAL,
                bloom: true,
                filmGrain: true,
                filmGrainStrength: .07,
                bloomStrength: .1,
                bloomThreshold: .75,
                selected: []
            })
    }, [
        meshes, materials,
        entities, gpu,
        renderer,
        target,
        initialized,
        focused
    ])


    return {
        focused, setFocused,
        load,
        entities, dispatchEntities,
        meshes, setMeshes, gpu,
        setInitialized,
        material: materials[0], setMaterial: mat => setMaterials([mat]),
        renderer, toImage: () => new Promise(re => re(gpu.canvas.toDataURL()))
    }
}


export function initializeMesh(data, gpu, id, name, setMeshes, noTranslation, noEntity) {
    let mesh = new MeshInstance({
        ...data,
        id: id,
        gpu: gpu
    })
    setMeshes(prev => [...prev, mesh])
    if (!noEntity) {
        const newEntity = new Entity(id, name)
        const transformation = new TransformComponent()

        transformation.scaling = data.scaling
        transformation.rotation = data.rotation
        if (!noTranslation)
            transformation.translation = data.translation

        newEntity.components.MeshComponent = new MeshComponent(undefined, mesh.id)
        newEntity.components.TransformComponent = transformation
        newEntity.components.MaterialComponent = new MaterialComponent(undefined, id === IDS.PLANE ? undefined : IDS.MATERIAL, id === IDS.PLANE)

        return newEntity
    }
    return null
}

export const IDS = {
    MATERIAL: '1',
    SPHERE: 'SPHERE-0',
    PLANE: 'PLANE-0',
    TARGET: 'TARGET',
    CUBE: 'CUBE-0'
}