import React, {useContext, useEffect, useState} from "react"
import TreeView from "../../../components/tree/TreeView"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import HierarchyProvider from "../../providers/EngineProvider"
import ViewWrapper from "../../../components/view/ViewWrapper"
import Search from "../../../components/search/Search"
import {Button, Icon} from "@f-ui/core"
import styles from "../../styles/Project.module.css"
import {createFolder} from "./utils/hiearchyUtils"
import useHierarchy from "../../hooks/useHierarchy"
import EngineProvider from "../../providers/EngineProvider"
import PropTypes from "prop-types"
import ViewHeader from "../../../components/view/ViewHeader"

const TRIGGERS = ["data-node", "data-self"]
const WORKER = new Worker(new URL("./hooks/hierarchyWorker.js", import.meta.url))

export default function Hierarchy(props){
    const  [engine, utils] = useContext(EngineProvider)
    const [searchedEntity, setSearchedEntity] = useState("")
    const [data, treeOptions] = useHierarchy(
        engine.setSelected,
        engine.dispatchEntities,
        engine.entities,
        engine.selected,
        engine.renderer,
        engine.dispatchChanges,
        WORKER,
        searchedEntity,
        utils
    )


    return (
        <>
            <ViewHeader {...props}  title={"Hierarchy"} icon={"account_tree"}>
                {!props.hidden ?
                    (
                        <div style={{display: "flex", gap: "2px"}}>
                            <Search
                                width={"100%"}
                                searchString={searchedEntity}
                                setSearchString={setSearchedEntity}
                            />
                            <Button className={styles.button} onClick={() => createFolder()}>
                                <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
                            </Button>
                        </div>
                    )
                    :
                    null
                }
            </ViewHeader>
            {props.hidden ?
                null :
                <TreeView
                    contextTriggers={TRIGGERS}
                    onMultiSelect={(items) => engine.setSelected(items)}
                    multiSelect={true}
                    searchable={true}
                    draggable={true}
                    options={treeOptions}
                    onDrop={(event, target) => {
                        event.preventDefault()
                        try {
                            const EE = JSON.parse(event.dataTransfer.getData("text"))
                            EE.forEach(entity => {
                                const current = engine.entities.find(f => f.id === target)
                                const dropTarget = engine.entities.find(f => f.id === entity)

                                if (!current && dropTarget) {
                                    if (dropTarget.components[COMPONENTS.TRANSFORM])
                                        dropTarget.components[COMPONENTS.TRANSFORM].changed = true
                                    engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.UPDATE,
                                        payload: {
                                            entityID: dropTarget.id, key: "linkedTo", data: undefined
                                        }
                                    })
                                } else if (dropTarget && dropTarget !== current && current.linkedTo !== dropTarget.id) {
                                    if (dropTarget.components[COMPONENTS.TRANSFORM])
                                        dropTarget.components[COMPONENTS.TRANSFORM].changed = true

                                    engine.dispatchEntities({
                                        type: ENTITY_ACTIONS.UPDATE,
                                        payload: {
                                            entityID: dropTarget.id,
                                            key: "linkedTo",
                                            data: current.id
                                        }
                                    })
                                }
                            })
                        } catch (e) {
                            alert.pushAlert("Error linking entities", "error")
                        }
                    }}
                    onDragStart={e => {
                        if (e.ctrlKey)
                            e.dataTransfer.setData("text", JSON.stringify(engine.selected.includes(e.currentTarget.id) ? engine.selected : [...engine.selected, e.currentTarget.id]))
                        else e.dataTransfer.setData("text", JSON.stringify([e.currentTarget.id]))
                    }}

                    ids={engine.entities}
                    selected={engine.selected}
                    nodes={data}
                    handleRename={(treeNode, newName) => engine.dispatchEntities({
                        type: ENTITY_ACTIONS.UPDATE,
                        payload: {entityID: treeNode.id, key: "name", data: newName}
                    })}
                />
            }
        </>
    )
}

Hierarchy.propTypes={
    hidden: PropTypes.bool,
    switchView: PropTypes.func
}