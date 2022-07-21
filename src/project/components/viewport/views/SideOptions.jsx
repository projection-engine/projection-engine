import CameraTab from "../components/CameraTab"
import ViewportTab from "../components/ViewportTab"
import Transform from "../../component/components/Transform"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import {updateTransform} from "../../component/hooks/useForm"
import VerticalTabs from "../../../../components/vertical-tab/VerticalTabs"
import React from "react"
import PropTypes from "prop-types"
import useLocalization from "../../../../global/useLocalization"

export default function SideOptions(props) {
    const {selectedEntity} = props

    const translate = useLocalization("PROJECT", "VIEWPORT")

    return (
        <VerticalTabs
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
                    disabled: !selectedEntity,
                    content: selectedEntity ? (
                        <Transform
                            selected={selectedEntity.components[COMPONENTS.TRANSFORM]}
                            entityID={selectedEntity.id}
                            submitRotation={(axis, data) => updateTransform(axis, data, "rotation", selectedEntity)}
                            submitScaling={(axis, data) => updateTransform(axis, data, "scaling", selectedEntity)}
                            submitTranslation={(axis, data) => updateTransform(axis, data, "translation", selectedEntity)}
                        />
                    ) : null
                }
            ]}
        />
    )
}

SideOptions.propTypes = {
    selectedEntity: PropTypes.object
}