import styles from "../../styles/Node.module.css"
import PropTypes from "prop-types"
import {DATA_TYPES} from "../../../../engine/data/DATA_TYPES"
import React, {useContext, useMemo, useRef} from "react"
import OnDragProvider from "../../context/DragProvider"
import NodeProvider from "../../context/NodeProvider"

export default function Output(props) {
    const node = useContext(NodeProvider)
    const wrapperRef = useRef()
    const onDragContext = useContext(OnDragProvider)
    const link = useMemo(() => {
        return props.outputLinks.find(o => o.sourceKey === props.data.key)
    }, [props.outputLinks])

    return (
        <div
            data-link={link ? (link.target + "-" + link.source) : null}
            className={styles.attribute} ref={wrapperRef}
            data-dtype={"output"}
            data-disabled={`${props.data.disabled || props.data.type === DATA_TYPES.UNDEFINED && (props.inputLinks.length === 0 && node.inputs.length > 0)}`}
            style={{justifyContent: "flex-end"}}>
            <div
                className={styles.overflow}
                style={{color: props.data.disabled ? "#999" : props.data.color, fontWeight: "bold"}}
            >
                {props.data.label}
            </div>
            <div
                id={node.id + props.data.key}
                className={styles.connection}
                draggable={!(props.data.type === DATA_TYPES.UNDEFINED && (props.inputLinks.length === 0 && node.inputs.length > 0))}
                data-dtype={"output"}
                data-disabled={`${props.data.disabled || props.data.type === DATA_TYPES.UNDEFINED && (props.inputLinks.length === 0 && node.inputs.length > 0)}`}
                data-highlight={link ? "-" : undefined}
                onDragEnd={props.onDragEnd}
                onDrag={props.handleLinkDrag}
                onDragStart={e => {
                    if (!props.data.disabled) {
                        const nType = props.data.type === DATA_TYPES.UNDEFINED ? (props.inputLinks.length === 1 ? props.inputLinks[0]?.sourceType : getPredominant(props.inputLinks)) : undefined
                        const attribute = props.data.type === DATA_TYPES.UNDEFINED ? {
                            ...props.data,
                            type: nType
                        } : props.data
                        e.dataTransfer
                            .setData(
                                "text",
                                JSON.stringify({
                                    id: node.id,
                                    type: "output",
                                    attribute
                                })
                            )

                        onDragContext.setDragType(attribute.type)
                    } else
                        e.preventDefault()
                }}>
            </div>
        </div>
    )
}


Output.propTypes = {
    handleLinkDrag: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    data: PropTypes.shape({
        disabled: PropTypes.bool,
        key: PropTypes.string.isRequired,
        label: PropTypes.string,
        type: PropTypes.any,
        accept: PropTypes.array,
        color: PropTypes.string,
        showTitle: PropTypes.bool,
        bundled: PropTypes.bool,
        options: PropTypes.array
    }).isRequired,
    outputLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
    inputLinks: PropTypes.arrayOf(PropTypes.object).isRequired
}

function getPredominant([a, b]) {
    const aType = a.sourceType, bType = b.sourceType
    if (aType === bType)
        return aType
    if (aType === DATA_TYPES.FLOAT && bType.toString().includes("vec"))
        return bType
    return aType
}