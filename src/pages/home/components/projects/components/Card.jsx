import styles from '../styles/Card.module.css'
import PropTypes from "prop-types";
import {Button, DataRow, Modal, TextField} from "@f-ui/core";
import {useState} from "react";
import logo from '../../../../../static/LOGO.png'
import shared from "../../../styles/Home.module.css";

export default function Card(props) {
    const [open, setOpen] = useState({
        delete: false,
        edit: false,
        image: false
    })
    const [name, setName] = useState(props.data.meta.name)

    return (
        <div className={styles.wrapper} data-card={props.data.id} style={{
            animationDelay: props.index * 100 + 'ms',
            background: props.index % 2 === 0 ? 'var(--fabric-background-primary)' : 'var(--fabric-background-tertiary)',
            borderRadius: props.index === 0 ? '5px 5px 0 0' : undefined
        }}>
            <Modal
                className={shared.modal}
                styles={{width: open.image ? 'fit-content' : undefined, height: open.image ? 'fit-content' : undefined}}
                open={open.edit || open.image} handleClose={() => setOpen({})}>
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
            <div className={styles.section}>
                <Button
                    variant={'minimal'}
                    className={styles.imageWrapper}
                    onClick={() => setOpen({image: true})}>
                    <img
                        alt={''}
                        src={props.data.meta?.preview ? props.data.meta?.preview : logo}
                        className={styles.image}
                        draggable={false}/>
                </Button>

                <DataRow
                    object={{...props.data.meta, name}}
                    keys={[
                        {label: 'Name', key: 'name', type: 'string'},
                        {label: 'Creation date', key: 'creationDate', type: 'string'},
                        {label: 'Last modification', key: 'lastModification', type: 'string'},
                        {label: 'Entities', key: 'entities', type: 'string'}
                    ]}
                    selfContained={true}
                    className={styles.dataRow}
                    index={0}
                />

            </div>

            <div className={styles.section} style={{justifyContent: 'flex-end'}}>
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
                    variant={'outlined'}
                    className={styles.button}
                    onClick={() => setOpen({
                        delete: true
                    })}>
                    <span className={'material-icons-round'}>delete</span>
                    <Modal
                        className={styles.onDelete} variant={'fit'}
                        handleClose={() => setOpen({})} open={open.delete}>
                        Are you sure ?
                        <Button
                            onClick={() => props.onDelete()}
                            variant={'filled'}
                            styles={{'--fabric-accent-color': '#ff5555'}}
                            className={styles.button}
                        >
                            <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>delete</span>
                            Delete permanently
                        </Button>
                    </Modal>
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