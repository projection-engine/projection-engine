import {Button, Modal} from "@f-ui/core";
import shared from "../styles/Home.module.css";
import styles from "../styles/Projects.module.css";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

export default function LinkProject(props) {
    const [pathLinkModal, setPathLinkModal] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('basePath') === null)
            setPathLinkModal(true)
    }, [])

    return (
        <>
            <Modal
                open={pathLinkModal}
                handleClose={() => {
                    if (localStorage.getItem('basePath') !== null)
                        setPathLinkModal(false)
                }}
                className={shared.modal}>
                <div className={styles.button} style={{gap: '8px'}}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>info</span>
                    Link a projects source folder
                </div>

                <Button className={styles.button} styles={{gap: '4px'}} variant={'filled'}
                        onClick={() => props.reference.current?.click()}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>snippet_folder</span>
                    Link folder
                </Button>
                <div>

                    <div className={styles.button} style={{gap: '8px'}}>
                        Can't link you directory ?
                    </div>
                    <div style={{fontWeight: 'normal'}}>
                        Please make sure to place the project identifier on the desired folder
                    </div>
                </div>
                <Button className={styles.button} styles={{gap: '4px'}}
                        variant={"outlined"}
                        onClick={() => {
                            const id = uuidv4()
                            const url = window.URL.createObjectURL(new Blob([id], {type: 'plain/text'}));
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url

                            a.download = 'identifier.projection';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>download</span>
                    Get identifier
                </Button>
            </Modal>
            <input
                ref={props.reference}
                type="file"
                onChange={(e) => {
                    let path = e.target.files[0].path.replace(e.target.files[0].name, '')
                    localStorage.setItem('basePath', path)
                    e.target.value = ''
                    setPathLinkModal(false)
                }}
                webkitdirectory={''}
                directory={''}
                style={{display: 'none'}}
            />
        </>
    )
}
LinkProject.propTypes = {
    reference: PropTypes.object
}