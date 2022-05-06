import React from 'react'
import {newFindLists} from "./finders/findList";
import {newFindQuotes} from "./finders/findQuote";
import {findTypeface} from "./finders/findTypeface";
import {findInlineHeader} from "./finders/findHeader";
import {newFindRules} from "./finders/findRule";
import {newFindTables} from "./finders/findTable";
import parseExternalSource, {findLink} from "./finders/findExternalSource";
import {newFindCode} from "./finders/findCode";
import removeParts from "./removeParts";
import parseCode from "./parsers/parseCode";
import parseHeader from "./parsers/parseHeader";
import parseTable from "./parsers/parseTable";
import parseList from "./parsers/parseList";
import parseQuote from "./parsers/parseQuote";
import parseRule from "./parsers/parseRule";
import findParagraph from "./finders/findParagraph";
import {findCheckboxes} from "./finders/findCheckboxes";


export default function markdownParser(data, id) {
    let string = data,  parsed = [], matches = [], metadata
    try {

        const headers = findInlineHeader(data, id)
        string = removeParts(headers, string, id, 'header')

        const codes = newFindCode(data)
        string = removeParts(codes, string, id, 'code')

        string = findTypeface(string)
        const rules = newFindRules(data)
        string = removeParts(rules, string, id, 'rule')

        const tables = newFindTables(data)
        string = removeParts(tables, string, id, 'table')

        const lists = newFindLists(data)
        string = removeParts(lists, string, id, 'list')

        const quotes = newFindQuotes(data)
        string = removeParts(quotes, string, id, 'quote')

        string.split('\n').forEach((line, index) => {

            if(line.trim().length > 0)
                if(!line.includes(id))
                    parsed.push({
                        starts: index,
                        ends: index + 1,
                        content: line,
                        type: line.includes(`&custom-empty;`) ? 'empty' : 'line'
                    })

                else{
                    const type = line.split('-')[1]
                    const index = parseInt(line.split('-')[2].replace('}', ''))
                    if(!isNaN(index))
                        switch (type){
                            case 'code':{
                                parsed.push({...codes[index], type: 'code', index: index})
                                break
                            }
                            case 'list':{
                                parsed.push({...lists[index], type: 'list'})
                                break
                            }
                            case 'table':{
                                parsed.push({...tables[index], type: 'table'})
                                break
                            }
                            case 'rule':{
                                parsed.push({...rules[index], type: 'rule'})
                                break
                            }
                            case 'header':{
                                parsed.push({...headers[index], type: 'header'})
                                break
                            }
                            case 'quote':{
                                parsed.push({...quotes[index], type: 'quote'})
                                break
                            }

                            default:
                                break
                        }
                }
        })

        metadata = [...parsed]

        parsed=  findParagraph(parsed)

        parsed = parsed.filter(p => p.type !== 'empty').map(p => {
            let parsedLine
            switch (p.type){
                case 'code':{
                    const [d, bID] = parseCode(p, p.index, id)
                    parsedLine = d

                    matches.push(bID)
                    break
                }
                case 'list':{
                    parsedLine = findTypeface(p.content)
                    parsedLine = parseList({...p, content: parsedLine})

                    parsedLine = parseExternalSource(parsedLine)

                    break
                }
                case 'table':{
                    parsedLine = parseTable(p)
                    break
                }
                case 'header':{
                    parsedLine = findTypeface(p.content)
                    parsedLine = parseHeader({...p, content: parsedLine})
                    parsedLine = findLink(parsedLine)

                    break
                }
                case 'rule':{
                    parsedLine = parseRule(p)
                    break
                }
                case 'quote':{
                    parsedLine = parseQuote(p)
                    break
                }

                case 'line': {
                    parsedLine = p.content
                    parsedLine = parseExternalSource(parsedLine)

                    break
                }
                default:
                    break

            }
            return parsedLine
        })
        parsed = findCheckboxes(parsed)
    } catch (e) {
        console.log(e)
    }

    return [parsed.join('\n'), matches, metadata]
}
