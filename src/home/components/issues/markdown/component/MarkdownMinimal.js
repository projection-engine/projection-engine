import React, {useRef} from 'react'

import PropTypes from "prop-types";
import styles from '../styles/Markdown.module.css'

export default function MarkdownMinimal(props) {
    const ref = useRef()
    return (
        <article className={styles.article} dangerouslySetInnerHTML={{__html: props.hook.data}}/>
    )
}

MarkdownMinimal.propTypes = {
    hook: PropTypes.object.isRequired
}
