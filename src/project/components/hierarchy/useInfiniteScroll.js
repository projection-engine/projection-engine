import {useEffect, useRef, useState} from "react"

const BRANCH_SIZE = 23, DELAY = 500
export default function useInfiniteScroll() {
    const ref = useRef()
    const [maxDepth, setMaxDepth] = useState(0)
    const [offset, setOffset] = useState(0)

    const handleWheel = (e) => {
        e.preventDefault()
        const current = parseInt(ref.current.getAttribute("data-offset")) - Math.sign(e.wheelDelta)
        if (current >= 0)
            setOffset(current)
    }

    useEffect(() => {
        let timeout
        const updateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const bBox = ref.current.getBoundingClientRect()
                const quantity = Math.ceil(bBox.height / BRANCH_SIZE)
                setMaxDepth(quantity)
            }, DELAY)
        }
        updateSize()
        const observer = new ResizeObserver(() => updateSize())
        observer.observe(ref.current)


        ref.current?.addEventListener("wheel", handleWheel, {passive: false})
        return () => {
            observer.disconnect()
            ref.current?.removeEventListener("wheel", handleWheel, {passive: false})
        }
    }, [])
    return [ref, offset, maxDepth]
}