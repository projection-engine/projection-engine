import {UUID} from "crypto";

export default class DynamicMap<K, T> extends Map {
    #array: T[] = []
    #locked = false
    #lockingKey: UUID

    get map(): Map<K, T> {
        return <Map<K, T>><unknown>this
    }

    get array(): T[] {
        return this.#array
    }

    get(k: K): T {
        return super.get(k)
    }

    set(key: K, value: T): this {
        if (this.#locked) return
        if (this.has(key))
            return
        super.set(key, value)
        this.#array.push(value)
        return this
    }

    clear() {
        if (this.#locked) return
        super.clear()
        this.#array.length = 0
    }

    delete(key: K): boolean {
        if (this.#locked) return
        const found = this.get(key)
        if (!found)
            return false
        this.#array.splice(this.#array.indexOf(found), 1)
        return super.delete(key)
    }

    removeBlock(resources: T[], getIDCallback: GenericNonVoidFunctionWithP<T, K>) {
        if (this.#locked) return
        const toRemoveMap = new Map<K, boolean>()
        for (let i = 0; i < resources.length; i++) {
            toRemoveMap.set(getIDCallback(resources[i]), true)
        }

        for (let i = 0; i < this.#array.length; i++) {
            const ID = getIDCallback(this.#array[i])
            if (toRemoveMap.get(ID)) {
                super.delete(ID)
                this.#array[i] = undefined
            }
        }
        this.#array = this.#array.filter(e => e !== undefined)
    }

    addBlock(resources: T[], getIDCallback: GenericNonVoidFunctionWithP<T, K>) {
        if (this.#locked) return
        this.#array.push(...resources)
        for (let i = 0; i < resources.length; i++) {
            const current = resources[i]
            super.set(getIDCallback(current), current)
        }
    }

    lock(key: UUID) {
        if (this.#locked || this.#lockingKey)
            return
        this.#lockingKey = key
        this.#locked = true
    }

    unlock(key: UUID) {
        if (this.#lockingKey === key)
            this.#locked = false
    }
}
