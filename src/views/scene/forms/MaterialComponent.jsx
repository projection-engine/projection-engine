import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import EVENTS from "../../../pages/project/utils/misc/EVENTS";


export default function MaterialComponent(props) {
    const [texture, setTexture] = useState('')


    useEffect(() => {
        if (props.selected.materialID)
            props.quickAccess.fileSystem.readFile(props.quickAccess.fileSystem.path + '/previews/' + props.selected.materialID + '.preview')
                .then(res => {
                    if (res)
                        setTexture(res)
                })
    }, [props.selected])

    const handleDrag = (e) => {
        e.preventDefault()
        if (e.type === 'dragover') {
            if (!e.currentTarget.classList.contains(styles.hovered))
                e.currentTarget.classList.add(styles.hovered)
        } else {
            e.currentTarget.classList.remove(styles.hovered)
        }
    }
    const importData = (id) => {
        props.load.pushEvent(EVENTS.LOADING_MATERIAL)
        const material = props.quickAccess
            .fileSystem
            .readFile(props.quickAccess.fileSystem.path + '/assets/' + id + '.material', 'json')
        const preview = props.quickAccess
            .fileSystem
            .readFile(props.quickAccess.fileSystem.path + '/previews/' + id + '.preview', 'json')

        Promise.all([material, preview])
            .then(res => {
                if (res[0]) {
                    setTexture(res[1])
                    props.submit(res[0])
                } else
                    props.setAlert({type: 'error', message: 'Could not load material.'})

                props.load.finishEvent(EVENTS.LOADING_MATERIAL)
            })
    }
    const handleDrop = (e) => {
        const data = e.dataTransfer.getData('text')

        if (data !== undefined && data.length > 0) {
            importData(data)
        }

        e.currentTarget.classList.remove(styles.hovered)
    }
    return (

        <Accordion>
            <AccordionSummary className={styles.summary}>
                Material
            </AccordionSummary>
            <div className={styles.wrapper} style={{alignItems: 'center'}} onDragOver={handleDrag} onDrop={handleDrop}
                 onDragLeave={handleDrag}>
                {
                    texture ? <img
                            className={styles.textureImage}
                            src={texture}
                            alt={'Texture'}
                        />
                        :
                        <span style={{fontSize: '60px'}} className={'material-icons-round'}>
                        texture
                    </span>
                }
                <div className={styles.content}>
                    <Dropdown
                        className={styles.dropdown}
                    >
                        {props.selected.name}
                        <DropdownOptions>
                            {props.quickAccess.materials.map((o, i) => (
                                <React.Fragment key={'material-' + i}>
                                    <DropdownOption option={{
                                        label: o.name,
                                        onClick: () => {
                                            importData(o.id)
                                        },
                                        icon: <img
                                            src={o.previewImage}
                                            style={{width: '30px', height: '30px'}}
                                            alt={'image'}/>
                                    }}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                </div>
            </div>
        </Accordion>

    )
}
MaterialComponent.propTypes = {
    quickAccess: PropTypes.object,
    loadedMaterials: PropTypes.array,
    setAlert: PropTypes.func.isRequired,
    selected: PropTypes.object,
    submit: PropTypes.func,
    gpu: PropTypes.object
}