import {vec4} from "gl-matrix"
import MeshInstance from "../../engine/instances/MeshInstance"
import COMPONENTS from "../../engine/data/COMPONENTS"
import TRANSFORMATION_TYPE from "../../../static/misc/TRANSFORMATION_TYPE"
import Gizmo from "./Gizmo"
import mapEntity from "./mapEntity"

import mesh from "../data/SCALE_GIZMO.json"

const MOVEMENT_SCALE = .001

export default class Scale extends Gizmo {
    target = []
    clickedAxis = -1
    tracking = false
    rotationTarget = [0, 0, 0, 1]

    gridSize = .01
    distanceX = 0
    distanceY = 0
    distanceZ = 0
    key = "scaling"

    constructor(sys) {
        super(sys)
        this.xGizmo = mapEntity("x", "SCALE")
        this.yGizmo = mapEntity("y", "SCALE")
        this.zGizmo = mapEntity("z", "SCALE")

        this.xyz = new MeshInstance({
            vertices: mesh.vertices,
            indices: mesh.indices
        })
    }

    onMouseMove(event) {
        super.onMouseMove()
        const s = Math.abs(this.gridSize > 1 ? event.movementX * MOVEMENT_SCALE * this.gridSize : event.movementX * MOVEMENT_SCALE)
        const sign = Math.sign(event.movementX)
        this.notify(s, sign)

        switch (this.clickedAxis) {
            case 1: // x
                this.distanceX += s
                if (Math.abs(this.distanceX) >= this.gridSize) {
                    this.transformElement([sign * this.distanceX, 0, 0])
                    this.distanceX = 0
                }
                break
            case 2: // y
                this.distanceY += s
                if (Math.abs(this.distanceY) >= this.gridSize) {
                    this.transformElement([0, sign * this.distanceY, 0])
                    this.distanceY = 0
                }
                break
            case 3: // z
                this.distanceZ += s
                if (Math.abs(this.distanceZ) >= this.gridSize) {
                    this.transformElement([0, 0, sign * this.distanceZ])
                    this.distanceZ = 0
                }
                break
        }
    }

    transformElement(vec) {
        let toApply
        if (this.transformationType === TRANSFORMATION_TYPE.RELATIVE || this.targetEntities.length > 1)
            toApply = vec
        else
            toApply = vec4.transformQuat([], vec, this.targetEntities[0].components[COMPONENTS.TRANSFORM].rotationQuat)
        for (let i = 0; i < this.targetEntities.length; i++) {
            const comp = this.targetEntities[i].components[COMPONENTS.TRANSFORM]
            comp.scaling = [
                comp.scaling[0] - toApply[0],
                comp.scaling[1] - toApply[1],
                comp.scaling[2] - toApply[2]
            ]
        }
    }
}
