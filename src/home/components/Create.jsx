import PropTypes from "prop-types"
import React, {useContext, useState} from "react"
import {DropdownProvider, TextField} from "@f-ui/core"
import FileSystem from "../../project/utils/files/FileSystem"

export default function Create(props) {
    const {setProjects} = props
    const [projectName, setProjectName] = useState("")
    const dropdownContext = useContext(DropdownProvider)

    return (
        <TextField
            handleChange={setProjectName}
            noMargin={true}
            placeholder={"New project"}
            value={projectName}
            onEnter={async () => {
                const res = await FileSystem.createProject(projectName)
                setProjects(prev => ([...prev, {
                    id: res,
                    meta: {name: projectName}
                }]))

                dropdownContext.setOpen(false)
                alert.pushAlert("Project created", "success")
                setProjectName("")
            }}
            height={"30px"}
        />

    )
}

Create.propTypes={
    setProjects: PropTypes.func
}