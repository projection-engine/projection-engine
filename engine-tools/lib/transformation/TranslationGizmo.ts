import mapGizmoMesh from "../../utils/map-gizmo-mesh"
import GizmoSystem from "../../runtime/GizmoSystem";
import Inheritance from "../Inheritance";
import gizmoTranslateEntity from "../../utils/gizmo-translate-entity";
import EngineTools from "../../EngineTools";
import StaticEditorMeshes from "../StaticEditorMeshes";
import EntityManager from "../../../frontend/views/editor/lib/EntityManager";

export default class TranslationGizmo extends Inheritance {
    static gridSize = 1
    static hasCloned = false
    static cache: [number,number,number] = [0, 0, 0]

    constructor() {
        super()
        this.xyz = StaticEditorMeshes.translationGizmo
        this.xGizmo = mapGizmoMesh("x", "TRANSLATION")
        this.yGizmo = mapGizmoMesh("y", "TRANSLATION")
        this.zGizmo = mapGizmoMesh("z", "TRANSLATION")
    }

    onMouseDown(event:MouseEvent) {
        super.onMouseDown(event);
        TranslationGizmo.hasCloned = false
        TranslationGizmo.cache = [0, 0, 0]
    }

    onMouseMove(event:MouseEvent) {
        super.onMouseMove()
        if(!TranslationGizmo.hasCloned && event.shiftKey){
            const clones = EngineTools.selected.map(m => m.clone())
            EntityManager.appendBlock(clones)

            GizmoSystem.linkEntityToGizmo(clones[0])
        }
        TranslationGizmo.hasCloned = event.shiftKey
        gizmoTranslateEntity(event)
    }


}
