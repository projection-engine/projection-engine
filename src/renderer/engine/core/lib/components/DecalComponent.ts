import Component from "./Component"
import DECAL_PROPS from "../../static/component-props/DECAL_PROPS"
import Texture from "@engine-core/lib/resources/Texture"
import GPUState from "../../states/GPUState"
import EngineFileSystemManager from "../../managers/EngineFileSystemManager"
import GPUManager from "../../managers/GPUManager"
import MATERIAL_RENDERING_TYPES from "../../static/MATERIAL_RENDERING_TYPES"
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
            const asset = await EngineFileSystemManager.readAsset(id)
            if (!asset)
                return
            const textureData = <TextureParams>(typeof asset === "string" ? JSON.parse(asset) : asset)
            return await GPUManager.allocateTexture({
                ...textureData,
                img: textureData.base64
            }, id)
        } catch (err) {
            console.error(err)
        }
    }

    set albedoID(value: string) {
        if (value && !GPUState.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._albedoID = value
    }

    set roughnessID(value: string) {
        if (value && !GPUState.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._roughnessID = value
    }

    set metallicID(value: string) {
        if (value && !GPUState.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._metallicID = value
    }

    set normalID(value: string) {
        if (value && !GPUState.textures.has(value))
            DecalComponent.#fetchIfNotFound(value).catch()
        this._normalID = value
    }

    set occlusionID(value: string) {
        if (value && !GPUState.textures.has(value))
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
