import React from 'react'
import ReactDOM from 'react-dom'
import './pages/wrapper/styles/globals.css'
import {Fabric} from "@f-ui/core";
import styles from './pages/wrapper/styles/App.module.css'
import ThemeProvider from "./pages/project/utils/hooks/ThemeProvider";

import useGlobalOptions from "./pages/project/utils/hooks/useGlobalOptions";

import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import {useState} from "react";

function App() {
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



ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
