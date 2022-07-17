import React, {useState} from "react"
import Tree from "./components/Tree"
import COMPONENTS from "../../engine/data/COMPONENTS"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import Search from "../../../components/search/Search"
import {Button, Icon} from "@f-ui/core"
import styles from "../../styles/Project.module.css"
import PropTypes from "prop-types"
import Header from "../../../components/view/components/Header"
import Entity from "../../engine/basic/Entity"
import FolderComponent from "../../engine/components/FolderComponent"
import useLocalization from "../../../global/useLocalization"

function createFolder(dispatchEntities){
    const newEntity = new Entity()
    newEntity.name = window.localization.translate("PROJECT", "HIERARCHY", "NEW_FOLDER")
    newEntity.components[COMPONENTS.FOLDER] = new FolderComponent()
    dispatchEntities({
        type: ENTITY_ACTIONS.ADD, payload: newEntity
    })
}

export default function Hierarchy(props){
    const [searchedEntity, setSearchedEntity] = useState("")
    const translate = useLocalization("PROJECT", "HIERARCHY")

    return (
        <>
            <Header {...props} title={translate("TITLE")} icon={"account_tree"}>
                <Search
                    width={"100%"}
                    searchString={searchedEntity}
                    setSearchString={setSearchedEntity}
                />
                <Button className={styles.button} onClick={() => createFolder()}>
                    <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
                </Button>
            </Header>
            {props.hidden ? null : <Tree/>}
        </>
    )
}

Hierarchy.propTypes={
    orientation: PropTypes.string,
    hidden: PropTypes.bool,
    switchView: PropTypes.func
}