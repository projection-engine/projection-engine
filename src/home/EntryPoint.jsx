import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import '../styles/globals.css'
import {Fabric} from "@f-ui/core";
import styles from '../styles/App.module.css'
import ThemeProvider from "../project/hooks/ThemeProvider";

import useGlobalOptions from "../project/hooks/useGlobalOptions";

import Home from "./Home";
import Project from "../project/Project";

import {HashRouter, Route, Routes} from "react-router-dom";
import useLoader from "../components/loader/useLoader";
import LoaderProvider from "../components/loader/LoaderProvider";
import openProject from "./openProject";

const {ipcRenderer} = window.require('electron')

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)

    useEffect(() => {
        const openData = openProject('123')
        ipcRenderer.send(openData.channel, openData.data)
    }, [])

    return (<Fabric
        language={"en"}
        theme={global.dark ? 'dark' : "light"}
        accentColor={global.accentColor}
        backgrounds={{
            primary: '#f0f0f0', secondary: '#e5e5e5', tertiary: '#e0e0e0', quaternary: '#d5d5d5'
        }}
        borders={{
            primary: '#e8e8e8'
        }}

        className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
    >
        <LoaderProvider.Provider value={loader}>
            <ThemeProvider.Provider value={{
                ...global, themeClass: global.dark ? styles.dark : styles.light
            }}>
                <HashRouter>
                    <Routes>
                        <Route
                            path={'/'}
                            exact={true}
                            element={<Home/>}
                        />

                        <Route
                            path={'/project/:id'}
                            element={<Project/>}
                        />
                    </Routes>
                </HashRouter>
            </ThemeProvider.Provider>
        </LoaderProvider.Provider>
    </Fabric>)
}


ReactDOM.render(<React.StrictMode>
    <EntryPoint/>
</React.StrictMode>, document.getElementById('root'))
