import GridSystem from "./GridSystem"
import IconsSystem from "./IconsSystem"
import GizmoSystem from "./GizmoSystem"
import SelectedSystem from "./SelectedSystem"
import PreviewSystem from "./PreviewSystem"
import BackgroundSystem from "./BackgroundSystem"
import Renderer from "../../engine/Renderer";

export default class Wrapper {
    constructor( resolution) {
        this.gridSystem = new GridSystem()
        this.billboardSystem = new IconsSystem()
        this.gizmoSystem = new GizmoSystem()
        this.selectedSystem = new SelectedSystem(resolution)
        this.previewSystem = new PreviewSystem()
        this.backgroundSystem = new BackgroundSystem()
    }

    execute(isDuringFrameComposition, isDuringBinging) {
        const meshes = Renderer.data.meshes
        const {
            selected,
            camera,
            transformationType,
            gizmo,
            canExecutePhysicsAnimation
        } = Renderer.params

        if(!isDuringFrameComposition && !isDuringBinging)
            this.selectedSystem.drawToBuffer(selected, camera)
        else if(!isDuringFrameComposition) {
            this.backgroundSystem.execute()
            this.gridSystem.execute()
        }
        else if(isDuringFrameComposition){

            gpu.enable(gpu.BLEND)
            gpu.blendFunc(gpu.SRC_ALPHA, gpu.ONE_MINUS_SRC_ALPHA)

            if (!canExecutePhysicsAnimation)
                this.billboardSystem.execute( )
            if (gizmo !== undefined && !canExecutePhysicsAnimation) {
                this.selectedSystem.drawSilhouette(selected)
                this.gizmoSystem.execute(
                    meshes,
                    selected,
                    camera,

                    gizmo,
                    transformationType
                )

            }
        }
    }
}