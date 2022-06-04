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

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)

    return (<Fabric
        language={"en"}
        theme={global.dark ? 'dark' : "light"}
        accentColor={global.accentColor}
        backgrounds={{primary: '#f0f0f0', secondary: '#e5e5e5', tertiary: '#e0e0e0', quaternary: '#d5d5d5'}}
        borders={{primary: '#e8e8e8'}}
        className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
    >
        <Frame
            options={[]}
            label={'Projection Engine'}
            hasLogo={false} pageInfo={{
            closeEvent: 'home-close',
            minimizeEvent: 'home-minimize',
            maximizeEvent: 'home-maximize',
        }}/>
        <LoaderProvider.Provider value={loader}>
            <ThemeProvider.Provider value={{
                ...global, themeClass: global.dark ? styles.dark : styles.light
            }}>
                <Home/>
            </ThemeProvider.Provider>
        </LoaderProvider.Provider>
    </Fabric>)
}


ReactDOM.render(
    <React.StrictMode>
        <EntryPoint/>
    </React.StrictMode>,
    document.getElementById('root')
)
