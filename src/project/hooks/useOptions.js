import React, {useMemo} from "react"

const {ipcRenderer, shell} = window.require("electron")
export default function useOptions(executingAnimation, setExecutingAnimation, engine, openLevelBlueprint, serializer, exporter) {
    return useMemo(() => {
        return  [
            {divider: true},
            {
                label: "Save",
                icon: "save",
                onClick: () => serializer.save()

            },
            {
                label: executingAnimation ? "Stop" : "Play",
                icon: executingAnimation ? "pause" : "play_arrow",
                onClick: () => setExecutingAnimation(prev => !prev)
            },
            {
                group: "b",
                label: "Rebuild cubemaps",
                icon: "refresh",
                onClick:() => {

                    alert.pushAlert( "Recompiling cubemaps",  "info")
                    engine.renderer.refreshCubemaps()
                }
            },
            {
                group: "c",
                label: "Edit level blueprint",
                icon: "foundation",
                onClick: () => openLevelBlueprint()
            },
            {divider: true},
            {
                label: "Help",
                options: [
                    {
                        label: "Editor Shortcuts",
                        onClick: () => ipcRenderer.send("open-shortcuts", {})
                    },
                    {
                        label: "About",
                        icon: "help",
                        disabled: true
                    },

                ]
            },
        ]
    }, [engine.entities, engine.scripts, engine.meshes, engine, executingAnimation])
}