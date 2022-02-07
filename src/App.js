import './pages/styles/globals.css'
import {Fabric} from "@f-ui/core";
import styles from './pages/styles/App.module.css'

// import LoadProvider from "./views/editor/hook/LoadProvider";
import useGlobalOptions from "./views/editor/hook/useGlobalOptions";
import useLoading from "./components/loader/useLoading";
import ThemeProvider from "./views/editor/hook/ThemeProvider";
import {useLayoutEffect, useState} from "react";
// import Home from "./pages/Home";
// import Project from "./pages/Project";
import LoadProvider from "./views/editor/hook/LoadProvider";
import Home from "./pages/Home";
import Project from "./pages/Project";

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
                    <div/>
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

