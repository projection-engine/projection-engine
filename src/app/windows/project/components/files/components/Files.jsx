import PropTypes from "prop-types"
import styles from "../styles/Files.module.css"
import React, {useId, useMemo, useState} from "react"
import File from "./File"
import SelectBox from "../../../../components/select-box/SelectBox"
import handleRename from "../utils/handleRename"
import useShortcuts from "../hooks/useShortcuts"
import useContextTarget from "../../../../components/context/hooks/useContextTarget"
import getFileOptions from "../utils/getFileOptions"
import {Icon} from "@f-ui/core"
import FileSystem from "../../../libs/FileSystem"

function map(arr, items) {
    return arr.map(e => {
        return {
            ...e, children: e.isFolder ? items.filter(i => {
                return typeof i.parent === "string" && i.parent === e.id
            }).length : 0,
        }
    })
}

const TRIGGERS = [
    "data-wrapper",
    "data-file",
    "data-folder"
]
export default function Files(props) {
    const {
        fileType, setFileType,
        searchString, setSearchString,
        selected, setSelected, hook,
        translate
    } = props
    const internalID = useId()
    const [currentItem, setCurrentItem] = useState()
    const filesToRender = useMemo(() => {
        let type = fileType?.split("")
        if (type) {
            type.shift()
            type = type.join("")
        }
        if (searchString || fileType)
            return map(hook.items.filter(file => (searchString.trim() && file.name.toLowerCase().includes(searchString) || type && file.type === type && !file.isFolder), hook.items))
        if (hook.currentDirectory.id !== FileSystem.sep)
            return map(
                hook.items
                    .filter(file => file.parent === hook.currentDirectory.id),
                hook.items
            )
        return map(hook.items.filter(file => !file.parent), hook.items)
    }, [hook.items, hook.currentDirectory, searchString, fileType])
    useShortcuts(hook, selected, setSelected, internalID, translate)

    const options = useMemo(
        () => getFileOptions(hook, setCurrentItem, translate),
        [hook.items, hook.currentDirectory, hook.toCut]
    )
    useContextTarget(
        internalID,
        options,
        TRIGGERS
    )


    return (
        <div
            id={internalID}
            className={styles.content}
            data-wrapper={internalID}
        >
            <div className={styles.filesWrapper}>
                <SelectBox
                    nodes={hook.items}
                    selected={selected}
                    setSelected={setSelected}
                />
                {filesToRender.length > 0 ?
                    filesToRender.map((child, index) => (
                        <React.Fragment key={child.id}>
                            <File
                                index={index}
                                reset={() => {
                                    setSelected([])
                                    setSearchString("")
                                    setFileType(undefined)
                                }}
                                type={child.isFolder ? 0 : 1}
                                data={child}
                                childrenQuantity={child.children}
                                selected={selected}
                                setSelected={(e) => setSelected(prev => {
                                    if (e) {
                                        if (e.ctrlKey)
                                            return [...prev, child.id]
                                        return [child.id]
                                    }
                                    return []
                                })}
                                hook={hook}
                                onRename={currentItem}
                                submitRename={name => handleRename(child, name, hook, setCurrentItem)}
                            />
                        </React.Fragment>
                    ))
                    :
                    <div className={styles.empty}>
                        <Icon styles={{fontSize: "100px"}}>folder</Icon>
                        <div style={{fontSize: ".8rem"}}>
                            {translate("EMPTY")}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

Files.propTypes = {
    translate: PropTypes.func,
    fileType: PropTypes.string,
    setFileType: PropTypes.func,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    visualizationType: PropTypes.number,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    hook: PropTypes.object.isRequired
}
