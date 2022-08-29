import Transformation from "../../../libs/engine/production/services/Transformation";
import EditorRenderer from "../../../libs/engine/editor/EditorRenderer";

export default function updateCursor(coords) {
    const t = EditorRenderer.cursor
    t.translation = coords
    t.transformationMatrix = Transformation.transform(t.translation, [0, 0, 0, 1], t.scaling)
}