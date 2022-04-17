import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, Checkbox, LoaderProvider} from "@f-ui/core";
import React, {useContext, useEffect, useRef} from "react";
import EVENTS from "../../../pages/project/utils/utils/EVENTS";

import Selector from "../../../components/selector/Selector";
import Range from "../../../components/range/Range";
import useDirectState from "../../../pages/project/utils/hooks/useDirectState";
import {DATA_TYPES} from "../../blueprints/base/DATA_TYPES";
import ColorPicker from "../../../components/color/ColorPicker";
import TextureInstance from "../../../engine/shared/instances/TextureInstance";


export default function MaterialComponent(props) {
    const [state, clear] = useDirectState()
    const fileSystem = props.quickAccess.fileSystem
    const load = useContext(LoaderProvider)
    const lastID = useRef()
    useEffect(() => {
        if(!lastID.current || lastID.current !== props.entityID) {
            clear()
            state.doubleSided = props.selected.doubleSided
            lastID.current = props.entityID
            state.overrideMaterial = props.selected.overrideMaterial
            state.uniforms = props.selected.uniforms
            state.currentMaterial = props.quickAccess.materials.find(i => i.registryID === props.selected.materialID)
        }
    }, [props.selected, props.entityID])


    const loadFile = async (src, type = 'json') => {
        load.pushEvent(EVENTS.LOAD_FILE)
        const rs = await fileSystem.readRegistryFile(src.registryID)
        if (rs) {
            const file = await fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path, type)
            load.finishEvent(EVENTS.LOAD_FILE)
            if (file)
                return file
            else {
                props.setAlert({
                    type: 'error',
                    message: 'Error loading file.'
                })
                return null
            }
        } else
            load.finishEvent(EVENTS.LOAD_FILE)

    }
    const updateUniforms = (key, value, obj, submit, submitUniformList) => {
        const index = state.uniforms.findIndex(u => u.key === key)
        if (index > -1) {
            const copy = [...state.uniforms]
            copy[index] = {...obj, value}

            state.uniforms = copy
            if (submit) {
                const values = {}
                copy.forEach(c => {
                    if (c.type !== DATA_TYPES.TEXTURE)
                        values[c.key] = c.value
                })
                props.submit(values, 'uniformValues')
            }

            if(submitUniformList)
                props.submit(copy, 'uniforms')
        }
    }
    const getField = (obj) => {
        const {type, key, label, value} = obj
        switch (type) {
            case DATA_TYPES.INT:
            case DATA_TYPES.FLOAT:
                return (
                    <Range
                        precision={type === DATA_TYPES.FLOAT ? 3 : 0}
                        maxValue={obj.max}
                        incrementPercentage={type === DATA_TYPES.FLOAT ? .001 : 1}
                        minValue={obj.min}
                        value={value ? value : 0}
                        onFinish={(v) => updateUniforms(key, v, obj, true)}
                        handleChange={v => updateUniforms(key, v, obj, false)}
                        label={label}
                    />
                )
            case DATA_TYPES.VEC3:
                if (!obj.normalized)
                    return (
                        <div className={styles.formWrapper}>
                            <Range
                                accentColor={'red'}
                                maxValue={obj.max}
                                minValue={obj.min}
                                onFinish={(v) => updateUniforms(key, [parseFloat(v), value[1], value[2]], obj, true)}
                                handleChange={v => updateUniforms(key, [parseFloat(v), value[1], value[2]], obj, false)}
                                value={value ? value[0] : 0}

                                label={'X'}
                            />
                            <Range
                                accentColor={'green'}
                                onFinish={(v) => updateUniforms(key, [value[0], parseFloat(v), value[2]], obj, true)}
                                handleChange={v => updateUniforms(key, [value[0], parseFloat(v), value[2]], obj, false)}
                                value={value ? value[1] : 0}

                                label={'Y'}
                            />
                            <Range
                                accentColor={'blue'}
                                maxValue={obj.max}
                                minValue={obj.min}
                                onFinish={(v) => updateUniforms(key, [value[0], value[1], parseFloat(v)], obj, true)}
                                handleChange={v => updateUniforms(key, [value[0], value[1], parseFloat(v)], obj, false)}
                                value={value ? value[2] : 0}

                                label={'Z'}
                            />
                        </div>
                    )
                else
                    return (
                        <ColorPicker
                            submit={(_, v) => updateUniforms(key, v.map(vv => vv / 255), obj, true)}
                            value={!value ? 'rgb(0,0,0)' : `rgb(${value[0] * 255},${value[1] * 255},${value[2] * 255})`}/>
                    )

            case DATA_TYPES.TEXTURE:
                return (
                    <Selector
                        type={'image'}
                        findData={true}
                        handleChange={async src => {
                            if (src) {
                                const k = obj.format
                                const file = await loadFile(src, 'string')
                                if (file) {
                                    let texture
                                    await new Promise(resolve => {
                                        texture = new TextureInstance(
                                            file,
                                            k.yFlip,
                                            props.engine.gpu,
                                            props.engine.gpu[k.internalFormat],
                                            props.engine.gpu[k.format],
                                            true,
                                            false,
                                            props.engine.gpu.UNSIGNED_BYTE,
                                            undefined,
                                            undefined,
                                            0,
                                            () => {
                                                resolve()
                                            }
                                        )
                                    })

                                    let index = state.uniforms.findIndex(u => u.key === key)
                                    if (index > -1) {
                                        const copy = [...state.uniforms]
                                        copy[index] = {...obj, value: src.registryID}

                                        state.uniforms = copy

                                        const values = {}
                                        copy.forEach(c => {
                                            if (c.type !== DATA_TYPES.TEXTURE)
                                                values[c.key] = c.value
                                            else if (c.key === key)
                                                values[c.key] = texture.texture
                                        })

                                        index = state.uniforms.findIndex(u => u.key === key)
                                        if (index > -1) {
                                            const copy = [...state.uniforms]
                                            copy[index] = {...obj, value: src.registryID, modified: true}

                                            state.uniforms = copy
                                            props.submit(copy, 'uniforms')
                                        }

                                        // updateUniforms(key, src.registryID, obj, false, false)
                                        // updateUniforms('modified', true, obj, false, true)


                                        props.submit(values, 'uniformValues')
                                    }

                                }
                            }
                        }}
                        selected={value}
                    />
                )
            default:
                return null
        }
    }


    return (
        <>
            <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                <AccordionSummary className={styles.summary}>
                    Material
                </AccordionSummary>
                <Selector
                    selected={state.currentMaterial}
                    type={'material'}
                    handleChange={async src => {
                        if (src) {
                            const file = await loadFile(src)
                            if (file && file.response) {
                                props.submit({
                                    blob: file.response,
                                    id: src.registryID,
                                    name: src.name
                                })
                                state.uniforms = file.response.uniforms
                                state.currentMaterial = src
                            }
                        } else
                            props.submit()
                    }}/>
            </Accordion>
            {props.selected.uniforms?.length > 0 ? (
                <Checkbox
                    noMargin={true}
                    label={'Override material uniforms'}
                    width={'100%'}
                    height={'35px'}
                    checked={state.overrideMaterial}
                    handleCheck={() => {
                        const s = !state.overrideMaterial
                        state.overrideMaterial = s
                        props.submit(s, 'overrideMaterial')
                    }}
                />
            ) : null}

                <Checkbox
                    noMargin={true}
                    label={'Double sided'}
                    width={'100%'}
                    height={'35px'}
                    checked={state.doubleSided}
                    handleCheck={() => {
                        const s = !state.doubleSided
                        state.doubleSided = s
                        props.submit(s, 'doubleSided')
                    }}
                />
            {state.overrideMaterial ?
                state.uniforms?.map(u => (
                    <Accordion className={styles.fieldset} contentClassName={styles.formWrapper}>
                        <AccordionSummary className={styles.summary}>
                            {u.label}
                        </AccordionSummary>
                        {getField(u)}
                    </Accordion>
                ))
                : null}
        </>

    )
}
MaterialComponent.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,


    quickAccess: PropTypes.object,
    setAlert: PropTypes.func.isRequired,
    selected: PropTypes.object,
    submit: PropTypes.func,
}