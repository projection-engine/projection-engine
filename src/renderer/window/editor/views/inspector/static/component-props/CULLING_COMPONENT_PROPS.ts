import {boolean, group, number} from "./prop-types";
import CullingComponent from "@engine-core/lib/components/CullingComponent";

export default [
    group("DISTANCE_CULLING", [
        boolean("ENABLED", "hasDistanceCullingEnabled"),
        number("MAX_DISTANCE", "cullingDistance", undefined, 0, 1, undefined, undefined, comp => !(comp as CullingComponent).hasDistanceCullingEnabled),
    ]),

    group("SCREEN_DOOR", [
        boolean("ENABLED", "screenDoorEffect")
    ]),


    group("OCCLUSION_CULLING", [
        boolean("ENABLED", "occlusionCulling")
    ])
]
