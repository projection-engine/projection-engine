import React, {useMemo} from "react"
import {Icon} from "@f-ui/core"

export default function useOptions(executingAnimation, setExecutingAnimation, engine, save, openLevelBlueprint) {
    return useMemo(() => {
        return  [
            {
                label: "Save",
                icon: <Icon
                    styles={{fontSize: "1.2rem"}}>save</Icon>,
                onClick: () => save()

            },
            {
                label: executingAnimation ? "Stop" : "Play",
                icon: <Icon
                    styles={{fontSize: "1.2rem"}}>{executingAnimation ? "pause" : "play_arrow"}</Icon>,
                onClick: () => setExecutingAnimation(prev => !prev)
            },
            {
                group: "b",
                label: "Rebuild cubemaps",
                icon: <Icon
                    styles={{fontSize: "1.2rem"}}>refresh</Icon>,
                onClick:() => {

                    alert.pushAlert( "Recompiling cubemaps",  "info")
                    engine.renderer.refreshCubemaps()
                }
            },
            {
                group: "c",
                label: "Edit level blueprint",
                icon: <Icon
                    styles={{fontSize: "1.2rem"}}>foundation</Icon>,
                onClick: () => openLevelBlueprint()
            }
        ]
    }, [engine.entities, engine.scripts, engine.meshes, engine, executingAnimation])
}