import CameraTab from "../components/CameraTab"
import ViewportTab from "../components/ViewportTab"
import Transform from "../../component/components/Transform"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {updateTransform} from "../../component/hooks/useForm"
import VerticalTabs from "../../../../components/vertical-tab/VerticalTabs"
import React, {useState} from "react"
import PropTypes from "prop-types"
import GizmoBar from "../components/GizmoBar"
import CameraBar from "../components/CameraBar"

export default function SideOptions(props){
    const {engine} = props
    const [openSideBar, setOpenSideBar] = useState(false)

    return (
        <>
            {engine.executingAnimation ?
                null
                :
                <>
                    <GizmoBar/>
                    <CameraBar sideBarOpen={openSideBar}/>
                </>
            }
            <VerticalTabs
                open={openSideBar}
                setOpen={setOpenSideBar}
                absolute={true}
                tabs={[
                    {
                        label: "Camera",
                        content: <CameraTab/>
                    },
                    {
                        label: "Viewport",
                        content: <ViewportTab/>
                    },
                    {
                        label: "Active entity",
                        disabled: !engine.selectedEntity,
                        content: engine.selectedEntity ? (
                            <Transform
                                engine={engine}
                                selected={engine.selectedEntity.components[COMPONENTS.TRANSFORM]}
                                entityID={engine.selectedEntity.id}
                                submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine.selectedEntity, engine.dispatchEntities)}
                                submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine.selectedEntity, engine.dispatchEntities)}
                                submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine.selectedEntity, engine.dispatchEntities)}
                            />
                        ) : null
                    }
                ]}
            />
        </>
    )
}
SideOptions.propTypes={
    engine: PropTypes.object
}