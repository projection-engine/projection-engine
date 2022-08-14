import Node from "./Node"
import DATA_TYPES from "../../../../libs/engine/data/DATA_TYPES"
import IMAGE_WORKER_ACTIONS from "../../../../libs/engine/data/IMAGE_WORKER_ACTIONS"
import NODE_TYPES from "../../data/NODE_TYPES"
import FilesAPI from "../../../../../../libs/files/FilesAPI"
import RegistryAPI from "../../../../../../libs/files/RegistryAPI";


export const TEXTURE_TYPES = {
    RGB: "RGB",
    RGBA: "RGBA",
    SRGB8_ALPHA8: "SRGB8_ALPHA8"
}
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

    format = {
        format: TEXTURE_TYPES.RGB,
        internalFormat: TEXTURE_TYPES.RGB,

        label: "RGB"
    }

    get ft() {
        return this.format.label
    }

    set ft(data) {
        switch (data) {
        case "RGB":
            this.format = {
                format: TEXTURE_TYPES.RGB,
                internalFormat: TEXTURE_TYPES.RGB,
                label: data
            }
            break
        case "RGBA":
            this.format = {
                label: data,
                format: TEXTURE_TYPES.RGBA,
                internalFormat: TEXTURE_TYPES.RGBA
            }
            break
        case "SRGBA":
            this.format = {
                label: data,
                format: TEXTURE_TYPES.RGBA,
                internalFormat: TEXTURE_TYPES.SRGB8_ALPHA8
            }
            break
        default:
            break
        }
    }

    constructor() {
        super(
            [
                {label: "UV", key: "uv", accept: [DATA_TYPES.VEC2]},
                {
                    label: "Flip Y axis",
                    key: "yFlip",
                    type: DATA_TYPES.CHECKBOX
                },
                {
                    label: "Format",
                    key: "ft",
                    type: DATA_TYPES.OPTIONS,
                    options: [
                        {label: "RGB", data: "RGB"},
                        {label: "RGBA", data: "RGBA"},
                        {label: "sRGBA", data: "SRGBA"}
                    ]
                },

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
                    const file = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + res.path, true)
                    uniforms.push({
                        label: this.name,
                        key: this.uniformName,
                        value: this.texture.registryID,
                        type: DATA_TYPES.TEXTURE,
                        format: {...this.format, yFlip: this.yFlip}
                    })
                    uniformData.push({

                        key: this.uniformName,
                        data: file,
                        type: DATA_TYPES.TEXTURE,
                        format: this.format,
                        yFlip: this.yFlip
                    })
                } else
                    uniformData.push({
                        key: this.uniformName,
                        data: await window.imageWorker(
                            IMAGE_WORKER_ACTIONS.COLOR_TO_IMAGE,
                            {
                                color: "rgba(128, 128, 128, 1)",
                                resolution: 16
                            }),
                        type: DATA_TYPES.TEXTURE,
                        format: this.format
                    })
            } catch (error) {
                alert.pushAlert("Error compiling texture", "error")
            }
        } else
            uniformData.push({
                key: this.uniformName,
                data: await window.imageWorker(
                    IMAGE_WORKER_ACTIONS.COLOR_TO_IMAGE,
                    {
                        color: "rgba(128, 128, 128, 1)",
                        resolution: 16
                    }),
                type: DATA_TYPES.TEXTURE,
                format: this.format
            })
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