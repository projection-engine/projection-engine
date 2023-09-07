import AbstractSingleton from "./AbstractSingleton";
import {UUID} from "crypto";

export default abstract class AbstractSystem extends AbstractSingleton {
    readonly #id: UUID

    protected constructor() {
        super();
        this.#id = crypto.randomUUID()
    }

    abstract execute()

    shouldExecute = () => {
        return true
    }

    getSystemId = () => {
        return this.#id
    }
}
