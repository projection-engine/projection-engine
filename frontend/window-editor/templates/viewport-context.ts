import SelectionStore from "../../shared/stores/SelectionStore";
import viewportHotkeys from "./viewport-hotkeys";
import EntityConstructor from "../lib/controllers/EntityConstructor";
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI";
import entityCreationOptions from "./entity-creation-options";
import MutableObject from "../../../engine-core/static/MutableObject";
import ContextMenuOption from "../../shared/lib/context-menu/templates/ContextMenuOptions";

export default function viewportContext(settings:MutableObject, forDropdown?:boolean):ContextMenuOption[] {
    const VIEWPORT_HOTKEYS = viewportHotkeys(settings)
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
                        const selected = QueryAPI.getEntityByID(SelectionStore.engineSelected[0])
                        if (selected) {
                            selected.pivotPoint[0] = 0
                            selected.pivotPoint[1] = 0
                            selected.pivotPoint[2] = 0
                            selected.__pivotChanged = true
                        }
                    }
                },
                VIEWPORT_HOTKEYS.ROUND_TRANSFORMATION,
                VIEWPORT_HOTKEYS.SNAP_TO_ORIGIN,
                VIEWPORT_HOTKEYS.SNAP_TO_GRID,
                {
                    label: "Translate to screen",
                    onClick: () => {
                        const selected = SelectionStore.engineSelected
                        for (let i = 0; i < selected.length; i++)
                            EntityConstructor.translateEntity(QueryAPI.getEntityByID(selected[i]))
                    }
                },
                {
                    label: "Apply transformation",
                    onClick: () => {
                        const comp = SelectionStore.selectedEntity
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

                        comp.__pivotChanged = true
                    }
                },

            ]
        },
        {divider: true},
        {
            label: "Create",
            children: entityCreationOptions()
        }
    ]
    if (forDropdown)
        data.pop()
    return data
}