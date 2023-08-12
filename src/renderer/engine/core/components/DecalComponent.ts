import Component from "./Component"
import DECAL_PROPS from "../static/component-props/DECAL_PROPS"
import Texture from "../instances/Texture"
import GPU from "../GPU"
import FileSystemAPI from "../lib/utils/FileSystemAPI"
import GPUAPI from "../lib/rendering/GPUAPI"
import MATERIAL_RENDERING_TYPES from "../static/MATERIAL_RENDERING_TYPES"
import {Components,} from "@engine-core/engine.enum";

export default class DecalComponent extends Component {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION];
    }

    static get componentKey(): Components {
        return Components.DECAL
    }

    getComponentKey(): Components {
        return DecalComponent.componentKey
    }

    _albedoID?: string
    _roughnessID?: string
    _metallicID?: string
    _normalID?: string
    _occlusionID?: string

    useSSR = false
    renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC

    anisotropicRotation = 0
    anisotropy = 0
    clearCoat = 0
    sheen = 0
    sheenTint = 0

    static async #fetchIfNotFound(id: string): Promise<Texture | undefined> {
        try {
            const asset = await FileSystemAPI.readAsset(id)
            if (!asset)
                return
            const textureData = <TextureParams>(typeof asset === "string" ? JSON.parse(asset) : asset)
            return await GPUAPI.allocateTexture({
                ...textureData,
                img: textureData.base64
            }, id)
        } catch (err) {
            console.error(err)
        }
    }

    set albedoID(value: string) {
        if (value && !GPU.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._albedoID = value
    }

    set roughnessID(value: string) {
        if (value && !GPU.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._roughnessID = value
    }

    set metallicID(value: string) {
        if (value && !GPU.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._metallicID = value
    }

    set normalID(value: string) {
        if (value && !GPU.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._normalID = value
    }

    set occlusionID(value: string) {
        if (value && !GPU.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._occlusionID = value
    }

    get albedoID(): string {
        return this._albedoID
    }

    get roughnessID(): string {
        return this._roughnessID
    }

    get metallicID(): string {
        return this._metallicID
    }

    get normalID(): string {
        return this._normalID
    }

    get occlusionID(): string {
        return this._occlusionID
    }

    _props = DECAL_PROPS
}
