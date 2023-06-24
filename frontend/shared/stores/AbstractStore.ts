import DynamicMap from "../../../engine-core/resource-libs/DynamicMap"

export default class AbstractStore {
	static data
	static _listeners = new DynamicMap<string, Function>()

	static updateStore(...args){
		const listeners = this._listeners.array
		for (let i = 0; i < listeners.length; i++){
			listeners[i]()
		}
	}

	static addListener(id: string, callback: Function) {
		if(this._listeners.has(id))
			return
		this._listeners.set(id, callback)
		callback()
	}

	static removeListener(id: string) {
		this._listeners.delete(id)
	}

	static updateStoreByKeys(keys:string[], values:any[]){
		for (let i = 0; i < keys.length; i++){
			const key = keys[i]
			this.data[key] = values[i]
		}
		this.updateStore()
	}
}