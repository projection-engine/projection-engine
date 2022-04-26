import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './pages/wrapper/styles/globals.css'
import {Fabric} from "@f-ui/core";
import styles from './pages/wrapper/styles/App.module.css'
import ThemeProvider from "./pages/project/utils/hooks/ThemeProvider";

import useGlobalOptions from "./pages/project/utils/hooks/useGlobalOptions";

import Home from "./pages/home/Home";
import Project from "./pages/project/Project";

function App() {
    const [currentTab, setCurrentTab] = useState()
    const global = useGlobalOptions()
    return (
        <Fabric
            language={"en"}
            theme={global.dark ? 'dark' : "light"}
            accentColor={global.accentColor}
            backgrounds={{
                primary: '#f0f0f0',
                secondary: '#e5e5e5',
                tertiary: '#e0e0e0',
                quaternary:'#d5d5d5'
            }}
            borders={{
                primary: '#e8e8e8'
            }}

            className={[styles.wrapper, global.dark ? styles.dark : styles.light].join(' ')}
        >
            <ThemeProvider.Provider value={{
                ...global,
                themeClass: global.dark ? styles.dark : styles.light
            }}>
                {!currentTab?
                    <Home redirect={(id) => {
                        setCurrentTab(id)
                    }}/>
                    :
                    <Project id={currentTab} redirect={() => setCurrentTab(undefined)}/>
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
