import TransformationAPI from "../../../../public/engine/production/apis/math/TransformationAPI";
import SelectionStore from "../../stores/SelectionStore";
import {vec3} from "gl-matrix";
import VIEWPORT_HOTKEYS from "../VIEWPORT_HOTKEYS";

export default function viewportContext() {
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
            label: "Move to 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                vec3.copy(comp.translation, window.engineCursor.translation)
            }
        },
        {
            label: "Pivot on 3D cursor",
            onClick: () => {
                const comp = SelectionStore.selectedEntity
                vec3.copy(comp.pivotPoint, window.engineCursor.translation)
            }
        },
        {
            label: "3D cursor to origin",
            onClick: () => {
                const component = SelectionStore.selectedEntity
                if (component) {
                    const t = window.engineCursor
                    vec3.copy(t.translation, component.absoluteTranslation)

                    t.matrix = TransformationAPI.transform(t.translation, [0, 0, 0, 1], t.scaling)
                }
            }
        },
        {divider: true},
        VIEWPORT_HOTKEYS.FOCUS,
        VIEWPORT_HOTKEYS.FIXATE_ACTIVE,
        VIEWPORT_HOTKEYS.SNAP_TO_GRID,
    ]
}