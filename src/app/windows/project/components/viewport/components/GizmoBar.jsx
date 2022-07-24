import styles from "../styles/SideOptions.module.css"
import {Button, Icon, ToolTip} from "@f-ui/core"
import TRANSFORMATION_TYPE from "../../../static/misc/TRANSFORMATION_TYPE"
import GIZMOS from "../../../static/misc/GIZMOS"
import React, {useContext, useEffect, useRef, useState} from "react"
import ResizableBar from "../../../../components/resizable/ResizableBar"
import SettingsProvider from "../../../context/SettingsProvider"
import GridSizeSelector from "./GridSizeSelector"
import useLocalization from "../../../../global/useLocalization"

const DEFAULT_ROTATION = .1, ROTATION_VALUES = [1, 5, 10, 15, 30, 45, 60, 90]
const DEFAULT_SCALE = .001, SCALE_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]
const DEFAULT_TRANSLATION = .001, TRANSLATION_VALUES = [.5, 1, 5, 10, 25, 50, 75, 100]
export default function GizmoBar() {
    const settings = useContext(SettingsProvider)
    const [minimal, setMinimal] = useState(true)
    const ref = useRef()
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current && settings.extendedGizmoView !== undefined && settings.extendedGizmoView) {
            ref.current.style.width = "150px"
            setMinimal(false)
            initialized.current = true
        }
    }, [settings.extendedGizmoView])

    const translate = useLocalization("PROJECT", "VIEWPORT")


    return (
        <div className={styles.floating}>
            <div className={styles.contentWrapper} ref={ref}>
                <Button
                    styles={{borderRadius: "3px"}}
                    attributes={{"data-minimal": `${minimal}`}}
                    className={styles.transformationWrapper}
                    onClick={() => {
                        if (settings.transformationType !== TRANSFORMATION_TYPE.GLOBAL)
                            settings.transformationType = TRANSFORMATION_TYPE.GLOBAL
                        else
                            settings.transformationType = TRANSFORMATION_TYPE.RELATIVE
                    }}
                >
                    <ToolTip content={`(${settings.transformationType}) Toggle transformation type`}/>
                    <Icon styles={{fontSize: "1.1rem"}}>
                        {settings.transformationType === TRANSFORMATION_TYPE.RELATIVE ? "place" : "language"}
                    </Icon>
                    {minimal ? null : <label className={styles.overflow}>{settings.transformationType}</label>}
                </Button>
                <div className={styles.buttonGroup}>
                    <GridSizeSelector
                        label={translate("TRANSLATION_GRID")}
                        minimal={minimal}
                        icon={<Icon styles={{fontSize: "1rem"}}>grid_4x4</Icon>}
                        initialValue={DEFAULT_TRANSLATION}
                        values={TRANSLATION_VALUES}
                        onSave={(value) => {
                            window.renderer.gizmos.translation.gridSize = value
                        }}
                    />
                    <GridSizeSelector

                        label={translate("SCALE_GRID")}
                        minimal={minimal}
                        icon={<Icon>linear_scale</Icon>}
                        initialValue={DEFAULT_SCALE}
                        values={SCALE_VALUES}
                        onSave={(value) => {
                            window.renderer.gizmos.scale.gridSize = value
                        }}
                    />
                    <GridSizeSelector
                        label={translate("ROTATION_GRID")}
                        minimal={minimal}
                        icon={<Icon>rotate_right</Icon>}
                        initialValue={DEFAULT_ROTATION}
                        values={ROTATION_VALUES}
                        onSave={(value) => {
                            window.renderer.gizmos.rotation.gridSize = value
                        }}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.NONE ? "filled" : undefined}
                        onClick={() => settings.gizmo = GIZMOS.NONE}>
                        <Icon>highlight_alt</Icon>
                        <ToolTip content={translate("SELECTION")}/>
                        {minimal ? null : <label className={styles.overflow}>{translate("SELECTION")}</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.CURSOR ? "filled" : undefined}
                        styles={{borderTop: "var(--pj-border-primary) 1px solid"}}
                        onClick={() => settings.gizmo = GIZMOS.CURSOR}>
                        <Icon>adjust</Icon>
                        <ToolTip content={translate("CURSOR")}/>
                        {minimal ? null : <label className={styles.overflow}>{translate("CURSOR")}</label>}
                    </Button>
                </div>
                <div className={styles.buttonGroup}>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.TRANSLATION ? "filled" : undefined}
                        onClick={() => settings.gizmo = GIZMOS.TRANSLATION}>
                        <Icon>open_with</Icon>
                        {minimal ? null : <label className={styles.overflow}>{translate("T_GIZMO")}</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.ROTATION ? "filled" : undefined}
                        onClick={() => settings.gizmo = GIZMOS.ROTATION}>
                        <Icon>360</Icon>
                        {minimal ? null : <label className={styles.overflow}>{translate("R_GIZMO")}</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.SCALE ? "filled" : undefined}
                        onClick={() => settings.gizmo = GIZMOS.SCALE}>
                        <Icon>open_in_full</Icon>
                        {minimal ? null : <label className={styles.overflow}>{translate("S_GIZMO")}</label>}
                    </Button>
                </div>
            </div>
            <ResizableBar
                type={"width"}
                onResizeEnd={() => settings.extendedGizmoView = minimal}
                onResize={() => {
                    const bBox = ref.current.getBoundingClientRect()
                    if (bBox.width < 80)
                        setMinimal(true)
                    else
                        setMinimal(false)
                }}
            />
            <div style={{maxWidth: "0px"}}/>
        </div>

    )
}
