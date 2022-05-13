import PropTypes from "prop-types";
import React, {useEffect} from "react";
import Range from "../../../../components/range/Range";
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate";
import styles from "../styles/Forms.module.css";
import useDirectState from "../../../hooks/useDirectState";
import {Checkbox} from '@f-ui/core'

const toDeg = 180 / Math.PI, toRad = Math.PI / 180
export default function CameraComponent(props) {
    const [state] = useDirectState({})

    useEffect(() => {

        state.fov = Math.round(props.selected.fov * toDeg)
        state.aspectRatio = props.selected.aspectRatio
        state.zNear = props.selected.zNear
        state.zFar = props.selected.zFar

    }, [props])

    return (<div className={styles.ppWrapper}>
            <AccordionTemplate title={'FOV'}>
                <Range
                    metric={'angle'}
                    accentColor={'red'}
                    value={state.fov} minValue={35}
                    maxValue={175}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => {
                        props.submit(v * toRad, 'fov')
                    }}
                    handleChange={e => state.fov = e}
                />
            </AccordionTemplate>


            <AccordionTemplate title={'View planes'} type={'flex'}>
                <Range
                    accentColor={'red'}
                    value={state.zFar}
                    metric={'Far'}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => props.submit(v, 'zFar')}
                    handleChange={e => {
                        state.zFar = e
                    }}
                />
                <Range
                    accentColor={'green'}
                    value={state.zNear}
                    metric={'Near'}
                    precision={1}
                    incrementPercentage={.1}
                    onFinish={(v) => props.submit(v, 'zNear')}
                    handleChange={e => {
                        state.zNear = e
                    }}/>
            </AccordionTemplate>


            <div className={styles.group}>
                <Checkbox
                    noMargin={true}
                    checked={state.distortion}
                    handleCheck={v => props.submit('distortion', !v)}
                    label={'Lens distortion'}
                    height={'25px'}
                    width={'100%'}/>
                <AccordionTemplate title={'Distortion strength'}>
                    <Range accentColor={'red'} disabled={!state.distortion}
                           onFinish={v => props.submit('distortionStrength', v)}
                           incrementPercentage={.01}
                           precision={3}
                           handleChange={v => state.distortionStrength = v}
                           value={state.distortionStrength} maxValue={10} minValue={0}/>
                </AccordionTemplate>
            </div>

            <div className={styles.group}>
                <Checkbox
                    noMargin={true}
                    checked={state.chromaticAberration}
                    handleCheck={v => props.submit('chromaticAberration', !v)}
                    label={'Chromatic aberration'}
                    height={'25px'}
                    width={'100%'}/>
                <AccordionTemplate title={'Chromatic aberration strength'}>
                    <Range accentColor={'red'} disabled={!state.chromaticAberration}
                           onFinish={v => props.submit('chromaticAberrationStrength', v)}
                           incrementPercentage={.01}
                           precision={3}
                           handleChange={v => state.chromaticAberrationStrength = v}
                           value={state.chromaticAberrationStrength} maxValue={10} minValue={0}/>
                </AccordionTemplate>
            </div>
            <div className={styles.group}>
                <Checkbox
                    noMargin={true}
                    checked={state.filmGrain}
                    handleCheck={v => props.submit('filmGrain', !v)}
                    label={'Film grain'}
                    height={'25px'}
                    width={'100%'}/>
                <AccordionTemplate title={'Film grain strength'}>
                    <Range accentColor={'red'} disabled={!state.filmGrain}
                           onFinish={v => props.submit('filmGrain', v)}
                           incrementPercentage={.001}
                           precision={3}
                           handleChange={v => state.filmGrainStrength = v}
                           value={state.filmGrainStrength} maxValue={10} minValue={0}/>
                </AccordionTemplate>
            </div>

            <div className={styles.group}>
                <Checkbox
                    noMargin={true}
                    checked={state.bloom}
                    handleCheck={v => props.submit('bloom', !v)}
                    label={'Bloom'}
                    height={'25px'}
                    width={'100%'}/>
                <AccordionTemplate title={'Bloom strength'}>
                    <Range accentColor={'red'} disabled={!state.bloom}

                           incrementPercentage={.001}
                           precision={3}
                           onFinish={v => props.submit('bloomStrength', v)}
                           handleChange={v => state.bloomStrength = v}
                           value={state.bloomStrength} maxValue={10} minValue={0}/>
                </AccordionTemplate>
                <AccordionTemplate title={'Bloom threshold'}>
                    <Range
                        accentColor={'green'} disabled={!state.bloom}
                        incrementPercentage={.001}
                        precision={3}

                        onFinish={v => props.submit('bloomThreshold', v)}
                        handleChange={v => state.bloomThreshold = v}
                        value={state.bloomThreshold}

                        maxValue={1} minValue={0}
                    />
                </AccordionTemplate>

            </div>
            {/*COLOR CORRECTION*/}
            <div className={styles.group}>
                <AccordionTemplate title={'Gamma'}>
                    <Range
                        accentColor={'yellow'}
                        incrementPercentage={.001}
                        precision={3}
                        minValue={.1}
                        maxValue={10}


                        onFinish={v => props.submit('gamma', v)}
                        handleChange={v => state.gamma = v}
                        value={state.gamma}

                    />
                </AccordionTemplate>
                <AccordionTemplate title={'Exposure'}>
                    <Range
                        accentColor={'white'}
                        minValue={.1}
                        incrementPercentage={.001}
                        precision={3}
                        maxValue={10}


                        onFinish={v => props.submit('exposure', v)}
                        handleChange={v => state.exposure = v}
                        value={state.exposure}
                    />
                </AccordionTemplate>
            </div>
        </div>
    )
}

CameraComponent.propTypes = {
    selected: PropTypes.object, submit: PropTypes.func,
}
