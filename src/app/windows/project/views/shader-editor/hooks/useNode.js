import {useEffect, useMemo, useRef, useState} from "react"
import getBezierCurve from "../utils/bezierCurve"
import NODE_TYPES from "../data/NODE_TYPES"
import NODE_INFO from "../data/NODE_INFO"
import dragNode from "../utils/dragNode"
import LINK_WIDTH from "../data/LINK_WIDTH"

export default function useNode(
    selected,
    setSelected,
    node,
    links
) {

    const isSelected = useMemo(() => selected.indexOf(node.id) > -1, [selected])
    const ref = useRef()
    const pathRef = useRef()
    const [height, setHeight] = useState()
    const outputLinks = useMemo(
        () => links.filter(l => l.source.includes(node.id)),
        [links]
    )
    const inputLinks = useMemo(
        () => links.filter(l => l.target.includes(node.id)),
        [links]
    )
    const nodeInfo = useMemo(() => {
        let key = (Object.entries(NODE_TYPES).find(([, value]) => value === node.type))
        if (key)
            return key[0]
        return NODE_INFO[key] ? NODE_INFO[key] : {}
    }, [])

    const handleLinkDrag = (event) => {
        const scale = window.blueprints.scale
        const parent = ref.current?.parentNode.parentNode
        const bBox = event.currentTarget.getBoundingClientRect()
        let parentBBox = parent.getBoundingClientRect()
        const bounding = {
            x: parent.scrollLeft - parentBBox.left,
            y: parent.scrollTop - parentBBox.top
        }

        const curve = getBezierCurve(
            {
                x: (bBox.x + bounding.x + 7.5) / scale,
                y: (bBox.y + bounding.y + 7.5 + LINK_WIDTH * 2) / scale
            },
            {
                x1: (event.clientX + bounding.x + 7.5) / scale,
                y1: (event.clientY + bounding.y + 7.5 + LINK_WIDTH * 2) / scale
            })

        pathRef.current?.setAttribute("d", curve)
    }

    const handleDragStart = (event) => {
        let isFirst, alreadyFound = false
        document.elementsFromPoint(event.clientX, event.clientY)
            .forEach(e => {
                if (e.id?.includes("-node") && !alreadyFound && e.id === (node.id + "-node"))
                    isFirst = true
                else if (e.id?.includes("-node") && !alreadyFound)
                    alreadyFound = true
            })

        if (event.button === 0 && isFirst && !isSelected)
            setSelected(node.id, event.ctrlKey)
        if (event.button === 0 && ((isSelected && event.ctrlKey) || isFirst)) {
            dragNode(event, ref.current, ref.current.parentNode.parentNode)
        }
    }

    useEffect(() => {
        if(!height){
            const h = ref.current.firstChild.scrollHeight + 4
            setHeight(h >= 35 ? h : 55)
        }
        document.addEventListener("mousedown", handleDragStart)
        return () => document.removeEventListener("mousedown", handleDragStart)
    }, [node, selected, isSelected])


    const width = useMemo(() => {
        switch (node.size) {
        case 0:
            return "225px"
        case 1:
            return "150px"
        default:
            return "135px"
        }
    }, [])

    return {
        nodeInfo, width,
        selected: isSelected,
        outputLinks,
        inputLinks,
        ref,
        handleLinkDrag,
        height,
        pathRef
    }
}