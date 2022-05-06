import {useContext, useEffect, useMemo, useState} from "react";

import useEngineEssentials, {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import Entity from "../engine/basic/Entity";


import EditorEngine from "../engine/editor/EditorEngine";
import DirectionalLightComponent from "../engine/components/DirectionalLightComponent";

import MeshComponent from "../engine/components/MeshComponent";
import TransformComponent from "../engine/components/TransformComponent";
import MeshInstance from "../engine/instances/MeshInstance";

import CAMERA_TYPES from "../engine/editor/camera/CAMERA_TYPES";
import MaterialComponent from "../engine/components/MaterialComponent";

import {v4 as uuidv4} from 'uuid';
import COMPONENTS from "../engine/templates/COMPONENTS";
import LoaderProvider from "../../components/loader/LoaderProvider";
import QuickAccessProvider from "./QuickAccessProvider";
import SYSTEMS from "../engine/templates/SYSTEMS";
import SHADING_MODELS from "../engine/templates/SHADING_MODELS";

const id = uuidv4().toString()
export default function useMinimalEngine(initializeSphere, centerOnSphere, loadAllMeshes) {
    const {
        meshes, setMeshes,
        materials, setMaterials,
        entities, dispatchEntities,
        gpu
    } = useEngineEssentials(id + '-canvas')
    const quickAccess = useContext(QuickAccessProvider)
    const [canRender, setCanRender] = useState(true)
    const load = useContext(LoaderProvider)

    const renderer = useMemo(() => {
        if (gpu) {
            const r = new EditorEngine(id, gpu, {w: window.screen.width, h: window.screen.height}, [SYSTEMS.SHADOWS])

            const lightEntity = new Entity(undefined, 'light')
            const light = new DirectionalLightComponent()
            light.direction = [0, 100, 100]
            light.shadowMap = false
            lightEntity.components[COMPONENTS.DIRECTIONAL_LIGHT] = light

            const promises = []
            if (initializeSphere)
                promises.push(new Promise(async r => {
                    const sphereMesh = await import('../engine/editor/assets/Sphere.json')
                    r(initializeMesh(sphereMesh, gpu, IDS.SPHERE, 'Sphere', setMeshes))
                }))
            if (loadAllMeshes)
                promises.push(new Promise(async r => {
                    const cubeData = await import('../engine/editor/assets/Cube.json')
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
            r.camera.radius = 2
            return r
        }
        return undefined
    }, [gpu])
    useEffect(() => {
        if (canRender && renderer) {
            renderer.start()
        } else if (renderer)
            renderer.stop()
    }, [canRender])
    useEffect(() => {
        if (renderer) {

            renderer.updatePackage(entities, materials, meshes, {
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
                bloomThreshold: .75
            })

        }
        return () => renderer?.stop()
    }, [
        meshes,
        materials,
        entities,
        gpu,
        id,
        renderer,
        canRender
    ])


    return {
        id, load,
        entities, dispatchEntities,
        meshes, setMeshes, gpu,
        material: materials[0], setMaterial: mat => setMaterials([mat]),
        renderer,
        canRender, setCanRender,
        toImage: () => new Promise(re => re(gpu.canvas.toDataURL()))
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

        if (id === IDS.SPHERE)
            transformation.translation = [0, 1, 0]
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