import React, {useContext} from "react"
import SettingsProvider from "../../../providers/SettingsProvider"
import styles from "./styles/LayoutTabs.module.css"
import {ContextMenu, Icon} from "@f-ui/core"
import VIEWS from "../../../../components/view/VIEWS"

export default function LayoutTabs(){
    const settings = useContext(SettingsProvider)

    return (
        <ContextMenu 
            className={styles.wrapper}
            options={[
                {
                    label: "Delete view",
                    onClick: (node) => {
                        const attr = parseInt(node.getAttribute("data-view"))
                        if(attr){
                            if(attr === settings.currentView)
                                settings.currentView = 0
                            settings.views = settings.views.filter((_, i) => i !== attr)
                        }
                    },
                    requiredTrigger: "data-view"
                }
            ]}
            triggers={["data-view"]}
        >
            {settings.views.map((v, i) => (
                <button 
                    onClick={() => settings.currentView = i} 
                    key={"tab-view-" + i} 
                    className={styles.tab} 
                    data-highlight={`${i === settings.currentView}`}
                    data-view={i}
                >
                    {v.name}
                </button>
            ))}
            {settings.views.length < 10 ?
                <button
                    onClick={() => settings.views = [...settings.views, {name: "New Tab" + settings.views.length, bottom: [VIEWS.CONSOLE], right: [VIEWS.HIERARCHY], left: []}]}
                    className={styles.tab}
                    style={{padding: "0", width: "17px"}}
                    data-highlight={"false"}
                >
                    <Icon styles={{fontSize: ".9rem"}}>
						add
                    </Icon>
                </button>
                :
                null
            }
        </ContextMenu>
    )
}