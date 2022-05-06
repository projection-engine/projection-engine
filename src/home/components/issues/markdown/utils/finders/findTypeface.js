import React from 'react'

import {BOLD_REGEX, INLINE_CODE_REGEX, ITALIC_REGEX, STRIKETHROUGH} from "../regex";
import styles from '../../styles/Markdown.module.css'


export function findTypeface(dataBlock) {
    let parsedLines = []
    let parsed = dataBlock.split('\n')
    parsed.forEach(p => {
        let str = p
        try {
            // BOLD
            const asterisk = str.match(BOLD_REGEX.BASE_ASTERISK)
            const underline = str.match(BOLD_REGEX.BASE_UNDERLINE)
            if (asterisk !== null)
                asterisk.forEach(i => {
                    const matched = i.match(BOLD_REGEX.ASTERISK)
                    str = str.replace(matched[0], `<b>${matched[1]}</b>`)
                })
            if (underline !== null)
                underline.forEach(i => {
                    const matched = i.match(BOLD_REGEX.UNDERLINE)
                    str = str.replace(matched[0], `<b>${matched[1]}</b>`)
                })
            // BOLD

            // ITALIC
            const asteriskItalic = str.match(ITALIC_REGEX.BASE_ASTERISK)
            const underlineItalic = str.match(ITALIC_REGEX.BASE_UNDERLINE)
            if (asteriskItalic !== null)
                asteriskItalic.forEach(i => {
                    const matched = i.match(ITALIC_REGEX.ASTERISK)
                    str = str.replace(matched[0], `<i>${matched[1]}</i>`)
                })
            if (underlineItalic !== null)
                underlineItalic.forEach(i => {
                    const matched = i.match(ITALIC_REGEX.UNDERLINE)
                    str = str.replace(matched[0], `<i>${matched[1]}</i>`)
                })
            // ITALIC


            // STRIKETHROUGH
            const strikethrough = str.match(STRIKETHROUGH.BASE)

            if (strikethrough !== null)
                strikethrough.forEach(i => {
                    const matched = i.match(STRIKETHROUGH.NOT_GLOBAL)
                    str = str.replace(matched[0], `<span style="text-decoration: line-through">${matched[1]}</span>`)
                })
            // STRIKETHROUGH

            // INLINE-CODE
            const inlineCode = str.match(INLINE_CODE_REGEX.BASE)
            if (inlineCode !== null)
                inlineCode.forEach(i => {
                    const matched = i.match(INLINE_CODE_REGEX.NOT_GLOBAL)
                    str = str.replace(matched[0], `<span class="${styles.inlineCode}">${matched[1]}</span>`)
                })
            parsedLines.push(str)
            // INLINE-CODE
        } catch (e) {
            console.log(e)
        }
    })

    // console.log(parsedLines)
    return  parsedLines.join('\n')
}
