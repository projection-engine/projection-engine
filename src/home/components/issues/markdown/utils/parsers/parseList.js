import React from 'react'
import {LIST_REGEX} from "../regex";
import styles from '../../styles/Markdown.module.css'

function getTag(type) {
    switch (type) {
        case 'number':
            return 'ol'
        default:
            return 'ul'
    }
}

function getType(e) {
    switch (true) {
        case e.match(LIST_REGEX.number) !== null:
            return 'number'
        case e.match(LIST_REGEX.plus) !== null:
            return 'plus'
        case e.match(LIST_REGEX.minus) !== null:
            return 'minus'
        case e.match(LIST_REGEX.asterisk) !== null:
            return 'asterisk'
        default:
            return null
    }
}

export default function parseList(block) {
    const split = block.content.split('\n')
    let tag
    let list = []
    split.forEach(s => {
        const match = s.match(/^(\s+)/g)

        if (match !== null) {
            list.push({
                nestingLevel: Math.round(match[0].length / 3),
                content: s
            })
        } else
            list.push({
                nestingLevel: 0,
                content: s
            })
    })

    list = list.map((l) => {


        const type = getType(l.content)

        if(tag === undefined)
            tag = tag = getTag(type)

        let content = `<li>${l.content.replace(LIST_REGEX[type], '')}</li>`
        for (let i = 0; i < l.nestingLevel; i++) {
            content = `<${tag} class="${styles.list}">${content}</${tag}>`
        }

        return content
    })

    return `<${tag} class="${styles.list}">${list.join('\n')}</${tag}>`
}
