import DynamicMap from "../../../engine-core/resource-libs/DynamicMap"

export default class AbstractStore { 
	static _listeners = new DynamicMap<string, Function>()

	static updateStore(...args){
		const listeners = this._listeners.array
		console.log(listeners)
		for (let i = 0; i < listeners.length; i++){
			listeners[i]()
		}
	}

	static addListener(id: string, callback: Function) {
		this._listeners.set(id, callback)
		callback()
	}

	static removeListener(id: string) {
		this._listeners.delete(id)
	}
}