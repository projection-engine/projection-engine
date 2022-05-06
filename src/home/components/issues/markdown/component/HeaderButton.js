import styles from "../styles/Navigation.module.css";
import {Ripple} from "@f-ui/core";
import React, {useMemo, useState} from "react";
import PropTypes from "prop-types";
import {INLINE_HEADER} from "../utils/regex";

export default function HeaderButton(props) {
    const [open, setOpen] = useState()

    const nestedHeaders = useMemo(() => {
        let stillValid = true
        let nested = []
        props.headers.forEach((h, i) => {
            if (i > props.index && h.variant > props.header.variant && stillValid)
                nested.push(h)
            else if(i > props.index)
                stillValid = false
        })

        return nested
    }, [props])


    return (
        <details>
            <summary

                className={styles.button}
                data-highlight={`${props.onHeader === props.header.id || nestedHeaders.find(nested => props.onHeader === nested.id) !== undefined}`}
                onClick={() => {
                    setOpen(!open)
                    const element = document.getElementById(props.header.id)
                    console.log(element)
                    if (element) {

                        props.scrollTo(element.getBoundingClientRect().top)
                    }
                }}>
                {props.header.content.replaceAll(INLINE_HEADER[props.header.variant + '-IND'], '')}
                <Ripple/>
            </summary>
            {nestedHeaders.map((nested, i) => (
                <button
                    key={'header-'+i}
                    className={styles.button}
                    data-variant={`${nested.variant}`}
                    data-highlight={`${props.onHeader === nested.id}`}
                    onClick={() => {
                        const element = document.getElementById(nested.id)
                        if (element)
                            props.scrollTo(element.getBoundingClientRect().top)
                    }}>
                    {nested.content.replaceAll(INLINE_HEADER[nested.variant + '-IND'], '')}
                    <Ripple/>
                </button>
            ))}

        </details>

    )
}
HeaderButton.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.object,
    index: PropTypes.number,
    scrollTo: PropTypes.func,
    onHeader: PropTypes.string
}
