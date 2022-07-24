import {useEffect, useMemo, useRef} from "react"
import dragNode from "../utils/dragNode"

export default function useComment({
    setSelected,
    node,
    selected,
    onDragStart
}) {
    const isSelected = useMemo(() => {
        return selected.indexOf(node.id) > -1
    }, [selected])
    const ref = useRef()
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
            if(isFirst)
                onDragStart()
            dragNode(event, ref.current, ref.current.parentNode)
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleDragStart)
        return () => document.removeEventListener("mousedown", handleDragStart)
    }, [node,  selected, isSelected])

    return {
        selected: isSelected,
        ref,
    }
}