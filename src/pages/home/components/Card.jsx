import styles from '../styles/Card.module.css'
import PropTypes from "prop-types";
import {Button, DataRow, Modal, TextField} from "@f-ui/core";
import {useMemo, useRef, useState} from "react";
import logo from '../../../static/LOGO.png'
import shared from "../styles/Home.module.css";

const KEYS = [
    {key: 'preview', type: 'image'},
    {label: 'Name', key: 'name', type: 'string'},
    {label: 'Creation date', key: 'creationDate', type: 'string'},
    {label: 'Last modification', key: 'lastModification', type: 'string'},
    {label: 'Entities', key: 'entities', type: 'string'}
]
export default function Card(props) {
    const ref = useRef()
    const [open, setOpen] = useState({
        delete: false,
        edit: false,
        image: false
    })
    const [name, setName] = useState(props.data.meta.name)
    const [hovered, setHovered] = useState(false)
    const object = useMemo(() => {
        return {...props.data.meta, name, preview: props.data.meta?.preview ? props.data.meta?.preview : logo}
    }, [props.data, name])

    return (
        <div
            className={styles.wrapper}
            data-card={props.data.id}
            ref={ref}

            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Modal
                className={shared.modal}
                styles={{width: open.image ? 'fit-content' : '250px', height: open.image ? 'fit-content' : undefined}}
                open={open.edit || open.image}
                variant={open.edit ? 'fit' : undefined}
                handleClose={() => setOpen({})}>
                {open.image ?

                    <img
                        alt={'Preview'}
                        src={props.data.meta?.preview ? props.data.meta?.preview : logo}
                        draggable={false}
                    />
                    :
                    <>
                        <TextField
                            handleChange={e => setName(e.target.value)}
                            label={'Project name'}
                            placeholder={'Project name'}
                            value={name} size={'small'}/>
                        <Button
                            variant={'filled'}
                            disabled={name === ''}
                            onClick={() => {
                                props.onRename(name)
                                setOpen({})
                            }}>
                            Rename project
                        </Button>
                    </>
                }
            </Modal>
            {open.delete ?
                <div
                    className={styles.onDelete}>
                    Are you sure ?
                    <div className={styles.buttonGroup}>

                        <Button
                            onClick={() => props.onDelete()}
                            variant={'filled'}
                            styles={{'--fabric-accent-color': '#ff5555', width: '100%'}}
                            className={styles.button}
                        >
                            <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>delete_forever</span>
                            Delete
                        </Button>
                        <Button
                            onClick={() => setOpen({...open, delete: false})}
                            variant={'outlined'}
                            styles={{width: '100%'}}
                            className={styles.button}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                :
                <DataRow
                    asCard={true}
                    object={object}
                    keys={KEYS}
                    styles={{width: '100%', minWidth: '100%', background: 'var(--fabric-background-secondary)'}}
                    selfContained={true}
                />
            }

            <div className={styles.section} style={{display: hovered && !open.delete && !open.edit ? undefined : 'none'}}>
                <Button
                    variant={'outlined'}
                    className={styles.button}
                    onClick={() => setOpen({
                        delete: true
                    })}>
                    <span className={'material-icons-round'}>delete</span>

                </Button>
                <Button
                    variant={'outlined'}
                    className={styles.button}
                    onClick={() => {
                        setOpen({
                            edit: true
                        })
                    }}
                >
                    <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>edit</span>
                </Button>

                <Button
                    onClick={() => props.onClick()}
                    variant={'filled'}
                    className={styles.button}>
                    <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>open_in_new</span>
                    <label>
                        Load project
                    </label>
                </Button>
            </div>
        </div>
    )
}
Card.propTypes = {
    index: PropTypes.number,
    data: PropTypes.object,
    onRename: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['row', 'cell'])
}