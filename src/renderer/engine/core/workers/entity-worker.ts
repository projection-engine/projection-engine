import TransformationPass from "./TransformationPass"
import {WorkerMessages,} from "@engine-core/engine.enum";

self.onmessage = (event) => {
    if (event.data) {
        const {type, payload} = event.data
        switch (type) {
            case WorkerMessages.INITIALIZE:
                TransformationPass.initialize(payload)
                break
            case WorkerMessages.REGISTER_ENTITY:
                if (TransformationPass.targets.has(payload.id))
                    TransformationPass.targets.delete(payload.id)
                TransformationPass.targets.set(payload.id, payload)
                TransformationPass.updateThreadInfo()
                break
            case WorkerMessages.REMOVE_ENTITY:
                TransformationPass.targets.delete(payload)
                TransformationPass.updateThreadInfo()
                break
            case WorkerMessages.REMOVE_ENTITY_BLOCK:
                TransformationPass.targets.removeBlock(payload, data => data.id)
                TransformationPass.updateThreadInfo()
                break

            case WorkerMessages.ADD_BLOCK:
                TransformationPass.targets.addBlock(payload, data => data.id)
                TransformationPass.updateThreadInfo()
                break
            case WorkerMessages.HIERARCHY_CHANGE:
                TransformationPass.childParent = payload.childParent
                TransformationPass.parentChildren = payload.parentChildren
                break
        }
    } else
        TransformationPass.execute()
}
