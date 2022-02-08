import './globals.css'
import {Fabric} from "@f-ui/core";
import styles from './App.module.css'

import useLoading from "./components/loader/useLoading";

import {useLayoutEffect, useState} from "react";

import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import ThemeProvider from "./pages/project/hook/ThemeProvider";
import LoadProvider from "./pages/project/hook/LoadProvider";
import useGlobalOptions from "./pages/project/hook/useGlobalOptions";

const fs = window.require('fs')
export default function App( ) {

    const global = useGlobalOptions()
    const load = useLoading(global.dark, global.accentColor)
    const [currentTab, setCurrentTab] = useState(0)

    useLayoutEffect(() => {
        if(!fs.existsSync('projects'))
            fs.mkdir('projects', () => null)
    }, [])
    return (
        <Fabric
            language={"en"}
            theme={global.dark ? 'dark' : "light"}
            accentColor={global.accentColor}
            className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
        >
            <ThemeProvider.Provider value={global}>
                <LoadProvider.Provider value={load}>

                    {currentTab === 0 ?
                        <Home redirect={(id) => {

                            setCurrentTab(id)
                        }}/>
                        :
                        <Project id={currentTab} redirect={() => setCurrentTab(0)}/>
                    }

                </LoadProvider.Provider>
            </ThemeProvider.Provider>
        </Fabric>
    )
}

