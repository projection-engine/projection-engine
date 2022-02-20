import './globals.css'
import {Fabric} from "@f-ui/core";
import styles from './App.module.css'
import ThemeProvider from "./services/hooks/ThemeProvider";

import useGlobalOptions from "./pages/project/hook/useGlobalOptions";
import Wrapper from "./Wrapper";

export default function App( ) {

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
                themeClass: global.dark ? styles.dark : styles.light,
                backgroundStripesClass: styles.backgroundStripes
            }}>
                <Wrapper/>
            </ThemeProvider.Provider>
        </Fabric>
    )
}

