import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";
import {TransformationRotationTypes,} from "@engine-core/engine.enum";

export default [
	{
		label: LocalizationEN.QUATERNION,
		type: TransformationRotationTypes.ROTATION_QUATERNION
	},

	{
		label: "XYZ " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_XYZ
	},
	{
		label: "XZY " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_XZY
	},
	{
		label: "YXZ " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_YXZ
	},
	{
		label: "YZX " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_YZX
	},
	{
		label: "ZXY " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_ZXY
	},
	{
		label: "ZYX " + LocalizationEN.EULER,
		type: TransformationRotationTypes.ROTATION_EULER_ZYX
	},
]
