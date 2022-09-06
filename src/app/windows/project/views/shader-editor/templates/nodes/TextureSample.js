import Node from "./Node"
import DATA_TYPES from "../../../../libs/engine/production/data/DATA_TYPES"
import IMAGE_WORKER_ACTIONS from "../../../../libs/engine/production/data/IMAGE_WORKER_ACTIONS"
import NODE_TYPES from "../../data/NODE_TYPES"
import FilesAPI from "../../../../../../libs/files/FilesAPI"
import RegistryAPI from "../../../../../../libs/files/RegistryAPI";
import GPU from "../../../../libs/engine/production/controllers/GPU";
import FilesStore from "../../../../stores/FilesStore";


export default class TextureSample extends Node {
    uniform = true
    _texture = {}
    yFlip = false


    get texture() {
        return this._texture
    }

    set texture(data) {
        this._texture = data
        this.output = this.output.map(o => {
            o.disabled = false
            return o
        })
    }


    constructor() {
        super(
            [
                {label: "UV", key: "uv", accept: [DATA_TYPES.VEC2]},
                {label: "Sampler", key: "texture", type: DATA_TYPES.TEXTURE}
            ],
            [
                {label: "Sampler", key: "sampler", type: DATA_TYPES.TEXTURE, disabled: true},
                {label: "RGB", key: "rgb", type: DATA_TYPES.VEC3, disabled: true},
                {label: "R", key: "r", type: DATA_TYPES.FLOAT, color: "red", disabled: true},
                {label: "G", key: "g", type: DATA_TYPES.FLOAT, color: "green", disabled: true},
                {label: "B", key: "b", type: DATA_TYPES.FLOAT, color: "blue", disabled: true},
                {label: "Alpha", key: "a", type: DATA_TYPES.FLOAT, color: "white", disabled: true}
            ]
        )
        this.inputs.find(i => i.key === "texture").onChange = (v) => {
            if (!v || Object.keys(v).length === 0)
                this.output = this.output.map(o => {
                    o.disabled = true
                    return o
                })
            else
                this.output = this.output.map(o => {
                    o.disabled = false
                    return o
                })
        }
        this.name = "TextureSample"
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }


    async getInputInstance(index, uniforms, uniformData) {
        this.uniformName = `sampler${index}`
        if (this.texture?.registryID) {
            try {
                const res = await RegistryAPI.readRegistryFile(this.texture?.registryID)
                if (res) {
                    uniforms.push({
                        label: this.name,
                        key: this.uniformName,
                        value: this.texture.registryID,
                        type: DATA_TYPES.TEXTURE,
                        format: {...this.format, yFlip: this.yFlip}
                    })
                    uniformData.push({
                        key: this.uniformName,
                        data: this.texture.registryID,
                        type: DATA_TYPES.TEXTURE,
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
        return `uniform sampler2D sampler${index};`
    }

    getFunctionCall({uv}, index, outputs) {
        const samplerName = this.name + "_" + index + "_S"
        let response = [
            `vec4 ${samplerName} = texture(${this.uniformName}, ${uv !== undefined ? uv.name : "texCoord"});`
        ]
        outputs.forEach(o => {
            if (o !== "sampler") {
                if (!this[o]) {
                    this[o] = o + `${index}`
                    const outputKey = this.output.find(oo => oo.key === o)
                    response.push(`${outputKey.type} ${this[o]} = ${samplerName}.${o};`)
                }
            } else
                this[o] = o + `${index}`
        })

        return response.join("\n")
    }
}