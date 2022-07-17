import React, {useState} from "react"
import ReactDOM from "react-dom"
import "../../global/global.css"
import {Tab, ThemeProvider, VerticalTabs} from "@f-ui/core"
import Frame from "../../components/frame/Frame"
import FRAME_EVENTS from "../../../public/static/FRAME_EVENTS"
import AccordionTemplate from "../../components/accordion/AccordionTemplate"

function Settings() {
    const [open, setOpen] = useState(0)
    return (
        <ThemeProvider
            language={"en"}
            theme={"dark"}
            className={"wrapper"}
        >
            <Frame 
                label={"Project settings"}
                options={[]}
                pageInfo={{
                    closeEvent: FRAME_EVENTS.CLOSE_SHORTCUTS,
                    minimizeEvent: FRAME_EVENTS.MINIMIZE_SHORTCUTS,
                    maximizeEvent: FRAME_EVENTS.MAXIMIZE_SHORTCUTS,
                }}
            />
            <VerticalTabs open={open} setOpen={setOpen}>
                <Tab label={"Project"}>
                    <AccordionTemplate title={"Name"}>

                    </AccordionTemplate>
                </Tab>
                <Tab label={"Key map"}>
                    <AccordionTemplate title={"Viewport"}>

                    </AccordionTemplate>
                    <AccordionTemplate title={"Viewport movement"}>

                    </AccordionTemplate>
                    <AccordionTemplate title={"Blueprints"}>

                    </AccordionTemplate>
                    <AccordionTemplate title={"Files"}>

                    </AccordionTemplate>

                </Tab>
            </VerticalTabs>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <React.StrictMode>
        <Settings/>
    </React.StrictMode>,
    document.getElementById("root")
)
