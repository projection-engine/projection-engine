import {ColliderTypes,} from "@engine-core/engine.enum";
import {array, group, number, options} from "./prop-types";
import PhysicsColliderComponent from "@engine-core/lib/components/PhysicsColliderComponent";

export default [
	group("COLLISION_TYPE", [
		options(
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


	group("CENTER", [
		array(["X", "Y", "Z"], "center", .001, undefined, undefined)
	]),
	group("SIZE", [
		array(["X", "Y", "Z"], "size", .001, undefined, 0, false, (comp) => (<PhysicsColliderComponent>comp).collisionType !== ColliderTypes.BOX)
	]),
	group("SIZE", [
		number("RADIUS", "radius", undefined, .0001, .001, undefined, true, (comp) => (<PhysicsColliderComponent>comp).collisionType === ColliderTypes.BOX),
		number("HEIGHT", "height", undefined, .0001, .001, undefined, true, (comp) => (<PhysicsColliderComponent>comp).collisionType !== ColliderTypes.CAPSULE),
	]),


	group("DIRECTION", [
		options(
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
			(comp) => (<PhysicsColliderComponent>comp).collisionType !== ColliderTypes.CAPSULE
		)
	])
]
