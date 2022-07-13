import styles from "../styles/Branch.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {Icon} from "@f-ui/core"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import Packager from "../../../engine/Packager"

const LEFT_BUTTON = 0
export default function Branch(props) {
    const {depth, node, open, setOpen, selected, setSelected, lockedEntity, setLockedEntity} = props

    const ref = useRef()
    const [active, setActive] = useState(true)
    const nodeRef = useMemo(() => {
        if (node)
            return window.renderer.entitiesMap.get(node.id)
        return undefined
    }, [node])

    useEffect(() => {
        if (nodeRef) {
            setActive(nodeRef.active)
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === nodeRef.id

            ref.current.setAttribute("data-selected", is ? "-" : "")
        }
    }, [selected, nodeRef])

    const icon = useMemo(() => {
        if (nodeRef) {
            if (nodeRef.components[COMPONENTS.FOLDER])
                return "inventory_2"
            if (nodeRef.components[COMPONENTS.POINT_LIGHT])
                return "lightbulb"
            if (nodeRef.components[COMPONENTS.DIRECTIONAL_LIGHT])
                return "light_mode"
            if (nodeRef.components[COMPONENTS.PROBE])
                return "lens_blur"
            return "category"
        }
    }, [nodeRef])

    if (!nodeRef)
        return null
    return (
        <div
            data-node={nodeRef.id}
            id={nodeRef.id}
            ref={ref}
            className={styles.wrapper}
            data-open={open[nodeRef.id] ? "-" : ""}
            data-selected={""}
            data-parentopen={""}
            style={{paddingLeft: depth * 16 + "px"}}
            onMouseDown={e => {
                console.log(e.button)
                if (e.button === LEFT_BUTTON && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                    setSelected(nodeRef.id, e.ctrlKey)
            }}
            onDragOver={e => {
                e.preventDefault()
                ref.current.classList.add(styles.draggedOver)
            }}
            onDragLeave={e => {
                e.preventDefault()
                ref.current.classList.remove(styles.draggedOver)
            }}
            onDrop={e => {
                e.preventDefault()
                ref.current.classList.remove(styles.draggedOver)
                // handleDropFolder(e.dataTransfer.getData("text"), b.id, props.hook)
            }}
        >
            <div className={styles.summary}>
                {nodeRef.children.length > 0 ? (
                    <button
                        data-open={open[nodeRef.id] ? "-" : ""}
                        className={styles.buttonSmall}
                        onClick={() => {
                            if (!open[nodeRef.id])
                                setOpen({...open, [nodeRef.id]: true})
                            else
                                setOpen({...open, [nodeRef.id]: false})
                        }}
                    >
                        <Icon>arrow_drop_down</Icon>
                    </button>
                ) : <div style={{width: "25px"}}/>}
                <div className={styles.info}>
                    <button
                        data-locked={lockedEntity === nodeRef.id ? "-" : ""}
                        className={styles.buttonIcon}
                        onClick={() => setLockedEntity(nodeRef.id)}
                    >
                        <Icon styles={{fontSize: icon === "lens_blur" ? "1.35rem" : "1rem"}}>{icon}</Icon>
                    </button>
                    <div
                        className={styles.label}
                        draggable={true}
                    >
                        {nodeRef.name}
                    </div>
                </div>
                <button
                    className={styles.buttonSmall}
                    onClick={() => {
                        window.renderer.entitiesMap.get(nodeRef.id).active = !active
                        Packager.lights()
                        if(!active)
                            window.renderer.activeEntitiesSize--
                        else
                            window.renderer.activeEntitiesSize++
                        setActive(!active)
                    }}>
                    <Icon styles={{fontSize: ".9rem"}}>
                        {active ? "visibility" : "visibility_off"}
                    </Icon>
                </button>
            </div>
            <div className={styles.content}>
                {nodeRef.components[COMPONENTS.MESH] ? (
                    <>
                        <Icon>view_in_ar</Icon>
						Mesh
                    </>
                ) : null}
            </div>
        </div>
    )
}

Branch.propTypes = {
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    lockedEntity: PropTypes.string,
    setLockedEntity: PropTypes.func,

    open: PropTypes.object,
    setOpen: PropTypes.func,
    depth: PropTypes.number,
    node: PropTypes.object,
}