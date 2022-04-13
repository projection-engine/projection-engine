import styles from "./styles/Projects.module.css";
import PropTypes from 'prop-types'
import React, {useMemo, useRef, useState} from "react";
import Card from "./components/Card";
import {Button, Dropdown, DropdownOption, DropdownOptions, Masonry} from "@f-ui/core";
import LinkProject from "./components/LinkProject";
import Search from "../../../../components/search/Search";

export default function Projects(props) {
    const ref = useRef()
    const [searchString, setSearchString] = useState('')

    const projectsToShow = useMemo(() => {

        return props.projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, props.projects])


    return (
        <div className={styles.wrapper}>
           <LinkProject reference={ref}/>

            <div className={styles.titleWrapper}>
                <label className={styles.title}>
                    Your projects
                    <Search searchString={searchString} setSearchString={setSearchString} size={'big'}/>
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

            <Masonry  className={styles.content}>
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
            </Masonry>
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