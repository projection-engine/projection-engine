import {boolean, group, number} from "./prop-types";

export default [
    group("DISTANCE_CULLING", [
        boolean("ENABLED", "hasDistanceCullingEnabled"),
        number("MAX_DISTANCE", "cullingDistance", undefined, 0, 1, undefined, undefined, comp => !comp.distanceCulling),
    ]),

    group("SCREEN_DOOR", [
        boolean("ENABLED", "screenDoorEffect")
    ]),


    group("OCCLUSION_CULLING", [
        boolean("ENABLED", "occlusionCulling")
    ])
]
