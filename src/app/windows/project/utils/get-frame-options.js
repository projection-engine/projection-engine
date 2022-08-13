import DataStoreController from "../stores/DataStoreController";
import loadScripts from "./load-scripts";
import ROUTES from "../../../../static/ROUTES";

const {ipcRenderer} = window.require("electron")

export default function getFrameOptions(engine, s) {
    const settings = {...s}
    return [
        {
            label: "Save",
            icon: "save",
            onClick: () => DataStoreController.save().catch()
        },
        {
            label: engine.executingAnimation ? "Stop" : "Play",
            icon: engine.executingAnimation ? "pause" : "play_arrow",
            onClick: async () => loadScripts(engine)
        },
        {divider: true},
        {
            label: "Recompile probes",
            icon: "refresh",
            onClick: () => {
                alert.pushAlert("Recompiling probes", "info")
                window.renderer.refreshProbes()
            }
        },
        {divider: true},
        {
            label: "Edit",
            options: [
                {
                    label: "Undo",
                    onClick: () => DataStoreController.undo(),

                    shortcut: "Ctrl - Z"
                },
                {
                    label: "Redo",
                    onClick: () => DataStoreController.redo(),

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
                        DataStoreController.updateSettings(settings)
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
                        DataStoreController.updateSettings(settings)
                    },
                }
            ]
        },
        {
            label: "Help",
            options: [
                {
                    label: "About",
                    onClick: () => {
                        // ipcRenderer.send(ROUTES.OPEN_NEW_WINDOW, {
                        //     type: WINDOWS.HELP,
                        //     windowSettings: {
                        //         maxWidth: 300,
                        //         maxHeight: 300,
                        //         minWidth: 300,
                        //         minHeight: 300,
                        //         modal: true
                        //     }
                        // })
                    },
                    icon: "info",
                }

            ]
        },
    ]
}