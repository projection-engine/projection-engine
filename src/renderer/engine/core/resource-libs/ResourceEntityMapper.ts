import DynamicMap from "./DynamicMap"
import type EditorEntity from "../../tools/EditorEntity"
import AbstractSingleton from "../AbstractSingleton";
import EntityManager from "../EntityManager";
import Component from "../components/Component";
import {Components,} from "@engine-core/engine.enum";

export default class ResourceEntityMapper extends AbstractSingleton {
    #byComponent = new Map<Components, DynamicMap<EngineEntity, Component[]>>()
    private Components: ;

    hasComponent(entity: EngineEntity, component: Components): boolean {

    }

    withComponent<T extends Component>(component: Components): DynamicMap<EngineEntity, Component[]>[] {

    }

    constructor() {
        super();
        const manager = EntityManager.getInstance()
        manager.addEventListener("hard-change", (event: EntityListenerEvent<EditorEntity, Components>) => {
            switch (event.type) {
                case "delete": {

                    break
                }
                case "create": {

                    break
                }
                case "component-add":

                    break
                case "component-remove":

                    break
            }
        })
        Object.values(this.Components).forEach(c => this.#byComponent.set(c, new DynamicMap<string, EditorEntity>()))
    }
}
