import React, {useEffect, useMemo, useRef, useState} from 'react'

import PropTypes from "prop-types";
import styles from '../styles/Markdown.module.css'
import Navigation from "./Navigation";

export default function Markdown(props) {
    const headers = useMemo(() => {

        return props.hook.metadata.filter(e => e.type === 'header')
    }, [props.hook])
    const ref = useRef()


    const intersectionObs = useRef()
    const [onHeader, setOnHeader] = useState(0)

    const handleIntersection = (event) => {
        const inter = event.filter(e => e.isIntersecting)
        if (inter && inter.length > 0)
            setOnHeader(inter[0].target.id)
    }

    useEffect(() => {
        intersectionObs.current = new IntersectionObserver(handleIntersection, {
            root: ref.current,
            rootMargin: "0px 0px -50% 0px"
        })
        headers.forEach((e) => {
            const element = document.getElementById(e.id)
            if(element)
                intersectionObs.current?.observe(element)
        })
        return () => {
            headers.forEach((e) => {
                const element = document.getElementById(e.id)
                if (element !== null)
                    intersectionObs.current?.unobserve(element)
            })
        }
    }, [headers])

    return (
        <div className={styles.wrapper} ref={ref}>
            <article className={styles.article} dangerouslySetInnerHTML={{__html: props.hook.data}}/>

            <Navigation
                onHeader={onHeader}
                headers={headers}
                setOnHeader={setOnHeader}
                scrollTo={position => {
                    ref.current.scroll(0, position - ref.current.offsetTop)
                }}
            />
        </div>
    )
}

Markdown.propTypes = {
    hook: PropTypes.object.isRequired
}
