let started = false
export default class MetricsManager {
    static #elapsed: { [key: string]: number } = {}
    static #totalElapsed = 0
    static #start = 0
    static #previousStart = 0

    static set currentState(data: string) {
        if (!started)
            return

        const now = performance.now()
        if (!Object.hasOwn(MetricsManager.#elapsed, data)) {
            MetricsManager.#elapsed[data] = now - MetricsManager.#previousStart
        } else {
            MetricsManager.#elapsed[data] = now - MetricsManager.#previousStart
        }
        MetricsManager.#previousStart = now
    }

    static init() {
        if (!started)
            return
        MetricsManager.#start = performance.now()
        MetricsManager.#previousStart = performance.now()
    }

    static end() {
        if (!started)
            return

        MetricsManager.#totalElapsed += performance.now() - MetricsManager.#start
        MetricsManager.#previousStart = 0
    }

    static start() {
        started = true
        MetricsManager.#totalElapsed = 0
        MetricsManager.#elapsed = {}
    }

    static getRecord(): { flag: string, percentage: number, elapsed: string }[] {
        started = false
        const data = Object.entries(MetricsManager.#elapsed)
        const totalElapsed = MetricsManager.#totalElapsed
        const response = []
        for (let i = 0; i < data.length; i++) {
            const percentage = data[i][1] / totalElapsed
            response[i] = {
                flag: data[i][0],
                percentage: percentage * 100,
                elapsed: (totalElapsed * percentage).toFixed(1)
            }
        }

        return response
    }

}
