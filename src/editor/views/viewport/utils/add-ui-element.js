import {COMPONENTS, Entity} from "../../../../../public/engine/production";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";

export default function addUiElement() {
    const e = new Entity(undefined, "UI-Node")
    e.addComponent(COMPONENTS.UI)
    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: e})
}