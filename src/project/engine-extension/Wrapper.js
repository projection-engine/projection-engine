import System from "../engine/basic/System"
import GridSystem from "./systems/GridSystem"
import IconsSystem from "./systems/IconsSystem"
import SYSTEMS from "../engine/templates/SYSTEMS"
import GizmoSystem from "./systems/GizmoSystem"
import SelectedSystem from "./systems/SelectedSystem"
import PreviewSystem from "./systems/PreviewSystem"
import BackgroundSystem from "./systems/BackgroundSystem"


export default class Wrapper extends System {
    constructor( resolution) {
        super()
        this.gridSystem = new GridSystem()
        this.billboardSystem = new IconsSystem()
        this.gizmoSystem = new GizmoSystem(resolution)
        this.selectedSystem = new SelectedSystem(resolution)
        this.previewSystem = new PreviewSystem()
        this.backgroundSystem = new BackgroundSystem()
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

        if(!after) {
            this.backgroundSystem.execute(data, options)
            window.gpu.disable(window.gpu.DEPTH_TEST)
            this.gridSystem.execute(options)
            window.gpu.enable(window.gpu.DEPTH_TEST)
        }
        else {
            window.gpu.enable(window.gpu.BLEND)
            window.gpu.blendFunc(window.gpu.SRC_ALPHA, window.gpu.ONE_MINUS_SRC_ALPHA)
            if (!canExecutePhysicsAnimation)
                this.billboardSystem.execute(data, options, entitiesMap)
            if (gizmo !== undefined && !canExecutePhysicsAnimation) {
                window.gpu.clear(window.gpu.DEPTH_BUFFER_BIT)
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