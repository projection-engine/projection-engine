import styles from '../styles/Tabs.module.css'
import PropTypes from "prop-types";
import React, {useMemo} from "react";
import COMPONENTS from "../../../engine/templates/COMPONENTS";
import {Button, ToolTip} from "@f-ui/core";


export default function FormTabs(props) {

    const tabs = useMemo(() => {
        if (props.entity) {
            const components = Object.keys(props.entity.components)
            if (components[props.currentTab] === undefined && props.currentTab > 0) {
                props.setCurrentTab(components.length - 1)
                return []
            }
            return components.map(c => {
                const res = {}
                switch (c) {
                    case COMPONENTS.TRANSFORM:
                        res.key = c
                        res.label = 'Transform'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>transform</span>
                        break
                    case COMPONENTS.CUBE_MAP:
                        res.key = c
                        res.label = 'CubeMap'
                        res.icon = <span className={'material-icons-round'}
                                         style={{fontWeight: '1rem'}}>panorama_photosphere</span>
                        break
                    case COMPONENTS.MESH:
                        res.key = c
                        res.label = 'Mesh'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>view_in_ar</span>
                        break
                    case COMPONENTS.MATERIAL:
                        res.key = c
                        res.label = 'Material'
                        res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>texture</span>
                        break
                    case COMPONENTS.POINT_LIGHT:
                        res.key = c
                        res.label = 'PointLight'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>lightbulb</span>
                        break
                    case COMPONENTS.SKYBOX:
                        res.key = c
                        res.label = 'Skybox'
                        res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>cloud</span>
                        break
                    case COMPONENTS.DIRECTIONAL_LIGHT:
                    case COMPONENTS.SKYLIGHT:
                        res.key = c
                        res.label = c === COMPONENTS.DIRECTIONAL_LIGHT ? 'DirectionalLight' : 'Skylight'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>light_mode</span>
                        break
                    case COMPONENTS.SPOT_LIGHT:
                        res.key = c
                        res.label = 'Spotlight'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>flashlight_on</span>
                        break
                    case COMPONENTS.SCRIPT:
                        res.key = c
                        res.label = 'Blueprint'
                        res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>code</span>
                        break
                    case COMPONENTS.PHYSICS:
                        res.key = c
                        res.label = 'Physics'
                        res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>public</span>
                        break
                    case COMPONENTS.COLLIDER:
                        res.key = c
                        res.label = 'Collider'
                        res.icon =
                            <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>compare_arrows</span>
                        break
                    case COMPONENTS.CAMERA:
                        res.key = c
                        res.label = 'Camera'
                        res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>videocam</span>
                        break
                    default:
                        break
                }

                return res.label ? res : undefined
            }).filter(e => e)
        }
        return []
    }, [props.entity, props.currentTab])

    const currentKey = useMemo(() => {
        if (props.entity)
            return Object.keys(props.entity.components)[props.currentTab]
        else
            return undefined
    }, [props.currentTab, props.entity?.id])

    return (
        <div className={styles.wrapper}>
            <Button
                className={styles.button}
                variant={props.currentTab === '-3' ? "filled" : undefined}
                onClick={() => props.setCurrentTab('-3')}
            >
                <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>videocam</span>
                <ToolTip content={'Editor camera'}/>
            </Button>
            <Button
                className={styles.button}
                variant={props.currentTab === '-2' ? "filled" : undefined}
                onClick={() => props.setCurrentTab('-2')}
            >
                <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>image</span>
                <ToolTip content={'Display'}/>
            </Button>
            <Button
                variant={props.currentTab === '-1' ? "filled" : undefined}
                className={styles.button}
                onClick={() => props.setCurrentTab('-1')}
            >
                <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>tv</span>
                <ToolTip content={'Graphics'}/>
            </Button>
            {props.entity ? <div className={styles.divider}/> : undefined}
            {tabs.map((t, i) => (
                <React.Fragment key={i + '-component-tab'}>
                    <Button
                        variant={currentKey === t.key ? "filled" : undefined}
                        className={styles.button}
                        onClick={() => props.setCurrentTab(Object.keys(props.entity.components).findIndex(e => e === t.key))}>
                        {t.icon}
                        <ToolTip content={t.label}/>
                    </Button>
                </React.Fragment>

            ))}
        </div>
    )
}

FormTabs.propTypes = {
    addComponent: PropTypes.func,

    entity: PropTypes.object,
    currentTab: PropTypes.any,
    setCurrentTab: PropTypes.func
}