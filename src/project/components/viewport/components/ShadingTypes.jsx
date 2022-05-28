import styles from "../styles/ViewportOptions.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";

import PropTypes from "prop-types";
import SHADING_MODELS from "../../../engine/templates/SHADING_MODELS";
import {useMemo} from "react";

export default function ShadingTypes(props) {
    const {settingsContext} = props
    const icon = <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>check</span>

    const shading = useMemo(() => {
        switch (settingsContext.shadingModel) {
            case SHADING_MODELS.LIGHT_ONLY:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem', width:'1.1rem'}}>light_bulb</span>,
                    label: 'Light only'
                }
            case SHADING_MODELS.ALBEDO:
                return {label: 'Unlit', icon: <div style={{'--colorToApply': 'white'}} className={styles.flatIcon}/>}
            case SHADING_MODELS.NORMAL:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>view_in_ar</span>,
                    label: 'Normal'
                }
            case SHADING_MODELS.TANGENT:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>view_in_ar</span>,
                    label: 'Tangent'
                }
            case SHADING_MODELS.DEPTH:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>settings</span>,
                    label: 'Depth'
                }
            case SHADING_MODELS.AO:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>settings</span>,
                    label: 'AO'
                }
            case SHADING_MODELS.BI_TANGENT:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>view_in_ar</span>,
                    label: 'Bi-Tangent'
                }
            case SHADING_MODELS.TEX_COORD:
                return {
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>view_in_ar</span>,
                    label: 'Texture coords'
                }
            case SHADING_MODELS.DETAIL:
                return {
                    label: 'Details',
                    icon: <div style={{'--colorToApply': 'white'}} className={styles.shadedIcon}/>
                }
            default:
                return {}
        }
    }, [settingsContext.shadingModel])
    return (
        <div style={{justifyContent: 'flex-end'}} className={styles.align}>
            <Dropdown className={styles.dropdown}>
                {shading.icon}
                <label className={styles.overflow}>{shading.label}</label>
                <DropdownOptions>
                    <DropdownOption
                        option={{
                            label: 'Light only',
                            icon: settingsContext.shadingModel === SHADING_MODELS.LIGHT_ONLY ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.LIGHT_ONLY
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Unlit',
                            icon: settingsContext.shadingModel === SHADING_MODELS.ALBEDO ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.ALBEDO
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Details',
                            icon: settingsContext.shadingModel === SHADING_MODELS.DETAIL ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.DETAIL
                        }}/>
                    <label className={styles.label}>Rendering</label>
                    <DropdownOption
                        option={{
                            label: 'Ambient occlusion',
                            icon: settingsContext.shadingModel === SHADING_MODELS.AO ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.AO
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Depth',
                            icon: settingsContext.shadingModel === SHADING_MODELS.DEPTH ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.DEPTH
                        }}/>

                    <label className={styles.label}>Mesh</label>
                    <DropdownOption
                        option={{
                            label: 'Normal',
                            icon: settingsContext.shadingModel === SHADING_MODELS.NORMAL ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.NORMAL
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Tangent',
                            icon: settingsContext.shadingModel === SHADING_MODELS.TANGENT ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.TANGENT
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Bi-Tangent',
                            icon: settingsContext.shadingModel === SHADING_MODELS.BI_TANGENT ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.BI_TANGENT
                        }}/>
                    <DropdownOption
                        option={{
                            label: 'Texture coords',
                            icon: settingsContext.shadingModel === SHADING_MODELS.TEX_COORD ? icon : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.TEX_COORD
                        }}/>
                </DropdownOptions>
            </Dropdown>
            {/*<div className={styles.buttonGroup}>*/}
            {/*    <Button*/}
            {/*        className={styles.groupItem}*/}
            {/*        variant={'minimal'}*/}
            {/*        highlight={settingsContext.shadingModel === SHADING_MODELS.DETAIL}*/}
            {/*        onClick={() => {*/}
            {/*            settingsContext.shadingModel = SHADING_MODELS.DETAIL*/}
            {/*        }}*/}
            {/*        styles={{borderRadius: '5px 0 0 5px'}}>*/}
            {/*        <div className={styles.shadedIcon}/>*/}
            {/*        <ToolTip>*/}
            {/*            <div style={{textAlign: 'left'}}>*/}
            {/*                <div style={{fontWeight: 'normal'}}>*/}
            {/*                    Viewport shading:*/}
            {/*                </div>*/}
            {/*                Details*/}
            {/*            </div>*/}
            {/*        </ToolTip>*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        className={styles.groupItem}*/}
            {/*        variant={'minimal'}*/}
            {/*        highlight={settingsContext.shadingModel === SHADING_MODELS.FLAT}*/}
            {/*        onClick={() => {*/}
            {/*            settingsContext.shadingModel = SHADING_MODELS.FLAT*/}
            {/*        }}>*/}
            {/*        <div className={styles.flatIcon}/>*/}
            {/*        <ToolTip>*/}
            {/*            <div style={{textAlign: 'left'}}>*/}
            {/*                <div style={{fontWeight: 'normal'}}>*/}
            {/*                    Viewport shading:*/}
            {/*                </div>*/}
            {/*                Flat*/}
            {/*            </div>*/}
            {/*        </ToolTip>*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        disabled={true}*/}
            {/*        className={styles.groupItem}*/}
            {/*        variant={'minimal'}*/}
            {/*        highlight={settingsContext.shadingModel === SHADING_MODELS.WIREFRAME}*/}
            {/*        onClick={() => {*/}
            {/*            settingsContext.shadingModel = SHADING_MODELS.WIREFRAME*/}
            {/*        }}*/}
            {/*        styles={{borderRadius: '0 5px 5px 0'}}>*/}

            {/*        <div className={'material-icons-round'}*/}
            {/*             style={{fontSize: '17px', color: 'var(-colorToApply)'}}>*/}
            {/*            language*/}
            {/*        </div>*/}
            {/*        <ToolTip>*/}
            {/*            <div style={{textAlign: 'left'}}>*/}
            {/*                <div style={{fontWeight: 'normal'}}>*/}
            {/*                    Viewport shading:*/}
            {/*                </div>*/}
            {/*                Wireframe*/}
            {/*            </div>*/}
            {/*        </ToolTip>*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    )
}

ShadingTypes.propTypes = {
    settingsContext: PropTypes.object
}