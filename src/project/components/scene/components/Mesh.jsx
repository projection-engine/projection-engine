import PropTypes from "prop-types"
import React, {useEffect, useState} from "react"
import {Checkbox} from "@f-ui/core"
import handleDrop from "../../../utils/importer/import"
import Selector from "../../../../components/selector/Selector"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"
import MESH_TYPES from "../../../engine/templates/MESH_TYPES"


export default function Mesh(props) {
    const [meshType, setMeshType] = useState(props.selected.meshType)
    const [currentMesh, setCurrentMesh] = useState()
    useEffect(() => {
        setCurrentMesh(props.quickAccess.meshes.find(mesh => mesh.registryID === props.selected.meshID))
    }, [props.quickAccess.meshes, props.selected])

    return (
        <>
            <AccordionTemplate title={"Mesh instance"}>
                <Selector
                    selected={currentMesh}
                    type={"mesh"}
                    handleChange={m => {
                        let data = props.engine.meshes.find(mesh => mesh.id === m.registryID)
                        if (!data)
                            handleDrop(m.registryID, props.quickAccess.fileSystem, props.engine, props.load, true)
                                .then(() => {
                                    props.submit(m.registryID)
                                })
                        else {

                            props.submit(m.registryID)
                        }
                    }}/>
            </AccordionTemplate>
            <Checkbox
                noMargin={true}
                label={"Static mesh"}
                width={"100%"}
                height={"25px"}

                checked={meshType === MESH_TYPES.STATIC} handleCheck={() => {
                    const c = meshType === MESH_TYPES.STATIC ? MESH_TYPES.DYNAMIC : MESH_TYPES.STATIC
                    setMeshType(c)
                    props.submit(c, true)
                }}/>
        </>
    )
}

Mesh.propTypes = {
    quickAccess: PropTypes.object,

    engine: PropTypes.object,
    load: PropTypes.object,

    submit: PropTypes.func,
    selected: PropTypes.object
}