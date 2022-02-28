import styles from "./styles/Projects.module.css";
import PropTypes from 'prop-types'
import React, {useEffect, useMemo, useRef, useState} from "react";
import Card from "./components/Card";
import {Button, Dropdown, DropdownOption, DropdownOptions, Modal} from "@f-ui/core";
import randomID from "../../../../services/utils/misc/randomID";
import shared from '../../styles/Home.module.css'

export default function Projects(props) {
    const ref = useRef()
    const [pathLinkModal, setPathLinkModal] = useState(false)
    const [searchString, setSearchString] = useState('')
    const projectsToShow = useMemo(() => {

        return props.projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, props.projects])
    useEffect(() => {
        if (localStorage.getItem('basePath') === null) {
            setPathLinkModal(true)
        }
    }, [])

    return (
        <div className={styles.wrapper}>
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
                        onClick={() => ref.current?.click()}>
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
                            const id = randomID()
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
                ref={ref}
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
            <div className={styles.titleWrapper}>
                <label className={styles.title}>
                    Your projects
                </label>
                <div className={styles.optionsWrapper}>
                    <Dropdown
                        className={styles.button}
                        variant={'outlined'}
                        styles={{backgroundColor: 'var(--fabric-background-primary)', padding: '2px 5px 0px 10px'}}
                    >
                        <label>
                            More
                        </label>
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: 'Import from package.',
                                icon: <span className={'material-icons-round'}>folder_zip</span>,
                                onClick: () => props.onLoad()
                            }}/>
                            <DropdownOption option={{
                                label: 'Link source directory',
                                icon: <span className={'material-icons-round'}>snippet_folder</span>,
                                onClick: () => ref.current?.click()
                            }}/>

                        </DropdownOptions>
                    </Dropdown>
                    <Button
                        className={styles.button}
                        variant={'filled'}
                        onClick={() => props.onNew()}>

                        <label>
                            New project
                        </label>
                    </Button>
                </div>
            </div>
            <div className={styles.content}>
                {projectsToShow.length > 0 ? projectsToShow.map((p, i) => (
                        <React.Fragment key={p.id}>
                            <Card
                                onClick={() => props.redirect(p.id)}

                                data={p} index={i}
                                onRename={newName => {
                                    props.renameProject(newName, p.id)
                                }}
                                onDelete={() => {
                                    props.deleteProject(p.id)
                                }}/>
                        </React.Fragment>
                    ))
                    :
                    <div className={styles.emptyWrapper}>
                        <span className={'material-icons-round'} style={{fontSize: '5rem'}}>folder</span>
                        No projects found.
                    </div>
                }
            </div>
        </div>

    )
}

Projects.propTypes = {
    deleteProject: PropTypes.func.isRequired,
    onLoad: PropTypes.func,
    onNew: PropTypes.func,
    refresh: PropTypes.func,
    renameProject: PropTypes.func.isRequired,
    load: PropTypes.object,
    redirect: PropTypes.func,
    projects: PropTypes.array,
    setProjects: PropTypes.func
}