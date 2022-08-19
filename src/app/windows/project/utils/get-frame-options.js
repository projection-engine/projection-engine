import RendererStoreController from "../stores/RendererStoreController";
import ROUTES from "../../../../assets/ROUTES";
import importFile from "../libs/import-file";
import CBStoreController from "../stores/CBStoreController";

const {ipcRenderer} = window.require("electron")

export default function getFrameOptions(engine, settings) {

    return [
        {label: "File",
        options: [
            {
                label: "Save",
                onClick: () => RendererStoreController.save().catch(),
                shortcut: "Ctrl - S"
            },
            {divider: true},
            {
                label: "Import asset",
                onClick: () => importFile(CBStoreController.ASSETS_PATH)
            }
        ]},
        {
            label: "Edit",
            options: [
                {
                    label: "Undo",
                    onClick: () => RendererStoreController.undo(),

                    shortcut: "Ctrl - Z"
                },
                {
                    label: "Redo",
                    onClick: () => RendererStoreController.redo(),

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
                    label: "Viewport Sidebar",
                    icon: !settings.visible.sideBarViewport ? undefined : "check",
                    onClick: () => {

                        settings.visible = {
                            ...settings.visible,
                            sideBarViewport: !settings.visible.sideBarViewport
                        }
                        RendererStoreController.updateSettings(settings)
                    },
                },
                {
                    label: "Metrics",
                    icon: !settings.visible.metrics ? undefined : "check",
                    onClick: () => {
                        settings.visible = {
                            ...settings.visible,
                            metrics: !settings.visible.metrics
                        }
                        RendererStoreController.updateSettings(settings)
                    },
                }
            ]
        }
    ]
}