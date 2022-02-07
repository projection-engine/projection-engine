export class WebWorker {
    _worker

    _build(m) {
        this._worker = new Worker(URL.createObjectURL(new Blob([`(${m})()`])));
    }

    async createExecution(data, execute) {
        const response = await new Promise((resolve) => {
            this._build(execute)

            function handler(e) {
                resolve(e.data)
            }

            this._worker.addEventListener('message', handler);
            this._worker.postMessage(data);
        })

        this._worker.terminate()

        return response
    }
}
