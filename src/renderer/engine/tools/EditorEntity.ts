import EntityAPI from "../core/lib/utils/EntityAPI"
import TransformationWorkerAPI from "../core/lib/utils/TransformationWorkerAPI"
import QueryAPI from "../core/lib/utils/QueryAPI"
import DynamicMap from "../core/resource-libs/DynamicMap"
import * as crypto from "crypto";
import EntityManager from "@engine-core/EntityManager";
import Component from "@engine-core/components/Component";
import {mat4, vec3} from "gl-matrix";


export default class EditorEntity {
    id = crypto.randomUUID()
    _colorIdentifier = [255, 255, 255]
    name = ""
    scripts = []
    parentID?: string
	__cacheCenterMatrix: mat4
	__pivotChanged: boolean
	__cacheIconMatrix: mat4
	__pivotOffset: vec3

    constructor(id?: EngineEntity) {
    	this.id = id ?? this.id
    }

	get colorIdentifier() {
		return this._colorIdentifier
	}

	set colorIdentifier(data) {
		if (data && Array.isArray(data))
			this._colorIdentifier = data
	}

	get active(){
		return EntityManager.isEntityEnabled(this.id)
	}

	get allComponents(): Component[]{
		return EntityManager.getAllComponents(this.id)
	}

	get children(): EngineEntity[]{
		return EntityManager.getChildren(this.id)
	}

	get parent(): EngineEntity{
		return EntityManager.getParent(this.id)
	}
}
