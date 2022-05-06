import React from 'react'
import {INLINE_HEADER} from "../regex";
import styles from '../../styles/Markdown.module.css'

export default function parseHeader(block){
    const replaced = block.content.replaceAll(INLINE_HEADER[block.variant+'-IND'], '')

    return `<h${block.variant} id="${block.id}" data-variant="${block.variant}" class="${styles.header}">${replaced}</h${block.variant}>`
}
