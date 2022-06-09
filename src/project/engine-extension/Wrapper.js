import System from "../engine/basic/System"
import GridSystem from "./systems/GridSystem"
import IconsSystem from "./systems/IconsSystem"
import SYSTEMS from "../engine/templates/SYSTEMS"
import GizmoSystem from "./systems/GizmoSystem"
import SelectedSystem from "./systems/SelectedSystem"
import PreviewSystem from "./systems/PreviewSystem"


export default class Wrapper extends System {
    constructor(gpu, resolution) {
        super()
        this.gpu = gpu
        this.gridSystem = new GridSystem(gpu)
        this.billboardSystem = new IconsSystem(gpu)
        this.gizmoSystem = new GizmoSystem(gpu, resolution)
        this.selectedSystem = new SelectedSystem(gpu, resolution)
        this.previewSystem = new PreviewSystem(gpu)
    }

    execute(options, systems, data, entities, entitiesMap, after) {
        super.execute()
        const {
            meshes,
            meshSources
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

        if(!after)
            this.gridSystem.execute(options)
        else {
            this.gpu.enable(this.gpu.BLEND)
            this.gpu.blendFunc(this.gpu.SRC_ALPHA, this.gpu.ONE_MINUS_SRC_ALPHA)
            if (!canExecutePhysicsAnimation) {
                this.billboardSystem.execute(data, options)
            }
            if (gizmo !== undefined && !canExecutePhysicsAnimation) {
                this.gpu.clear(this.gpu.DEPTH_BUFFER_BIT)
                this.gizmoSystem.execute(
                    meshes,
                    meshSources,
                    selected,
                    camera,
                    systems[SYSTEMS.PICK],
                    entitiesMap,
                    gizmo,
                    rotationType,
                    onGizmoStart,
                    onGizmoEnd,
                    gridSize,
                    gridRotationSize,
                    gridScaleSize,
                    systems[SYSTEMS.DEPTH_PRE_PASS],
                    setSelected
                )
                this.selectedSystem.execute(selected, meshSources, camera, entitiesMap)
            }
        }

    }
}