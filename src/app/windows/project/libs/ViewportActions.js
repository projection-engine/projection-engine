import dispatchRendererEntities, {ENTITY_ACTIONS} from "../stores/templates/dispatch-renderer-entities";
import RendererStoreController from "../stores/RendererStoreController";
import Renderer from "./engine/Renderer";
import COMPONENTS from "./engine/data/COMPONENTS";

export default class ViewportActions {
    static toCopy = []

    static copy(single, target, engine) {
        ViewportActions.toCopy = target ? target : (single ? [engine.selected[0]] : engine.selected)
        alert.pushAlert(`Entities copied (${engine.selected.length}).`, "info")
    }

    static focus(entity) {
        if (!entity || !entity.components[COMPONENTS.TRANSFORM])
            return
        window.renderer.camera.radius = 10
        window.renderer.camera.centerOn = entity.components[COMPONENTS.TRANSFORM].translation
        window.renderer.camera.updateViewMatrix()
    }

    static deleteSelected() {
        const engine = RendererStoreController.engine
        dispatchRendererEntities({
            type: ENTITY_ACTIONS.REMOVE_BLOCK,
            payload: [...engine.selected]
        })
    }

    static invertSelection() {
        const engine = RendererStoreController.engine
        const newArr = []
        const notValid = {}
        const engineCopy = {...engine}
        for (let i in engineCopy.selected)
            notValid[engineCopy.selected[i]] = true
        const entities = window.renderer.entities

        for (let i = 0; i < entities.length; i++) {
            if (!notValid[entities[i].id])
                newArr.push(entities[i].id)
        }
        engineCopy.selected = newArr
        RendererStoreController.updateEngine(engineCopy)
    }

    static paste(parent) {
        let block = []
        if (!ViewportActions.toCopy)
            return
        ViewportActions.toCopy.forEach(t => {
            const found = Renderer.entitiesMap.get(t)
            if (found) {
                const clone = found.clone()
                clone.parent = parent ? Renderer.entitiesMap.get(parent) : undefined
                block.push(clone)
            }
        })

        dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: block})
        alert.pushAlert(`Pasted ${ViewportActions.toCopy.length} entities.`, "info")

    }

    static group() {
        const engine = RendererStoreController.engine
        ViewportActions.toCopy = engine.selected
        if (engine.selected.length > 1)
            dispatchRendererEntities({
                type: ENTITY_ACTIONS.LINK_MULTIPLE,
                payload: engine.selected
            })
    }

    static selectAll() {
        RendererStoreController.updateEngine({
            ...RendererStoreController.engine,
            selected: window.renderer.entities.filter(e => !e.isFolder).map(e => e.id)
        })
    }

    static fixateActive() {
        const engine = RendererStoreController.engine
        if (engine.selected[0])
            RendererStoreController.updateEngine({...engine, lockedEntity: engine.selected[0]})
    }
}