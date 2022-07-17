import React, {useState} from "react"
import ReactDOM from "react-dom"
import "../global/global.css"
import LocalizationProvider from "../global/LocalizationProvider"
import Project from "./Project"

function Wrapper(){
    const [localization, setLocalization] = useState("en")
    return (
        <LocalizationProvider.Provider value={{localization, setLocalization}}>
            <Project/>
        </LocalizationProvider.Provider>
    )
}
ReactDOM.render(
    <Wrapper/>,
    document.getElementById("root")
)
