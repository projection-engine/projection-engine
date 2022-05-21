import {useContext, useEffect, useState} from "react";
import useEngineEssentials, {ENTITY_ACTIONS} from "../engine/useEngineEssentials";
import useHistory from "../hooks/useHistory";
import {HISTORY_ACTIONS} from "../hooks/historyReducer";
import COMPONENTS from "../engine/templates/COMPONENTS";
import GPUContextProvider from "../../components/viewport/hooks/GPUContextProvider";


export default function useEditorEngine(canExecutePhysicsAnimation, settings,  canStart, setAlert) {
    const [canRender, setCanRender] = useState(true)
    const [selected, setSelected] = useState([])
    const [lockedEntity, setLockedEntity] = useState()
    const {
        meshes, setMeshes,
        materials, setMaterials,
        entities, dispatchEntities,
        scripts, setScripts
    } = useEngineEssentials()
    const {gpu, renderer} = useContext(GPUContextProvider)
    const {returnChanges, forwardChanges, dispatchChanges} = useHistory(entities, dispatchEntities, setAlert)

    useEffect(() => {
        if (renderer)
            renderer.start()
    }, [renderer])

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
    useEffect(() => {
        if (renderer && canStart && canRender) {
            renderer.cameraType = settings.cameraType
            renderer.gizmo = settings.gizmo


            renderer?.updatePackage(
                entities,
                materials,
                meshes,
                {canExecutePhysicsAnimation, selected, setSelected, ...settings},
                scripts,
                onGizmoStart,
                onGizmoEnd
            )
        }

    }, [
        canRender,
        canExecutePhysicsAnimation,
        selected, setSelected,
        materials, meshes, scripts,
        entities, gpu,
        settings, canStart
    ])

    return {
        returnChanges, forwardChanges,
        dispatchChanges,
        lockedEntity, setLockedEntity,
        entities, dispatchEntities,
        meshes, setMeshes,
        gpu, materials, setMaterials,

        selected: [...selected],
        setSelected: (data) => {
            console.trace(data)
            setSelected(data)
        },
        canRender, setCanRender,
        renderer,
        scripts, setScripts
    }
}


