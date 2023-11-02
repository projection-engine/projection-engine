import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
import EditorCameraSystem from "../../../../../engine/tools/systems/EditorCameraSystem"
import COMPONENT_PROP_TYPES from "../../../static/COMPONENT_PROP_TYPES";

export default [
	{
		type: COMPONENT_PROP_TYPES.NUMBER,
		label: LocalizationEN.SCREEN_GRABBING_SPEED,
		key: ["camera", "screenSpaceMovementSpeed"],
		target: "settings",
		min: .01,
		increment: .1,
		onChange: v => {
			EditorCameraSystem.updateProperties({screenSpaceMovementSpeed: v})
			return v
		}
	},
	{
		type: COMPONENT_PROP_TYPES.NUMBER,
		label: LocalizationEN.TRANSLATION,
		key: ["camera", "movementSpeed"],
		target: "settings",
		min: .01,
		increment: .1,
		onChange: v => {
			EditorCameraSystem.updateProperties({movementSpeed: v})
			return v
		}
	},
	{
		type: COMPONENT_PROP_TYPES.NUMBER,
		label: LocalizationEN.ROTATION,
		key: ["camera", "turnSpeed"],
		target: "settings",
		min: .01,
		increment: .001,
		onChange: v => {
			EditorCameraSystem.updateProperties({turnSpeed: v})
			return v
		}
	},
	{
		type: COMPONENT_PROP_TYPES.NUMBER,
		label: LocalizationEN.SMOOTHING,
		key: ["camera", "smoothing"],
		target: "settings",
		min: 0,
		max: 10,
		increment: .001,
		onChange: v => 1 / v
	}
]
