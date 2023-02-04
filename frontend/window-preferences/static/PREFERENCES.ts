import LOCALIZATION_EN from "../../shared/static/LOCALIZATION_EN";
import GridSystem from "../../../engine-tools/runtime/GridSystem";
import CameraTracker from "../../../engine-tools/lib/CameraTracker";
import Component from "../../../engine-core/instances/components/Component";

export default [
    {label: LOCALIZATION_EN.GLOBAL, type: "global", icon: "public"},
    {label: LOCALIZATION_EN.SHORTCUTS, type: "shortcuts", icon: "keyboard"},
    {
        label: LOCALIZATION_EN.VIEWPORT,
        icon: "desktop_windows",
        form: [
            {
                label: LOCALIZATION_EN.ICONS,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.SIZE,
                        key: "iconScale",
                        target: "settings",
                        min: .01,
                        updateOnChange: true
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.CULLING_DISTANCE,
                        key: "maxDistanceIcon",
                        target: "settings",
                        min: 1,
                        increment: 1,
                        updateOnChange: true
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.OVERLAY,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        target: "settings",
                        type: Component.propTypes.BOOLEAN,
                        label: LOCALIZATION_EN.GRID,
                        key: "showGrid"
                    },
                    {
                        target: "settings",
                        type: Component.propTypes.BOOLEAN,
                        label: LOCALIZATION_EN.ICONS,
                        key: "showIcons"
                    },
                    {
                        target: "settings",
                        type: Component.propTypes.BOOLEAN,
                        label: LOCALIZATION_EN.LINES,
                        key: "showLines"
                    },
                    {
                        target: "settings",
                        type: Component.propTypes.BOOLEAN,
                        label: LOCALIZATION_EN.OUTLINE,
                        key: "showOutline"
                    },
                    {divider: true},
                    {
                        type: Component.propTypes.COLOR,
                        label: LOCALIZATION_EN.OUTLINE,
                        key: "outlineColor",
                        target: "settings",
                        updateOnChange: true
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.OUTLINE_WIDTH,
                        key: "outlineWidth",
                        target: "settings",
                        min: .001,
                        updateOnChange: true
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.GRID,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.BRIGHTNESS,
                        key: "gridColor",
                        target: "settings",
                        min: 0,
                        max: 1,
                        onChange: v => GridSystem.buffer[0] = v
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.OPACITY,
                        key: "gridOpacity",
                        target: "settings",
                        min: 0,
                        max: 1,
                        onChange: v => GridSystem.buffer[3] = v
                    },
                    {divider: true},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.THRESHOLD,
                        key: "gridThreshold",
                        target: "settings",
                        increment: .01,
                        min: .001,
                        onChange: v => GridSystem.buffer[2] = v
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.SCALE,
                        key: "gridScale",
                        target: "settings",
                        increment: .0001,
                        min: .0001,
                        onChange: v => GridSystem.buffer[1] = v
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.CAMERA_GIZMO,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.SIZE,
                        key: "cameraGizmoSize",
                        target: "settings",
                        increment: 1,
                        min: 10
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.GIZMOS,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.SENSITIVITY,
                        key: ["gizmoGrid", "sensitivity"],
                        target: "settings",
                        min: 1
                    }
                ]
            },
        ]
    },
    {
        label: LOCALIZATION_EN.RENDERING,
        icon: "visibility",
        form: [
            {
                label: LOCALIZATION_EN.RESOLUTION,
                type: Component.propTypes.GROUP,
                children: [
                    {type: Component.propTypes.NUMBER, label: "X", key: "resolutionX", min: 1, increment: 1},
                    {type: Component.propTypes.NUMBER, label: "Y", key: "resolutionY", min: 1, increment: 1}
                ]
            },
            {
                label: LOCALIZATION_EN.ANTI_ALIASING,
                type: Component.propTypes.GROUP,
                children: [
                    {type: Component.propTypes.BOOLEAN, label: LOCALIZATION_EN.FXAA, key: "FXAA"},
                    {type: Component.propTypes.BOOLEAN, label: LOCALIZATION_EN.TAA, key: "TAA", disabled: true},
                ]
            },
            {
                label: LOCALIZATION_EN.PHYSICS,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.PHYSICS_SIMULATION_STEP,
                        key: "physicsSimulationStep",
                        min: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.PHYSICS_SUB_STEPS,
                        key: "physicsSubSteps",
                        increment: 1,
                        min: 1
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.SSR,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STEPS,
                        key: ["SSR", "maxSteps"],
                        min: 1,
                        increment: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STEP_SIZE,
                        key: ["SSR", "stepSize"],
                        min: .1
                    },
                    {type: Component.propTypes.NUMBER, label: LOCALIZATION_EN.FALLOFF, key: ["SSR", "falloff"], min: 0},
                ]
            },
            {
                label: LOCALIZATION_EN.SSGI,
                type: Component.propTypes.GROUP,
                children: [
                    {type: Component.propTypes.BOOLEAN, label: LOCALIZATION_EN.ENABLED, key: ["SSGI", "enabled"]},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STRENGTH,
                        key: ["SSGI", "strength"],
                        min: 0,
                        increment: .01
                    },
                    {divider: true},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.FILTERING_SAMPLES,
                        key: ["SSGI", "blurSamples"],
                        min: 1,
                        increment: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.FILTERING_INTENSITY,
                        key: ["SSGI", "blurRadius"],
                        min: 1,
                        increment: 1
                    },
                    {divider: true},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STEPS,
                        key: ["SSGI", "maxSteps"],
                        min: 1,
                        increment: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STEP_SIZE,
                        key: ["SSGI", "stepSize"],
                        min: .1
                    },
                ]
            },
            {
                label: LOCALIZATION_EN.SSS,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.STEPS,
                        key: ["SSS", "maxSteps"],
                        min: 1,
                        increment: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.MAX_DISTANCE,
                        key: ["SSS", "maxDistance"],
                        min: .00001
                    },

                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.DEPTH_THICKNESS,
                        key: ["SSS", "depthThickness"],
                        min: .00001
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.EDGE_FALLOFF,
                        key: ["SSS", "edgeFalloff"],
                        min: 0
                    },
                    {type: Component.propTypes.NUMBER, label: LOCALIZATION_EN.DEPTH_DELTA, key: ["SSS", "depthDelta"]},

                ]
            },

            {
                label: LOCALIZATION_EN.DIRECTIONAL_SHADOWS,
                type: Component.propTypes.GROUP,
                children: [
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.MAX_LIGHTS,
                        key: "shadowAtlasQuantity",
                        min: 1,
                        increment: 1
                    },
                ]
            },

            {
                label: LOCALIZATION_EN.SSAO,
                type: Component.propTypes.GROUP,
                children: [
                    {type: Component.propTypes.BOOLEAN, label: LOCALIZATION_EN.ENABLED, key: ["SSAO", "enabled"]},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.BLUR_SAMPLES,
                        key: ["SSAO", "blurSamples"],
                        min: 1
                    },
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.SAMPLES,
                        key: ["SSAO", "maxSamples"],
                        min: 1,
                        max: 64
                    },
                    {type: Component.propTypes.NUMBER, label: LOCALIZATION_EN.RADIUS, key: ["SSAO", "radius"], min: 0},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.POWER,
                        key: ["SSAO", "power"],
                        min: 1,
                        increment: 1
                    },
                    {type: Component.propTypes.NUMBER, label: LOCALIZATION_EN.BIAS, key: ["SSAO", "bias"]},
                    {
                        type: Component.propTypes.NUMBER,
                        label: LOCALIZATION_EN.FALLOFF,
                        key: ["SSAO", "falloffDistance"]
                    },
                ]
            },
        ]
    },
]
