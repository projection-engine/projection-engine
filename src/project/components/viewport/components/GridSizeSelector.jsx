import React, {useState} from "react"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import styles from "../styles/SideOptions.module.css"

export default function GridSizeSelector(props) {
    const [state, setState] = useState(props.initialValue)
    const [open, setOpen] = useState(false)

    return (
        <Dropdown
            className={styles.transformationWrapper}
            hideArrow={true}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            variant={open ? "filled" : undefined}
            attributes={{"data-minimal": `${props.minimal}`}}
            modalStyles={{padding: "4px"}}
        >
            <ToolTip content={props.label}/>
            {props.icon}
            {props.minimal ? null : <label className={styles.overflow}>{props.label}</label>}
            <DropdownOptions>
                <div className={styles.gridSizeHeader}>
                    {props.label}
                    <Button
                        onClick={() => {
                            setState(props.initialValue)
                            props.onSave(props.initialValue)
                        }}
                        variant={"outlined"}
                        styles={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "20px",
                            height: "20px",
                            padding: 0
                        }}
                    >
                        <Icon styles={{fontSize: "1rem"}}>close</Icon>
                    </Button>
                </div>
                <div className={styles.gridSizeItems}>
                    {props.values.map(e => (
                        <React.Fragment key={e + "variable-scale"}>
                            <Button

                                styles={{width: "100%"}}
                                className={styles.button}
                                variant={state === e ? "filled" : undefined}
                                onClick={() => {
                                    setState(e)
                                    props.onSave(state)
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