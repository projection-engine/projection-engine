import ROUTES from "../../../../../backend/static/ROUTES";
import WindowChangeStore from "../../../../shared/components/frame/WindowChangeStore";
import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
import ElectronResources from "../../../../shared/lib/ElectronResources"
import LevelController from "../../../lib/utils/LevelController";
import EditorActionHistory from "../../../lib/utils/EditorActionHistory";
import ViewportActions from "../../../lib/utils/ViewportActions";
import SettingsStore from "../../../../shared/stores/SettingsStore";
import GPU from "../../../../../engine-core/GPU";
import ResourceManager from "../../../../../engine-core/runtime/ResourceManager";

function callMethod(id: string) {
    switch (id) {
        case "save":
            LevelController.save().catch()
            break
        case "undo":
            EditorActionHistory.undo()
            break
        case "redo":
            EditorActionHistory.redo()
            break
        case "copy":
            ViewportActions.copy()
            break
        case "paste":
            ViewportActions.paste()
            break
        case "footer":
            SettingsStore.updateStore({...SettingsStore.data, hideFooter: !SettingsStore.data.hideFooter})
            break
        case "learn-more":
            ElectronResources.shell.openExternal("https://github.com/projection-engine").catch()
            break

        case "fullscreen":
            GPU.canvas.requestFullscreen().catch()
            break
        case "reload":
            ElectronResources.ipcRenderer.send("reload")
    }
}

export default function getFrameOptions(disabledSave: boolean) {
    return [
        {divider: true, label: "File"},
        {
            label: 'Save',
            icon: "save",
            disabled: disabledSave,
            onClick: () => callMethod("save")
        },
        {
            label: "Clear unused resources",
            onClick: ResourceManager.execute
        },
        {divider: true, label: "Utils"},
        {
            label: "Toggle fullscreen",
            icon: "fullscreen",
            onClick: () => callMethod("fullscreen")
        },
        {
            label: "Toggle footer",
            onClick: () => callMethod("footer")
        },
        {divider: true, label: "Other"},
        {
            label: 'Reload project',
            icon: "refresh",
            onClick: () => WindowChangeStore.updateStore({
                message: LOCALIZATION_EN.UNSAVED_CHANGES, callback: () => {
                    LevelController.save().then(() => callMethod("reload"))
                }
            })
        },
        {
            label: "Close project",
            onClick: () => WindowChangeStore.updateStore({
                message: LOCALIZATION_EN.UNSAVED_CHANGES,
                callback: () => {
                    LevelController.save().then(() => ElectronResources.ipcRenderer.send(ROUTES.CLOSE_EDITOR))
                }
            })
        },
    ]
}