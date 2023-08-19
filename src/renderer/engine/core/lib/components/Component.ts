import {Components,} from "@engine-core/engine.enum";


export default abstract class Component {
    abstract getDependencies(): Components[]

    _props: ComponentValueGeneric[] = []
    _name = ""

    #entity: EngineEntity
    get entity() {
        return this.#entity
    }

    constructor(entity: EngineEntity) {
        this.#entity = entity
    }

    abstract getComponentKey(): Components

    onUpdate() {}

    static propTypes = Object.freeze({
        NUMBER: "number",
        GROUP: "group",
        ARRAY: "array",
        STRING: "string",
        OPTIONS: "options",
        COLOR: "color",
        BOOLEAN: "bool",
        IMAGE: "image",
        MESH: "mesh",
        MATERIAL: "material",
        TERRAIN: "terrain",
        QUAT_EULER: "quatEuler"
    })

    static group(label, children, disabledIf?: Function | string): ComponentValueGeneric {
        return {
            type: Component.propTypes.GROUP,
            label,
            disabledIf,
            children: Array.isArray(children) ? children : []
        }
    }

    static number(label: string, key: string, max?: number, min?: number, increment?: number, isAngle?: boolean, realtime?: boolean, disabledIf?: Function | string): ComponentValueGeneric {
        return {
            label,
            max,
            min,
            increment: increment ? increment : .001,
            type: Component.propTypes.NUMBER,
            key,
            isAngle,
            realtime: !!realtime,
            disabledIf
        }
    }

    static array(labels: string[], key: string, increment, max?: number, min?: number, isAngle?: boolean, disabledIf?: Function | string): ComponentValueGeneric {
        return {labels, max, min, increment, type: Component.propTypes.ARRAY, key, disabledIf, isAngle}
    }

    static string(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.STRING, label, key, disabledIf}
    }

    static options(key: string, options?: {
        label: string,
        value: any
    }[], disabledIf?: Function | string): ComponentValueGeneric {
        return {
            type: Component.propTypes.OPTIONS,
            options,
            key,
            disabledIf
        }
    }

    static color(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.COLOR, label, key, disabledIf}
    }

    static boolean(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.BOOLEAN, label, key, disabledIf}
    }

    static imageTexture(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.IMAGE, label, key, disabledIf}
    }

    static materialInstance(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.MATERIAL, label, key, disabledIf}
    }

    static terrainInstance(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.TERRAIN, label, key, disabledIf}
    }

    static meshInstance(label: string, key: string, disabledIf?: Function | string): ComponentValueGeneric {
        return {type: Component.propTypes.MESH, label, key, disabledIf}
    }


    get props() {
        return this._props
    }


    get name(): string {
        return this._name
    }

    set name(data) {
        this._name = data
    }
}
