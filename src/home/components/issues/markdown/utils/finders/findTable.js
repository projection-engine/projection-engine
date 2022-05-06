import React from 'react'

import {TABLE_REGEX} from "../regex";
import findRowIndex from "../findRowIndex";


export function newFindTables(str) {
    let lastWasRow = false
    let tables = []
    const split = str.split('\n')
    let indexes = []
    let currentTable = []

    let dividerFound = false

    split.forEach(l => {
        if (l.match(TABLE_REGEX.CONTENT) !== null) {
            if(!dividerFound){
                dividerFound = l.match(TABLE_REGEX.DIVIDER) !== null
            }

            currentTable.push(l)
            lastWasRow = true
        } else if (currentTable.length > 0) {
            tables.push(currentTable.join('\n'))
            currentTable = []
            lastWasRow = false
        } else
            lastWasRow = false
    })

    tables.forEach(t => {
        const index = findRowIndex(str, t)

        indexes.push({
            starts: index.start,
            ends: index.end,
            content: t,
            length:t.split('\n').length
        })
    })

    return indexes
}
