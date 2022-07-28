import styles from "../styles/ShaderEditor.module.css"
import Search from "../../../../views/search/Search"
import React, {useDeferredValue, useMemo, useState} from "react"
import PropTypes from "prop-types"
import {Dropdown, DropdownOptions, Icon} from "@f-ui/core"
import {availableNodes} from "../templates/availableNodes"

const parseStr = (str) => {
    return str.toLowerCase().replace(/\s/g, "")
}
export default function Available(props) {
    const [searchString, setSearchString] = useState("")
    const search = useDeferredValue(searchString)
    const nodes = useMemo(() => {
        const s = parseStr(search)
        if (!s)
            return availableNodes
        return availableNodes.filter(i => parseStr(i.label).includes(s))
    }, [search])

    return (
        <Dropdown
            className={styles.button}
            styles={{paddingRight: "2px"}}
            disabled={props.disabled}
            modalClassName={styles.modalAvailableNodes}
        >
			Add
            <DropdownOptions>
                <div className={styles.contentAvailableNodes}>
                    {nodes.map((d, i) => (
                        <div
                            className={styles.optionAvailableNodes}
                            draggable={true}
                            // title={d.tooltip}
                            onDragStart={e => e.dataTransfer.setData("text", d.dataTransfer)}
                            key={d.dataTransfer + "-" + i}
                        >
                            <Icon>drag_indicator</Icon>
                            {d.label}
                        </div>
                    ))}
                </div>
                <div className={styles.headerAvailableNodes}>
                    <Search
                        width={"100%"}
                        searchString={searchString}
                        setSearchString={setSearchString}
                    />
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}

Available.propTypes = {
    disabled: PropTypes.bool
}