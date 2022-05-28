import PropTypes from "prop-types";
import React, {useState} from "react";
import styles from './styles/TabRouter.module.css'
import {Button} from "@f-ui/core";
import ControlProvider from "./components/ControlProvider";
import Options from "./components/Options";
import {HashRouter, Route, Routes, useNavigate} from "react-router-dom";
import Editor from "../editor/Editor";
import MaterialView from "../blueprints/material/MaterialView";
import BlueprintView from "../blueprints/scripts/BlueprintView";
import LevelBlueprint from "../blueprints/scripts/LevelBlueprint";

export const ROUTER_TYPES = {
    EDITOR: 'editor',
    MATERIAL: 'material',
    BLUEPRINT: 'blueprint',
    LEVEL: 'level',


    MESH: 'mesh',
    IMAGE: 'image',
    UI: 'ui'
}
export default function TabRouter(props) {
    const [tabs, setTabs] = useState([])
    const [selected, setSelected] = useState(0)
    return (
        <ControlProvider.Provider
            value={{
                setTabAttributes: (options, label, icon, type, registryID) => {
                    if (!tabs.find(t => t.registryID === registryID))
                        setTabs([...tabs, {options, label, icon, type, registryID}])
                }
            }}>
            <div className={styles.wrapper}>
                <div className={styles.contentWrapper}>
                    <div className={styles.tabs}>
                        {tabs.map((tab, i) => (
                            <React.Fragment>
                                <Tab i={i} tab={tab} setSelected={setSelected} selected={selected} setTabs={setTabs}
                                     refreshData={props.refreshData}/>
                            </React.Fragment>
                        ))}
                    </div>
                    <Options options={tabs[selected]?.options}/>
                </div>
                <Routes>
                    <Route
                        path={'/'}
                        exact={true}
                        element={<Editor {...props.mainProps}/>}
                    />
                    <Route
                        path={'/flow/:registryID/:name'}
                        element={<BlueprintView submitPackage={props.submitPackage}/>}
                    />
                    <Route
                        path={'/material/:registryID/:name'}
                        element={<MaterialView submitPackage={props.submitPackage}/>}
                    />
                    <Route
                        path={'/level'}
                        element={<LevelBlueprint {...props.levelProps} submitPackage={props.submitPackage}/>}
                    />
                </Routes>
            </div>
        </ControlProvider.Provider>

    )
}
TabRouter.propTypes = {
    levelProps: PropTypes.object, submitPackage: PropTypes.func, refreshData: PropTypes.func
}

function Tab({i, tab, setTabs, refreshData, setSelected, selected}) {
    const navigate = useNavigate()
    return (
        <div
            key={'tab-' + i}
            className={[styles.tabButtonWrapper, tab === i ? styles.currentTabButton : ''].join(' ')}>
            <Button
                variant={'minimal-horizontal'}
                className={styles.button}
                highlight={selected === i}
                onClick={() => {
                    setSelected(i)
                    switch (tab.type) {
                        case ROUTER_TYPES.LEVEL:
                            navigate('/level')
                            break
                        case ROUTER_TYPES.EDITOR:
                            navigate('/')
                            break
                        default:
                            navigate(tab.type + '/' + tab.registryID + '/' + tab.label)
                            break
                    }
                }}
            >
                {tab.icon}
                <div className={styles.overflow}>
                    {tab.label}
                </div>
            </Button>
            <Button
                color={"secondary"}
                className={styles.closeButton}
                onClick={() => {
                    const {type, registryID} = tab
                    setTabs(prev => prev.filter((_, index) => index !== i))
                    refreshData(type, registryID)
                }}
            >
                <span className={'material-icons-round'}>close</span>
            </Button>
        </div>
    )
}