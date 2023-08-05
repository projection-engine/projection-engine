import ShaderNode from "../../ShaderNode"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import DraggableNodeUtils from "../../../libs/DraggableNodeUtils"
import Signature from "../../Signature"
import {MaterialDataTypes,} from "@engine-core/engine.enum";

export default class LinearInterpolate extends ShaderNode implements Signature{
	static signature = "LinearInterpolate"
	getSignature():string{
		return LinearInterpolate.signature
	}
	c = 0.
	constructor() {
		super([
			{label: "A", key: "a", accept: [MaterialDataTypes.VEC2,MaterialDataTypes.VEC3,MaterialDataTypes.VEC4]},
			{label: "B", key: "b", accept: [MaterialDataTypes.VEC2,MaterialDataTypes.VEC3,MaterialDataTypes.VEC4]},
			{label: "Percentage", key: "c", accept: [MaterialDataTypes.FLOAT], type: MaterialDataTypes.FLOAT},
		], [
			{
				label: "Result",
				key: "LINEAR_INTERPOLATION",
				type: MaterialDataTypes.UNDEFINED
			}
		])
		this.name = "LinearInterpolate"

	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a,b, c={name: this.c}}, index) {
		this.LINEAR_INTERPOLATION = "LINEAR_INTERPOLATION" + index
		const minType = DraggableNodeUtils.getMinimalType(a, b)
		if(b && a && c)
			return `${minType} ${this.LINEAR_INTERPOLATION} = mix(${minType}(${a.name}), ${minType}(${b.name}), ${c.name});`
		return `${minType} ${this.LINEAR_INTERPOLATION} = ${minType}(0.);`
	}
}
