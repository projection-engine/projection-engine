import SelectionStore from "../stores/SelectionStore";
import viewportHotkeys from "./viewport-hotkeys";
import EntityConstructor from "../lib/controllers/EntityConstructor";
import QueryAPI from "../../../engine-core/lib/utils/QueryAPI";
import entityCreationOptions from "./entity-creation-options";
import MutableObject from "../../../engine-core/MutableObject";
import ContextMenuOption from "../../lib/context-menu/templates/ContextMenuOptions";

export default function viewportContext(settings:MutableObject, forDropdown?:boolean):ContextMenuOption[] {
    const VIEWPORT_HOTKEYS = viewportHotkeys(settings)
    const data = [
        {divider: true, label: "Selection"},
        VIEWPORT_HOTKEYS.SELECT_NONE,
        VIEWPORT_HOTKEYS.SELECT_ALL,
        VIEWPORT_HOTKEYS.INVERT_SELECTION,
        VIEWPORT_HOTKEYS.SELECT_HIERARCHY,

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

                        comp._translation[0] = 0
                        comp._translation[1] = 0
                        comp._translation[2] = 0

                        comp._scaling[0] = 1
                        comp._scaling[1] = 1
                        comp._scaling[2] = 1

                        comp._rotationQuat[0] = 0
                        comp._rotationQuat[1] = 0
                        comp._rotationQuat[2] = 0
                        comp._rotationQuat[3] = 1

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