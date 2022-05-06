import React from 'react'

export const LIST_REGEX = {
    number: /^[0-9]+\. | {3}[0-9]+\. /gi,
    asterisk: /^(\s{0,3})\* /gi,
    minus: /^(\s{0,3})-\s/gi,
    plus: /^(\s{0,3})\+\s/gi,
    nested: /^(\s{0,3})(.+)/gi
}

export const INLINE_HEADER = {
    '1-IND': /(\s*?)#/gm,
    '2-IND': /(\s*?)##/gm,
    '3-IND': /(\s*?)###/gm,
    '4-IND': /(\s*?)####/gm,
    '5-IND': /(\s*?)#####/gm,
    '6-IND': /(\s*?)######/gm,

    1: /^([^\S\r\n]*?)#(?!#.*)/gm,
    2: /^([^\S\r\n]*?)##(?!#.*)/gm,
    3: /^([^\S\r\n]*?)###(?!#.*)/gm,
    4: /^([^\S\r\n]*?)####(?!#.*)/gm,
    5: /^([^\S\r\n]*?)#####(?!#.*)/gm,
    6: /^([^\S\r\n]*?)######(?!#.*)/gm
}
export const ITALIC_REGEX = {
    BASE_UNDERLINE: /_(.+?)_/gs,
    UNDERLINE: /(?!<.*)_(.+?)_/s,

    BASE_ASTERISK: /\*(.+?)\*/gs,
    ASTERISK: /\*(.+?)\*/
}
// export const BOLD_ITALIC_REGEX = {
//     BASE_UNDERLINE: /___(.+)___/gm,
//     UNDERLINE: /(?!<.*)___(.+)___/,
//
//     BASE_ASTERISK: /\*\*\*(.+)\*\*\*/g,
//     ASTERISK: /\*\*\*(.+)\*\*\*/
// }
export const BOLD_REGEX = {
    BASE_UNDERLINE: /__(.+?)__/gs,
    UNDERLINE: /__(.+?)__/s,

    BASE_ASTERISK: /\*\*(.+?)\*\*/gm,
    ASTERISK: /\*\*(.+?)\*\*/m
}
export const STRIKETHROUGH = {
    BASE: /~(.+?)~/gm,
    NOT_GLOBAL: /~(.+?)~/m,
}
export const INLINE_CODE_REGEX={
    BASE: /`(.+?)`/g,
    NOT_GLOBAL: /`(.+?)`/,
}
export const RULE_REGEX = {
    // underline: /^_+$|^_$/gi,
    // base: /^-+$|^-$|^\*+$|^\*$|^_+$|^_$/gi,
    BASE: /^(-+|\*+|_+)$/mg,
    EMPTY: /(?!\S)/g,
    LINE_BEFORE: /(?!\S)([\r\n]|\n)^(-+|\*+|_+)(\s*)$/mg,
    LINE_AFTER: /(\S+)$([\r\n]|\n)(^-+|^\*+|^_+)([\r\n]|\n)(?!\S)/gm,
    LINE_ALONE: /(?!\S)([\r\n]|\n)(^-+|^\*+|^_+)([\r\n]|\n)(?!\S)/mg
}

