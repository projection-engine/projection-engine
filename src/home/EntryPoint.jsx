import React from "react"
import ReactDOM from "react-dom"
import "../styles/globals.css"
import {Fabric} from "@f-ui/core"
import styles from "../styles/App.module.css"
import ThemeProvider from "../project/hooks/ThemeProvider"

import useGlobalOptions from "../project/hooks/useGlobalOptions"

import Home from "./Home"
import useLoader from "../components/loader/useLoader"
import LoaderProvider from "../components/loader/LoaderProvider"
import Frame from "../components/frame/Frame"
import EN from "../static/locale/EN"

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)

    return (
        <Fabric
            language={"en"}
            theme={"dark"}
            accentColor={global.accentColor}
            className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(" ")}
        >
            <Frame
                options={[]}
                label={EN.HOME.ENTRY_POINT.TITLE}
                hasLogo={false} pageInfo={{
                    closeEvent: "home-close",
                    minimizeEvent: "home-minimize",
                    maximizeEvent: "home-maximize",
                }}/>
            <LoaderProvider.Provider value={loader}>
                <ThemeProvider.Provider value={{
                    ...global, themeClass: global.dark ? styles.dark : styles.light
                }}>
                    <Home/>
                </ThemeProvider.Provider>
            </LoaderProvider.Provider>
        </Fabric>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <EntryPoint/>
    </React.StrictMode>,
    document.getElementById("root")
)
