import styles from '../styles/Card.module.css'
import PropTypes from "prop-types";
import {Button, DataRow, Dropdown, DropdownOptions, DropdownProvider, Modal, TextField} from "@f-ui/core";
import {useContext, useMemo, useRef, useState} from "react";
import logo from '../../../static/LOGO.png'
import shared from "../styles/Home.module.css";
import {Link} from "react-router-dom";

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
        edit: false
    })
    const [name, setName] = useState(props.data.meta.name)
    const object = useMemo(() => {
        return {...props.data.meta, preview: props.data.meta?.preview ? props.data.meta?.preview : logo, name}
    }, [props.data, name])

    return (
        <div
            className={styles.wrapper}
            data-card={props.data.id}
            ref={ref}
        >
            <DataRow
                asCard={true}
                object={object}
                keys={KEYS}
                className={styles.dataRow}
                selfContained={true}
            />

            <div className={styles.section} style={{display: !open.delete && !open.edit ? undefined : 'none'}}>
                <Dropdown
                    variant={'outlined'}
                    className={styles.button}
                    onClick={() => setOpen({
                        delete: true
                    })} hideArrow={true}>
                    <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>delete_forever</span>
                    <DropdownOptions>
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
                                    <span className={'material-icons-round'}
                                          style={{fontSize: '1rem'}}>delete_forever</span>
                                    Delete
                                </Button>

                            </div>
                        </div>
                    </DropdownOptions>
                </Dropdown>
                <Dropdown
                    variant={'outlined'}
                    className={styles.button}
                    wrapperClassname={styles.modalOptions}
                    onClick={() => setOpen({
                        edit: true
                    })} hideArrow={true}>
                    <span style={{fontSize: '1rem'}} className={'material-icons-round'}>edit</span>
                    <DropdownOptions>
                        <div
                            className={styles.onDelete}>

                            <Rename name={name} setName={setName} setOpen={setOpen} onRename={props.onRename}/>

                        </div>
                    </DropdownOptions>
                </Dropdown>

                <Link to={'/project/' + props.data.id}>
                    <Button
                        variant={'filled'}
                        className={styles.button}>
                        <span className={'material-icons-round'} style={{fontSize: '1rem'}}>open_in_new</span>
                        <label>
                            Load project
                        </label>
                    </Button>
                </Link>
            </div>
        </div>
    )
}
Card.propTypes = {
    isLast: PropTypes.bool,
    index: PropTypes.number,
    data: PropTypes.object,
    onRename: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['row', 'cell'])
}

function Rename({setName, name, onRename, setOpen}) {
    const dropdownContext = useContext(DropdownProvider)
    return (
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
                    onRename(name)
                    setOpen({})
                    dropdownContext.setOpen(false)
                }}>
                Rename project
            </Button>
        </>
    )
}