import ShaderNode from "../../ShaderNode"
import DATA_TYPES from "../../../../../../../engine/core/static/DATA_TYPES"
import NODE_TYPES from "../../../libs/material-compiler/templates/NODE_TYPES"
import DraggableNodeUtils from "../../../libs/DraggableNodeUtils"
import Signature from "../../Signature"


export default class DotProduct extends ShaderNode implements Signature{
	static signature = "DotProduct"
	getSignature():string{
		return DotProduct.signature
	}

	constructor() {
		super([
			{label: "A", key: "a", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]},
			{label: "B", key: "b", accept: [DATA_TYPES.VEC2,DATA_TYPES.VEC3,DATA_TYPES.VEC4]},
		], [
			{label: "Result", key: "DOT_PRODUCT", type: DATA_TYPES.FLOAT}
		])

		this.name = "DotProduct"
        
	}

	get type() {
		return NODE_TYPES.FUNCTION
	}

	getFunctionCall({a, b}, index) {
		this.DOT_PRODUCT = "DOT_PRODUCT" + index
		const minType = DraggableNodeUtils.getMinimalType(a, b)
		if (b && a)
			return `float ${this.DOT_PRODUCT} = dot(${minType}(${a.name}), ${minType}(${b.name}));`
		return `float ${this.DOT_PRODUCT} = 0.;`
	}

}