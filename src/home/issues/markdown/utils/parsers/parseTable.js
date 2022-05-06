import React from 'react'
import styles from "../../styles/Markdown.module.css";

const removeLimiters = (str) => {
    return str.split('| ').filter(s => s !== '| ').join('').split(' |').filter(s => s !== ' |').join('')
}
export default function parseTable(block) {
    const split = block.content.split('\n')
    const header = [split[0]]
    split.splice(0, 2)

    let splitColumns = split.map(c => c.split(' | '))
    splitColumns = splitColumns.map(c => `<tr class="${styles.tableRow}">${c.map(cc => `<td class="${styles.tableContent}">${removeLimiters(cc)}</td>`).join('')}</tr>`).join('')

    let splitHeaders = header.map(c => c.split(' | '))
    splitHeaders = splitHeaders.map(c => `<tr class="${styles.tableRow}">${c.map(cc => `<th class="${styles.tableContent}">${removeLimiters(cc)}</th>`).join('')}</tr>`).join('')

    return `<table class="${styles.tableWrapper}">${splitHeaders}\n${splitColumns}</table>`

}
