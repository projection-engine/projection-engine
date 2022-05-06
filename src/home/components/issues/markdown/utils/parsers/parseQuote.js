import React from 'react'
import styles from "../../styles/Markdown.module.css";

export default function parseQuote(block){
    let split = block.content.split('\n')

    split = split.map((line) => parser(line))

    return `<section data-layer="false" class="${styles.quote}">${split.join('')}</section>`

}

function parser(line, nestingLevel){
    const innerRegex = nestingLevel !== undefined && nestingLevel > 0 ? />(.+)/gi : /^>/gi
    let parsed = line

    try {
        const split = parsed.split(innerRegex)
        if (split.length > 1)
            parsed = `${nestingLevel !== undefined ? `<section data-layer="true" class="${styles.quote}">`: ''}${parser(split[1], nestingLevel !== undefined ? nestingLevel + 1 : 1)}${nestingLevel !== undefined ? `</section>`: ''}`
    } catch (e) {
        console.log(e, 'QUOTE ERROR')
    }

    return parsed
}
