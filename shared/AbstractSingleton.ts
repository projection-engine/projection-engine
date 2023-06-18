export default class AbstractSingleton {
	static singletonInstance

	constructor(...args) {
	}

	onDestroy() {
	}

	/**
     * @param args
     *
     * If no instance exists in memory then a new one is created, but if one exists, the existing one will be returned
     */
	static get<T>(...args): T {
		if (!this.singletonInstance) {
			this.singletonInstance = new this(...args)
		}
		return this.singletonInstance
	}

	/**
     * Destroys existing instance, but executes "onDestroy" method before so
     */
	static destroy() {
		if (this.singletonInstance == null)
			return
		this.singletonInstance.onDestroy()
		this.singletonInstance = undefined
	}
}