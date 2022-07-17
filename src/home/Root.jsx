import React, {useState} from "react"
import ReactDOM from "react-dom"
import "../global/global.css"
import Home from "./Home"
import LocalizationProvider from "../global/LocalizationProvider"

function Wrapper(){
    const [localization, setLocalization] = useState("en")
    return (
        <LocalizationProvider.Provider value={{localization, setLocalization}}>
            <Home/>
        </LocalizationProvider.Provider>
    )
}
ReactDOM.render(
    <Wrapper/>,
    document.getElementById("root")
)
