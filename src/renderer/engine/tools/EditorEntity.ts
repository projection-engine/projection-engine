import EntityAPI from "../core/lib/utils/EntityAPI"
import TransformationWorkerAPI from "../core/lib/utils/TransformationWorkerAPI"
import QueryAPI from "../core/lib/utils/QueryAPI"
import DynamicMap from "../core/resource-libs/DynamicMap"
import * as crypto from "crypto";


export default class EditorEntity {
    [key: string]: any;

    #id = crypto.randomUUID()
    #colorIdentifier = [255, 255, 255]
    name = ""
    active = true
    scripts = []
    #parent?: EditorEntity
    parentID?: string
    #pickID = new Float32Array(3)
    #pickIndex = -1
    #children = new DynamicMap<string, EditorEntity>()


    constructor(id?: EngineEntity) {
    	this.#id = id ?? this.#id
    }

	get colorIdentifier() {
		return this.#colorIdentifier
	}

	set colorIdentifier(data) {
		if (data && Array.isArray(data))
			this.#colorIdentifier = data
	}

	get id() {
		return this.#id
	}

	setPickID(data: number[]) {
    	data.forEach((v, i) => this.#pickID[i] = v)
    	this.#pickIndex = (data[0] + data[1] + data[2]) * 255
    }

    get pickID(): Float32Array {
    	return this.#pickID
    }

    get pickIndex() {
    	return this.#pickIndex
    }

    removeParent() {
    	if (!this.#parent)
    		return
    	const prev = this.#parent
    	this.#parent = undefined
    	prev.removeChild(this)
    }

    addChild(entity: EditorEntity) {
    	if (!entity || entity === this || entity.parent !== this || this.#children.has(entity.id)) {
    		return
    	}
    	this.#children.set(entity.id, entity)
    }

    removeChild(entity: EditorEntity) {
    	if (!entity || entity.parent || !this.#children.has(entity.id))
    		return
    	this.#children.delete(entity.id)
    }

    addParent(parent: EditorEntity) {
    	if (!parent || parent === this || parent === this.#parent || QueryAPI.isChildOf(this, parent.id) || QueryAPI.isChildOf(parent, this.id)) {
    		return
    	}
    	if (this.#parent)
    		this.removeParent()
    	this.#parent = parent
    	parent.addChild(this)
    	if (EntityAPI.isRegistered(this)) {
    		TransformationWorkerAPI.updateEntityReference(this)
    		this.changed = true
    	}
    }

    get parent() {
    	return this.#parent
    }

    get children() {
    	return this.#children
    }
}
