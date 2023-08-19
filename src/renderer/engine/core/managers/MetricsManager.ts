import METRICS_FLAGS, {REVERSED_METRICS_FLAGS} from "../static/METRICS_FLAGS"

let started = false
export default class MetricsManager {
	static #elapsed = new Float32Array(Object.keys(METRICS_FLAGS).length)
	static #totalElapsed = 0
	static #start = 0
	static #previousStart = 0

	static set currentState(data: number) {
		if (!started)
			return

		const now = performance.now()
		MetricsManager.#elapsed[data]+= now-MetricsManager.#previousStart
		MetricsManager.#previousStart = now
	}
	static init(){
		if (!started)
			return
		MetricsManager.#start = performance.now()
		MetricsManager.#previousStart = performance.now()
	}
	static end(){
		if (!started)
			return

		MetricsManager.#totalElapsed += performance.now() - MetricsManager.#start
		MetricsManager.#previousStart = 0
	}
	static start() {
		started = true
		MetricsManager.#totalElapsed= 0
		Object.keys(METRICS_FLAGS).forEach((_, i) => MetricsManager.#elapsed[i] = 0)
	}

	static getRecord() {
		started = false
		const data = MetricsManager.#elapsed
		const totalElapsed = MetricsManager.#totalElapsed
		const response = []

		for (let i = 0; i < data.length; i++) {
			const percentage = data[i] / totalElapsed
			response[i] = {
				flag: REVERSED_METRICS_FLAGS[i.toString()],
				percentage: percentage  * 100,
				elapsed: (totalElapsed * percentage).toFixed(1)
			}
		}

		return response
	}

}
