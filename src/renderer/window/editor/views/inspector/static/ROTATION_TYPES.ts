import Movable from "../../../../../engine/core/instances/components/Movable"
import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";

export default [
	{
		label: LocalizationEN.QUATERNION,
		type: Movable.ROTATION_QUATERNION
	},

	{
		label: "XYZ " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_XYZ
	},
	{
		label: "XZY " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_XZY
	},
	{
		label: "YXZ " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_YXZ
	},
	{
		label: "YZX " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_YZX
	},
	{
		label: "ZXY " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_ZXY
	},
	{
		label: "ZYX " + LocalizationEN.EULER,
		type: Movable.ROTATION_EULER_ZYX
	},
]