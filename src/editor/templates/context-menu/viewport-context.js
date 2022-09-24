import TransformationAPI from "../../../../public/engine/production/apis/math/TransformationAPI";
import SelectionStore from "../../stores/SelectionStore";
import {vec3} from "gl-matrix";
import VIEWPORT_HOTKEYS from "../VIEWPORT_HOTKEYS";
import EntityConstructor from "../../libs/EntityConstructor";
import {Engine} from "../../../../public/engine/production";
import QueryAPI from "../../../../public/engine/production/apis/utils/QueryAPI";

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
            label: "Move to screen",
            onClick: () => {
                const selected = SelectionStore.engineSelected
                for (let i = 0; i < selected.length; i++)
                    EntityConstructor.translateEntity(QueryAPI.getEntityByID(selected[i]))
            }
        },

        {
            label: "Center on origin",
            onClick: () => {
                const selected = SelectionStore.engineSelected
                for (let i = 0; i < selected.length; i++) {
                    const entity = QueryAPI.getEntityByID(selected[i])
                    entity._translation[0] = 0
                    entity._translation[1] = 0
                    entity._translation[2] = 0
                    entity.__changedBuffer[0] = 1
                }
            }
        },
        VIEWPORT_HOTKEYS.SNAP_TO_GRID,
        {divider: true},
        VIEWPORT_HOTKEYS.FOCUS,
        VIEWPORT_HOTKEYS.FIXATE_ACTIVE

    ]
}