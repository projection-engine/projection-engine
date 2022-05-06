import React from 'react'

import {RULE_REGEX} from "../regex";


export function newFindRules(str) {
    const matches = []
    const split = str.split('\n')

    split.forEach((s, i) => {
        const stringBefore = i > 0 ? split[i - 1] : null
        const stringAfter = i < split.length - 1 ? split[i + 1] : null
        if (s.match(RULE_REGEX.BASE) && ((stringBefore === null || stringBefore.match(RULE_REGEX.EMPTY) !== null) || (stringAfter === null || stringAfter.match(RULE_REGEX.EMPTY) !== null))) {

            matches.push({
                starts: i,
                ends: i + 1,
                length: -1,
                content: s
            })
        }
    })

    return matches
}



