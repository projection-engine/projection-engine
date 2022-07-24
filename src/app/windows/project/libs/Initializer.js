import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import initializeConsole from "./initializer/initializeConsole"
import initializeEntityWorker from "./initializer/initializeEntityWorker"
import initializeBlueprints from "./initializer/initializeBlueprints"


export default function Initializer(fileSystem, pushEvent) {
    // ALERT / FS
    alert.pushEvent = pushEvent
    window.fileSystem = fileSystem

    // MATH
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat

    // BLUEPRINTS
    initializeBlueprints()

    // ContextMap MENU
    window.contextMenu = {targets: {}, focused: undefined}

    // ENTITY WORKER
    initializeEntityWorker()

    // CONSOLE
    initializeConsole()
}