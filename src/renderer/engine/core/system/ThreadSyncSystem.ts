import AbstractSystem from "../AbstractSystem";
import TransformationWorkerAPI from "../lib/utils/TransformationWorkerAPI";
import CameraAPI from "../lib/utils/CameraAPI";

export default class ThreadSyncSystem extends AbstractSystem{
    execute() {
        TransformationWorkerAPI.hasChangeBuffer[0] = 0
        CameraAPI.syncThreads()
        TransformationWorkerAPI.syncThreads()
    }
}
