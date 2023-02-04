import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
import Movable from "../../../../../engine-core/instances/components/Movable";

export default [
    {
        label: LOCALIZATION_EN.QUATERNION,
        type: Movable.ROTATION_QUATERNION
    },

    {
        label: "XYZ " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_XYZ
    },
    {
        label: "XZY " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_XZY
    },
    {
        label: "YXZ " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_YXZ
    },
    {
        label: "YZX " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_YZX
    },
    {
        label: "ZXY " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_ZXY
    },
    {
        label: "ZYX " + LOCALIZATION_EN.EULER,
        type: Movable.ROTATION_EULER_ZYX
    },
]