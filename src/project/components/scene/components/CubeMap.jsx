import PropTypes from "prop-types"
import styles from "../styles/Forms.module.css"
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import React, {useEffect, useState} from "react"
import Range from "../../../../components/range/Range"
import AccordionTemplate from "../../../../components/templates/AccordionTemplate"


export default function CubeMap(props) {
    const getNewState = () => {
        return {

            resolution: props.selected.resolution,
            irradiance: props.selected.irradiance,
            prefilteredMipmaps: props.selected.prefilteredMipmaps,
            radius: props.selected.radius,

            xR: props.selected.irradianceMultiplier[0],
            yR: props.selected.irradianceMultiplier[1],
            zR: props.selected.irradianceMultiplier[2],
        }
    }
    const [state, setState] = useState(getNewState())
    useEffect(() => {
        setState(getNewState())
    }, [props.selected])

        return (
            <>
                <AccordionTemplate title={'Resolution'}>
                    <Dropdown className={styles.dropdown} styles={{background: 'var(--fabric-border-primary)'}}>
                        {state.resolution}p
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: '128p',
                                icon: state.resolution === 128 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 128
                                    })
                                    props.submit(128, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '512p',
                                icon: state.resolution === 512 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 512
                                    })
                                    props.submit(512, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '1024p',
                                icon: state.resolution === 1024 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 1024
                                    })
                                    props.submit(1024, 'resolution')
                                }
                            }}/>
                            <DropdownOption option={{
                                label: '2048p',
                                icon: state.resolution === 2048 ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    setState({
                                        ...state,
                                        resolution: 2048
                                    })
                                    props.submit(2048, 'resolution')
                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>
                </AccordionTemplate>

                <AccordionTemplate title={'LOD samples'}>
                    <Range
                        accentColor={'blue'}
                        integer={true}
                        incrementPercentage={1}
                        minValue={1}
                        maxValue={10}

                        onFinish={(v) => props.submit(v, 'prefilteredMipmaps')}
                        value={state.prefilteredMipmaps}
                        handleChange={e => {
                            setState({...state, prefilteredMipmaps: parseInt(e)})
                        }}
                    />
                </AccordionTemplate>


            </>
        )
    // return (
    //     <AccordionTemplate type={'flex'} title={'Translation'}>
    //         <Range
    //             metric={'m'}
    //             accentColor={'red'}
    //             label={'x'}
    //
    //             precision={3}
    //             incrementPercentage={.01}
    //
    //             value={state.xR}
    //             onFinish={(v) => props.submit([v, state.yR, state.zR], 'irradianceMultiplier')}
    //             handleChange={e => setState({...state, xR: parseInt(e)})}
    //         />
    //         <Range
    //             metric={'m'}
    //             accentColor={'#00ff00'}
    //             label={'y'}
    //             precision={3}
    //             incrementPercentage={.01}
    //
    //             value={state.yR}
    //             onFinish={(v) => props.submit([state.xR, v, state.zR], 'irradianceMultiplier')}
    //             handleChange={e => setState({...state, yR: parseInt(e)})}
    //         />
    //         <Range
    //             metric={'m'}
    //             accentColor={'#0095ff'}
    //             label={'z'}
    //             precision={3}
    //             incrementPercentage={.01}
    //
    //             value={state.zR}
    //             onFinish={(v) => props.submit([state.xR, state.yR, v], 'irradianceMultiplier')}
    //             handleChange={e => setState({...state, zR: parseInt(e)})}
    //         />
    //     </AccordionTemplate>
    // )
}
CubeMap.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func
}
