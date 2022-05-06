import React from 'react'
import PropTypes from "prop-types";
import styles from '../styles/Navigation.module.css'
import HeaderButton from "./HeaderButton";

export default function Navigation(props) {
    return (
        <div className={styles.wrapper}>
            {props.headers.filter(h => h.variant <= 2).map((e, i) => (
                <React.Fragment key={i + '-headers'}>
                    <HeaderButton onHeader={props.onHeader} header={e} index={i} headers={props.headers} scrollTo={props.scrollTo}/>
                </React.Fragment>
            ))}
        </div>
    )
}

Navigation.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.object).isRequired,
    scrollTo: PropTypes.func.isRequired,
    onHeader: PropTypes.string
}
