import AbstractComponent from "@engine-core/lib/components/AbstractComponent"
import MATERIAL_RENDERING_TYPES from "@engine-core/static/MATERIAL_RENDERING_TYPES"
import {Components,} from "@engine-core/engine.enum";

export default class DecalComponent extends AbstractComponent {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION, Components.CULLING];
    }

    static get componentKey(): Components {
        return Components.DECAL
    }

    getComponentKey(): Components {
        return DecalComponent.componentKey
    }

    albedoID?: string
    roughnessID?: string
    metallicID?: string
    normalID?: string
    occlusionID?: string

    useSSR = false
    renderingMode = MATERIAL_RENDERING_TYPES.ISOTROPIC

    anisotropicRotation = 0
    anisotropy = 0
    clearCoat = 0
    sheen = 0
    sheenTint = 0
}
