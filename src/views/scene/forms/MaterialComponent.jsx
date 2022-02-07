import PropTypes from "prop-types";
import styles from '../styles/Forms.module.css'
import {Accordion, AccordionSummary, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import React, {useEffect, useState} from "react";
import loadPromises from "../../editor/utils/parsers/loadMaterial";


export default function MaterialComponent(props) {

    const [texture, setTexture] = useState('')

    const setDefaultErrorAlert = () => {
        props.setAlert({type: 'error', message: 'Could not load material.'})
    }

    useEffect(() => {
        console.log(props.quickAccess.materials)
        if (props.database !== undefined) {
            try {
                if (props.selected.materialID)
                    props.database.getFile(props.selected.materialID).then(res => {
                        if (res !== undefined) {
                            const parsedBlob = JSON.parse(res.blob)
                            if (parsedBlob.response && parsedBlob.response.length > 0)
                                setTexture(parsedBlob.response.ambientColor)
                        }
                    })

            } catch (e) {
            }
        }


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
    const handleDrop = (e) => {
        const data = e.dataTransfer.getData('text')
        if (data !== undefined && data.length > 0)
            if (props.database) {
                try {
                    props.database.table('file').get(data).then(res => {
                        if (res.type !== 'material')
                            setDefaultErrorAlert()
                        else
                            loadPromises(res, props.database, props.gpu, (r, textures) => {
                                if (r) {
                                    setTexture(textures[0])
                                    props.submit(r)
                                }
                            })
                    }).catch(() => setDefaultErrorAlert())
                } catch (e) {
                }
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
                                            props.database.getBlob(o.id)
                                                .then(e => loadPromises({
                                                    ...o,
                                                    blob: e
                                                }, props.database, props.gpu, (mat, texts) => props.submit(mat, texts)))
                                        },
                                        icon: <img src={o.previewImage} style={{width: '30px', height: '30px'}} alt={'image'}/>
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
    database: PropTypes.object,

    setAlert: PropTypes.func.isRequired,
    selected: PropTypes.object,
    submit: PropTypes.func,
    gpu: PropTypes.object
}