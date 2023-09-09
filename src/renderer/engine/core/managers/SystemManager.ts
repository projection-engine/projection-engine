import AbstractSingleton from "../AbstractSingleton";
import DynamicMap from "../lib/DynamicMap";
import AbstractSystem from "../AbstractSystem";
import PhysicsSystem from "../system/PhysicsSystem";
import EngineState from "../states/EngineState";
import MetricsManager from "@engine-core/managers/MetricsManager";

export default class SystemManager extends AbstractSingleton {
    #executionQueue = new DynamicMap<UUID, AbstractSystem>()
    #systems = new Map<UUID, boolean>()
    #frameId: number = null

    static getInstance(): SystemManager {
        return SystemManager.get<SystemManager>()
    }

    enableSystem = (system: typeof AbstractSystem) => {
        const ref = system.get<AbstractSystem>()
        this.#systems.set(ref.getSystemId(), true)
        this.#executionQueue.set(ref.getSystemId(), ref)
    }

    disableSystem= (system: typeof AbstractSystem)=> {
        const ref = system.get<AbstractSystem>()
        this.#systems.set(ref.getSystemId(), false)
    }

    isRunning = () =>  {
        return this.#frameId != null
    }

    start = () =>  {
        PhysicsSystem.start()
        this.#frameId = requestAnimationFrame(SystemManager.#loop)
    }

    stop = () =>  {
        cancelAnimationFrame(this.#frameId)
        this.#frameId = undefined
        PhysicsSystem.stop()
    }

    static #loop(c) {
        const instance = SystemManager.getInstance()
        const systems = instance.#systems
        const queue = instance.#executionQueue.array
        const queueLength = queue.length
        EngineState.currentTimeStamp = c
        MetricsManager.init()
        for (let i = 0; i < queueLength; i++) {
            const system = queue[i];
            if (system.shouldExecute() && systems.has(system.getSystemId())) {
                system.execute()
                MetricsManager.currentState = system.constructor.name
            }
        }
        MetricsManager.end()

        instance.#frameId = requestAnimationFrame(SystemManager.#loop)
    }

}
