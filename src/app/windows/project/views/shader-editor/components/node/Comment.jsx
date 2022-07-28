import PropTypes from "prop-types"
import styles from "../../styles/Comment.module.css"
import React, {useMemo, useState} from "react"
import useComment from "../../hooks/useComment"
import KEYS from "../../../../engine/data/KEYS"

export default function Comment(props) {
    const [onEdit, setOnEdit] = useState(false)
    const [nameCache, setNameCache] = useState(props.node.name)
    const {ref, selected} = useComment(props)
    const rgb = useMemo(() => props.node.color.slice(0, 3).join(", "), [props.node])
    return (
        <g
            ref={ref}
            transform={`translate(${props.node.x} ${props.node.y})`}
        >
            <foreignObject
                onContextMenu={() => props.setSelected(props.node.id)}
                data-group={props.node.id}
                id={props.node.id}

                className={styles.wrapper}
                data-seleted={`${selected}`}
                style={{
                    background: props.node.color ? `rgba(${rgb}, .5)` : "rgba(150, 150, 150, .5)",
                    width: props.node.width + "px",
                    height: props.node.height + "px"
                }}>
                {onEdit ? <input
                    style={{background: `rgb(${rgb})`}}
                    value={nameCache}
                    onChange={v => setNameCache(v.target.value)}
                    className={styles.input}
                    onBlur={() => {
                        props.submitName(nameCache)
                        setOnEdit(false)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === KEYS.Enter) {
                            props.submitName(nameCache)
                            setOnEdit(false)
                        }
                    }}
                /> : <div
                    className={styles.header}
                    style={{background: `rgb(${rgb})`}}
                    id={props.node.id + "-node"}
                    onDoubleClick={() => setOnEdit(true)}
                >
                    {props.node.name}
                </div>}
            </foreignObject>
        </g>
    )
}
Comment.propTypes = {
    submitName: PropTypes.func,
    node: PropTypes.object.isRequired,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
}