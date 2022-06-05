import styles from "../styles/Card.module.css"
import PropTypes from "prop-types"
import {Button, DataRow, Dropdown, DropdownOptions, DropdownProvider, TextField} from "@f-ui/core"
import React,  {useContext, useMemo, useRef, useState} from "react"
import logo from "../../static/icons/logo.png"
import EN from "../../static/locale/EN"

const KEYS = EN.HOME.CARD.KEYS
const {ipcRenderer} = window.require("electron")
export default function Card(props) {
    const ref = useRef()
    const [open, setOpen] = useState({
        delete: false,
        edit: false
    })
    const [name, setName] = useState(props.data.meta.name)
    const object = useMemo(() => {
        return {...props.data.meta, preview: props.data.meta?.preview ? props.data.meta?.preview : logo, name}
    }, [props.data, name])

    return (
        <div
            className={styles.wrapper}
            data-card={props.data.id}
            ref={ref}
        >
            <DataRow
                asCard={true}
                object={object}
                keys={KEYS}
                className={styles.dataRow}
                selfContained={true}
            />

            <div className={styles.section} style={{display: !open.delete && !open.edit ? undefined : "none"}}>
                <Dropdown
                    styles={{"--fabric-accent-color": "#ff5555"}}
                    className={styles.button}
                    onClick={() => setOpen({
                        delete: true
                    })}
                    hideArrow={true}>
                    <span className={"material-icons-round"} style={{fontSize: "1.2rem"}}>delete_forever</span>
                    <DropdownOptions>
                        <div
                            className={styles.onDelete}>
                            {EN.HOME.CARD.CONFIRMATION}
                            <div className={styles.buttonGroup}>
                                <Button
                                    onClick={() => props.onDelete()}
                                    variant={"filled"}
                                    styles={{"--fabric-accent-color": "#ff5555", width: "100%"}}
                                    className={styles.button}
                                >
                                    <span className={"material-icons-round"}
                                        style={{fontSize: "1rem"}}>delete_forever</span>
                                    {EN.HOME.CARD.DELETE}
                                </Button>

                            </div>
                        </div>
                    </DropdownOptions>
                </Dropdown>
                <Dropdown
                    className={styles.button}
                    wrapperClassname={styles.modalOptions}
                    onClick={() => setOpen({
                        edit: true
                    })} hideArrow={true}>
                    <span style={{fontSize: "1rem"}} className={"material-icons-round"}>edit</span>
                    <DropdownOptions>
                        <Rename name={name} setName={setName} setOpen={setOpen} onRename={props.onRename}/>
                    </DropdownOptions>
                </Dropdown>
                <Button
                    onClick={() => ipcRenderer.send("switch-window", {
                        windowID: props.data.id,
                        data: props.data,
                        hasMain: false
                    })}
                    variant={"filled"}
                    className={styles.openButton}>
                    <span className={"material-icons-round"} style={{fontSize: "1rem"}}>open_in_new</span>
                    <label>
                        {EN.HOME.CARD.LOAD}
                    </label>
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

function Rename({setName, name, onRename, setOpen}) {
    const dropdownContext = useContext(DropdownProvider)
    return (
        <TextField
            handleChange={e => setName(e.target.value)}
            label={"New name"}
            placeholder={"New name"}
            value={name} height={"30px"}
            onEnter={() => {
                onRename(name)
                setOpen({})
                dropdownContext.setOpen(false)
            }}
        />
    )
}