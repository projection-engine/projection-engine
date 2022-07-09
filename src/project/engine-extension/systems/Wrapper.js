import System from "../../engine/basic/System"
import GridSystem from "./GridSystem"
import IconsSystem from "./IconsSystem"
import GizmoSystem from "./GizmoSystem"
import SelectedSystem from "./SelectedSystem"
import PreviewSystem from "./PreviewSystem"
import BackgroundSystem from "./BackgroundSystem"

let gpu
export default class Wrapper extends System {
    constructor( resolution) {
        super()
        gpu = window.gpu
        this.gridSystem = new GridSystem()
        this.billboardSystem = new IconsSystem()
        this.gizmoSystem = new GizmoSystem(resolution)
        this.selectedSystem = new SelectedSystem(resolution)
        this.previewSystem = new PreviewSystem()
        this.backgroundSystem = new BackgroundSystem()
    }

    execute(options, data, entities, entitiesMap, after) {
        const {
            meshes,
            meshesMap
        } = data
        const {
            selected,
            camera,
            rotationType,
            onGizmoStart,
            onGizmoEnd,
            gizmo,
            canExecutePhysicsAnimation,
            gridSize,
            gridRotationSize,
            gridScaleSize,
            setSelected
        } = options

        if(!after) {
            this.backgroundSystem.execute(data, options)
            this.gridSystem.execute(options)
        }
        else {
            gpu.enable(gpu.BLEND)
            gpu.blendFunc(gpu.SRC_ALPHA, gpu.ONE_MINUS_SRC_ALPHA)
            if (!canExecutePhysicsAnimation)
                this.billboardSystem.execute(data, options, entitiesMap)
            if (gizmo !== undefined && !canExecutePhysicsAnimation) {
                gpu.clear(gpu.DEPTH_BUFFER_BIT)
                this.gizmoSystem.execute(
                    meshes,
                    meshesMap,
                    selected,
                    camera,

                    entitiesMap,
                    gizmo,
                    rotationType,
                    onGizmoStart,
                    onGizmoEnd,
                    gridSize,
                    gridRotationSize,
                    gridScaleSize,
                    setSelected
                )
                this.selectedSystem.execute(selected, meshesMap, camera, entitiesMap)
            }
        }

    }
}