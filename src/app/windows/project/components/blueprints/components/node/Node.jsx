import PropTypes from "prop-types"
import styles from "../../styles/Node.module.css"
import React from "react"
import useNode from "../../hooks/useNode"
import LINK_WIDTH from "../../data/LINK_WIDTH"
import Input from "./Input"
import Output from "./Output"
import NodeProvider from "../../context/NodeProvider"

export default function Node(props) {
    const {
        nodeInfo, width,
        ref, handleLinkDrag,
        height, pathRef,
        outputLinks,
        inputLinks,
        selected
    } = useNode(
        props.selected,
        props.setSelected,
        props.node,
        props.links
    )


    return (
        <NodeProvider.Provider value={props.node}>
            <g>
                <g
                    ref={ref}
                    transform={`translate(${props.node.x} ${props.node.y})`}
                >
                    <foreignObject
                        data-node={props.node.canBeDeleted ? props.node.id : undefined}
                        id={props.node.id}
                        onMouseDown={(e) => props.setSelected(props.node.id, e.ctrlKey)}
                        className={styles.wrapper}
                        style={{
                            width: width,
                            height: height + "px",
                            outline: selected ? "yellow 2px solid" : undefined
                        }}
                    >
                        <div
                            className={styles.label}
                            style={{borderColor: nodeInfo.COLOR}}
                            id={props.node.id + "-node"}
                            title={nodeInfo.LABEL}
                        >
                            {props.node.name}
                        </div>
                        <div className={styles.content}>
                            <div className={styles.column} style={{maxWidth: props.node.output.length > 0  ? `calc(${width} - 75px)` : undefined}}>
                                {props.node.inputs.map((a, i) => (
                                    <React.Fragment key={a.key + "-input-" + i}>
                                        <Input
                                            handleLink={props.handleLink}
                                            attribute={a}
                                            inputLinks={inputLinks}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                            {props.node.output.length > 0 ?
                                <div
                                    className={styles.column}
                                    style={{justifyContent: "flex-end", width: "50%"}}
                                >
                                    {props.node.output.map((a, i) => (
                                        <React.Fragment key={a.key + "-output-" + i}>
                                            <Output
                                                onDragEnd={() => pathRef.current.setAttribute("d", undefined)}
                                                data={a}
                                                handleLinkDrag={handleLinkDrag}
                                                inputLinks={inputLinks}
                                                outputLinks={outputLinks}
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                                :
                                null
                            }
                        </div>
                    </foreignObject>
                </g>
                <path
                    ref={pathRef}
                    fill={"none"}
                    stroke={"var(--pj-accent-color)"}
                    strokeWidth={LINK_WIDTH}
                    strokeDasharray={"3,3"}
                />
            </g>
        </NodeProvider.Provider>
    )
}
Node.propTypes = {
    links: PropTypes.array,
    node: PropTypes.object.isRequired,
    handleLink: PropTypes.func,
    selected: PropTypes.array,
    setSelected: PropTypes.func
}