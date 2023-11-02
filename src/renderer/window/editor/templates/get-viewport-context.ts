import getViewportHotkeys from "./get-viewport-hotkeys"
import EntityFactoryService from "../services/engine/EntityFactoryService"
import getEntityCreationOptions from "./get-entity-creation-options"
import ContextMenuOption from "../../shared/lib/context-menu/templates/ContextMenuOptions"
import EntitySelectionStore from "../../shared/stores/EntitySelectionStore";
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EngineToolsState from "../../../engine/tools/state/EngineToolsState";


export function getViewportOptionsForDropdown() {
    const result = []
    const options = getViewportContext(true)
    for (let i = 0; i < options.length; i++) {
        const v = options[i]
        if (i >= options.length - 1)
            continue
        if (v.children) {
            result.push({divider: true, label: v.label})
            v.children.forEach(v => {
                result.push(v)
            })
        } else
            result.push(v)
    }
    return result
}

export default function getViewportContext(forDropdown?: boolean): ContextMenuOption[] {
    const VIEWPORT_HOTKEYS = getViewportHotkeys()
    const data = [
        {divider: true, label: "Selection"},
        VIEWPORT_HOTKEYS.SELECT_NONE,
        VIEWPORT_HOTKEYS.SELECT_ALL,
        VIEWPORT_HOTKEYS.INVERT_SELECTION,
        VIEWPORT_HOTKEYS.SELECT_HIERARCHY,
        VIEWPORT_HOTKEYS.SHOW_SELECTED,

        {divider: true, label: "Copy/paste"},
        VIEWPORT_HOTKEYS.COPY,
        VIEWPORT_HOTKEYS.PASTE,
        VIEWPORT_HOTKEYS.DELETE,
        {divider: true, label: "Active"},
        VIEWPORT_HOTKEYS.FOCUS_ON_CAMERA,
        VIEWPORT_HOTKEYS.GROUP,
        VIEWPORT_HOTKEYS.DUPLICATE,

        VIEWPORT_HOTKEYS.HIDE_ACTIVE,
        VIEWPORT_HOTKEYS.FOCUS,
        VIEWPORT_HOTKEYS.FIXATE_ACTIVE,
        {
            label: "Transformation",
            children: [
                {
                    label: "Pivot point to origin",
                    onClick: () => {
                        const selected = EntityManager.getComponent<TransformationComponent>(EntitySelectionStore.getEntitiesSelected()[0], Components.TRANSFORMATION)
                        if (selected) {
                            selected.pivotPoint[0] = 0
                            selected.pivotPoint[1] = 0
                            selected.pivotPoint[2] = 0
                            EngineToolsState.pivotChanged.set(selected.entity, true)
                        }
                    }
                },
                VIEWPORT_HOTKEYS.ROUND_TRANSFORMATION,
                VIEWPORT_HOTKEYS.SNAP_TO_ORIGIN,
                VIEWPORT_HOTKEYS.SNAP_TO_GRID,
                {
                    label: "Translate to screen",
                    onClick: () => {
                        EntitySelectionStore.getEntitiesSelected().forEach(EntityFactoryService.translateEntity)
                    }
                },
                {
                    label: "Apply transformation",
                    onClick: () => {
                        const comp = EntityManager.getComponent<TransformationComponent>(EntitySelectionStore.getMainEntity(), Components.TRANSFORMATION)
                        if (!comp) {
                            return
                        }
                        comp.baseTransformationMatrix = comp.matrix

                        comp.translation[0] = 0
                        comp.translation[1] = 0
                        comp.translation[2] = 0

                        comp.scaling[0] = 1
                        comp.scaling[1] = 1
                        comp.scaling[2] = 1

                        comp.rotationQuaternion[0] = 0
                        comp.rotationQuaternion[1] = 0
                        comp.rotationQuaternion[2] = 0
                        comp.rotationQuaternion[3] = 1

                        comp.rotationEuler[0] = 0
                        comp.rotationEuler[1] = 0
                        comp.rotationEuler[2] = 0

                        EngineToolsState.pivotChanged.set(comp.entity, false)
                    }
                },

            ]
        },
        {divider: true},
        {
            label: "Create",
            children: getEntityCreationOptions()
        }
    ]
    if (forDropdown)
        data.pop()
    return data
}
