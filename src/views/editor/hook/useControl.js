import {useEffect, useState} from "react";
import MeshComponent from "../../../services/engine/ecs/components/MeshComponent";
import MaterialComponent from "../../../services/engine/ecs/components/MaterialComponent";
import PickComponent from "../../../services/engine/ecs/components/PickComponent";
import TransformComponent from "../../../services/engine/ecs/components/TransformComponent";
import {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";

export default function useControl(engine, save, settings) {
    const [toClone, setToClone] = useState()
    let isCtrl = false, isShift = false, isAlt = false
    const handleKey = (e) => {

        if (e.type === 'keydown') {

            if (e.key === 'Control')
                isCtrl = true
            if (e.key === 'Shift')
                isShift = true
            if (e.key === 'Alt')
                isAlt = true

            if (e.key === 's' && isCtrl && !isAlt && !isShift) {
                e.preventDefault()
                save()
            }

            if (e.key === 'c' && isCtrl && !isAlt && !isShift) {
                e.preventDefault()
                if (engine.selectedElement)
                    setToClone(engine.selectedElement)
            }

            if (e.key === 'v' && isCtrl && toClone) {
                const currentElement = engine.entities.find(e => e.id === toClone)
                const clone = new Entity(undefined, currentElement.name + ' - copy')

                // TODO - OTIMIZAR ISSO
                clone.components.MeshComponent = new MeshComponent(undefined, currentElement.components.MeshComponent.meshID)
                clone.components.MaterialComponent = new MaterialComponent()
                clone.components.MaterialComponent.materialID = currentElement.components.MaterialComponent.materialID
                clone.components.MaterialComponent.name = currentElement.components.MaterialComponent.name

                clone.components.PickComponent = new PickComponent(undefined, engine.entities.length + 1)
                clone.components.TransformComponent = new TransformComponent()
                clone.components.TransformComponent.rotation = currentElement.components.TransformComponent.rotation
                clone.components.TransformComponent.translation = currentElement.components.TransformComponent.translation
                clone.components.TransformComponent.scaling = currentElement.components.TransformComponent.scaling


                engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                engine.setSelectedElement(clone.id)
                setToClone(undefined)

            }
            if (e.key === 's' && isCtrl && isAlt) {
                e.preventDefault()
                settings.viewPreferences = true
            }
            if (e.key.toLowerCase() === 'h' && isCtrl && isShift) {
                e.preventDefault()
                settings.fpsVisibility = !settings.fpsVisibility
            }

            if (e.key.toLowerCase() === 'f' && isCtrl && isShift) {
                e.preventDefault()
                settings.fullscreen = !settings.fullscreen
            }
        } else {

            if (e.key === 'Control')
                isCtrl = false
            if (e.key === 'Shift')
                isShift = false
            if (e.key === 'Alt')
                isAlt = false
        }
    }

    useEffect(() => {
        setToClone(undefined)
    }, [engine.selectedElement])
    useEffect(() => {
        document.addEventListener('keydown', handleKey)
        document.addEventListener('keyup', handleKey)
        return () => {
            document.removeEventListener('keyup', handleKey)
            document.removeEventListener('keydown', handleKey)
        }
    }, [engine.entities, engine.selectedElement, settings, toClone])
}

