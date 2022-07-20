import React, {useEffect, useState} from "react"
import FileSystem from "../libs/FileSystem"
import FILE_TYPES from "../../../public/static/FILE_TYPES"
import openLevelBlueprint from "../utils/openLevelBlueprint"
import ROUTES from "../../../public/static/ROUTES"
import WINDOWS from "../../../public/static/WINDOWS"
import {Icon} from "@f-ui/core"

const {ipcRenderer} = window.require("electron")
export default function useOptions(engine, save, settings) {
    const [options, setOptions] = useState([])
    useEffect(() => {
        setOptions([
            {
                label: "Save",
                icon: "save",
                onClick: () => save().catch()
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
                                engine.setLevelScript(levelScript)
                        }
                        engine.setExecutingAnimation(newValue)
                    } catch (err) {
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
                label: "View",
                options: [
                    {
                        label: "Viewport Sidebar",
                        icon: !settings.visible.sideBarViewport ? undefined :
                            <Icon styles={{fontSize: "1.1rem"}}>check</Icon>,
                        onClick: () => {
                            settings.visible = {
                                ...settings.visible,
                                sideBarViewport: !settings.visible.sideBarViewport
                            }
                        },
                    },
                    {
                        label: "Viewport Metrics",
                        icon: !settings.visible.metricsViewport ? undefined :
                            <Icon styles={{fontSize: "1.1rem"}}>check</Icon>,
                        onClick: () => {
                            settings.visible = {
                                ...settings.visible,
                                metricsViewport: !settings.visible.metricsViewport
                            }
                        },
                    },
                    {
                        label: "Shortcuts",
                        icon: !settings.visible.shortcuts ? undefined :
                            <Icon styles={{fontSize: "1.1rem"}}>check</Icon>,
                        onClick: () => {
                            settings.visible = {
                                ...settings.visible,
                                shortcuts: !settings.visible.shortcuts
                            }
                        },
                    }
                ]
            },
            {
                label: "Help",
                options: [
                    {
                        label: "About",
                        onClick: () => ipcRenderer.send(ROUTES.OPEN_NEW_WINDOW, {
                            type: WINDOWS.HELP,
                            windowSettings: {
                                maxWidth: 300,
                                maxHeight: 300,
                                minWidth: 300,
                                minHeight: 300,
                                modal: true
                            }
                        }),
                        icon: <Icon styles={{fontSize: "1.1rem"}}>info</Icon>,
                    }

                ]
            },
        ])
    }, [save, engine.executingAnimation])

    return options
}