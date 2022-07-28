import styles from "../../styles/Node.module.css"
import PropTypes from "prop-types"
import {DATA_TYPES} from "../../../../engine/data/DATA_TYPES"
import React, {useContext, useMemo, useRef} from "react"
import OnDragProvider from "../../context/DragProvider"
import NodeProvider from "../../context/NodeProvider"
import linkNodes from "../../utils/linkNodes"
import getNodeInput from "../../utils/getNodeInput"
import UpdateNodeProvider from "../../context/UpdateNodeProvider"

export default function Input(props) {
    const {handleLink, inputLinks, attribute} = props
    const {submitNodeVariable} = useContext(UpdateNodeProvider)
    const node = useContext(NodeProvider)
    const onDragContext = useContext(OnDragProvider)

    const wrapperRef = useRef()
    const link = useMemo(
        () => attribute.accept ? inputLinks.find(o => o.targetKey === attribute.key) : undefined,
        [inputLinks]
    )


    return (
        <div
            data-link={link ? (link.target + "-" + link.source) : null}
            className={styles.attribute} ref={wrapperRef}
            data-dtype={"input"}
            data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
            style={{transform: attribute.accept ? "translateX(var(--direction))" : undefined}}
        >

            {attribute.accept ? (
                <div
                    id={node.id + attribute.key}
                    className={styles.connection}
                    data-dtype={"input"}
                    data-disabled={`${attribute.disabled || attribute.type === DATA_TYPES.UNDEFINED && (inputLinks.length === 0 && node.inputs.length > 0)}`}
                    data-highlight={link ? "-" : undefined}
                    onDrop={e => {
                        e.preventDefault()
                        onDragContext.setDragType(undefined)
                        if (!attribute.disabled)
                            linkNodes(e, attribute, node, handleLink)
                    }}
                />
            ) : null}
            {link ? attribute.label : getNodeInput(attribute, node, (...attrData) => submitNodeVariable(...attrData, node), true)}
        </div>
    )
}


Input.propTypes = {
    handleLink: PropTypes.func,
    attribute: PropTypes.object.isRequired,
    inputLinks: PropTypes.arrayOf(PropTypes.object).isRequired
}
