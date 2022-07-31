import openLevelBlueprint from "./open-level-blueprint";
import DataStoreController from "../stores/DataStoreController";
import FILE_TYPES from "../../../../static/FILE_TYPES";
import FileSystem from "../libs/FileSystem"

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
            onClick: async () => {
                const newValue = !engine.executingAnimation
                const entities = window.renderer.entities
                try {
                    if (newValue) {
                        for (let i = 0; i < entities.length; i++) {
                            const c = entities[i]
                            const scripts = []
                            for (let s = 0; s < c.scriptsMap.length; s++) {
                                const reg = await window.fileSystem.readRegistryFile(c.scriptsMap[s])
                                if (reg) {
                                    const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path)
                                    if (file)
                                        scripts.push(file)
                                }
                            }
                            c.scripts = scripts
                        }
                        const levelScript = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT)
                        if (levelScript)
                            DataStoreController.updateEngine({...engine, levelScript})
                    }
                    DataStoreController.updateEngine({...engine, executingAnimation: newValue})
                } catch (err) {
                    console.error(err)
                    if (newValue)
                        alert.pushAlert("Some error occurred", "error")
                }
            }
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
        {
            label: "Edit level blueprint",
            icon: "foundation",
            onClick: openLevelBlueprint
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
                        // const settingsClone = {}
                        // Object.keys(settings).map(k => {
                        //     settingsClone[k] = settings[k]
                        // })
                        // ipcRenderer.send(
                        //     ROUTES.OPEN_NEW_WINDOW,
                        //     {
                        //         type: WINDOWS.SETTINGS,
                        //         windowSettings: {
                        //             width: 625,
                        //             height: 750,
                        //             minWidth: 300,
                        //             minHeight: 500 ,
                        //
                        //         },
                        //         windowProps:settingsClone
                        //     })
                        // ipcRenderer.once(WINDOWS.SETTINGS + ROUTES.CLOSE_NEW_WINDOW, (event, data) => {
                        //     console.log(data, event)
                        // })
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
                    label: "Viewport Metrics",
                    icon: !settings.visible.metricsViewport ? undefined : "check",
                    onClick: () => {
                        settings.visible = {
                            ...settings.visible,
                            metricsViewport: !settings.visible.metricsViewport
                        }
                        DataStoreController.updateSettings(settings)
                    },
                },
                {
                    label: "Shortcuts",
                    icon: !settings.visible.shortcuts ? undefined : "check",
                    onClick: () => {
                        settings.visible = {
                            ...settings.visible,
                            shortcuts: !settings.visible.shortcuts
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