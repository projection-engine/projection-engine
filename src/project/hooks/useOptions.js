import {useMemo} from "react"
import FileSystem from "../utils/files/FileSystem"
import FILE_TYPES from "../../../public/static/FILE_TYPES"

const {ipcRenderer} = window.require("electron")
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
                onClick: async () => {
                    const newValue = !executingAnimation
                    try{
                        if (newValue) {
                            alert.pushAlert("Loading scripts", "info")

                            for (let i = 0; i < engine.entities.length; i++) {
                                const c = engine.entities[i]
                                const scripts = []
                                for (let s = 0; s < c.scriptsMap.length; s++) {
                                    const reg = await document.fileSystem.readRegistryFile(c.scriptsMap[s])
                                    if (reg) {
                                        const file = await document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path)
                                        if (file)
                                            scripts.push(file)
                                    }
                                }
                                c.scripts = scripts
                            }
                            const levelScript = await document.fileSystem.readFile(document.fileSystem.path + FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT)
                            if(levelScript)
                                engine.setLevelScript(levelScript)
                            alert.pushAlert("Scripts loaded", "success")
                        }
                        setExecutingAnimation(newValue)
                    }catch (err){
                        if(newValue)
                            alert.pushAlert("Some error occurred", "error")
                    }
                }
            },
            {divider: true},
            {
                label: "Rebuild cubemaps",
                icon: "refresh",
                onClick:() => {
                    alert.pushAlert( "Recompiling cube-maps and probes",  "info")
                    engine.renderer.refreshCubemaps()
                }
            },
            {
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