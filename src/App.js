import './globals.css'
import {Fabric, LoaderProvider, useLoader} from "@f-ui/core";
import styles from './App.module.css'

import {useState} from "react";

import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import ThemeProvider from "./services/hooks/ThemeProvider";

import useGlobalOptions from "./pages/project/hook/useGlobalOptions";

export default function App( ) {

    const global = useGlobalOptions()
    const load = useLoader(global.dark, global.accentColor)
    const [currentTab, setCurrentTab] = useState(0)


    return (
        <Fabric
            language={"en"}
            theme={global.dark ? 'dark' : "light"}
            accentColor={global.accentColor}
            className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
        >
            <ThemeProvider.Provider value={{
                ...global,
                themeClass: global.dark ? styles.dark : styles.light,
                backgroundStripesClass: styles.backgroundStripes
            }}>
                <LoaderProvider.Provider value={load}>
                    {currentTab === 0 ?
                        <Home redirect={(id) => {

                            setCurrentTab(id)
                        }}/>
                        :
                        <Project id={currentTab} redirect={() => setCurrentTab(0)}/>
                    }

                </LoaderProvider.Provider>
            </ThemeProvider.Provider>
        </Fabric>
    )
}

