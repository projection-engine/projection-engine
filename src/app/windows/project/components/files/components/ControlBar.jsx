import PropTypes from "prop-types"
import styles from "../styles/ControlBar.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import React, {useContext, useMemo} from "react"
import Search from "../../../../components/search/Search"
import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import importFile from "../utils/importFile"
import EngineProvider from "../../../context/EngineProvider"
import selection from "../utils/selection"
import SELECTION_TYPES from "../templates/SELECTION_TYPES"

export default function ControlBar(props) {
    const {
        searchString,
        setSearchString,
        hook,
        hidden,
        view, setView,
        translate
    } = props
    const starred = useMemo(() => hook.bookmarks.find(b => b.path === hook.currentDirectory.id) !== undefined, [hook.currentDirectory, hook.bookmarks])
    const [engine] = useContext(EngineProvider)

    return (
        <div className={styles.wrapper} style={{border: hidden ? "none" : undefined}}>
            {view.navigation ?
                <div className={styles.buttonGroup} style={{width: "100%"}}>
                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.settingsButton}
                            onClick={() => hook.returnDir()}
                        >
                            <Icon>arrow_back</Icon>
                            <ToolTip content={translate("BACK_DIR")}/>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            onClick={() => hook.forwardDir()}
                        >
                            <Icon styles={{transform: "rotate(180deg)"}}>arrow_back</Icon>
                            <ToolTip content={translate("FORWARD_DIR")}/>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            disabled={hook.currentDirectory.id === FileSystem.sep}
                            onClick={hook.goToParent}
                        >
                            <Icon
                                styles={{transform: "rotate(180deg)"}}>subdirectory_arrow_right</Icon>
                            <ToolTip content={translate("PARENT_DIR")}/>
                        </Button>
                        <div className={styles.divider}/>
                        <Button
                            disabled={hook.loading}
                            className={styles.settingsButton}
                            onClick={() => {
                                alert.pushAlert(translate("REFRESHING"), "info")
                                hook.refreshFiles().catch()
                            }}
                        >
                            <Icon>sync</Icon>
                            <ToolTip content={translate("REFRESH")}/>
                        </Button>
                        <Button
                            styles={{border: "none"}}
                            className={styles.settingsButton}
                            onClick={async () => {
                                let path = hook.currentDirectory.id + FileSystem.sep + translate("NEW_FOLDER")

                                const existing = window.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                                if (existing.length > 0)
                                    path += " - " + existing.length
                                await AsyncFS.mkdir(hook.path + path, {})
                                hook.refreshFiles().catch()
                            }}

                        >
                            <Icon styles={{transform: "rotate(180deg)"}}>create_new_folder</Icon>
                            <ToolTip content={translate("CREATE_FOLDER")}/>
                        </Button>
                        <Button
                            className={styles.settingsButton}
                            variant={starred ? "filled" : undefined}
                            styles={{border: "none"}}
                            onClick={() => {
                                if (starred)
                                    hook.removeBookmark(hook.currentDirectory.id)
                                else
                                    hook.addBookmark(hook.currentDirectory.id)
                            }}
                        >
                            <Icon>star</Icon>
                            <ToolTip content={translate("ADD_BOOKMARK")}/>
                        </Button>
                        <Dropdown
                            disabled={hook.loading} hideArrow={true}
                            className={styles.settingsButton}
                            styles={{border: "none"}}
                            onClick={() => {
                                hook.refreshFiles().catch()
                            }}
                            variant={props.fileType !== undefined ? "filled" : undefined}
                        >
                            <ToolTip content={translate("FILTER_TYPE")}/>
                            <Icon>filter_alt</Icon>
                            <DropdownOptions>
                                {Object.keys(FILE_TYPES).map((k, i) => (
                                    <React.Fragment key={k + "-filter-key-" + i}>
                                        <DropdownOption
                                            option={{
                                                label: k.toLowerCase().replace("_", " "),
                                                icon: props.fileType === FILE_TYPES[k] ? <Icon>check</Icon> : undefined,
                                                onClick: () => props.setFileType(props.fileType === FILE_TYPES[k] ? undefined : FILE_TYPES[k]),
                                                keepAlive: false,
                                            }}
                                            className={styles.fileType}
                                        />
                                    </React.Fragment>
                                ))}
                            </DropdownOptions>
                        </Dropdown>
                    </div>

                    <Search
                        width={"100%"}
                        searchString={hook.currentDirectory.id}
                        noIcon={true}
                        noPlaceHolder={true}
                        noAutoSubmit={true}
                        setSearchString={async (path) => {
                            if (await AsyncFS.exists(hook.path + path))
                                hook.setCurrentDirectory({
                                    id: path
                                })
                        }}
                    />
                    <Search
                        searchString={searchString}
                        setSearchString={setSearchString}
                        width={"25%"}
                    />


                </div>
                :
                null
            }

            <div className={styles.buttonGroup} style={{justifyContent: "flex-end"}}>
                <Dropdown className={styles.settingsButton}    styles={{paddingLeft: "8px"}}>
                    {translate("VIEW")}
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: translate("OPTIONS"),
                                icon: view.navigation ? <Icon styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                                onClick: () => setView({...view, navigation: !view.navigation})
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: translate("SIDE_BAR"),
                                icon: view.sideBar ? <Icon styles={{fontSize: "1.1rem"}}>check</Icon> : null,
                                onClick: () => setView({...view, sideBar: !view.sideBar})
                            }}
                        />
                    </DropdownOptions>
                </Dropdown>
                <Dropdown className={styles.settingsButton}    styles={{paddingLeft: "8px"}}>
					Select
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: translate("SELECT_ALL"),
                                onClick: () => selection(SELECTION_TYPES.ALL, hook, props.setSelected, props.selected),
                                shortcut: "A"
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: translate("SELECT_NONE"),
                                onClick: () => selection(SELECTION_TYPES.NONE, hook, props.setSelected, props.selected),
                                shortcut: "Alt + A"
                            }}
                        />
                        <DropdownOption
                            option={{
                                label: translate("SELECT_INVERT"),
                                onClick: () => selection(SELECTION_TYPES.INVERT, hook, props.setSelected, props.selected),
                                shortcut: "Ctrl + i"
                            }}/>
                    </DropdownOptions>
                </Dropdown>
                <div className={styles.divider}/>
                <Button
                    styles={{width: "75px", gap: "4px", padding: "0 16px"}}
                    className={styles.settingsButton}
                    onClick={() => {
                        importFile(engine, props.hook)
                    }}
                >
                    <Icon styles={{fontSize: "1rem"}}>open_in_new</Icon>

                    {translate("IMPORT")}
                </Button>
            </div>
        </div>
    )
}

ControlBar.propTypes = {
    translate: PropTypes.func.isRequired,
    setSelected: PropTypes.func,
    selected: PropTypes.array,

    view: PropTypes.object,
    setView: PropTypes.func,

    fileType: PropTypes.string,
    setFileType: PropTypes.func,

    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    path: PropTypes.arrayOf(PropTypes.object),
    hook: PropTypes.object.isRequired,
    hidden: PropTypes.bool
}
