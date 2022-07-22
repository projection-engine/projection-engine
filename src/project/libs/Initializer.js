import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import * as DOM from "react-dom/client"
import SHORTCUTS_ID from "../static/misc/SHORTCUTS_ID"
import React from "react"
import {Icon} from "@f-ui/core"
import LABELED_KEYS from "../static/misc/LABELED_KEYS"
import compiler from "../components/blueprints/libs/compiler"
import BOARD_SIZE from "../components/blueprints/data/BOARD_SIZE"
import ENVIRONMENT from "../engine/data/ENVIRONMENT"
import initializeConsole from "./initializer/initializeConsole"
import initializeShortcuts from "./initializer/initializeShortcuts"
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

    // CONTEXT MENU
    window.contextMenu = {targets: {}, focused: undefined}

    // ENTITY WORKER
    initializeEntityWorker()

    // SHORTCUTS
    initializeShortcuts()
    // CONSOLE
    initializeConsole()
}