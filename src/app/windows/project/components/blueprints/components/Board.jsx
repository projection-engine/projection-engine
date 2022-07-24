import PropTypes from "prop-types"
import React from "react"
import Node from "./node/Node"
import styles from "../styles/Board.module.css"
import handleDropBoard from "../utils/handleDropBoard"

import handleBoardScroll from "../utils/handleBoardScroll"
import useBoard from "../hooks/useBoard"
import OnDragProvider from "../context/DragProvider"
import SelectBox from "../../../../components/select-box/SelectBox"
import Comment from "./node/Comment"
import useContextTarget from "../../../../components/context/hooks/useContextTarget"
import BOARD_SIZE from "../data/BOARD_SIZE"
import handleDropNode from "../utils/handleDropNode"
import LINK_WIDTH from "../data/LINK_WIDTH"
import {availableNodes} from "../templates/availableNodes"

const TRIGGERS = [
    "data-node",
    "data-board",
    "data-link",
    "data-group"
]
export default function Board(props) {
    const {hook} = props
    const {
        links,
        ref,
        handleLink,
        internalID,
        dragType, setDragType,
        setSelected,  boardOptions
    } = useBoard(hook)


    useContextTarget(
        internalID,
        boardOptions,
        TRIGGERS
    )
    return (
        <OnDragProvider.Provider value={{setDragType, dragType}}>
            <div className={styles.context}>
                <SelectBox
                    nodes={hook.nodes}
                    selected={hook.selected}
                    targetElementID={internalID}
                    setSelected={hook.setSelected}
                />
                <svg
                    id={internalID}
                    onDragOver={e => e.preventDefault()}
                    onContextMenu={e => e.preventDefault()}

                    data-board={"BOARD"}
                    style={{
                        transformOrigin: "center center",
                        height: BOARD_SIZE + "px",
                        width: BOARD_SIZE + "px",
                    }}

                    onDrop={event => {
                        event.preventDefault()
                        const nodes = handleDropBoard(event.dataTransfer.getData("text"), availableNodes)
                        if (nodes)
                            handleDropNode(nodes, event, ref, hook)

                    }}
                    ref={ref}
                    className={[styles.wrapper, styles.background].join(" ")}
                    onMouseDown={e => {
                        if (e.button === 2)
                            handleBoardScroll(ref.current.parentNode)
                        if (e.target === ref.current)
                            hook.setSelected([])

                    }}
                >
                    {hook.nodes.map(node => node.isComment ? (
                        <React.Fragment key={node.id}>
                            <Comment
                                setSelected={(i) => hook.setSelected([i])}
                                submitName={newName => {
                                    hook.setNodes(prev => {
                                        return prev.map(p => {
                                            if (p.id === node.id)
                                                p.name = newName

                                            return p
                                        })
                                    })
                                }}
                                onDragStart={() => hook.setChanged(true)}
                                selected={hook.selected}
                                node={node}
                            />
                        </React.Fragment>
                    ) : null)}
                    {links.map(l => (
                        <path
                            data-link={l.target + "-" + l.source}
                            fill={"none"}
                            stroke={"#fff"}
                            strokeWidth={LINK_WIDTH}
                            key={l.target + "-" + l.source}
                            id={l.target + "-" + l.source}
                        />
                    ))}
                    {hook.nodes.map(node => !node.isComment ? (
                        <React.Fragment key={node.id}>
                            <Node
                                links={links}
                                submitBundledVariable={(key, value) => {
                                    hook.setChanged(true)
                                    hook.setNodes(prev => {
                                        return prev.map(p => {
                                            if (p.id === node.id)
                                                p[key] = value
                                            return p
                                        })
                                    })
                                }}
                                setSelected={(i, multi) => {
                                    if (multi)
                                        setSelected(i)
                                    else
                                        hook.setSelected([i])
                                }}
                                selected={hook.selected}
                                node={node}
                                handleLink={handleLink}/>
                        </React.Fragment>
                    ) : null)}
                </svg>
            </div>
        </OnDragProvider.Provider>
    )
}
Board.propTypes = {
    hook: PropTypes.object
}