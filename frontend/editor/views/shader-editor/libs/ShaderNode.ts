import {v4} from "uuid"

const types = {
    vec2: 0,
    vec3: 1,
    vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]
export default class ShaderNode {
    canBeDeleted = true
    dynamicInputs = false
    size = 0

    constructor(inputs, output = [], dynamicInputs) {
        this.x = 10
        this.y = 10
        this.id = v4()
        this.uniformName = "DYNAMIC_" + this.id.replaceAll("-", "_")
        this.output = output
        this.inputs = inputs ? inputs : []

        this.dynamicInputs = dynamicInputs
    }

    static getMinimalType(...typesToCompare) {
        const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
        return typesInverted[min]
    }


}