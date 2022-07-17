import CameraTab from "../components/CameraTab"
import ViewportTab from "../components/ViewportTab"
import Transform from "../../component/components/Transform"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import {updateTransform} from "../../component/hooks/useForm"
import VerticalTabs from "../../../../components/vertical-tab/VerticalTabs"
import React, {useState} from "react"
import PropTypes from "prop-types"
import GizmoBar from "../components/GizmoBar"
import CameraBar from "../components/CameraBar"
import useLocalization from "../../../../global/useLocalization"

export default function SideOptions(props){
    const {engine} = props
    const [openSideBar, setOpenSideBar] = useState(false)

    const translate = useLocalization("PROJECT", "VIEWPORT")

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
                        label: translate("CAMERA"),
                        content: <CameraTab/>
                    },
                    {
                        label: translate("TITLE"),
                        content: <ViewportTab/>
                    },
                    {
                        label: translate("ACTIVE_ENTITY"),
                        disabled: !engine.selectedEntity,
                        content: engine.selectedEntity ? (
                            <Transform
                                engine={engine}
                                selected={engine.selectedEntity.components[COMPONENTS.TRANSFORM]}
                                entityID={engine.selectedEntity.id}
                                submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine.selectedEntity)}
                                submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine.selectedEntity)}
                                submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine.selectedEntity)}
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