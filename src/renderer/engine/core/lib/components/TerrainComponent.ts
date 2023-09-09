import AbstractComponent from "@engine-core/lib/components/AbstractComponent"
import {Components,} from "@engine-core/engine.enum";

export default class TerrainComponent extends AbstractComponent {
    heightScale: number = 1;
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
