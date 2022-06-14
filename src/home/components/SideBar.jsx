import styles from "../styles/SideBar.module.css"
import {Button, Icon} from "@f-ui/core"

import PropTypes from "prop-types"
import React, {useState} from "react"
import EN from "../../static/locale/EN"

export default function SideBar(props) {
    const {open, setOpen} = props
    const [extended, setExtended] = useState(false)
    return (
        <div className={styles.wrapper} data-extended={`${extended}`}>
            <div style={{width: "100%", overflow: "hidden", height: "100%"}}>
                <div className={styles.block}>
                    <Button onClick={() => setOpen(0)}
                        className={styles.button}
                        variant={open === 0 ? "filled" : undefined}
                        styles={{justifyContent: !extended ? "center" : undefined}}
                    >
                        <Icon
                            styles={{width: "30px"}}
                        >inventory_2</Icon>
                        {extended ? EN.HOME.SIDE_BAR.PROJECTS : undefined}
                    </Button>

                    <Button onClick={() => setOpen(1)}
                        className={styles.button}
                        variant={open === 1 ? "filled" : undefined}
                        styles={{justifyContent: !extended ? "center" : undefined}}
                    >
                        <Icon
                            styles={{width: "30px"}}
                        >chat_bubble</Icon>
                        {extended ? EN.HOME.SIDE_BAR.ISSUES : undefined}
                    </Button>
                </div>
            </div>
            <div className={styles.block} style={{transform: "none", height: "100%", alignContent: "flex-end"}}>
                <Button onClick={() => setExtended(!extended)}
                    styles={{justifyContent: !extended ? "center" : undefined}}
                    className={styles.button}
                >
                    <Icon
                        styles={{width: "30px"}}
                    >{extended ? "chevron_right" : "chevron_left"}</Icon>
                    {extended ? EN.HOME.SIDE_BAR.HIDE : undefined}
                </Button>
            </div>
        </div>

    )
}

SideBar.propTypes = {
    open: PropTypes.number,
    setOpen: PropTypes.func
}