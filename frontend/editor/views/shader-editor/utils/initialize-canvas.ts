import SEContextController from "../libs/SEContextController";
import shaderActions from "../../../templates/shader-actions";
import HotKeysController from "../../../lib/utils/HotKeysController";
import Localization from "../../../templates/LOCALIZATION_EN";
import SelectionStore from "../../../stores/SelectionStore";
import BOARD_SIZE from "../static/BOARD_SIZE";
import handleWheelZoom from "./handle-wheel-zoom";
import ContextMenuController from "../../../../shared/libs/context-menu/ContextMenuController";


export default function initializeCanvas(openFile, ref, ctx, setGraphData) {
    function updateData() {
        setGraphData(
            ctx.getNodes(),
            ctx.getLinks()
        )
    }
    SEContextController.initializeCallback(openFile.registryID, updateData)
    updateData()

    const {contextMenu, hotkeys} = shaderActions(openFile)
    HotKeysController.unbindAction(ref)
    ContextMenuController.destroy(openFile.registryID)
    ContextMenuController.mount(
        {icon: "texture", label: Localization.SHADER_EDITOR},
        contextMenu,
        openFile.registryID,
        [],
        (trigger, element, event) => {
            const el = event.path || []
            for (let i = 0; i < el.length; i++) {
                const current = el[i]
                if (current === document.body)
                    break
                if (!current)
                    continue
                const id = current.getAttribute("data-id")
                const link = current.getAttribute("data-link")
                if (link) {
                    SelectionStore.shaderEditorSelected = [ctx.getLinks().find(l => l.identifier === id)]
                    break
                }
                if (id) {
                    SelectionStore.shaderEditorSelected = [ctx.getNodes().find(n => n.id === id)]
                    break
                }
            }

        }
    )
    HotKeysController.bindAction(
        ref,
        hotkeys,
        "texture",
        Localization.SHADER_EDITOR
    )
    ref.parentElement.scrollTop = BOARD_SIZE / 2
    ref.parentElement.scrollLeft = BOARD_SIZE / 2
    ref.parentElement.addEventListener("wheel", handleWheelZoom, {passive: false})
}