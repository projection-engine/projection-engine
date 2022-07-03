import styles from "../../options/styles/ViewportOptions.module.css"
import {Button, Dropdown, DropdownOptions, Icon, ToolTip} from "@f-ui/core"
import ROTATION_TYPES from "../../../../../static/misc/ROTATION_TYPES"
import Range from "../../../../../components/range/Range"
import GIZMOS from "../../../../../static/misc/GIZMOS"
import React, {useContext, useEffect, useRef, useState} from "react"
import ResizableBar from "../../../../../components/resizable/ResizableBar"
import SettingsProvider from "../../../../providers/SettingsProvider"

export default function GizmoBar(){
    const settings = useContext(SettingsProvider)
    const [gridSize, setGridSize] = useState(settings.gridSize)
    
    const [minimal, setMinimal] = useState( true )
    const ref = useRef()
    const initialized = useRef(false)

    useEffect(() => {
        if(!initialized.current && settings.extendedGizmoView !== undefined && settings.extendedGizmoView) {
            ref.current.style.width = "150px"
            setMinimal(false)
            initialized.current = true
        }
    }, [settings.extendedGizmoView])

    return (
        <div className={styles.floating}>
            <div className={styles.contentWrapper} ref={ref}>
            
                <Button
                    styles={{borderRadius: "3px"}}
                    attributes={{title: `(${settings.rotationType}) Toggle transformation type`, "data-minimal": `${minimal}`}}
                    className={styles.transformationWrapper}
                    onClick={() => {
                        if (settings.rotationType !== ROTATION_TYPES.GLOBAL)
                            settings.rotationType = ROTATION_TYPES.GLOBAL
                        else
                            settings.rotationType = ROTATION_TYPES.RELATIVE
                    }}
                >
                    <Icon  styles={{fontSize: "1.1rem"}}>
                        {settings.rotationType === ROTATION_TYPES.RELATIVE ? "place" : "language"}
                    </Icon>
                    {minimal ? null : <label className={styles.overflow}>{settings.rotationType}</label>}
                </Button>
                <div className={styles.buttonGroup} style={{display: "grid"}}>
                    <Dropdown
                        styles={{borderRadius: "3px 3px 0 0"}}
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        hideArrow={true}>
                        <ToolTip content={"Translation grid size"}/>
                        <Icon  styles={{fontSize: "1rem"}}>grid_4x4</Icon>
                        {minimal ? null : <label className={styles.overflow}>Translation grid</label>}
                        <DropdownOptions>
                            <div className={styles.rangeWrapper} style={{display: "grid"}}>
                                <div className={styles.rangeLabel}>
                                            Translation grid size
                                </div>
                                <Range
                                    onFinish={v => {
                                        setGridSize(v)
                                        settings.gridSize = v
                                    }} accentColor={"red"}
                                    handleChange={(v) => setGridSize(v)}
                                    value={gridSize}
                                    precision={4}
                                    incrementPercentage={.001}
                                />
                            </div>
                        </DropdownOptions>
                    </Dropdown>
                    <Dropdown
                        className={styles.transformationWrapper}
                        styles={{borderTop: "none"}}
                        hideArrow={true}
                        attributes={{"data-minimal": `${minimal}`}}
                    >

                        <ToolTip content={"Scale grid size"}/>
                        <Icon

                            styles={{transform: "rotate(-45deg)"}}>linear_scale</Icon>

                        {minimal ? null : <label className={styles.overflow}>Scale grid</label>}
                        <DropdownOptions>
                            <div className={styles.rangeLabel} style={{padding: "8px", display: "flex", gap: "4px"}}>
                                <Button
                                    className={styles.enableButton}
                                    styles={{color: settings.gridScaleSize ? "var(--pj-accent-color)" : undefined}}
                                    onClick={() => settings.gridScaleSize = settings.gridScaleSize ? undefined : 1}
                                >
                                    <Icon

                                        styles={{fontSize: ".9rem"}}
                                    >{settings.gridScaleSize ? "lens" : "panorama_fish_eye"}</Icon>
                                </Button>
                                        Scale grid size
                            </div>

                            <div style={{display: "flex", padding: "4px", gap: "4px"}}>
                                <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                    {[1, .5, .25].map(e => (
                                        <React.Fragment key={e + "variable-scale"}>
                                            <Button
                                                disabled={!settings.gridScaleSize}
                                                styles={{width: "100%"}} className={styles.button}
                                                variant={settings.gridScaleSize === e ? "filled" : undefined}
                                                onClick={() => settings.gridScaleSize = e}>
                                                {e}
                                            </Button>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                    {[.125, .0625, .03125].map(e => (
                                        <React.Fragment key={e + "variable-scale"}>
                                            <Button
                                                disabled={!settings.gridScaleSize}
                                                styles={{width: "100%"}} className={styles.button}
                                                variant={settings.gridScaleSize === e ? "filled" : undefined}
                                                onClick={() => settings.gridScaleSize = e}>
                                                {e}
                                            </Button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </DropdownOptions>
                    </Dropdown>
                    <Dropdown
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        styles={{borderRadius: "0 0 3px 3px",  borderTop: "none"}}
                        hideArrow={true}
                    >
                        <ToolTip content={"Rotation angle"}/>
                        <div style={{display: "flex", alignContent: "center", flexDirection: "column", fontSize: ".7rem"}}>
                            <svg viewBox="0 0 512 512" style={{width: "1rem"}}>
                                <path
                                    fill={"var(--pj-color-secondary)"}
                                    d="M495.304,425.738H255.417c-3.576-52.031-23.828-100.842-58.185-140.23L401.371,81.37c6.52-6.52,6.52-17.091,0-23.611    c-6.519-6.52-17.091-6.52-23.611,0L4.89,430.629c-3.282,3.282-4.984,7.702-4.886,12.172c0.018,0.813,0.095,1.627,0.233,2.436    c0.207,1.214,0.55,2.416,1.034,3.586c2.584,6.239,8.672,10.307,15.425,10.307h222.609h256c9.22,0,16.696-7.475,16.696-16.696    S504.525,425.738,495.304,425.738z M57.002,425.738l116.562-116.561c28.136,32.988,44.927,73.446,48.38,116.561H57.002z"/>
                            </svg>
                            {!settings.gridRotationSize ? "" : settings.gridRotationSize + "°"}
                        </div>
                        {minimal ? null : <label className={styles.overflow}>Rotation angle</label>}

                        <DropdownOptions>
                            <div className={styles.rangeLabel} style={{padding: "8px", display: "flex", gap: "4px"}}>
                                <Button

                                    className={styles.enableButton}
                                    styles={{color: settings.gridRotationSize ? "var(--pj-accent-color)" : undefined}}
                                    onClick={() => settings.gridRotationSize = settings.gridRotationSize ? undefined : 5}
                                >
                                    <Icon

                                        styles={{fontSize: ".9rem"}}
                                    >{settings.gridRotationSize ? "lens" : "panorama_fish_eye"}</Icon>
                                </Button>
                                        Rotation angle
                            </div>

                            <div style={{display: "flex", padding: "4px", gap: "4px"}}>
                                <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                    {[1, 5, 10, 15].map(e => (
                                        <React.Fragment key={e + "variable-rotation"}>
                                            <Button
                                                disabled={!settings.gridRotationSize}
                                                styles={{width: "100%"}} className={styles.button}
                                                variant={settings.gridRotationSize === e ? "filled" : undefined}
                                                onClick={() => settings.gridRotationSize = e}>
                                                {e}
                                            </Button>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                    {[30, 45, 60, 90].map(e => (
                                        <React.Fragment key={e + "variable-rotation"}>
                                            <Button
                                                disabled={!settings.gridRotationSize}
                                                styles={{width: "100%"}} className={styles.button}
                                                variant={settings.gridRotationSize === e ? "filled" : undefined}
                                                onClick={() => settings.gridRotationSize = e}>
                                                {e}
                                            </Button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </DropdownOptions>
                    </Dropdown>
                </div>


                <div className={styles.buttonGroup} style={{display: "grid"}}>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.NONE ? "filled" : undefined}
                        styles={{borderRadius: "3px 3px 0  0"}}
                        highlight={settings.gizmo === GIZMOS.NONE}
                        onClick={() => {
                            settings.gizmo = GIZMOS.NONE
                        }}
                    >
                        <Icon >highlight_alt</Icon>
                        <ToolTip content={"Select box"}/>
                        {minimal ? null : <label className={styles.overflow}>Select box</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.CURSOR ? "filled" : undefined}
                        styles={{borderRadius: "0 0 3px 3px"}}
                        highlight={settings.gizmo === GIZMOS.CURSOR}
                        onClick={() => {
                            settings.gizmo = GIZMOS.CURSOR
                        }}>
                        <Icon >adjust</Icon>
                        <ToolTip content={"3D cursor"}/>
                        {minimal ? null : <label className={styles.overflow}>3D cursor</label>}
                    </Button>
                </div>
                <div className={styles.buttonGroup} style={{display: "grid"}}>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        styles={{borderRadius: "3px 3px 0  0"}}
                        variant={settings.gizmo === GIZMOS.TRANSLATION ? "filled" : undefined}

                        highlight={settings.gizmo === GIZMOS.TRANSLATION}
                        onClick={() => {
                            settings.gizmo = GIZMOS.TRANSLATION
                        }}>
                        <Icon >open_with</Icon>
                        {minimal ? null : <label className={styles.overflow}>Translation gizmo</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.ROTATION ? "filled" : undefined}
                        highlight={settings.gizmo === GIZMOS.ROTATION}

                        onClick={() => {
                            settings.gizmo = GIZMOS.ROTATION
                        }}>
                        <Icon >cached</Icon>
                        {minimal ? null : <label className={styles.overflow}>Rotation gizmo</label>}
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        attributes={{"data-minimal": `${minimal}`}}
                        variant={settings.gizmo === GIZMOS.SCALE ? "filled" : undefined}
                        styles={{borderRadius: "0 0 3px 3px", borderTop: "none"}}
                        highlight={settings.gizmo === GIZMOS.SCALE}
                        onClick={() => {
                            settings.gizmo = GIZMOS.SCALE
                        }}>
                        <Icon >transform</Icon>
                        {minimal ? null : <label className={styles.overflow}>Scale gizmo</label>}
                    </Button>
                </div>
            </div>
            <ResizableBar
                type={"width"}
                onResizeEnd={() => settings.extendedGizmoView = minimal}
                onResize={() => {
                    const bBox = ref.current.getBoundingClientRect()
                    if(bBox.width < 80)
                        setMinimal(true)
                    else
                        setMinimal(false)
                }}
            />
            <div style={{ maxWidth: "0px"}}/>
        </div>
       
    )
}
