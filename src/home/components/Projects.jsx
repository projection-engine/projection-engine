import styles from "../styles/Projects.module.css";
import PropTypes from 'prop-types'
import React, {useMemo, useRef, useState} from "react";
import Card from "./Card";
import {Button, Masonry} from "@f-ui/core";
import Search from "../../components/search/Search";


export default function Projects(props) {
    const ref = useRef()
    const [searchString, setSearchString] = useState('')

    const projectsToShow = useMemo(() => {
        return props.projects
            .filter(p => p.meta.name?.toLowerCase().includes(searchString.toLowerCase()))
    }, [searchString, props.projects])

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <label className={styles.title}>
                    Your projects
                    <Search searchString={searchString} setSearchString={setSearchString} size={'big'}/>
                </label>
                <Button
                    className={styles.button}
                    variant={'filled'}
                    onClick={() => props.onNew()}>
                    New project
                </Button>
            </div>
            <Masonry className={styles.content}>
                {projectsToShow.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <Card
                            data={p} index={i}
                            onRename={newName => {
                                props.renameProject(newName, p.id)
                            }}
                            onDelete={() => {
                                props.deleteProject(p.id)
                            }}/>
                    </React.Fragment>
                ))}

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
    projects: PropTypes.array,
    setProjects: PropTypes.func
}