export const TABLE_REGEX = {
    // allRows: /^\|([^\S\r\n]*?)(.*)([^\S\r\n]*?)\||([^\S\r\n]*?)\|([^\S\r\n]*?)(.*)([^\S\r\n]*?)\|/gi,
    CONTENT: /^([^\S\r\n]*?)\|([^\S\r\n]*?)(.*)([^\S\r\n]*?)\||([^\S\r\n]*?)\|([^\S\r\n]*?)(.*)([^\S\r\n]*?)\|/gi,
    DIVIDER: /^([^\S\r\n]*?)\|([^\S\r\n]*?)(:?)(-+)(:?)([^\S\r\n]*?)\|([^\S\r\n]*?)(:?)(-+)(:?)([^\S\r\n]*?)\|/gi
}
export const EXTERNAL_SOURCE_REGEX = {
    image: /!\[(.*)]\((.*)\)/i,
    link: /((?!!).*)\[(.*)]\((.*?)\)/i,

    linked_image: /\[!\[(.*)]\((.*)\)]\((.*)\)/i
}
export const CODE_BLOCK = {
    BASIC: /^```([^\S\r\n]*?)([a-zA-Z]*$)([\r\n]|\n)([\s\S]*?)```$/mg,
    NOT_GLOBAL: /^```([^\S\r\n]*?)([a-zA-Z]*$)([\r\n]|\n)([\s\S]*?)```$/m,
    TYPES: {
        javascript: /^```([^\S\r\n]*?)(javascript|jsx|js)([\r\n]|\n)([\s\S]*?)```$/m,
        json: /^```([^\S\r\n]*?)json([\r\n]|\n)([\s\S]*?)```$/m,
        html: /^```([^\S\r\n]*?)html([\r\n]|\n)([\s\S]*?)```$/m,
        console: /^```([^\S\r\n]*?)console\n([\s\S]*?)```$/m
    },
    REPLACED: /^<section class="(.+)">\n<pre>([\s\S]*?)<\/pre>\n<\/section>/gmi,
    WHITE_SPACE: /^(\s+)/gmi,
    KEYWORDS: [
        /^&nbsp;(\s*)import(\s*)/g,
        /(\s*)from(\s+)/g,
        /^&nbsp;(\s*)function(\s+)/g,
        /^&nbsp;(\s*)const(\s+)/g,
        /^&nbsp;(\s*)let(\s+)/g,
        /^&nbsp;(\s*)return(\s+)/g,
        /^&nbsp;(\s*)class(\s+)/g,

    ],
    DOM_KEYWORDS: [
        /(\s*)([a-zA-Z]+)\./g,
        /(\s+)React(\s+)/g,
        /(\s+)ReactDOM(\s+)/g
    ],
    STRING: /&quot;([\s\S]*?)&quot;/g,
    OBJECT: /{([\s\S]*?)}/
}
export const JSX_REGEX = {
    TAG: /&lt;(.+)&gt;/gim,
    SELF_CLOSING_TAG: /&lt;\/(.+)&gt;/gim,
    CLOSING_TAG: /&lt;(.+)\/&gt;/gim,
    STRING_ATTRIBUTE: /(\s*)([a-zA-Z]+)=&quot;([\s\S]*?)&quot;((\s)|&gt;)/igm,
    ATTRIBUTE: /(\s*)([a-zA-Z]+)={([\s\S]*?)}((\s+)|&gt;)/igm
}

export const HTML_REGEX = {
    SUMMARY_TAG: /<summary((([^\S\r\n]+)(.*?))|)>/g,
    TAG_ATTRS: /<([a-zA-Z]+)([^\S\r\n]?)style="(.*)">/g,
    NOT_GLOBAL_TAG_ATTRS: /<([a-zA-Z]+)([^\S\r\n]?)style="(.*)">/,
    TAG: /<([a-zA-Z]+)((([^\S\r\n]+)(.*?))|)>/g,
    // SELF_CLOSING_TAG: /&lt;\/(.+)&gt;/gim,
    CLOSING_TAG: /<\/([a-zA-Z]+)([^\S\r\n]*?)>/g,
    IMAGE_TAG: /<img((([^\S\r\n]+)(.*?))|)>/g,
    STRING_ATTRIBUTE: /(\s*)([a-zA-Z]+)=&quot;([\s\S]*?)&quot;((\s)|&gt;)/igm,
    ATTRIBUTE: /(\s*)([a-zA-Z]+)={([\s\S]*?)}((\s+)|&gt;)/igm
}


export const QUOTE_REGEX = {
    BASE: /^>(\s*)/gm
}