import React, {useContext, useState} from "react"
import Tree from "../../../components/tree/Tree"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import Search from "../../../components/search/Search"
import {Button, Icon} from "@f-ui/core"
import styles from "../../styles/Project.module.css"
import PropTypes from "prop-types"
import Header from "../../../components/view/components/Header"
import EntityProvider from "../../../components/tree/EntityProvider"
import Entity from "../../engine/basic/Entity"
import FolderComponent from "../../engine/components/FolderComponent"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import HierarchyProvider from "../../providers/HierarchyProvider"

function createFolder(dispatchEntities, dispatchChanges){
    const newEntity = new Entity()
    newEntity.name = "New folder"
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
    })
    dispatchChanges({
        type: HISTORY_ACTIONS.PUSHING_DATA, payload: [newEntity]
    })
}

export default function Hierarchy(props){
    const {worker, setSelected, lockedEntity, setLockedEntity, selected, entitiesChangeID} = useContext(HierarchyProvider)
    const [searchedEntity, setSearchedEntity] = useState("")

    return (
        <EntityProvider.Provider 
            value={{
                lockedEntity,
                setLockedEntity,
                selected,
                setSelected: (entity, ctrlKey) => {
                    if(ctrlKey ) {
                        if (!selected.includes(entity))
                            setSelected([...selected, entity])
                        else
                            setSelected(selected.filter(e => e !== entity))
                    }
                    else
                        setSelected([entity])
                }
            }}
        >
            <Header {...props} title={"Hierarchy"} icon={"account_tree"}>
                <Search
                    width={"100%"}
                    searchString={searchedEntity}
                    setSearchString={setSearchedEntity}
                />
                <Button className={styles.button} onClick={() => createFolder()}>
                    <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
                </Button>
            </Header>
            {props.hidden ? null : <Tree entitiesChangeID={entitiesChangeID}/>}
        </EntityProvider.Provider>
    )
}

Hierarchy.propTypes={
    orientation: PropTypes.string,
    hidden: PropTypes.bool,
    switchView: PropTypes.func
}