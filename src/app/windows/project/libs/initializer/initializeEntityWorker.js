import entityWorker from "../../../../web-workers/entity-worker";

export default function initializeEntityWorker() {
    const listeners = {}

    window.entityWorker = entityWorker()
    window.addEntityWorkerListener = (callback, id) => {
        listeners[id] = callback
    }
    window.entityWorker.onmessage = ({data: {actionID, payload}}) => {
        if (listeners[actionID])
            listeners[actionID](payload)
    }
}