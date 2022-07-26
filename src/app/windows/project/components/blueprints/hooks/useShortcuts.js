import {useMemo, useState} from "react"
import bindShortcuts from "../../shortcuts/hooks/bindShortcuts"
import KEYS from "../../../engine/data/KEYS"
import addComment from "../utils/addComment"
import cloneClass from "../../../engine/utils/cloneClass"
import {v4 as uuidv4} from "uuid"


export default function useShortcuts(hook,  save, internalID) {
    const [toCopy, setToCopy] = useState([])
    const actions = useMemo(() => {
        return [

            {
                label: "Select multiple",
                require: [KEYS.ControlLeft, KEYS.Mouse0]
            },
            {
                label: "Select all",
                require: [KEYS.KeyA],
                callback: () => hook.setSelected(hook.nodes.map(e => e.id))
            },
            {
                label: "Invert selection",
                require: [KEYS.ControlLeft, KEYS.KeyI],
                callback: () => {
                    const newArr = []
                    const notValid = {}
                    for(let i in hook.selected){
                        notValid[ hook.selected[i]] = true
                    }
                    for(let i in  hook.nodes){
                        const id = hook.nodes[i].id
                        if(!notValid[id])
                            newArr.push(id)
                    }
                    hook.setSelected(newArr)
                }
            },
            {
                label: "Move multiple",
                disabled: hook.selected.length === 0,
                require: [KEYS.ControlLeft, KEYS.Mouse0]
            },
            {
                label: "Comment",
                disabled: hook.selected.length === 0,
                require: [KEYS.KeyG],
                callback: () => {
                    if (hook.selected.length > 0)
                        addComment(hook)
                }
            },
            {
                label: "Save",
                disabled: !hook.changed,
                require: [KEYS.ControlLeft, KEYS.KeyS],
                callback: save
            },
            {
                label: "Copy",
                disabled: hook.selected.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyC],
                callback: () => {
                    setToCopy(hook.selected)
                    if (hook.selected.length > 0)
                        alert.pushAlert("Copied", "success",)
                }
            },
            {
                label: "Delete",
                disabled: hook.selected.length === 0,
                require: [KEYS.Delete],
                callback: () => {
                    const clone = [...hook.selected]
                    const newNodes= hook.nodes.filter(currentNode => !clone.find(e => e === currentNode.id)),
                        newLinks = hook.links.filter(currentLink => !clone.find(e => e === currentLink.target.id || e === currentLink.source.id))
                    hook.setSelected([])
                    hook.setLinks(newLinks)
                    hook.setNodes(newNodes)
                }
            },
            {
                label: "Paste",
                disabled: toCopy.length === 0,
                require: [KEYS.ControlLeft, KEYS.KeyV],
                callback: () => {
                    toCopy.forEach(toC => {
                        const toCopyNode = hook.nodes.find(n => n.id === toC)
                        if (toCopyNode) {
                            const nodeEl = document.getElementById(toC).parentNode
                            const transformation = nodeEl
                                .getAttribute("transform")
                                .replace("translate(", "")
                                .replace(")", "")
                                .split(" ")

                            const clone = cloneClass(toCopyNode)
                            clone.id = uuidv4()

                            clone.x = parseFloat(transformation[0]) + 5
                            clone.y = parseFloat(transformation[1]) + 5

                            hook.setNodes(prev => {
                                return [...prev, clone]
                            })
                        }
                    })
                }
            }
        ]
    }, [hook.nodes, hook.links, toCopy, hook.selected, hook.changed])
    bindShortcuts({
        focusTargetLabel:  "Shader Editor",
        focusTargetIcon:  "texture",
        focusTarget: internalID,
        actions
    })

}