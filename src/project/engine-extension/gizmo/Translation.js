import {vec4} from "gl-matrix"
import MeshInstance from "../../engine/instances/MeshInstance"
import COMPONENTS from "../../engine/data/COMPONENTS"
import TRANSFORMATION_TYPE from "../../static/misc/TRANSFORMATION_TYPE"
import Gizmo from "./Gizmo"
import mapEntity from "./mapEntity"

export default class Translation extends Gizmo {
    target = []
    clickedAxis = -1
    tracking = false
    currentCoord = undefined
    gridSize = .01
    distanceX = 0
    distanceY = 0
    distanceZ = 0

    constructor(sys) {
        super(sys)
        this.xGizmo = mapEntity("x", "TRANSLATION")
        this.yGizmo = mapEntity("y", "TRANSLATION")
        this.zGizmo = mapEntity("z", "TRANSLATION")
        import("../data/TranslationGizmo.json")
            .then(res => {
                this.xyz = new MeshInstance({
                    vertices: res.vertices,
                    indices: res.indices,
                    normals: res.normals,
                    uvs: [],
                    tangents: []
                })
            })

        this.updateTransformationRealtime = true
    }


    onMouseMove(event) {
        const s = Math.abs(event.movementX * this.gridSize)
        const sign = Math.sign(event.movementX)
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

        if (this.targetEntities.length === 1) {
            let t = this.targetEntities[0].components[COMPONENTS.TRANSFORM]?.translation
            this.tooltip.render(t)
        }
    }

    transformElement(vec) {
        let toApply
        if (this.transformationType === TRANSFORMATION_TYPE.GLOBAL || !this.targetEntities[0].components[COMPONENTS.TRANSFORM] || this.targetEntities.length > 1)
            toApply = vec
        else
            toApply = vec4.transformQuat([], vec, this.targetEntities[0].components[COMPONENTS.TRANSFORM].rotationQuat)

        for (let i = 0; i < this.targetEntities.length; i++) {
            const target = this.targetEntities[i]
            target.components[COMPONENTS.TRANSFORM].translation = [
                target.components[COMPONENTS.TRANSFORM].translation[0] - toApply[0],
                target.components[COMPONENTS.TRANSFORM].translation[1] - toApply[1],
                target.components[COMPONENTS.TRANSFORM].translation[2] - toApply[2]
            ]
        }
    }

}
