import styles from "../styles/ViewportOptions.module.css"
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core"
import ROTATION_TYPES from "../../../extension/gizmo/ROTATION_TYPES"
import Range from "../../../../components/range/Range"
import GIZMOS from "../../../extension/gizmo/GIZMOS"
import PropTypes from "prop-types"
import React, {useState} from "react"

export default function TransformationSettings(props){
    const {settingsContext} = props
    const [gridSize, setGridSize] = useState(settingsContext.gridSize)
    const [hidden, setHidden] = useState(false)
	
    return (
        <div
            className={styles.floating}
            style={{
                left: hidden ? 0 : "4px",
                right: "unset",
                top: "36px",
                gap: "8px",
                maxHeight: "calc(100% - 35px)"
            }}>

            {hidden ? null : (
                <>
                    <Button
                        styles={{borderRadius: "5px"}}
                        className={styles.transformationWrapper}
                        onClick={() => {
                            if (settingsContext.rotationType !== ROTATION_TYPES.GLOBAL)
                                settingsContext.rotationType = ROTATION_TYPES.GLOBAL
                            else
                                settingsContext.rotationType = ROTATION_TYPES.RELATIVE
                        }}
                    >

                        <span className={"material-icons-round"} style={{fontSize: "1.1rem"}}>
                            {settingsContext.rotationType === ROTATION_TYPES.RELATIVE ? "place" : "language"}
                        </span>
                    </Button>
                    <div className={styles.buttonGroup} style={{display: "grid"}}>
                        <Dropdown
                            styles={{borderRadius: "5px 5px 0 0"}}
                            className={styles.transformationWrapper}
                            hideArrow={true}>
                            <ToolTip styles={{textAlign: "left", display: "grid"}}>
                                <div>Translation grid size</div>
                            </ToolTip>
                            <span className={"material-icons-round"} style={{fontSize: "1rem"}}>grid_4x4</span>
                            <DropdownOptions>
                                <div className={styles.rangeWrapper} style={{display: "grid"}}>
                                    <div className={styles.rangeLabel}>
                                        Translation grid size
                                    </div>
                                    <Range
                                        onFinish={v => {
                                            setGridSize(v)
                                            settingsContext.gridSize = v
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
                            styles={{flexDirection: "column", borderTop: "none"}}
                            hideArrow={true}>
                            <ToolTip styles={{textAlign: "left", display: "grid"}}>
                                <div>Scale grid size</div>
                            </ToolTip>
                            <span
                                className={"material-icons-round"}
                                style={{transform: "rotate(-45deg)"}}>linear_scale</span>
                            <div
                                className={styles.overflow}
                                style={{fontSize: ".75rem", fontWeight: "550", color: "var(--fabric-color-tertiary)", padding: "0 2px"}}
                            >
                                {!settingsContext.gridScaleSize ? "" : settingsContext.gridScaleSize}
                            </div>
                            <DropdownOptions>
                                <div className={styles.rangeLabel} style={{padding: "8px", display: "flex", gap: "4px"}}>
                                    <Button
                                        className={styles.enableButton}
                                        styles={{color: settingsContext.gridScaleSize ? "var(--fabric-accent-color)" : undefined}}
                                        onClick={() => settingsContext.gridScaleSize = settingsContext.gridScaleSize ? undefined : 1}
                                    >
                                        <span
                                            className={"material-icons-round"}
                                            style={{fontSize: ".9rem"}}
                                        >{settingsContext.gridScaleSize ? "lens" : "panorama_fish_eye"}</span>
                                    </Button>
                                    Scale grid size
                                </div>

                                <div style={{display: "flex", padding: "4px", gap: "4px"}}>
                                    <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                        {[1, .5, .25].map(e => (
                                            <React.Fragment key={e + "variable-scale"}>
                                                <Button
                                                    disabled={!settingsContext.gridScaleSize}
                                                    styles={{width: "100%"}} className={styles.button}
                                                    variant={settingsContext.gridScaleSize === e ? "filled" : undefined}
                                                    onClick={() => settingsContext.gridScaleSize = e}>
                                                    {e}
                                                </Button>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                        {[.125, .0625, .03125].map(e => (
                                            <React.Fragment key={e + "variable-scale"}>
                                                <Button
                                                    disabled={!settingsContext.gridScaleSize}
                                                    styles={{width: "100%"}} className={styles.button}
                                                    variant={settingsContext.gridScaleSize === e ? "filled" : undefined}
                                                    onClick={() => settingsContext.gridScaleSize = e}>
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
                            styles={{borderRadius: "0 0 5px 5px", flexDirection: "column", borderTop: "none"}}
                            hideArrow={true}>
                            <ToolTip styles={{textAlign: "left", display: "grid"}}>
                                <div> Rotation angle</div>
                            </ToolTip>
                            <svg viewBox="0 0 512 512" style={{width: "1rem"}}>
                                <path
                                    fill={"var(--fabric-color-secondary)"}
                                    d="M495.304,425.738H255.417c-3.576-52.031-23.828-100.842-58.185-140.23L401.371,81.37c6.52-6.52,6.52-17.091,0-23.611    c-6.519-6.52-17.091-6.52-23.611,0L4.89,430.629c-3.282,3.282-4.984,7.702-4.886,12.172c0.018,0.813,0.095,1.627,0.233,2.436    c0.207,1.214,0.55,2.416,1.034,3.586c2.584,6.239,8.672,10.307,15.425,10.307h222.609h256c9.22,0,16.696-7.475,16.696-16.696    S504.525,425.738,495.304,425.738z M57.002,425.738l116.562-116.561c28.136,32.988,44.927,73.446,48.38,116.561H57.002z"/>
                            </svg>
                            {!settingsContext.gridRotationSize ? "" : settingsContext.gridRotationSize + "°"}
                            <DropdownOptions>
                                <div className={styles.rangeLabel} style={{padding: "8px", display: "flex", gap: "4px"}}>
                                    <Button

                                        className={styles.enableButton}
                                        styles={{color: settingsContext.gridRotationSize ? "var(--fabric-accent-color)" : undefined}}
                                        onClick={() => settingsContext.gridRotationSize = settingsContext.gridRotationSize ? undefined : 5}
                                    >
                                        <span
                                            className={"material-icons-round"}
                                            style={{fontSize: ".9rem"}}
                                        >{settingsContext.gridRotationSize ? "lens" : "panorama_fish_eye"}</span>
                                    </Button>
                                    Rotation angle
                                </div>

                                <div style={{display: "flex", padding: "4px", gap: "4px"}}>
                                    <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                        {[5, 10, 15, 30].map(e => (
                                            <React.Fragment key={e + "variable-rotation"}>
                                                <Button
                                                    disabled={!settingsContext.gridRotationSize}
                                                    styles={{width: "100%"}} className={styles.button}
                                                    variant={settingsContext.gridRotationSize === e ? "filled" : undefined}
                                                    onClick={() => settingsContext.gridRotationSize = e}>
                                                    {e}
                                                </Button>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div style={{display: "grid", gap: "4px", width: "100%"}}>
                                        {[45, 60, 90, 120].map(e => (
                                            <React.Fragment key={e + "variable-rotation"}>
                                                <Button
                                                    disabled={!settingsContext.gridRotationSize}
                                                    styles={{width: "100%"}} className={styles.button}
                                                    variant={settingsContext.gridRotationSize === e ? "filled" : undefined}
                                                    onClick={() => settingsContext.gridRotationSize = e}>
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
                            variant={settingsContext.gizmo === GIZMOS.NONE ? "filled" : undefined}
                            styles={{borderRadius: "5px 5px 0  0"}}
                            highlight={settingsContext.gizmo === GIZMOS.NONE}
                            onClick={() => {
                                settingsContext.gizmo = GIZMOS.NONE
                            }}>
                            <span className={"material-icons-round"}>mouse</span>
                        </Button>
                        <Button
                            className={styles.transformationWrapper}
                            variant={settingsContext.gizmo === GIZMOS.TRANSLATION ? "filled" : undefined}

                            highlight={settingsContext.gizmo === GIZMOS.TRANSLATION}
                            onClick={() => {
                                settingsContext.gizmo = GIZMOS.TRANSLATION
                            }}>
                            <span className={"material-icons-round"}>open_with</span>
                        </Button>
                        <Button
                            className={styles.transformationWrapper}
                            variant={settingsContext.gizmo === GIZMOS.ROTATION ? "filled" : undefined}
                            highlight={settingsContext.gizmo === GIZMOS.ROTATION}

                            onClick={() => {
                                settingsContext.gizmo = GIZMOS.ROTATION
                            }}>
                            <span className={"material-icons-round"}>cached</span>
                        </Button>
                        <Button
                            className={styles.transformationWrapper}
                            variant={settingsContext.gizmo === GIZMOS.SCALE ? "filled" : undefined}
                            styles={{borderRadius: "0 0 5px 5px", borderTop: "none"}}
                            highlight={settingsContext.gizmo === GIZMOS.SCALE}
                            onClick={() => {
                                settingsContext.gizmo = GIZMOS.SCALE
                            }}>
                            <span className={"material-icons-round"}>transform</span>
                        </Button>
                    </div>
                </>
            )}
            <Button
                className={styles.hideButton}
                styles={{
                    transform: hidden ? "translateX(0)" : undefined
                }}
                onClick={() => setHidden(!hidden)}>
                <span className={"material-icons-round"} style={{
                    fontSize: "1.1rem",
                    transform: !hidden ? "rotate(180deg)" : undefined
                }}>navigate_next</span>
            </Button>
        </div>
    )
}

TransformationSettings.propTypes={
    settingsContext: PropTypes.object
}