import DynamicMap from "./DynamicMap"
import AbstractSingleton from "../AbstractSingleton";
import EntityManager from "../EntityManager";
import Component from "../components/Component";
import {Components,} from "@engine-core/engine.enum";

export default class ResourceEntityMapper extends AbstractSingleton {
    #byComponent = new Map<Components, DynamicMap<EngineEntity, EngineEntity>>()

    static withComponent<T extends Component>(component: Components): DynamicMap<EngineEntity, EngineEntity> {
        const instance = ResourceEntityMapper.get<ResourceEntityMapper>()
        return instance.#byComponent.get(component)
    }

    constructor() {
        super();
        EntityManager.addEventListener("hard-change", (event: EntityListenerEvent<EngineEntity, Components>) => {
            const targets = event.all
            switch (event.type) {
                case "delete": {
                    this.#byComponent.forEach(component => {
                        component.removeBlock(targets, id => id)
                    })
                    break
                }
                case "create": {
                    for (let targetI = 0; targetI < targets.length; targetI++){
                        const entity = targets[targetI];
                        const allComponents = EntityManager.getAllComponents(entity)
                        for (let i = 0; i < allComponents.length; i++){
                            const component = allComponents[i];
                            this.#byComponent.get(component.getComponentKey()).set(entity, entity)
                        }
                    }
                    break
                }
                case "component-add": {
                    const targetComponents = event.targetComponents
                    for (let i = 0; i < targetComponents.length; i++){
                        const component = targetComponents[i];
                        this.#byComponent.get(component).set(event.target, event.target)
                    }
                    break
                }
                case "component-remove":
                    const targetComponents = event.targetComponents
                    for (let i = 0; i < targetComponents.length; i++){
                        const component = targetComponents[i];
                        this.#byComponent.get(component).delete(event.target)
                    }
                    break
            }
        })
        Object.values(Components).forEach(c => this.#byComponent.set(c as Components, new DynamicMap<EngineEntity, EngineEntity>()))
    }
}
