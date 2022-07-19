import {vec4} from "gl-matrix"
import MeshInstance from "../../engine/instances/MeshInstance"
import COMPONENTS from "../../engine/data/COMPONENTS"
import TRANSFORMATION_TYPE from "../../static/misc/TRANSFORMATION_TYPE"
import Gizmo from "./Gizmo"
import mapEntity from "./mapEntity"

export default class Scale extends Gizmo {
    target = []
    clickedAxis = -1
    tracking = false
    rotationTarget = [0, 0, 0, 1]

    gridSize = .01
    distanceX = 0
    distanceY = 0
    distanceZ = 0

    constructor( sys) {
        super( sys)
        this.xGizmo = mapEntity("x",  "SCALE")
        this.yGizmo = mapEntity("y",  "SCALE")
        this.zGizmo = mapEntity("z",  "SCALE")

        import("../data/ScaleGizmo.json")
            .then(res => {
                this.xyz = new MeshInstance({
                    vertices: res.vertices,
                    indices: res.indices
                })
            })
    }

    onMouseMove(event) {
        if (!this.started) {
            this.tooltip.start()
            this.started = true
        }
        const vector = [event.movementX, event.movementX, event.movementX]
        switch (this.clickedAxis) {
        case 1: // x
            this.distanceX += Math.abs(vector[0] * 0.01)
            if (Math.abs(this.distanceX) >= this.gridSize) {
                this.transformElement([Math.sign(vector[0]) * this.distanceX, 0, 0])
                this.distanceX = 0
            }
            break
        case 2: // y
            this.distanceY += Math.abs(vector[1] * 0.01)
            if (Math.abs(this.distanceY) >= this.gridSize) {
                this.transformElement([0, Math.sign(vector[1]) * this.distanceY, 0])
                this.distanceY = 0
            }
            break
        case 3: // z
            this.distanceZ += Math.abs(vector[2] * 0.01)
            if (Math.abs(this.distanceZ) >= this.gridSize) {
                this.transformElement([0, 0, Math.sign(vector[2]) * this.distanceZ])
                this.distanceZ = 0
            }
            break
        }
        if (this.targetEntities.length === 1)
            this.tooltip.render(this.targetEntities[0].components[COMPONENTS.TRANSFORM].scaling)
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
