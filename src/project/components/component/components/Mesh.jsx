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
            <Selector
                selected={currentMesh}
                type={"mesh"}
                handleChange={(src) => {
                    let data = props.engine.meshes.find(mesh => mesh.id === src.registryID)
                    if (!data)
                        handleDrop(src.registryID,   props.engine,  true)
                            .then(() => {
                                props.submit(src.registryID)
                            })
                    else {

                        props.submit(src.registryID)
                    }
                }}
            />
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

    submit: PropTypes.func,
    selected: PropTypes.object
}