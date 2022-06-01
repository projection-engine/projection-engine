import System from "../../engine/basic/System"
import RENDER_TARGET from "../../components/viewport/hooks/RENDER_TARGET"

export default class CameraCubeSystem extends System {
    constructor() {
        super([])
        this.renderTarget = document.getElementById( RENDER_TARGET+"-camera")
    }

    execute(options) {
        super.execute()
        const {camera} = options

        if(this.renderTarget) {
            const t = camera.getNotTranslatedViewMatrix()
            this.renderTarget.style.transform = `translateZ(calc(var(--cubeSize) * -3)) matrix3d(${t})`
        }
    }
}