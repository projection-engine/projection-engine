import {COMPONENTS, Entity} from "../../../../../public/engine/production";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../stores/templates/dispatch-renderer-entities";
import UI_TEMPLATE from "../../content-browser/templates/UI_TEMPLATE";

export default function addUiElement() {
    const e = new Entity(undefined, "UI-Node")
    e.addComponent(COMPONENTS.UI)
    e.components.get(COMPONENTS.UI).uiLayoutData = UI_TEMPLATE
    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: e})
}