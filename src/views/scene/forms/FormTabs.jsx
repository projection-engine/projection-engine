import styles from '../styles/Tabs.module.css'
import PropTypes from "prop-types";
import React, {useMemo} from "react";
import COMPONENTS from "../../../services/utils/misc/COMPONENTS";
import {Button, ToolTip} from "@f-ui/core";

const C = COMPONENTS
export default function FormTabs(props){

    const tabs = useMemo(() => {
        const components = Object.keys(props.entity.components)
        if(components[props.currentTab] === undefined && props.currentTab > 0)
            props.setCurrentTab = components.length -1
        return components.map(c => {
            const res = {}
            switch (c){
                case C.TRANSFORM:
                    res.label = 'Transform'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>transform</span>
                    break
                case C.CUBE_MAP:
                    res.label = 'CubeMap'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>panorama_photosphere</span>
                    break
                case C.MESH:
                    res.label = 'Mesh'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>view_in_ar</span>
                    break
                case C.MATERIAL:
                    res.label = 'Material'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>texture</span>
                    break
                case C.POINT_LIGHT:
                    res.label = 'PointLight'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>lightbulb</span>
                    break
                case C.SKYBOX:
                    res.label = 'Skybox'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>cloud</span>
                    break
                case C.SKYLIGHT:
                    res.label = 'Skylight'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>light_mode</span>
                    break
                case C.SPOT_LIGHT:
                    res.label = 'Spotlight'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>flashlight_on</span>
                    break
                case C.PHYSICS:
                    res.label = 'Physics'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>public</span>
                    break
                case C.COLLIDER:
                    res.label = 'Collider'
                    res.icon = <span className={'material-icons-round'} style={{fontWeight: '1rem'}}>compare_arrows</span>
                    break
                default:
                    break
            }

            return res.label ? res : undefined
        }).filter(e => e)
    }, [props.entity, props.currentTab])
    return (
        <div className={styles.wrapper}>
            {tabs.map((t, i) => (
                <React.Fragment key={i + '-component-tab'}>
                    <Button className={styles.button} variant={"outlined"} highlight={props.currentTab === i} onClick={() => props.setCurrentTab(i)}>
                        {t.icon}
                        <ToolTip content={t.label}/>
                    </Button>
                </React.Fragment>

            ))}
        </div>
    )
}

FormTabs.propTypes={
    entity: PropTypes.object,
    currentTab: PropTypes.number,
    setCurrentTab: PropTypes.func
}