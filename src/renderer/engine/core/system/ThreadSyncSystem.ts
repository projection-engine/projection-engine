import AbstractSystem from "../AbstractSystem";
import TransformationManager from "../managers/TransformationManager";
import CameraManager from "../managers/CameraManager";

export default class ThreadSyncSystem extends AbstractSystem{
     execute = () => {
        TransformationManager.hasChangeBuffer[0] = 0
        CameraManager.syncThreads()
        TransformationManager.syncThreads()
    }
}
