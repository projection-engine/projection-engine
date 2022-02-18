import {LoaderProvider, useLoader} from "@f-ui/core";
import Home from "./pages/home/Home";
import Project from "./pages/project/Project";
import {useState} from "react";

export default function Wrapper(){
    const [currentTab, setCurrentTab] = useState(0)
    const load = useLoader()


    return (
        <LoaderProvider.Provider value={load}>
            {currentTab === 0 ?
                <Home redirect={(id) => {
                    setCurrentTab(id)
                }}/>
                :
                <Project id={currentTab} redirect={() => setCurrentTab(0)}/>
            }
        </LoaderProvider.Provider>
    )
}