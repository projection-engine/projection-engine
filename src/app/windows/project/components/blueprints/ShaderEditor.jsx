import styles from "./styles/ShaderEditor.module.css"
import React from "react"
import PropTypes from "prop-types"
import useShaderEditor from "./hooks/useShaderEditor"
import compileShaders from "./libs/compileShaders"
import Header from "../../../components/view/components/Header"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import Editor from "./components/Editor"
import Available from "./components/Available"
import selection from "./utils/selection"
import SELECTION_TYPES from "./templates/SELECTION_TYPES"
import useLocalization from "../../../global/useLocalization"
import FileSystem from "../../libs/FileSystem"
import compiler from "./libs/compiler"

const GRID_SIZE = 20

const {shell} = window.require("electron")
export default function ShaderEditor(props) {
    const hook = useShaderEditor()
    const translate = useLocalization("PROJECT", "SHADER_EDITOR")

    return (
        <>
            <Header
                {...props}
                title={translate("TITLE")}
                icon={"texture"}
                orientation={"horizontal"}
            >
                <div className={styles.options}>
                    <div className={styles.divider}/>
                    <Button
                        disabled={!hook.openFile?.registryID || !hook.changed}
                        className={styles.button}
                        onClick={() => window.blueprints.save(hook).catch()}>
                        <Icon styles={{fontSize: "1rem"}}>save</Icon>
                        {translate("SAVE")}
                    </Button>
                    <Button
                        disabled={!hook.openFile?.registryID}
                        className={styles.button}
                        onClick={() => compileShaders(hook).catch()}
                    >
                        <Icon styles={{fontSize: "1rem"}}>code</Icon>
                        {translate("COMPILE")}
                    </Button>
                    <div className={styles.divider}/>
                    <Dropdown
                        className={styles.button}
                        styles={{paddingRight: "2px"}}
                        disabled={hook.quickAccessMaterials.length === 0}
                    >
                        <div className={styles.icon}/>
                        {hook.openFile?.name ? hook.openFile.name : ""}
                        <DropdownOptions>
                            {hook.quickAccessMaterials.map((m, i) => (
                                <React.Fragment key={hook.internalID + "-material-" + i}>
                                    <DropdownOption option={{
                                        label: m.name,
                                        onClick: () => hook.setOpenFile(m)
                                    }}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                    <Available disabled={!hook.openFile.registryID}/>
                </div>
                <div className={styles.options} style={{justifyContent: "flex-end"}}>
                    <Dropdown
                        className={styles.button}
                        styles={{paddingRight: "2px"}}
                    >
                        {translate("SELECT")}
                        <DropdownOptions>
                            <DropdownOption
                                option={{
                                    label: translate("ALL"),
                                    onClick: () => selection(SELECTION_TYPES.ALL, hook),
                                    shortcut: "A"
                                }}
                            />
                            <DropdownOption
                                option={{
                                    label: translate("NONE"),
                                    onClick: () => selection(SELECTION_TYPES.NONE, hook),
                                    shortcut: "Alt + A"
                                }}
                            />
                            <DropdownOption
                                option={{
                                    label: translate("INVERT"),
                                    onClick: () => selection(SELECTION_TYPES.INVERT, hook),
                                    shortcut: "Ctrl + i"
                                }}
                            />
                        </DropdownOptions>
                    </Dropdown>

                    <Button
                        className={styles.button}
                        styles={{padding: "4px"}}
                        onClick={e => {
                            if (window.blueprints.grid === GRID_SIZE) {
                                window.blueprints.grid = 1
                                e.currentTarget.classList.remove(styles.highlightButton)
                            } else {
                                window.blueprints.grid = GRID_SIZE
                                e.currentTarget.classList.add(styles.highlightButton)
                            }
                        }}
                    >
                        <Icon styles={{fontSize: "1rem"}}>grid_4x4</Icon>
                        <ToolTip content={translate("GRID")}/>
                    </Button>
                    <Button
                        className={styles.button}
                        styles={{padding: "4px"}}
                        disabled={!hook.openFile?.registryID}
                        onClick={async () => {
                            const {shader} = await compiler(hook.nodes, hook.links)
                            const newFile = window.fileSystem.temp + FileSystem.sep + hook.openFile.registryID + ".log"
                            await window.fileSystem.writeFile(newFile, shader, true)
                            shell.openPath(newFile).catch()
                        }}
                    >
                        <Icon styles={{fontSize: "1rem"}}>code</Icon>
                        <ToolTip content={translate("SOURCE")}/>
                    </Button>
                </div>
            </Header>
            {props.hidden ? null : <Editor hook={hook}/>}
        </>
    )
}

ShaderEditor.propTypes = {
    hidden: PropTypes.bool,
    switchView: PropTypes.func,
    orientation: PropTypes.string,
}


