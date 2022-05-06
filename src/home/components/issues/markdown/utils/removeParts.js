import React from 'react'
export default function removeParts(toRemove, str, id, type) {
    const split = str.split('\n')
    toRemove.forEach((t, i) => {
        split[t.starts] = `{${id}-${type}-${i}}`
        for(let i = 0; i < t.length+1 ; i++){
            split[t.starts + i + (i === 0 ? 1 : 0)] = `&custom-empty;`
        }
    })
    return split.join('\n')
}
