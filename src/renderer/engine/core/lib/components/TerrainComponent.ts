import AbstractComponent from "./AbstractComponent"
import MaterialManager from "../../managers/MaterialManager"
import GPUState from "../../states/GPUState"
import {Components,} from "@engine-core/engine.enum";

export default class TerrainComponent extends AbstractComponent {
    getDependencies(): Components[] {
        return [Components.TRANSFORMATION];
    }

    static get componentKey(): Components {
        return Components.TERRAIN
    }

    getComponentKey(): Components {
        return TerrainComponent.componentKey
    }

    castsShadows = true
    terrainID?: string
}
