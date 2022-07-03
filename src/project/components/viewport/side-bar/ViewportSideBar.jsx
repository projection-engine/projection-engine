import CameraTab from "./components/CameraTab"
import ViewportTab from "./components/ViewportTab"
import Transform from "../../component/components/Transform"
import COMPONENTS from "../../../engine/templates/COMPONENTS"
import {updateTransform} from "../../component/hooks/useForm"
import VerticalTabs from "../../../../components/vertical-tab/VerticalTabs"
import React, {useState} from "react"
import PropTypes from "prop-types"
import GizmoBar from "../wrapper/components/GizmoBar"
import CameraBar from "../wrapper/components/CameraBar"

export default function ViewportSideBar(props){
    const {engine} = props
    const [openSideBar, setOpenSideBar] = useState(false)

    return (
        <>
            {engine.executingAnimation ?
                null
                :
                <>
                    <GizmoBar/>
                    <CameraBar
                        engine={engine}
                        sideBarOpen={openSideBar}
                    />
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
                        content: <ViewportTab engine={engine}/>
                    },
                    {
                        label: "Active entity",
                        disabled: !engine.selectedEntity,
                        content: engine.selectedEntity ? (
                            <Transform
                                engine={engine} selected={engine.selectedEntity.components[COMPONENTS.TRANSFORM]} entityID={engine.selectedEntity.id}
                                submitRotation={(axis, data) => updateTransform(axis, data, "rotation", engine, engine.selectedEntity.id)}
                                submitScaling={(axis, data) => updateTransform(axis, data, "scaling", engine, engine.selectedEntity.id)}
                                submitTranslation={(axis, data) => updateTransform(axis, data, "translation", engine, engine.selectedEntity.id)}
                            />
                        ) : null
                    }
                ]}
            />
        </>
    )
}
ViewportSideBar.propTypes={
    engine: PropTypes.object
}