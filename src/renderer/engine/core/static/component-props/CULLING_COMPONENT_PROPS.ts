import Component from "@engine-core/lib/components/Component"

export default [
	Component.group("DISTANCE_CULLING", [
		Component.boolean("ENABLED", "hasDistanceCullingEnabled"),
		Component.number("MAX_DISTANCE", "cullingDistance", undefined, 0, 1, undefined, undefined, comp => !comp.distanceCulling),
	]),

	Component.group("SCREEN_DOOR", [
		Component.boolean("ENABLED", "screenDoorEffect")
	]),


	Component.group("OCCLUSION_CULLING",[
		Component.boolean("ENABLED", "occlusionCulling")
	])
]
