import React from 'react'

import {LIST_REGEX} from "../regex";

export function getType(e) {
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

export function newFindLists(str) {
    const split = str.split('\n')

    let lists = []
    let currentType, currentList = [], startedOn
    split.forEach((s, i) => {
        const type = getType(s)
        const isChild = ((currentType === type && currentType === 'number') || (currentType !== 'number' && type !== 'number'))

        if ((type !== null && isChild) || (type !== null && currentType === undefined)) {
            if (startedOn === undefined) {
                startedOn = i
                currentList.push(s)
                currentType = type
            } else
                currentList.push(s)
        } else {
            if (currentList.length > 0)
                lists.push({
                    starts: startedOn,
                    content: currentList.join('\n'),
                    length: currentList.length,
                    ends: startedOn + currentList.length
                })

            currentList = []
            currentType = undefined
            startedOn = undefined
        }
    })
    if (currentList.length > 0) {
        lists.push({
            starts: startedOn,
            content: currentList.join('\n'),
            length: currentList.length,
            ends: startedOn + currentList.length
        })
    }


    return lists
}
