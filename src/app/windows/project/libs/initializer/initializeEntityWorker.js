export default function initializeEntityWorker() {
    const listeners = {}
    window.entityWorker = new Worker(new URL("./Entity.worker.js", import.meta.url))
    window.addEntityWorkerListener = (callback, id) => {
        listeners[id] = callback
    }
    window.entityWorker.onmessage = ({data: {actionID, payload}}) => {
        if (listeners[actionID])
            listeners[actionID](payload)
    }
}