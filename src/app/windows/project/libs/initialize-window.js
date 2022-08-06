import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import initializeConsole from "./initializer/initializeConsole"
import initializeEntityWorker from "./initializer/initializeEntityWorker"
import initializeBlueprints from "./initializer/initializeBlueprints"
import FileSystem from "./FileSystem";


export default function InitializeWindow( ) {
    window.fileSystem =  new FileSystem(sessionStorage.getItem("electronWindowID"))
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat
    initializeBlueprints()
    window.contextMenu = {targets: {}, focused: undefined}
    initializeEntityWorker()
    initializeConsole()

    window.shortcuts = {all: [], active: {}, window: undefined}
    window.shortcuts.updateShortcuts = () => null
}