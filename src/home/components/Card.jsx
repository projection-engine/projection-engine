import styles from "../styles/Card.module.css"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOption, DropdownOptions, DropdownProvider, Icon, TextField} from "@f-ui/core"
import React, {useContext, useRef, useState} from "react"
import FileSystem from "../../project/libs/FileSystem"
import ROUTES from "../../../public/static/ROUTES"

const {ipcRenderer, shell} = window.require("electron")
export default function Card(props) {
    const {data} = props
    const ref = useRef()
    const [name, setName] = useState(data.meta.name)
    return (
        <div
            className={styles.wrapper}
            data-card={props.data.id}
            ref={ref}
        >
            <div style={{width: "100%", fontSize: ".9rem", fontWeight: 550}}>
                {name}
            </div>
            <div className={styles.divider}/>
            <div style={{width: "100%", paddingLeft: "4px"}}>
                {data.meta.lastModification ? data.meta.lastModification : "Not modified"}
            </div>
            <div className={styles.divider}/>
            <div style={{width: "100%", paddingLeft: "4px"}}>
                {data.meta.creationDate}
            </div>
            <div className={styles.divider}/>
            <div className={styles.section}>
                <Dropdown
                    className={styles.button}
                    wrapperClassname={styles.modalOptions}
                    hideArrow={true}>
                    <Icon styles={{fontSize: "1rem"}}>edit</Icon>
                    <DropdownOptions>
                        <Rename name={name} setName={setName} onRename={props.onRename}/>
                    </DropdownOptions>
                </Dropdown>
                <Dropdown
                    hideArrow={true}
                    className={styles.button}
                >
                    <Icon>
                        more_horiz
                    </Icon>
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: "Show in explorer",
                            icon: <Icon styles={{fontSize: "1.1rem"}}>folder</Icon>,
                            onClick: () => shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FileSystem.sep + data.id)
                        }}/>
                        <DropdownOption option={{
                            label: "Delete",
                            icon: <Icon styles={{fontSize: "1.1rem"}}>delete_forever</Icon>,
                            onClick: () => props.onDelete()
                        }}/>
                    </DropdownOptions>
                </Dropdown>
                <Button
                    onClick={() => {
                        ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW, {
                            windowID: props.data.id,
                            data: props.data,
                            hasMain: false
                        })
                    }}
                    className={styles.button}
                    styles={{background: "var(--pj-border-primary)"}}
                >
                    <Icon styles={{fontSize: "1rem"}}>open_in_new</Icon>
                </Button>
            </div>
        </div>
    )
}
Card.propTypes = {
    isLast: PropTypes.bool,
    index: PropTypes.number,
    data: PropTypes.object,
    onRename: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(["row", "cell"])
}

function Rename(props) {
    const {setName, name, onRename} = props
    const dropdownContext = useContext(DropdownProvider)
    return (
        <TextField
            handleChange={e => setName(e)}
            noMargin={true}
            placeholder={"New name"}
            value={name} height={"30px"}
            onEnter={() => {
                onRename(name)
                dropdownContext.setOpen(false)
                alert.pushAlert("Project renamed", "success")
            }}
        />
    )
}

Rename.propTypes={
    setName: PropTypes.func, name: PropTypes.string, onRename: PropTypes.func
}