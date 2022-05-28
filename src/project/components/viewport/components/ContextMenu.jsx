import PropTypes from "prop-types";
import React from "react";
import styles from '../styles/ContextMenu.module.css'
import {Button} from "@f-ui/core";

export default function ContextMenu(props) {
    const {options} = props
    if (options && options.length > 0 && props.engine.selected.length > 0)
        return options.map((o, i) => (
            <React.Fragment key={'viewport-option-' + i}>
                {o.divider ? <div className={styles.divider}/> :
                    <Button
                        disabled={o.disabled}
                        className={styles.button}
                        onClick={() => {
                            console.log(o)
                            o.onClick()
                        }}>
                        <div className={styles.icon}>
                            <span style={{fontSize: '1.1rem'}}
                                  className={'material-icons-round'}>{o.icon}</span>
                        </div>
                        {o.label}
                    </Button>}
            </React.Fragment>
        ))
    return null
}

ContextMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func,
        divider: PropTypes.bool,
        disabled: PropTypes.bool
    })),
    engine: PropTypes.object,
}