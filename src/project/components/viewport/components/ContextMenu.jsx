import PropTypes from "prop-types"
import React, {useMemo} from "react"
import styles from "../styles/ContextMenu.module.css"
import {Button} from "@f-ui/core"

export default function ContextMenu(props) {
    const {options, close} = props
   
    return options.map((o, i) => (
        <React.Fragment key={"viewport-option-" + i}>
            {o.divider ? <div className={styles.divider}/> :
                <Button
                    disabled={o.disabled}
                    className={styles.button}
                    onClick={() => {
                        o.onClick()
                        close()
                    }}>
                    <div className={styles.inline}>
                        <div className={styles.icon}>
                            <span style={{fontSize: "1.1rem"}}
                                className={"material-icons-round"}>{o.icon}</span>
                        </div>
                        {o.label}
                    </div>
                    <Shortcut shortcut={o.shortcut}/>
                </Button>}
        </React.Fragment>
    ))
    
}

ContextMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func,
        divider: PropTypes.bool,
        disabled: PropTypes.bool,
        shortcut: PropTypes.array
    })),
    engine: PropTypes.object,
    close: PropTypes.func
}
function Shortcut(props){
    const shortcut = useMemo(() => {
        return props.shortcut.map((s, i) => s + (i < props.shortcut.length -1 ? " + " : ""))
    }, [props.shortcut])
    if(!shortcut)
        return null
    return(
        <div className={styles.shortcut}>
            {shortcut}
        </div>
    )
}

Shortcut.propTypes={
    shortcut: PropTypes.array
}