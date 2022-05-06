import React from 'react'

const SPACE = '  '

const parseData = (field, layer, isArrayField) => {
    if (field !== null && field && typeof field === 'object' && !Array.isArray(field)) {
        if (Object.keys(field).length > 0)
            return `${highlightObject(field, layer + 1)}`
        else
            return `${SPACE.repeat(layer - 1)}{}`
    } else if (field !== null && field && Array.isArray(field)) {
        return highlightArray(field, layer)
    } else {
        if (typeof field === 'string' && !isArrayField)
            return `"<i style="color: red">${field}</i>"`
        else if(typeof field === 'boolean')
            return `<b style="color: #FF6A00">${field}</b>`
        else
            return `<i style="color: red">${field}</i>`

    }
}

const highlightArray = (field, layer, isWrapper) => {
    let newField = [], startP, endP
    const subFieldLayer = field.length === 1 ? layer : layer + 1

    field.forEach(e => {
        const parsed = parseData(e, subFieldLayer, true)
        newField.push(typeof e === 'string' && !isWrapper ? `"${parsed}"` : parsed)
    })

    startP = SPACE.repeat(layer + 2)
    endP = SPACE.repeat(layer + 1)
    if (field.length === 0 || field.length === 1)
        return `[${newField.join(',\n' + startP)}]`
    else
        return `[\n${startP}${newField.join(',\n' + startP)}\n${endP}]`
}
const highlightObject = (obj, layer, isWrapper) => {
    const keys = Object.keys(obj)
    let newObj = ''

    if (!isWrapper) {
        keys.forEach(e => {
            newObj += `"${e}": ${parseData(obj[e], layer, Array.isArray(obj[e]))}`
        })
        newObj = `{${newObj}}`
    } else {
        keys.forEach(e => {
            newObj += `"${e}": ${obj[e]}`
        })
        newObj = `{${newObj}}`
    }

    let str = newObj
    const lineTerminator = (keys.length > 1 || keys.length > 0 && typeof obj[keys[0]] === 'object' ? '\n' : '')
    keys.forEach(e => {
        str = str.replace(`"${e}":`, `${layer === 0 || layer > 0 ? lineTerminator + (SPACE).repeat(layer + 1) : ''}<b style="color: #0095ff">"${e}": </b>`)
    })

    str = str.split('')
    if (str[str.length - 1] === '}')
        str[str.length - 1] = lineTerminator + SPACE.repeat(!isWrapper ? (layer ? layer : 1) : 0) + '}'


    return str.join('')
}

export default function jsonParser(data) {


    let response
    if (Array.isArray(data)) {
        let newArr = []
        data.forEach(e => {
            let keys = Object.keys(e)
            let newObj = {}
            // console.log(e)
            keys.forEach(key => {
                newObj[key] = parseData(e[key], 0)
            })
            newArr.push(highlightObject(newObj, 0, true))
        })


        response = highlightArray(newArr, 0, true)
    } else {
        let newObject = {}
        Object.keys(data).forEach(e => {
            newObject[e] = parseData(data[e], 0)
        })

        response = highlightObject(newObject, 0, true)
    }

    return {
        data: data,
        parsedData: response
    }
}

