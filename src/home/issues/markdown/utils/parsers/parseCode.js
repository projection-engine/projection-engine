import React from 'react'
import {CODE_BLOCK} from "../regex";
import styles from "../../styles/Markdown.module.css";
import javascriptParser from "./code/javascript";
import jsonParser from "./code/json";
import consoleParser from "./code/console";
import htmlParser from "./code/html";

function findTag(data) {
    return data.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}


function identifyType(str, clean) {
    let parsedClean = findTag(clean)
    parsedClean = parsedClean.split('\n')
    parsedClean = parsedClean.map(p => {
        return `&nbsp;${p}`
    })

    parsedClean = parsedClean.join('\n')

    parsedClean = parsedClean.replaceAll(/'/g, '&quot;')
    parsedClean = parsedClean.replaceAll(/"/g, '&quot;')
    parsedClean = parsedClean.replaceAll(/´/g, '&quot;')

    switch (true) {
        case str.match(CODE_BLOCK.TYPES.javascript) !== null:
            return javascriptParser(parsedClean)
        case str.match(CODE_BLOCK.TYPES.json) !== null:
            return jsonParser(parsedClean)
        case str.match(CODE_BLOCK.TYPES.console) !== null:
            return consoleParser(parsedClean)
        case str.match(CODE_BLOCK.TYPES.html) !== null:
            return htmlParser(parsedClean)
        default:
            return parsedClean
    }
}

export default function parseCode(block, index, id) {
    let buttonID = undefined
    let parsed = block.content
    const m = block.content.match(CODE_BLOCK.NOT_GLOBAL)

    if (m !== null) {
        let parsedBlock = identifyType(block.content, m[4].replace(/(\n|\r\n)/, ''))

        parsedBlock = parsedBlock.split('\n')

        parsedBlock = parsedBlock.map((p, i) => {
            return `<button data-index="${i}" data-variant="code" class="${styles.lineEnumeration}">${'&nbsp'.repeat(Math.ceil(parsedBlock.length * .1))}<span style="user-select: text">${p}</span></button>`
        })


        buttonID = id + '-button-' + index

        parsed = `<section style="position: relative; width: 100%"><link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/><button id="${id + '-button-' + index}" class="${styles.copyButton}"><span class="material-icons-round">copy</span></button><pre class="${styles.code}">${parsedBlock.join('\n')}</pre></section>`
    }

    return [parsed, buttonID]
}
