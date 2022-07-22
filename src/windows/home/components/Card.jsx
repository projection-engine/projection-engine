import styles from "../styles/Card.module.css"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOption, DropdownOptions, DropdownProvider, Icon, TextField} from "@f-ui/core"
import React, {useContext, useRef, useState} from "react"
import FileSystem from "../../../project/libs/FileSystem"
import useLocalization from "../../../global/useLocalization"

const {ipcRenderer, shell} = window.require("electron")
export default function Card(props) {
    const {data} = props
    const ref = useRef()
    const [name, setName] = useState(data.meta.name)
    const translate = useLocalization("HOME", "CARD")

    return (
        <div
            className={styles.wrapper}
            data-card={props.data.id}
            ref={ref}
        >
            <div className={styles.info}>
                <strong>{name}</strong>
            </div>
            <div className={styles.divider}/>
            <div className={styles.info}>
                <strong>{data.meta.lastModification ? data.meta.lastModification : translate("NEVER")}</strong>
                <small>{translate("LAST_MODIFIED")}</small>
            </div>
            <div className={styles.divider}/>
            <div className={styles.info}>
                <strong>{data.meta.creationDate}</strong>
                <small>{translate("CREATION")}</small>
            </div>
            <div className={styles.divider}/>
            <div className={styles.section}>
                <Dropdown
                    className={styles.button}
                    wrapperClassname={styles.modalOptions}
                    hideArrow={true}>
                    <Icon styles={{fontSize: "1rem"}}>edit</Icon>
                    <DropdownOptions>
                        <Rename name={name} setName={setName} onRename={props.onRename} translate={translate}/>
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
                            label: translate("SHOW_IN_EXPLORER"),
                            icon: <Icon styles={{fontSize: "1.1rem"}}>folder</Icon>,
                            onClick: () => shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FileSystem.sep + data.id)
                        }}/>
                        <DropdownOption option={{
                            label: translate("DELETE"),
                            icon: <Icon styles={{fontSize: "1.1rem"}}>delete_forever</Icon>,
                            onClick: () => props.onDelete()
                        }}/>
                    </DropdownOptions>
                </Dropdown>
                <Button
                    onClick={() => props.open()}
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
    open: PropTypes.func,
    isLast: PropTypes.bool,
    index: PropTypes.number,
    data: PropTypes.object,
    onRename: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(["row", "cell"])
}

function Rename(props) {
    const {setName, name, onRename, translate} = props
    const dropdownContext = useContext(DropdownProvider)
    return (
        <TextField
            handleChange={e => setName(e)}
            noMargin={true}
            placeholder={translate("NEW_NAME")}
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
    setName: PropTypes.func, name: PropTypes.string, onRename: PropTypes.func, translate: PropTypes.func
}