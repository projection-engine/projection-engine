import styles from '../styles/Forms.module.css'
import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Selector from "../../../../components/selector/Selector";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";

import EVENTS from "../../../utils/EVENTS";
import Range from "../../../../components/range/Range";
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate";
import LoaderProvider from "../../../../components/loader/LoaderProvider";

export default function SkyboxComponent(props) {
    const [currentImage, setCurrentImage] = useState(undefined)
    const [state, setState] = useState({
        resolution: props.selected.resolution,
        gamma: props.selected.gamma,
        exposure: props.selected.exposure
    })
    const fileSystem = props.quickAccess.fileSystem
    const load = useContext(LoaderProvider)
    useEffect(() => {
        if (props.selected.imageID)
            setCurrentImage(props.quickAccess.images.find(i => i.registryID === props.selected.imageID))
    }, [])

    return (
        <>
            <AccordionTemplate title={'Environment map'}>
                <Selector
                    type={'image'}
                    selected={currentImage}
                    handleChange={(src) => {
                        load.pushEvent(EVENTS.LOAD_FILE)
                        fileSystem.readRegistryFile(src.registryID)
                            .then(rs => {
                                if (rs)
                                    fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path)
                                        .then(file => {
                                            if (file) {
                                                const img = new Image()
                                                img.onload = () => {
                                                    props.submit({
                                                        blob: img,
                                                        imageID: src.registryID
                                                    }, 'blob')
                                                    load.finishEvent(EVENTS.LOAD_FILE)
                                                    setCurrentImage(props.quickAccess.images.find(i => i.registryID === src.registryID))
                                                }
                                                img.src = file
                                            } else
                                                load.finishEvent(EVENTS.LOAD_FILE)
                                        })
                                else
                                    load.finishEvent(EVENTS.LOAD_FILE)
                            })
                    }}
                />
            </AccordionTemplate>
            <AccordionTemplate title={'Resolution'}>
                <Dropdown className={styles.dropdown}>
                    {state.resolution}p
                    <DropdownOptions>
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
                        <DropdownOption option={{
                            label: '4096p',
                            icon: state.resolution === 4096 ?
                                <span style={{fontSize: '1.2rem'}}
                                      className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => {
                                setState({
                                    ...state,
                                    resolution: 4096
                                })
                                props.submit(4096, 'resolution')
                            }
                        }}/>
                    </DropdownOptions>
                </Dropdown>
            </AccordionTemplate>
            <AccordionTemplate title={'Gamma'}>
                <Range
                    accentColor={'yellow'}
                    value={state.gamma}
                    minValue={.1}
                    maxValue={10}
                    onFinish={(v) => props.submit(v, 'gamma')}
                    handleChange={e => setState(prev => {
                        return {
                            ...prev,
                            gamma: e
                        }
                    })}/>
            </AccordionTemplate>
            <AccordionTemplate title={'Exposure'}>
                <Range
                    accentColor={'yellow'}
                    value={state.exposure}
                    minValue={.1}
                    maxValue={10}
                    onFinish={(v) => props.submit(v, 'exposure')}
                    handleChange={e => setState(prev => {
                        return {
                            ...prev,
                            exposure: e
                        }
                    })}/>

            </AccordionTemplate>
        </>
    )
}

SkyboxComponent.propTypes = {
    quickAccess: PropTypes.object,
    database: PropTypes.object,
    selected: PropTypes.object,
    submit: PropTypes.func
}