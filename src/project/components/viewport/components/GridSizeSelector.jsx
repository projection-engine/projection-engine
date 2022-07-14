import React, {useState} from "react"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core"
import styles from "../styles/SideOptions.module.css"

export default function GridSizeSelector(props) {
    const [state, setState] = useState(props.initialValue)
    const [active, setActive] = useState(false)
    const [open, setOpen] = useState(false)

    return (
        <Dropdown
            className={styles.transformationWrapper}
            hideArrow={true}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            variant={open ? "filled" : undefined}
            attributes={{"data-minimal": `${props.minimal}`}}
            modalStyles={{
                padding: "4px"
            }}
        >
            <ToolTip content={props.label}/>
            {props.icon}
            {props.minimal ? null : <label className={styles.overflow}>{props.label}</label>}
            <DropdownOptions>
                <div className={styles.gridSizeHeader}>
                    <input
                        type={"checkbox"}
                        checked={active}
                        onChange={e => {
                            setActive(e.target.checked)
                        }}
                    />
                    {props.label}
                </div>
                <div className={styles.gridSizeItems}>
                    {props.values.map(e => (
                        <React.Fragment key={e + "variable-scale"}>
                            <Button
                                disabled={!active}
                                styles={{width: "100%"}}
                                className={styles.button}
                                variant={state === e ? "filled" : undefined}
                                onClick={() => {
                                    setState(e)
                                    props.onSave(state, active)
                                }}>
                                {e}
                            </Button>
                        </React.Fragment>
                    ))}
                </div>
            </DropdownOptions>
        </Dropdown>
    )
}

GridSizeSelector.propTypes = {
    values: PropTypes.array,
    minimal: PropTypes.bool,
    onSave: PropTypes.func,
    label: PropTypes.string,
    initialValue: PropTypes.number,
    icon: PropTypes.node
}