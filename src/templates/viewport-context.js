import SelectionStore from "../stores/SelectionStore";
import viewportHotkeys from "./viewport-hotkeys";
import EntityConstructor from "../libs/EntityConstructor";
import QueryAPI from "../../public/engine/api/utils/QueryAPI";
import entityCreationOptions from "./entity-creation-options";
import {vec3, vec4} from "gl-matrix";
import CameraAPI from "../../public/engine/api/CameraAPI";

export default function viewportContext(settings, forDropdown) {
    const VIEWPORT_HOTKEYS = viewportHotkeys(settings)
    const data = [
        VIEWPORT_HOTKEYS.SELECT_NONE,
        VIEWPORT_HOTKEYS.SELECT_ALL,
        VIEWPORT_HOTKEYS.INVERT_SELECTION,
        VIEWPORT_HOTKEYS.SELECT_HIERARCHY,
        VIEWPORT_HOTKEYS.FOCUS_ON_CAMERA,
        {divider: true},
        VIEWPORT_HOTKEYS.COPY,
        VIEWPORT_HOTKEYS.PASTE,
        VIEWPORT_HOTKEYS.DELETE,
        {divider: true},
        VIEWPORT_HOTKEYS.GROUP,
        VIEWPORT_HOTKEYS.DUPLICATE,
        {divider: true},
        VIEWPORT_HOTKEYS.HIDE_ACTIVE,
        VIEWPORT_HOTKEYS.FOCUS,
        VIEWPORT_HOTKEYS.FIXATE_ACTIVE,
        {
            label: "Pivot point",
            children: [

                {
                    label: "To screen",
                    onClick: () => {
                        const selected = QueryAPI.getEntityByID(SelectionStore.engineSelected[0])
                        if (selected) {
                            const position = [0, 0, -10, 1]
                            vec4.transformQuat(position, position, CameraAPI.rotationBuffer)
                            vec3.add(selected.pivotPoint, CameraAPI.translationBuffer, position)

                            selected.__pivotChanged = true
                        }


                        for (let i = 0; i < selected.length; i++)
                            EntityConstructor.translateEntity(QueryAPI.getEntityByID(selected[i]))
                    }
                },
                {
                    label: "To origin",
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
                {
                    label: "To absolute translation",
                    onClick: () => {
                        const selected = QueryAPI.getEntityByID(SelectionStore.engineSelected[0])
                        if (selected) {
                            selected.pivotPoint[0] = selected.absoluteTranslation[0]
                            selected.pivotPoint[1] = selected.absoluteTranslation[1]
                            selected.pivotPoint[2] = selected.absoluteTranslation[2]
                            selected.__pivotChanged = true
                        }
                    }
                },
                {
                    label: "To translation",
                    onClick: () => {
                        const selected = QueryAPI.getEntityByID(SelectionStore.engineSelected[0])
                        if (selected) {
                            selected.pivotPoint[0] = selected._translation[0]
                            selected.pivotPoint[1] = selected._translation[1]
                            selected.pivotPoint[2] = selected._translation[2]
                            selected.__pivotChanged = true
                        }
                    }
                },
                {
                    label: "To secondary selection",
                    onClick: () => {
                        const primary = QueryAPI.getEntityByID(SelectionStore.engineSelected[0])
                        const secondary = QueryAPI.getEntityByID(SelectionStore.engineSelected[1])
                        if (primary && secondary) {
                            primary.pivotPoint[0] = secondary._translation[0]
                            primary.pivotPoint[1] = secondary._translation[1]
                            primary.pivotPoint[2] = secondary._translation[2]
                            primary.__pivotChanged = true
                        }
                    }
                },
            ]
        },
        {
            label: "Transformation",
            children: [
                VIEWPORT_HOTKEYS.ROUND_TRANSFORMATION,
                VIEWPORT_HOTKEYS.SNAP_TO_ORIGIN,
                VIEWPORT_HOTKEYS.SNAP_TO_GRID,
                {
                    label: "To pivot",
                    onClick: () => {
                        const selected = SelectionStore.engineSelected
                        for (let i = 0; i < selected.length; i++)
                            EntityConstructor.translateEntity(QueryAPI.getEntityByID(selected[i]))
                    }
                },
                {
                    label: "To screen",
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

                        comp.translation = [0, 0, 0]
                        comp.scaling = [1, 1, 1]
                        comp._rotationQuat = [0, 0, 0, 1]
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
    if(forDropdown)
        data.pop()
    return data
}