import PropTypes from "prop-types"

import React, {useContext, useEffect, useState} from "react"
import HierarchyProvider from "../context/HierarchyProvider"
import QuickAccessProvider from "../context/QuickAccessProvider"
import BlueprintProvider from "../context/BlueprintProvider"
import EngineProvider from "../context/EngineProvider"
import FilesProvider from "../context/FilesProvider"
import SettingsProvider from "../context/SettingsProvider"


export default function ContextProvider(props) {
    const {
        children,
        quickAccess,
        settings,
        filesHook,
        engine,
        utils
    } = props

    return (
        <QuickAccessProvider.Provider value={quickAccess}>
            <BlueprintProvider.Provider
                value={{
                    selectedEntity: engine.selectedEntity,
                    materials: engine.materials,
                    setMaterials: engine.setMaterials,
                    quickAccessMaterials: props.quickAccess.materials
                }}
            >
                <HierarchyProvider.Provider value={{
                    dispatchEntities: engine.dispatchEntities,
                    operationUtils: utils,
                    setSelected: engine.setSelected,
                    lockedEntity: engine.lockedEntity,
                    setLockedEntity: engine.setLockedEntity,
                    selected: engine.selected,
                    entitiesChangeID: engine.entitiesChangeID,
                    update: () => {
                        engine.update()
                        engine.updateHierarchy()
                    }
                }}>
                    <EngineProvider.Provider value={[engine, utils]}>
                        <FilesProvider.Provider value={filesHook}>
                            <SettingsProvider.Provider value={settings}>
                                {children}
                            </SettingsProvider.Provider>
                        </FilesProvider.Provider>
                    </EngineProvider.Provider>
                </HierarchyProvider.Provider>
            </BlueprintProvider.Provider>
        </QuickAccessProvider.Provider>
    )
}
ContextProvider.propTypes = {
    children: PropTypes.node,
    quickAccess: PropTypes.object,
    settings: PropTypes.object,
    filesHook: PropTypes.object,
    engine: PropTypes.object,
    utils: PropTypes.object,
}