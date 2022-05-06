import React from 'react'
import {HTML_REGEX} from "../regex";

export default function findHtml(str) {
    const split = str.split('\n')
    let found = [], currentTag, starts, currentTagStructure = []
    split.forEach((s, i) => {
        if (s.match(HTML_REGEX.TAG) !== null && s.match(HTML_REGEX.CLOSING_TAG) === null) {

            if (currentTag === undefined) {
                starts = i
                currentTag = s.match(HTML_REGEX.TAG)[0]
                currentTagStructure.push(s)
            } else
                currentTagStructure.push(s)
        } else if (s.match(HTML_REGEX.CLOSING_TAG) !== null && s.match(HTML_REGEX.CLOSING_TAG) === currentTag) {
            found.push({
                starts: starts,
                content: currentTagStructure.join('\n'),
                length: currentTagStructure.length
            })

            currentTag = undefined
            starts = undefined
            currentTagStructure = []
        }
    })


    return []
}
