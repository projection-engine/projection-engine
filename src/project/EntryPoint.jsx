import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import '../styles/globals.css'
import {Button, Fabric} from "@f-ui/core";
import styles from '../styles/App.module.css'
import ThemeProvider from "../project/hooks/ThemeProvider";
import useGlobalOptions from "../project/hooks/useGlobalOptions";
import useLoader from "../components/loader/useLoader";
import LoaderProvider from "../components/loader/LoaderProvider";
import {CLOSE_CHANNEL} from "../home/openProject";

const {ipcRenderer} = window.require('electron')

function EntryPoint() {
    const global = useGlobalOptions()
    const loader = useLoader(global.dark, global.accentColor)
    useEffect(() => {
        ipcRenderer.on('project-load', (event, data) => {
            console.log('EH')
        })
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
                <Button onClick={() => ipcRenderer.send(CLOSE_CHANNEL)}>
                    CLOSE
                </Button>

            </ThemeProvider.Provider>
        </LoaderProvider.Provider>
    </Fabric>)
}


ReactDOM.render(<React.StrictMode>
    <EntryPoint/>
</React.StrictMode>, document.getElementById('root'))
