import styles from '../styles/Forms.module.css'
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Selector from "../../../../components/selector/Selector";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import AccordionTemplate from "../../../../components/templates/AccordionTemplate";
import ImageProcessor from "../../../engine/utils/image/ImageProcessor";

export default function Skybox(props) {
    const [currentImage, setCurrentImage] = useState(undefined)
    const [state, setState] = useState({
        resolution: props.selected.resolution,
        // gamma: props.selected.gamma, exposure: props.selected.exposure
    })
    const fileSystem = props.quickAccess.fileSystem
    useEffect(() => {
        if (props.selected.imageID) setCurrentImage(props.quickAccess.images.find(i => i.registryID === props.selected.imageID))
    }, [])

    return (<>
        <AccordionTemplate title={'Environment map'}>
            <Selector
                type={'image'}
                selected={currentImage}
                handleChange={async (src) => {
                    const rs = await fileSystem.readRegistryFile(src.registryID)
                    const file = !rs ? null : await fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path)
                    const res = !file ? null : await ImageProcessor.getImageBitmap(file)
                    if (res) {
                        props.submit({
                            blob: res, imageID: src.registryID
                        }, 'blob')
                        setCurrentImage(props.quickAccess.images.find(i => i.registryID === src.registryID))
                    }
                }}
            />
        </AccordionTemplate>
        <AccordionTemplate title={'Resolution'}>
            <Dropdown className={styles.dropdown}>
                {state.resolution}p
                <DropdownOptions>
                    <DropdownOption option={{
                        label: '512p',
                        icon: state.resolution === 512 ? <span style={{fontSize: '1.2rem'}}
                                                               className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 512
                            })
                            props.submit(512, 'resolution')
                        }
                    }}/>
                    <DropdownOption option={{
                        label: '1024p',
                        icon: state.resolution === 1024 ? <span style={{fontSize: '1.2rem'}}
                                                                className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 1024
                            })
                            props.submit(1024, 'resolution')
                        }
                    }}/>
                    <DropdownOption option={{
                        label: '2048p',
                        icon: state.resolution === 2048 ? <span style={{fontSize: '1.2rem'}}
                                                                className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 2048
                            })
                            props.submit(2048, 'resolution')
                        }
                    }}/>
                    <DropdownOption option={{
                        label: '4096p',
                        icon: state.resolution === 4096 ? <span style={{fontSize: '1.2rem'}}
                                                                className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            setState({
                                ...state, resolution: 4096
                            })
                            props.submit(4096, 'resolution')
                        }
                    }}/>
                </DropdownOptions>
            </Dropdown>
        </AccordionTemplate>
        {/*<AccordionTemplate title={'Gamma'}>*/}
        {/*    <Range*/}
        {/*        accentColor={'yellow'}*/}
        {/*        value={state.gamma}*/}
        {/*        minValue={.1}*/}
        {/*        incrementPercentage={.01}*/}
        {/*        precision={3}*/}
        {/*        maxValue={10}*/}
        {/*        onFinish={(v) => props.submit(v, 'gamma')}*/}
        {/*        handleChange={e => setState(prev => {*/}
        {/*            return {*/}
        {/*                ...prev, gamma: e*/}
        {/*            }*/}
        {/*        })}/>*/}
        {/*</AccordionTemplate>*/}
        {/*<AccordionTemplate title={'Exposure'}>*/}
        {/*    <Range*/}
        {/*        accentColor={'yellow'}*/}
        {/*        value={state.exposure}*/}
        {/*        minValue={.1}*/}
        {/*        incrementPercentage={.01}*/}
        {/*        precision={3}*/}
        {/*        maxValue={10}*/}
        {/*        onFinish={(v) => props.submit(v, 'exposure')}*/}
        {/*        handleChange={e => setState(prev => {*/}
        {/*            return {*/}
        {/*                ...prev, exposure: e*/}
        {/*            }*/}
        {/*        })}/>*/}

        {/*</AccordionTemplate>*/}
    </>)
}

Skybox.propTypes = {
    quickAccess: PropTypes.object, database: PropTypes.object, selected: PropTypes.object, submit: PropTypes.func
}