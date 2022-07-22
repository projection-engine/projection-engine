import PropTypes from "prop-types"
import React, {useContext, useState} from "react"
import {DropdownProvider, TextField} from "@f-ui/core"
import FileSystem from "../../../project/libs/FileSystem"
import useLocalization from "../../../global/useLocalization"

export default function Create(props) {
    const {setProjects} = props
    const [projectName, setProjectName] = useState("")
    const dropdownContext = useContext(DropdownProvider)
    const translate = useLocalization("HOME", "CREATE")
    return (
        <TextField
            handleChange={setProjectName}
            noMargin={true}
            placeholder={translate("NEW_PROJECT")}
            value={projectName}
            onEnter={async () => {
                const res = await FileSystem.createProject(projectName)
                setProjects(prev => ([...prev, {
                    id: res,
                    meta: {name: projectName}
                }]))

                dropdownContext.setOpen(false)
                alert.pushAlert(translate("PROJECT_CREATED"), "success")
                setProjectName("")
            }}
            height={"30px"}
        />

    )
}

Create.propTypes={
    setProjects: PropTypes.func
}