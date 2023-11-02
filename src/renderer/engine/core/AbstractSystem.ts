import AbstractSingleton from "./AbstractSingleton";
import UUIDGen from "../../../shared/UUIDGen";

export default abstract class AbstractSystem extends AbstractSingleton {
    readonly #id: UUID

    protected constructor() {
        super();
        this.#id = UUIDGen()
    }

    abstract execute()

    shouldExecute = () => {
        return true
    }

    getSystemId = () => {
        return this.#id
    }
}
