import styles from "../styles/SideBar.module.css"
import {Button, Icon} from "@f-ui/core"

import PropTypes from "prop-types"
import React from "react"
import EN from "../../static/locale/EN"

export default function SideBar(props) {
    const {open, setOpen} = props
    return (
        <div className={styles.wrapper}>
            <Button onClick={() => setOpen(0)}
                className={styles.button}
                variant={open === 0 ? "filled" : undefined}
            >
                <Icon
                    styles={{width: "30px"}}
                >inventory_2</Icon>
                {EN.HOME.SIDE_BAR.PROJECTS}
            </Button>

            <Button onClick={() => setOpen(1)}
                className={styles.button}
                variant={open === 1 ? "filled" : undefined}
            >
                <Icon
                    styles={{width: "30px"}}
                >report_bug</Icon>
                {EN.HOME.SIDE_BAR.ISSUES}
            </Button>
        </div>
    )
}

SideBar.propTypes = {
    open: PropTypes.number,
    setOpen: PropTypes.func
}