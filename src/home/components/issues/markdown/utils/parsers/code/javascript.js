import React from 'react'
import styles from '../../../styles/Markdown.module.css'
import {CODE_BLOCK, JSX_REGEX} from "../../regex";

function parseObject(attr) {
    let parsed = attr, match = attr.match(CODE_BLOCK.OBJECT)
    if (match) {
        let parsedChild = match[1]
        const hasObjectAsChild = parsedChild.match(CODE_BLOCK.OBJECT) !== null

        if (hasObjectAsChild) {
            parsedChild = parseObject(parsedChild)
        }
        parsedChild = parsedChild.split(/(?!\\),/g)
        parsedChild = parsedChild.map(c => {
            if (c.match(CODE_BLOCK.STRING) === null) {
                switch (c){
                    case 'true':
                        return `<span class="${styles.keyword}">${c}</span>`
                    case 'false':
                        return `<span class="${styles.keyword}">${c}</span>`
                    case 'null':
                        return `<span class="${styles.keyword}">${c}</span>`
                    case 'undefined':
                        return `<span class="${styles.keyword}">${c}</span>`
                    default:
                        return `<span class="${styles.tag}">${c}</span>`
                }
            }
            else
                return c
            })

        parsed = parsed.replace(match[1], `<span>${parsedChild.join(',')}</span>`)
    }

    return parsed
}

function parseTag(tag) {
    let newTag = tag
    const objectAttributes = tag.match(JSX_REGEX.ATTRIBUTE)
    const stringAttributes = tag.match(JSX_REGEX.STRING_ATTRIBUTE)
    let parsedAttr = []

    objectAttributes?.forEach(a => {
        const attr = a.split('=')
        const p = parseObject(attr[1])

        parsedAttr.push({
            original: a,
            new: `<span class="${styles.attr}">${attr[0]}</span><span class="${styles.attrValue}">=${p}</span>`
        })
    })
    stringAttributes?.forEach(a => {
        const attr = a.split('=')
        parsedAttr.push({
            original: a,
            new: `<span class="${styles.attr}">${attr[0]}</span><span class="${styles.attrValue}">=${attr[1]}</span>`
        })
    })

    parsedAttr.forEach(p => {
        newTag = newTag.replace(p.original, p.new)
    })

    return newTag
}

export default function javascriptParser(data) {
    let parsedString = data

    const tags = {
        tag: parsedString.match(JSX_REGEX.TAG),
        closing: parsedString.match(JSX_REGEX.CLOSING_TAG),
        selfClosing: parsedString.match(JSX_REGEX.SELF_CLOSING_TAG),
        objects: parsedString.match(CODE_BLOCK.OBJECT)
    }

    let tagsToReplace = []
    tags.objects?.forEach(t => {
        tagsToReplace.push({
            original: t,
            new: parseObject(t)
        })
    })
    tags.tag?.forEach(t => {
        tagsToReplace.push({
            original: t,
            new: `<span class="${styles.tag}">${parseTag(t)}</span>`
        })
    })
    tags.closing?.forEach(t => {
        tagsToReplace.push({
            original: t,
            new: `<span class="${styles.tag}">${parseTag(t)}</span>`
        })
    })
    tags.selfClosing?.forEach(t => {
        tagsToReplace.push({
            original: t,
            new: `<span class="${styles.tag}">${parseTag(t)}</span>`
        })
    })

    tagsToReplace.forEach(t => {
        parsedString = parsedString.replace(t.original, t.new)
    })

    parsedString = parsedString.split('\n')

    parsedString = parsedString.map(line => {
        let parsedLine = line


        parsedLine = parsedLine.replaceAll(CODE_BLOCK.STRING, `<span class="${styles.strings}">$&</span>`)

        CODE_BLOCK.DOM_KEYWORDS.forEach(k => {
            parsedLine = parsedLine.replace(k, `<span class="${styles.domKeyword}">$&</span>`)
        })
        CODE_BLOCK.KEYWORDS.forEach(k => {
            parsedLine = parsedLine.replace(k, `<span class="${styles.keyword}">$&</span>`)
        })


        return parsedLine
    })
    return parsedString.join('\n')
}
