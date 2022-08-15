import RendererStoreController from "../stores/RendererStoreController";
import loadScripts from "./load-scripts";
import ROUTES from "../../../../assets/ROUTES";

const {ipcRenderer} = window.require("electron")

export default function getFrameOptions(engine, s) {
    const settings = {...s}
    return [
        {
            label: "Save",
            icon: "save",
            onClick: () => RendererStoreController.save().catch()
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