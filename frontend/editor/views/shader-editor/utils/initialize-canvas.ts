import SEContextController from "../libs/SEContextController";
import shaderActions from "../../../templates/shader-actions";
import HotKeysController from "../../../lib/utils/HotKeysController";
import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
import ContextMenuController from "../../../../lib/context-menu/ContextMenuController";


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
        contextMenu,
        openFile.registryID,
        []
    )
    HotKeysController.bindAction(
        ref,
        hotkeys,
        "texture",
        LOCALIZATION_EN.SHADER_EDITOR
    )
    // ref.parentElement.scrollTop = BOARD_SIZE / 2
    // ref.parentElement.scrollLeft = BOARD_SIZE / 2
}