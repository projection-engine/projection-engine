import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import Signature from "../../Signature"
import {MaterialDataTypes,} from "@engine-core/engine.enum";

export default class MakeVector extends ShaderNode implements Signature{
	static signature = "MakeVector"
	getSignature():string{
		return MakeVector.signature
	}
	constructor() {
		super([
			{label: "X", key: "x", accept: [MaterialDataTypes.FLOAT], color: "red"},
			{label: "Y", key: "y", accept: [MaterialDataTypes.FLOAT], color: "green"},
			{label: "Z", key: "z", accept: [MaterialDataTypes.FLOAT], color: "blue"},
			{label: "W", key: "w", accept: [MaterialDataTypes.FLOAT], color: "white"}
		], [
			{label: "Vec2", key: "vec2MakerRes", type: MaterialDataTypes.VEC2, color: "red"},
			{label: "Vec3", key: "vec3MakerRes", type: MaterialDataTypes.VEC3, color: "green"},
			{label: "Vec4", key: "vec4MakerRes", type: MaterialDataTypes.VEC4, color: "blue"}
		])
		this.name = "MakeVector"
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({x, y, z, w}, index, outputs) {

		return outputs.map(o => {
			if(!this[o]) {
				this[o] = o + `${index}`
				switch (o) {
				case "vec2MakerRes":
					return `vec2 ${this[o]} = vec2(${x ? x.name : "0."},${y ? y.name : "0."});`
				case "vec3MakerRes":
					return `vec3 ${this[o]} = vec3(${x ? x.name : "0."},${y ? y.name : "0."}, ${z ? z.name : "0."});`
				case "vec4MakerRes":
					return `vec4 ${this[o]} = vec4(${x ? x.name : "0."}, ${y ? y.name : "0."}, ${z ? z.name : "0."}, ${w ? w.name : "0."});`
				default:
					return ""
				}
			}
			return ""
		}).join("\n")
	}
}
