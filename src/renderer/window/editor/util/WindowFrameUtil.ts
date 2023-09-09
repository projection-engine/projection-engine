import SettingsStore from "../../shared/stores/SettingsStore"
import EditorLevelService from "../services/engine/EditorLevelService"
import EditorActionHistory from "../services/EditorActionHistory"
import ViewportActionUtil from "../services/ViewportActionUtil"
import ElectronResources from "../../shared/lib/ElectronResources"
import GPUState from "@engine-core/states/GPUState"
import WindowChangeStore from "../../shared/stores/WindowChangeStore"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"

export default class WindowFrameUtil {
    static #callMethod(id: string) {
        switch (id) {
            case "save":
                EditorLevelService.getInstance().save().catch(console.error)
                break
            case "undo":
                EditorActionHistory.undo()
                break
            case "redo":
                EditorActionHistory.redo()
                break
            case "copy":
                ViewportActionUtil.copy()
                break
            case "paste":
                ViewportActionUtil.paste()
                break
            case "footer":
                SettingsStore.updateStore({hideFooter: !SettingsStore.getData().hideFooter})
                break
            case "learn-more":
                ElectronResources.shell.openExternal("https://github.com/projection-engine").catch(console.error)
                break

            case "fullscreen":
                GPUState.canvas.requestFullscreen().catch(console.error)
                break
            case "reload":
                ElectronResources.ipcRenderer.send("reload")
        }
    }

    static getFrameOptions(disabledSave: boolean) {
        return [
            {divider: true, label: "File"},
            {
                label: "Save",
                icon: "save",
                disabled: disabledSave,
                onClick: () => WindowFrameUtil.#callMethod("save")
            },
            {divider: true, label: "Utils"},
            {
                label: "Toggle fullscreen",
                icon: "fullscreen",
                onClick: () => WindowFrameUtil.#callMethod("fullscreen")
            },
            {
                label: "Toggle footer",
                onClick: () => WindowFrameUtil.#callMethod("footer")
            },
            {divider: true, label: "Other"},
            {
                label: "Reload project",
                icon: "refresh",
                onClick: () => WindowChangeStore.updateStore({
                    message: LocalizationEN.UNSAVED_CHANGES, callback: () => {
                        EditorLevelService.getInstance().save().then(() => WindowFrameUtil.#callMethod("reload"))
                    }
                })
            },
            {
                label: LocalizationEN.CLOSE_PROJECT,
                onClick: WindowFrameUtil.closeProject
            },
        ]
    }

    static closeProject() {
        WindowChangeStore.updateStore({
            message: LocalizationEN.UNSAVED_CHANGES,
            callback: () => {
                EditorLevelService.getInstance().save().then(() => ElectronResources.ipcRenderer.send(IPCRoutes.CLOSE_EDITOR))
            }
        })
    }
}
