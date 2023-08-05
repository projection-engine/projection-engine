import Component from "../../components/Component"
import {ColliderTypes,} from "@engine-core/engine.enum";

export default [
	Component.group("COLLISION_TYPE", [
		Component.options(
			"collisionType",
			[
				{
					label: ColliderTypes.BOX,
					value: ColliderTypes.BOX
				},
				{
					label: ColliderTypes.SPHERE,
					value: ColliderTypes.SPHERE,
				},
				{
					label: ColliderTypes.CAPSULE,
					value: ColliderTypes.CAPSULE,
				}
			]
		),
	]),


	Component.group("CENTER", [
		Component.array(["X", "Y", "Z"], "center", .001, undefined, undefined)
	]),
	Component.group("SIZE", [
		Component.array(["X", "Y", "Z"], "size", .001, undefined, 0, false, (comp) => comp.collisionType !== ColliderTypes.BOX)
	]),
	Component.group("SIZE", [
		Component.number("RADIUS", "radius", undefined, .0001, .001, undefined, true, (comp) => comp.collisionType === ColliderTypes.BOX),
		Component.number("HEIGHT", "height", undefined, .0001, .001, undefined, true, (comp) => comp.collisionType !== ColliderTypes.CAPSULE),
	]),


	Component.group("DIRECTION", [
		Component.options(
			"direction",
			[
				{
					label: "X",
					value: "X"
				},
				{
					label: "Y",
					value: "Y"
				},
				{
					label: "Z",
					value: "Z"
				}
			],
			(comp) => comp.collisionType !== ColliderTypes.CAPSULE
		)
	])
]
