import styles from '../styles/Card.module.css'
import PropTypes from "prop-types";
import {Button, Modal, TextField, ToolTip} from "@f-ui/core";
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
        <div className={styles.wrapper} data-card={props.data.id} style={{animationDelay: props.index * 100 + 'ms'}}>
            <Modal
                className={shared.modal}
                styles={{width: open.image ? '50%' : undefined, height: open.image ? 'fit-content' : undefined}} open={open.edit || open.image} handleClose={() => setOpen({})}  >
                {open.image ?

                        <img
                            alt={'Preview'}
                            src={props.data.meta?.preview ? props.data.meta?.preview : logo}
                            className={styles.image}

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
            <Button variant={'minimal'} className={styles.imageWrapper} onClick={() => setOpen({image: true})}>
                <img

                    alt={'Preview'}
                    src={props.data.meta?.preview ? props.data.meta?.preview : logo}
                    className={styles.image}
                    draggable={false}/>
            </Button>
            <div className={styles.label}>
                <div className={styles.labels}>
                    <div className={styles.overflow}>
                        {name}
                    </div>
                    <div className={[styles.overflow, styles.date].join(' ')}>
                        {props.data.meta.lastModification}
                    </div>
                </div>
                <div className={styles.options}>
                    <Button
                        variant={'outlined'}
                        className={styles.button}
                        onClick={() => {
                            setOpen({
                                edit: true
                            })
                        }}
                        styles={{width: 'fit-content', position: 'absolute', left: 0}}>
                        <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>edit</span>

                    </Button>

                    <Button onClick={() => props.onClick()} variant={'filled'} className={styles.button}>
                        <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>open_in_new</span>
                        Load project
                    </Button>
                    <Button variant={'outlined'} className={styles.button} onClick={() => setOpen({
                        delete: true
                    })}>
                        <span className={'material-icons-round'}>delete</span>
                        <Modal

                            className={styles.onDelete} variant={'fit'}
                            handleClose={() => setOpen({})} open={open.delete}>
                            Are you sure ?
                            <Button onClick={() => props.onDelete()} variant={'filled'}
                                    styles={{'--fabric-accent-color': '#ff5555'}} className={styles.button}>
                                <span className={'material-icons-round'}>delete</span>
                                Delete permanently
                            </Button>
                        </Modal>
                    </Button>
                </div>

            </div>
            <ToolTip>
                <div className={styles.data}>
                    id:
                    <div className={styles.overflow} style={{fontWeight: 'normal'}}>{props.data.id}</div>
                </div>
                <div className={styles.data}>
                    Last modified:
                    <div className={styles.overflow}
                         style={{fontWeight: 'normal'}}>{props.data.meta?.lastModification}</div>
                </div>
                <div className={styles.data}>
                    Creation date:
                    <div className={styles.overflow}
                         style={{fontWeight: 'normal'}}>{props.data.meta?.creationDate}</div>
                </div>


            </ToolTip>
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