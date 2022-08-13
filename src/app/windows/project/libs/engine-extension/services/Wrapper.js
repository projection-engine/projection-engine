import GridSystem from "./GridSystem"
import IconsSystem from "./IconsSystem"
import GizmoSystem from "./GizmoSystem"
import SelectedSystem from "./SelectedSystem"
import PreviewSystem from "./PreviewSystem"
import BackgroundSystem from "./BackgroundSystem"

export default class Wrapper {
    constructor( resolution) {
        this.gridSystem = new GridSystem()
        this.billboardSystem = new IconsSystem()
        this.gizmoSystem = new GizmoSystem()
        this.selectedSystem = new SelectedSystem(resolution)
        this.previewSystem = new PreviewSystem()
        this.backgroundSystem = new BackgroundSystem()
    }

    execute(options, data, isDuringFrameComposition, isDuringBinging) {
        const {
            meshes,
            meshesMap
        } = data
        const {
            selected,
            camera,
            transformationType,
            gizmo,
            canExecutePhysicsAnimation
        } = options

        if(!isDuringFrameComposition && !isDuringBinging)
            this.selectedSystem.drawToBuffer(selected, meshesMap, camera)
        else if(!isDuringFrameComposition) {
            this.backgroundSystem.execute(data, options)
            this.gridSystem.execute(options)
        }
        else if(isDuringFrameComposition){

            gpu.enable(gpu.BLEND)
            gpu.blendFunc(gpu.SRC_ALPHA, gpu.ONE_MINUS_SRC_ALPHA)

            if (!canExecutePhysicsAnimation)
                this.billboardSystem.execute(data, options)
            if (gizmo !== undefined && !canExecutePhysicsAnimation) {
                this.selectedSystem.drawSilhouette(selected)
                this.gizmoSystem.execute(
                    meshes,
                    meshesMap,
                    selected,
                    camera,

                    gizmo,
                    transformationType
                )

            }
        }
    }
}