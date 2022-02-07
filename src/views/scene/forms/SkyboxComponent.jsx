import styles from '../styles/Forms.module.css'
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Selector from "../../../components/selector/Selector";

export default function SkyboxComponent(props) {
    const [currentImage, setCurrentImage] = useState(undefined)

    useEffect(() => {
        if (props.selected.imageID)
            props.database
                .getFile(props.selected.imageID)
                .then(res => {
                    setCurrentImage({
                        name: res.name,
                        id: res.id,
                        blob: res.previewImage,
                        creationDate: res.creationDate
                    })
                })
    }, [])

    return (

        <div className={styles.formWrapper}>
            <Selector
                type={'image'}
                availableTextures={props.quickAccess.images}
                selected={currentImage}
                handleChange={(src) => {
                    props.database.getFileWithBlob(src.id)
                        .then(props.submit)
                }}
            />
        </div>
    )
}

SkyboxComponent.propTypes = {
    quickAccess: PropTypes.object,
    database: PropTypes.object,
    selected: PropTypes.object,
    submit: PropTypes.func
}