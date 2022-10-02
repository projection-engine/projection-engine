import SelectionStore from "../../stores/SelectionStore";
import viewportHotkeys from "../hotkeys/viewport-hotkeys";
import EntityConstructor from "../../libs/EntityConstructor";
import QueryAPI from "../../../../public/engine/production/apis/utils/QueryAPI";

export default function viewportContext(settings) {
    const VIEWPORT_HOTKEYS = viewportHotkeys(settings)
    return [
        VIEWPORT_HOTKEYS.SAVE,
        {divider: true},
        VIEWPORT_HOTKEYS.SELECT_NONE,
        VIEWPORT_HOTKEYS.SELECT_ALL,
        VIEWPORT_HOTKEYS.INVERT_SELECTION,
        VIEWPORT_HOTKEYS.SELECT_HIERARCHY,
        {divider: true},
        VIEWPORT_HOTKEYS.COPY,
        VIEWPORT_HOTKEYS.PASTE,
        VIEWPORT_HOTKEYS.DELETE,
        {divider: true},
        VIEWPORT_HOTKEYS.GROUP,
        VIEWPORT_HOTKEYS.DUPLICATE,
        {divider: true},
        {
            label: "Apply current transformation",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                comp.baseTransformationMatrix = comp.matrix

                comp.translation = [0, 0, 0]
                comp.scaling = [1, 1, 1]
                comp.rotationQuaternion = [0, 0, 0, 1]
            }
        },

        {
            label: "Move to screen",
            onClick: () => {
                const selected = SelectionStore.engineSelected
                for (let i = 0; i < selected.length; i++)
                    EntityConstructor.translateEntity(QueryAPI.getEntityByID(selected[i]))
            }
        },

        VIEWPORT_HOTKEYS.ROUND_TRANSFORMATION,
        VIEWPORT_HOTKEYS.SNAP_TO_ORIGIN,
        VIEWPORT_HOTKEYS.SNAP_TO_GRID,
        {divider: true},
        VIEWPORT_HOTKEYS.HIDE_ACTIVE,
        VIEWPORT_HOTKEYS.FOCUS,
        VIEWPORT_HOTKEYS.FIXATE_ACTIVE

    ]
}