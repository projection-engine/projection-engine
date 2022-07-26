import PropTypes from "prop-types"
import styles from "../styles/Views.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import React from "react"
import VIEWS from "../VIEWS"
import useLocalization from "../../../global/useLocalization"

export default function Header(props) {
    const {icon, title, children, orientation, hidden, switchView} = props
    const translate = useLocalization("COMPONENTS", "VIEWS")
    return (
        <div className={hidden ? styles.headerHidden : styles.header}>
            <Dropdown
                variant={"outlined"}
                styles={{height: orientation === "vertical" && hidden ? "fit-content" : "25px"}}
                hideArrow={true}
                className={styles.title}

            >
                <div className={styles.icon}><Icon styles={{fontSize: "1rem"}}>{icon}</Icon></div>
                <ToolTip content={props.title}/>
                <DropdownOptions>
                    <DropdownOption
                        option={{
                            label: translate("CLOSE"),
                            icon: <Icon styles={{fontSize: "1rem"}}>close</Icon>,
                            onClick: () => switchView(undefined)
                        }}
                    />
                    <div className={styles.divider}/>
                    <DropdownOption
                        option={{
                            label: translate("HIERARCHY"),
                            icon: <Icon styles={{fontSize: "1rem"}}>account_tree</Icon>,
                            onClick: () => switchView(VIEWS.HIERARCHY)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: translate("COMP_EDITOR"),
                            icon: <Icon styles={{fontSize: "1rem"}}>category</Icon>,
                            onClick: () => switchView(VIEWS.COMPONENT)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: translate("CONTENT_BROWSER"),
                            icon: <Icon styles={{fontSize: "1rem"}}>folder</Icon>,
                            onClick: () => switchView(VIEWS.FILES)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: translate("SHADER_EDITOR"),
                            icon: <Icon styles={{fontSize: "1rem"}}>texture</Icon>,
                            onClick: () => switchView(VIEWS.BLUEPRINT)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: translate("CONSOLE"),
                            icon: <Icon styles={{fontSize: "1rem"}}>terminal</Icon>,
                            onClick: () => switchView(VIEWS.CONSOLE)
                        }}
                    />
                </DropdownOptions>
            </Dropdown>
            {!hidden && children ?
                children
                :
                null}
        </div>
    )
}
Header.propTypes = {
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
    icon: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    switchView: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired
}
