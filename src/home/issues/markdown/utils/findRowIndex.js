import React from 'react'
export default function findRowIndex(string, toFind){
    let start

    const d = string.split(toFind)
    if(d.length > 0)
        start = d[0].split('\n').length -1
    return {start}
}
