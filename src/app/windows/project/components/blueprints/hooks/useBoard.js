import {useEffect, useId, useMemo, useRef, useState} from "react"
import getBezierCurve from "../utils/bezierCurve"
import BOARD_SIZE from "../data/BOARD_SIZE"
import LINK_WIDTH from "../data/LINK_WIDTH"
import getBoardOptions from "../utils/getBoardOptions"
import handleDropNode from "../utils/handleDropNode"

export default function useBoard(hook) {
    const ref = useRef()
    const mappedLinks = useRef([])
    const internalID = useId()
    const [dragType, setDragType] = useState()

    const links = useMemo(() => {
        return hook.links.map(l => {
            return {
                target: l.target.id + l.target.attribute.key,
                source: l.source.id + l.source.attribute.key,
                targetKey: l.target.attribute.key,
                sourceKey: l.source.attribute.key,

                sourceType: l.source.attribute.type,
                targetType: l.target.attribute.type
            }
        })
    }, [hook.links])

    const updateLinks = () => {
        const scale = window.blueprints.scale
        try {
            let parentBBox = ref.current?.getBoundingClientRect()
            const bounding = {
                x: ref.current?.scrollLeft - parentBBox.left,
                y: ref.current?.scrollTop - parentBBox.top
            }

            for (let i = 0; i < mappedLinks.current.length; i++) {
                const {
                    target,
                    source,
                    linkPath
                } = mappedLinks.current[i]

                if (target && source && linkPath) {
                    const sourceBBox = source.getBoundingClientRect(),
                        targetBBox = target.getBoundingClientRect()
                    const OFFSET = 7.5
                    const curve = getBezierCurve(
                        {
                            x: (sourceBBox.x + bounding.x + OFFSET) / scale,
                            y: (sourceBBox.y + bounding.y + OFFSET + LINK_WIDTH * 2) / scale
                        },
                        {
                            x1: (targetBBox.x + bounding.x + OFFSET) / scale,
                            y1: (targetBBox.y + bounding.y + OFFSET + LINK_WIDTH * 2) / scale
                        })

                    if (linkPath.getAttribute("d") !== curve)
                        linkPath.setAttribute("d", curve)
                }
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleWheel = (e) => {
        e.preventDefault()
        let s = window.blueprints.scale
        if (e.wheelDelta > 0 && s < 3)
            s += s * .1
        else if (e.wheelDelta < 0 && s >= .5)
            s -= s * .1

        ref.current.style.transform = "scale(" + s + ")"
        window.blueprints.scale = s
        updateLinks()
    }

    const handleLink = (src, target, isExecution) => {
        hook.setLinks(prev => {
            let c = [...prev]
            const existing = c.filter(c => (c.target.id === target.id && c.target.attribute.key === target.attribute.key) || (isExecution && c.source.id === src.id && c.source.attribute.key === src.attribute.key))
            c = c.filter(cc => !existing.find(e => e === cc))
            if (!target.attribute.componentRequired || src.attribute.components.includes(target.attribute.componentRequired)) {
                hook.setChanged(true)
                hook.setImpactingChange(true)
                c.push({
                    source: src,
                    target: target
                })
            } else
                alert.pushAlert("Missing component on entity", "error")
            return c
        })
    }
    const boardOptions = useMemo(() => {
        return getBoardOptions(
            (nodes, event) => handleDropNode(nodes, event, ref, hook),
            hook,
            links,
            (t) => {
                hook.setChanged(true)
                hook.setImpactingChange(true)
                hook.setLinks(prev => {
                    return prev.filter(l => {
                        const test = {
                            t: l.target.id + l.target.attribute.key,
                            s: l.source.id + l.source.attribute.key,
                        }
                        return (test.t + "-" + test.s) !== t
                    })
                })
            }
        )
    }, [hook.nodes, links])


    const setSelected = (i) => {
        if (i && !hook.selected.find(e => e === i))
            hook.setSelected(prev => {
                return [...prev, i]
            })
        else if (hook.selected.find(e => e === i))
            hook.setSelected(prev => {
                const copy = [...prev]
                copy.splice(copy.indexOf(i), 1)
                return copy
            })
    }
    useEffect(() => {
        if (ref.current && ref.current.parentNode) {
            ref.current.parentNode.scrollTop = BOARD_SIZE / 2
            ref.current.parentNode.scrollLeft = BOARD_SIZE / 2
            ref.current.parentNode.addEventListener("wheel", handleWheel, {passive: false})
        }
        return () => {
            if (ref.current && ref.current.parentNode)
                ref.current.parentNode.removeEventListener("wheel", handleWheel, {passive: false})
        }
    }, [])

    useEffect(() => {
        if (mappedLinks.current.length !== links.length)
            mappedLinks.current = links.map(l => {
                const linkPath = document.getElementById(l.target + "-" + l.source)
                return {
                    target: document.getElementById(l.target),
                    source: document.getElementById(l.source),
                    linkPath
                }
            })
        updateLinks()
        const mutationObserver = new MutationObserver(updateLinks)
        mutationObserver.observe(ref.current, {subtree: true, childList: true, attributes: true})
        return () => mutationObserver.disconnect()
    }, [links])

    return {
        setSelected, boardOptions,
        dragType, setDragType,
        internalID,
        links,
        ref,
        handleLink
    }
}