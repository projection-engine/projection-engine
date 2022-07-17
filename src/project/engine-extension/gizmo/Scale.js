import {vec4} from "gl-matrix"
import Entity from "../../engine/basic/Entity"
import TransformComponent from "../../engine/components/TransformComponent"
import MeshInstance from "../../engine/instances/MeshInstance"
import Transformation from "../../engine/utils/Transformation"
import PickComponent from "../../engine/components/PickComponent"
import COMPONENTS from "../../engine/data/COMPONENTS"
import TRANSFORMATION_TYPE from "../../static/misc/TRANSFORMATION_TYPE"
import Gizmo from "./Gizmo"

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
        this.xGizmo = Scale.#mapEntity(2, "x")
        this.yGizmo = Scale.#mapEntity(3, "y")
        this.zGizmo = Scale.#mapEntity(4, "z")

        import("../data/ScaleGizmo.json")
            .then(res => {
                this.xyz = new MeshInstance({
                    vertices: res.vertices,
                    indices: res.indices
                })
            })
    }

    static #mapEntity(i, axis) {
        const e = new Entity(undefined)
        e.components[COMPONENTS.PICK] = new PickComponent(undefined, i - 3)
        e.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        let s = [.2, 0.2, 0.2], r
        switch (axis) {
        case "x":
            r = [0, 1.57, 0]
            break
        case "y":
            r = [-1.57, 1.57, 0]
            break
        case "z":
            r = [3.1415, -3.1415, 3.1415]
            break
        default:
            break
        }
        e.components[COMPONENTS.TRANSFORM].translation = [0, 0, 0]
        e.components[COMPONENTS.TRANSFORM].rotation = r
        e.components[COMPONENTS.TRANSFORM].scaling = s
        e.components[COMPONENTS.TRANSFORM].transformationMatrix = Transformation.transform([0, 0, 0], r, s)

        return e
    }

    onMouseMove(event) {
        if (!this.started) {
            this.tooltip.start()
            this.started = true
            if(this.onGizmoStart)
                this.onGizmoStart()
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
        if (this.target.length === 1)
            this.tooltip.render(this.target[0].components[COMPONENTS.TRANSFORM].scaling)
    }

    transformElement(vec) {
        let toApply
        if (this.typeRot === TRANSFORMATION_TYPE.RELATIVE || this.target.length > 1)
            toApply = vec
        else
            toApply = vec4.transformQuat([], vec, this.target[0].components[COMPONENTS.TRANSFORM].rotationQuat)
        for (let i = 0; i < this.target.length; i++) {
            const comp = this.target[i].components[COMPONENTS.TRANSFORM]
            comp.scaling = [
                comp.scaling[0] - toApply[0],
                comp.scaling[1] - toApply[1],
                comp.scaling[2] - toApply[2]
            ]
        }
    }
}
