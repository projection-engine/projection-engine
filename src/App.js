import './globals.css'
import {Fabric} from "@f-ui/core";
import styles from './App.module.css'
import ThemeProvider from "./services/hooks/ThemeProvider";

import useGlobalOptions from "./pages/project/hook/useGlobalOptions";

import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import {useEffect, useState} from "react";
import ImageProcessor, {COLOR_BLEND_OPERATIONS} from "./services/workers/image/ImageProcessor";

export default function App() {
    const [currentTab, setCurrentTab] = useState(0)
    const global = useGlobalOptions()

    return (
        <Fabric
            language={"en"}
            theme={global.dark ? 'dark' : "light"}
            accentColor={global.accentColor}
            className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
        >
            <ThemeProvider.Provider value={{
                ...global,
                themeClass: global.dark ? styles.dark : styles.light
            }}>
                {currentTab === 0 ?
                    <Home redirect={(id) => {
                        setCurrentTab(id)
                    }}/>
                    :
                    <Project id={currentTab} redirect={() => setCurrentTab(0)}/>
                }
            </ThemeProvider.Provider>
        </Fabric>
    )
}

