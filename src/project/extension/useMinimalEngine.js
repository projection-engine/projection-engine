import {useContext, useEffect, useState} from "react";

import useEngineEssentials, {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import Entity from "../engine/basic/Entity";
import DirectionalLightComponent from "../engine/components/DirectionalLightComponent";

import MeshComponent from "../engine/components/MeshComponent";
import TransformComponent from "../engine/components/TransformComponent";
import MeshInstance from "../engine/instances/MeshInstance";

import MaterialComponent from "../engine/components/MaterialComponent";
import COMPONENTS from "../engine/templates/COMPONENTS";
import LoaderProvider from "../../components/loader/LoaderProvider";
import QuickAccessProvider from "../hooks/QuickAccessProvider";
import SHADING_MODELS from "../engine/templates/SHADING_MODELS";
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider";

const toRad = 180 / Math.PI
export default function useMinimalEngine() {
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
        Promise.all([import('../../static/assets/Sphere.json'), import('../../static/assets/Cube.json')])
            .then(r => {
                const [sphereMesh, cubeData] = r
                const sphere = initializeMesh(sphereMesh, gpu, IDS.SPHERE, 'Sphere', setMeshes)
                const cube = initializeMesh(cubeData, gpu, IDS.CUBE, 'Cube', setMeshes, undefined, true)
                const toLoad = [
                    quickAccess.sampleSkybox,
                    lightEntity,
                ]
                if (sphere)
                    toLoad.push(sphere)
                if (cube)
                    toLoad.push(cube)
                dispatchEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: toLoad})
            })
    }, [])

    useEffect(() => {
        renderer.cameraData.useBackupCamera = true
        renderer.camera.radius = 3

        if (!initialized && focused) {
            setInitialized(true)
        }
    }, [initialized, focused])
    useEffect(() => {
        if (focused)
            renderer.updatePackage(
                entities,
                materials,
                meshes,
                {
                    fov: 60 * toRad,
                    distortion: false,
                    distortionStrength: 1,
                    chromaticAberration: true,
                    chromaticAberrationStrength: .5,

                    fxaa: true,
                    meshes,
                    gamma: 1.8,
                    exposure: 1,
                    materials: [],
                    noRSM: true,
                    shadingModel: SHADING_MODELS.DETAIL,

                    bloom: true,
                    filmGrain: true,
                    filmGrainStrength: .1,
                    bloomStrength: .1,
                    bloomThreshold: .75,
                    selected: []
                },
                [],
                undefined,
                undefined,
                true)
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

        newEntity.components[COMPONENTS.MESH] = new MeshComponent(undefined, mesh.id)
        newEntity.components[COMPONENTS.TRANSFORM] = transformation
        newEntity.components[COMPONENTS.MATERIAL] = new MaterialComponent(undefined, id === IDS.PLANE ? undefined : IDS.MATERIAL, id === IDS.PLANE)

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