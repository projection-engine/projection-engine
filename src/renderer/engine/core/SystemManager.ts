import AbstractSingleton from "./AbstractSingleton";
import DynamicMap from "./resource-libs/DynamicMap";
import AbstractSystem from "./AbstractSystem";
import {UUID} from "crypto";

export default class SystemManager extends AbstractSingleton {
    #executionQueue = new DynamicMap<UUID, AbstractSystem>()

    static getInstance(): SystemManager {
        return super.get<SystemManager>()
    }

    static getExecutionQueue() {
        return SystemManager.getInstance().getExecutionQueue()
    }

    getExecutionQueue() {
        return this.#executionQueue
    }

    enableSystem(system: typeof AbstractSystem) {
        const ref = system.get<AbstractSystem>()
        this.#executionQueue.set(ref.getSystemId(), ref)
    }

    disableSystem(system: typeof AbstractSystem) {
        this.#executionQueue.delete(system.get<AbstractSystem>().getSystemId())
    }
}
