import styles from '../styles/Tabs.module.css'
import React, {useState} from "react";
import {Button} from "@f-ui/core";
import PropTypes from "prop-types";

export default function MinimalTabs(props){
    const {open, setOpen} = props
    return (
        <div className={[styles.wrapper, props.className].join(' ')} ref={props.reference}>
            <div className={styles.options}>
                {props.tabs.map((t, i) => (
                    <Button variant={'minimal'} highlight={i === open} className={styles.option} onClick={() => {
                        props.onTabSwitch(i)
                        setOpen(i)
                    }}>
                        {t}
                    </Button>
                ))}
            </div>
            {props.children}
        </div>
    )
}

MinimalTabs.propTypes={
    reference: PropTypes.object,
    children: PropTypes.node,
    tabs: PropTypes.array,
    className: PropTypes.string,
    onTabSwitch: PropTypes.func,
    open: PropTypes.number, setOpen: PropTypes.func
}