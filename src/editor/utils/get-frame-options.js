import EngineStore from "../stores/EngineStore";
import ROUTES from "../../static/ROUTES";
import importFile from "../libs/import-file";
import FilesStore from "../stores/FilesStore";
import SettingsStore from "../stores/SettingsStore";
import ActionHistoryAPI from "../libs/ActionHistoryAPI";

const {ipcRenderer} = window.require("electron")

export default function getFrameOptions(settings) {

    return [
        {label: "File",
        options: [
            {
                label: "Save",
                onClick: () => EngineStore.save().catch(),
                shortcut: "Ctrl - S"
            },
            {divider: true},
            {
                label: "Import asset",
                onClick: () => importFile(FilesStore.ASSETS_PATH)
            }
        ]},
        {
            label: "Edit",
            options: [
                {
                    label: "Undo",
                    onClick: () => ActionHistoryAPI.undo(),

                    shortcut: "Ctrl - Z"
                },
                {
                    label: "Redo",
                    onClick: () => ActionHistoryAPI.redo(),

                    shortcut: "Ctrl - Y"
                },
                {divider: true},
                {
                    label: "Preferences",
                    icon: "settings",
                    onClick: () => {
                        const settingsClone = structuredClone(settings)
                        ipcRenderer.send(
                            ROUTES.OPEN_SETTINGS + sessionStorage.getItem("electronWindowID"),
                            settingsClone
                        )
                    },
                },
            ]
        },
        {
            label: "Window",
            options: [
                {
                    label: "Metrics",
                    icon: !settings.visible.metrics ? undefined : "check",
                    onClick: () => {
                        settings.visible = {
                            ...settings.visible,
                            metrics: !settings.visible.metrics
                        }
                        SettingsStore.updateStore(settings)
                    },
                }
            ]
        }
    ]
}