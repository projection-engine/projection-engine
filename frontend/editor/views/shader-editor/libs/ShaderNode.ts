import {v4} from "uuid"
import MutableObject from "../../../../../engine-core/MutableObject";
import DATA_TYPES from "../../../../../engine-core/static/DATA_TYPES";

const types = {
    vec2: 0,
    vec3: 1,
    vec4: 2
}
const typesInverted = ["vec2", "vec3", "vec4"]

export interface Output {
    [key: string]: any

    label: string
    key: string
    type: string
}

export interface Input {
    [key: string]: any

    label: string
    key: string
    accept?: string[]
    type?: string
    disabled?: boolean
}


export default class ShaderNode {
    [key: string]: any

    canBeDeleted = true
    dynamicInputs = false
    size = 0
    x: number
    y: number
    id: string
    uniformName: string
    output: MutableObject[]
    inputs: MutableObject[]

    constructor(inputs: Input[], output?: Output[], dynamicInputs?: boolean) {
        this.x = 10
        this.y = 10
        this.id = v4()
        this.uniformName = "DYNAMIC_" + this.id.replaceAll("-", "_")
        this.output = output
        this.inputs = inputs ? inputs : []

        this.dynamicInputs = dynamicInputs
    }

    static getMinimalType(...typesToCompare): string | undefined {
        const min = Math.min(...typesToCompare.map(t => types[t]).filter(t => t !== undefined))
        return typesInverted[min]
    }
}