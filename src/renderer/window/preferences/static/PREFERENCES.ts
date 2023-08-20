import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import EngineToolsState from "../../../engine/tools/EngineToolsState"
import COMPONENT_PROP_TYPES from "../../editor/static/COMPONENT_PROP_TYPES";

export default [
	{label: LocalizationEN.GLOBAL, type: "global", icon: "public"},
	{label: LocalizationEN.SHORTCUTS, type: "shortcuts", icon: "keyboard"},
	{
		label: LocalizationEN.VIEWPORT,
		icon: "desktop_windows",
		form: [
			{
				label: LocalizationEN.ICONS,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.SIZE,
						key: "iconScale",
						target: "settings",
						min: .01,
						updateOnChange: true
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.CULLING_DISTANCE,
						key: "maxDistanceIcon",
						target: "settings",
						min: 1,
						increment: 1,
						updateOnChange: true
					},
				]
			},
			{
				label: LocalizationEN.OVERLAY,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						target: "settings",
						type: COMPONENT_PROP_TYPES.BOOLEAN,
						label: LocalizationEN.GRID,
						key: "showGrid"
					},
					{
						target: "settings",
						type: COMPONENT_PROP_TYPES.BOOLEAN,
						label: LocalizationEN.ICONS,
						key: "showIcons"
					},
					{
						target: "settings",
						type: COMPONENT_PROP_TYPES.BOOLEAN,
						label: LocalizationEN.LINES,
						key: "showLines"
					},
					{
						target: "settings",
						type: COMPONENT_PROP_TYPES.BOOLEAN,
						label: LocalizationEN.OUTLINE,
						key: "showOutline"
					},
					{divider: true},
					{
						type: COMPONENT_PROP_TYPES.COLOR,
						label: LocalizationEN.OUTLINE,
						key: "outlineColor",
						target: "settings",
						updateOnChange: true
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.OUTLINE_WIDTH,
						key: "outlineWidth",
						target: "settings",
						min: .001,
						updateOnChange: true
					},
				]
			},
			{
				label: LocalizationEN.GRID,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.BRIGHTNESS,
						key: "gridColor",
						target: "settings",
						min: 0,
						max: 1,
						onChange: v => EngineToolsState.gridColor = v
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.OPACITY,
						key: "gridOpacity",
						target: "settings",
						min: 0,
						max: 1,
						onChange: v => EngineToolsState.gridOpacity = v
					},
					{divider: true},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.THRESHOLD,
						key: "gridThreshold",
						target: "settings",
						increment: .01,
						min: .001,
						onChange: v => EngineToolsState.gridThreshold = v
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.SCALE,
						key: "gridScale",
						target: "settings",
						increment: .0001,
						min: .0001,
						onChange: v => EngineToolsState.gridScale = v
					},
				]
			},
			{
				label: LocalizationEN.CAMERA_GIZMO,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.SIZE,
						key: "cameraGizmoSize",
						target: "settings",
						increment: 1,
						min: 10
					},
				]
			},
			{
				label: LocalizationEN.GIZMOS,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.SENSITIVITY,
						key: ["gizmoGrid", "sensitivity"],
						target: "settings",
						min: 1
					}
				]
			},
		]
	},
	{
		label: LocalizationEN.RENDERING,
		icon: "visibility",
		form: [
			{
				label: LocalizationEN.RESOLUTION,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{type: COMPONENT_PROP_TYPES.NUMBER, label: "X", key: "resolutionX", min: 1, increment: 1},
					{type: COMPONENT_PROP_TYPES.NUMBER, label: "Y", key: "resolutionY", min: 1, increment: 1}
				]
			},
			{
				label: LocalizationEN.ANTI_ALIASING,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{type: COMPONENT_PROP_TYPES.BOOLEAN, label: LocalizationEN.FXAA, key: "FXAA"},
					{type: COMPONENT_PROP_TYPES.BOOLEAN, label: LocalizationEN.TAA, key: "TAA", disabled: true},
				]
			},
			{
				label: LocalizationEN.PHYSICS,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.PHYSICS_SIMULATION_STEP,
						key: "physicsSimulationStep",
						min: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.PHYSICS_SUB_STEPS,
						key: "physicsSubSteps",
						increment: 1,
						min: 1
					},
				]
			},
			{
				label: LocalizationEN.SSR,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STEPS,
						key: ["SSR", "maxSteps"],
						min: 1,
						increment: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STEP_SIZE,
						key: ["SSR", "stepSize"],
						min: .1
					},
					{type: COMPONENT_PROP_TYPES.NUMBER, label: LocalizationEN.FALLOFF, key: ["SSR", "falloff"], min: 0},
				]
			},
			{
				label: LocalizationEN.SSGI,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{type: COMPONENT_PROP_TYPES.BOOLEAN, label: LocalizationEN.ENABLED, key: ["SSGI", "enabled"]},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STRENGTH,
						key: ["SSGI", "strength"],
						min: 0,
						increment: .01
					},
					{divider: true},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.FILTERING_SAMPLES,
						key: ["SSGI", "blurSamples"],
						min: 1,
						increment: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.FILTERING_INTENSITY,
						key: ["SSGI", "blurRadius"],
						min: 1,
						increment: 1
					},
					{divider: true},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STEPS,
						key: ["SSGI", "maxSteps"],
						min: 1,
						increment: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STEP_SIZE,
						key: ["SSGI", "stepSize"],
						min: .1
					},
				]
			},
			{
				label: LocalizationEN.SSS,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.STEPS,
						key: ["SSS", "maxSteps"],
						min: 1,
						increment: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.MAX_DISTANCE,
						key: ["SSS", "maxDistance"],
						min: .00001
					},

					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.DEPTH_THICKNESS,
						key: ["SSS", "depthThickness"],
						min: .00001
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.EDGE_FALLOFF,
						key: ["SSS", "edgeFalloff"],
						min: 0
					},
					{type: COMPONENT_PROP_TYPES.NUMBER, label: LocalizationEN.DEPTH_DELTA, key: ["SSS", "depthDelta"]},

				]
			},

			{
				label: LocalizationEN.DIRECTIONAL_SHADOWS,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.MAX_LIGHTS,
						key: "shadowAtlasQuantity",
						min: 1,
						increment: 1
					},
				]
			},

			{
				label: LocalizationEN.SSAO,
				type: COMPONENT_PROP_TYPES.GROUP,
				children: [
					{type: COMPONENT_PROP_TYPES.BOOLEAN, label: LocalizationEN.ENABLED, key: ["SSAO", "enabled"]},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.BLUR_SAMPLES,
						key: ["SSAO", "blurSamples"],
						min: 1
					},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.SAMPLES,
						key: ["SSAO", "maxSamples"],
						min: 1,
						max: 64
					},
					{type: COMPONENT_PROP_TYPES.NUMBER, label: LocalizationEN.RADIUS, key: ["SSAO", "radius"], min: 0},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.POWER,
						key: ["SSAO", "power"],
						min: 1,
						increment: 1
					},
					{type: COMPONENT_PROP_TYPES.NUMBER, label: LocalizationEN.BIAS, key: ["SSAO", "bias"]},
					{
						type: COMPONENT_PROP_TYPES.NUMBER,
						label: LocalizationEN.FALLOFF,
						key: ["SSAO", "falloffDistance"]
					},
				]
			},
		]
	},
]
