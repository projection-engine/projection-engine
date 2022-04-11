import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, Checkbox, LoaderProvider} from "@f-ui/core";
import React, {useContext, useEffect, useState} from "react";
import EVENTS from "../../../services/utils/misc/EVENTS";

import Selector from "../../../components/selector/Selector";
import Range from "../../../components/range/Range";
import {HISTORY_ACTIONS} from "../../../services/utils/historyReducer";


export default function MaterialComponent(props) {
    const [currentMaterial, setCurrentMaterial] = useState(undefined)
    const getState = () => {
        if (props.selected)
            return {
                tilingX: props.selected.tiling[0],
                tilingY: props.selected.tiling[1],
                overrideTiling: props.selected.overrideTiling,
                radius: props.selected.radius,
                parallaxLayers:  props.selected.parallaxLayers,
                parallaxHeightScale: props.selected.parallaxHeightScale
            }
        else
            return {}
    }
    const [state, setState] = useState(getState())

    const fileSystem = props.quickAccess.fileSystem
    const load = useContext(LoaderProvider)


    useEffect(() => {
        setState(getState())

        setCurrentMaterial(props.quickAccess.materials.find(i => i.registryID === props.selected.materialID))
    }, [props.selected])

    const [hasChanged, setHasChanged] = useState(false)
    const saveVersion = () => {
        if (!hasChanged) {
            setHasChanged(true)
            props.engine.dispatchChanges({
                type: HISTORY_ACTIONS.SAVE_COMPONENT_STATE,
                payload: {
                    key: props.selected.constructor.name,
                    entityID: props.entityID,
                    component: props.selected
                }
            })
        }
    }

    return (
        <>
        <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Material
                </AccordionSummary>
                    <Selector
                        selected={currentMaterial}
                        type={'material'}
                        handleChange={src => {
                            if (src) {
                                load.pushEvent(EVENTS.LOAD_FILE)
                                fileSystem.readRegistryFile(src.registryID)
                                    .then(rs => {
                                        if (rs)
                                            fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path, 'json')
                                                .then(file => {
                                                    if (file && file.response) {
                                                        saveVersion()
                                                        props.submit({
                                                            blob: file.response,
                                                            id: src.registryID,
                                                            name: src.name
                                                        })
                                                        setCurrentMaterial(src)
                                                    } else
                                                        props.setAlert({
                                                            type: 'error',
                                                            message: 'Error loading material.'
                                                        })
                                                    load.finishEvent(EVENTS.LOAD_FILE)
                                                })
                                        else
                                            load.finishEvent(EVENTS.LOAD_FILE)
                                    })
                            } else
                                props.submit()
                        }}/>

            </Accordion>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    CubeMap influence radius
                </AccordionSummary>
                    <Range
                        accentColor={'red'}
                        metric={'un'}

                        value={state.radius}
                        precision={3}
                        incrementPercentage={.01}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submitRadius(state.radius, 'radius')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.radius = state.radius
                            setState({...state, radius: parseFloat(e)})
                        }}
                    />

            </Accordion>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}
                       contentStyles={{display: 'flex', gap: '2px'}}>
                <AccordionSummary className={styles.summary}>
                    UV tiling
                </AccordionSummary>


                        <Range
                            accentColor={'red'}
                            metric={'x'}
                            disabled={!state.overrideTiling}
                            value={state.tilingX}
                            precision={3}
                            incrementPercentage={.01}
                            onFinish={() => {
                                setHasChanged(false)
                                props.submitTiling([state.tilingX, state.tilingY])
                            }}
                            handleChange={e => {
                                saveVersion()

                                props.selected.tiling = [parseFloat(e), state.tilingY]
                                setState({...state, tilingX: parseFloat(e)})
                            }}
                        />
                        <Range
                            accentColor={'green'}
                            metric={'y'}
                            disabled={!state.overrideTiling}
                            precision={3}
                            incrementPercentage={.01}
                            value={state.tilingY}
                            onFinish={() => {
                                setHasChanged(false)
                                props.submitTiling([state.tilingX, state.tilingY])
                            }}
                            handleChange={e => {
                                saveVersion()

                                props.selected.tiling = [state.tilingX, parseFloat(e)]
                                setState({...state, tilingY: parseFloat(e)})

                            }}
                        />


            </Accordion>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Parallax height scale
                </AccordionSummary>

                    <Range
                        accentColor={'red'}

                        value={state.parallaxHeightScale}
                        precision={3}
                        maxValue={2}
                        minValue={.01}
                        incrementPercentage={.01}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submit (state.parallaxHeightScale, 'parallaxHeightScale')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.parallaxHeightScale = state.parallaxHeightScale
                            setState({...state, parallaxHeightScale: e})
                        }}
                    />

            </Accordion>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Parallax layers
                </AccordionSummary>

                    <Range
                        accentColor={'red'}

                        value={state.parallaxLayers}
                        precision={0}
                        minValue={1}
                        maxValue={64}
                        incrementPercentage={1}
                        onFinish={() => {
                            setHasChanged(false)
                            props.submit (state.parallaxLayers, 'parallaxLayers')
                        }}
                        handleChange={e => {
                            saveVersion()
                            props.selected.parallaxLayers = state.parallaxLayers
                            setState({...state, parallaxLayers: e})
                        }}
                    />

            </Accordion>
            <Checkbox
                noMargin={true}
                label={'Override material params'}
                width={'100%'}
                height={'35px'}

                checked={state.overrideTiling}
                handleCheck={() => {
                    saveVersion()
                    setHasChanged(false)
                    setState({...state, overrideTiling: !state.overrideTiling})
                    props.submitTiling(undefined, !state.overrideTiling)
                }}
            />
        </>

    )
}
MaterialComponent.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,


    quickAccess: PropTypes.object,
    setAlert: PropTypes.func.isRequired,
    selected: PropTypes.object,
    submitTiling: PropTypes.func,

    submit: PropTypes.func,
    submitRadius: PropTypes.func
}