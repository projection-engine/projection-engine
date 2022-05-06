import React from 'react'

import {EXTERNAL_SOURCE_REGEX} from "../regex";
import styles from '../../styles/Markdown.module.css'

export default function parseExternalSource(dataBlock) {
    const split = dataBlock.split('\n')
    let parsed = []
    split.forEach((line) => {
        let currentLine = line
        let match = currentLine.match(EXTERNAL_SOURCE_REGEX.linked_image)

        while (match !== null) {

            const alt = match[1]
            const href = match[3]
            const src = match[2]

            currentLine = currentLine.replace(EXTERNAL_SOURCE_REGEX.link, `<a class="${styles.link}" href="${href}"><img class="${styles.image}" src="${src}" alt="${alt}"/></a>`)
            match = currentLine.match(EXTERNAL_SOURCE_REGEX.linked_image)
        }


        match = currentLine.match(EXTERNAL_SOURCE_REGEX.image)
        if (match !== null) {
            const alt = match[1]
            const src = match[2]
            currentLine = currentLine.replace(`![${alt}](${src})`, `<img class="${styles.image}" src="${src}" alt="${alt}"/>`)

        }


        match = currentLine.match(EXTERNAL_SOURCE_REGEX.link)

        while (match !== null) {
            // if(currentLine.includes('Migration'))
            //     console.log(match)
            const alt = match[2]
            let href = match[3]
            const splitHref = href.split(' ')
            let title
            if (splitHref.length > 1)
                title = splitHref.splice(1, 2).join(' ')

            currentLine = currentLine.replace(`[${alt}](${href})`, `<a ${title !== undefined ? `title=${title}` : ''} class="${styles.link}"  href="${splitHref[0]}">${alt}</a>`)
            // currentLine = findLink(currentLine)

            match = currentLine.match(EXTERNAL_SOURCE_REGEX.link)
        }
        // console.log(match)
        parsed.push(currentLine)
    })


    return parsed.join('\n')
}


export function findImage(line) {
    let parsed = line
    const match = line.match(EXTERNAL_SOURCE_REGEX.image)
    if (match !== null) {
        const alt = match[1]
        const src = match[2]
        parsed = parsed.replace(`![${alt}](${src})`, `<img class="${styles.image}" src="${src}" alt="${alt}"/>`)

    }

    return parsed
}

export function findLink(line) {
    let parsed = line
    const match = line.match(EXTERNAL_SOURCE_REGEX.link)
    if (match !== null) {
        const alt = match[2]
        let href = match[3]
        const splitHref = href.split(' ')
        let title
        if (splitHref.length > 1)
            title = splitHref.splice(1, 2).join(' ')

        parsed = parsed.replace(`[${alt}](${href})`, `<a ${title !== undefined ? `title=${title}` : ''} class="${styles.link}"  href="${splitHref[0]}">${alt}</a>`)

        parsed = findLink(parsed)
    }


    return parsed
}

export function findLinkedImage(line) {
    let parsed = line
    const match = line.match(EXTERNAL_SOURCE_REGEX.linked_image)
    if (match !== null) {

        const alt = match[1]
        const href = match[3]
        const src = match[2]
        parsed = parsed.replace(EXTERNAL_SOURCE_REGEX.link, `<a class="${styles.link}" href="${href}"><img  src="${src}" alt="${alt}"/></a>`)
    }
    return parsed
}
