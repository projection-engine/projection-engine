import PropTypes from "prop-types"
import React, {useMemo} from "react"
import styles from "../styles/Recent.module.css"
import logo from "../../../static/logo.png"
import useLocalization from "../../../global/useLocalization"

export default function Recent(props) {
    const toShow = useMemo(() => {
        return props.projects.sort((a, b) => {
            if (a.meta?.lastModification < b.meta?.lastModification)
                return -1
            if (a.meta?.lastModification > b.meta?.lastModification)
                return 1
            return 0
        }).slice(0, 5)
    }, [props.projects])

    const translate = useLocalization("HOME", "CARD")

    return (
        <div style={{color: "var(--pj-color-secondary)"}}>
            <h4 style={{marginBottom: "4px", marginTop: "4px"}}>{translate("RECENT")}</h4>

            <div className={styles.wrapper}>

                {toShow.map(project => (
                    <div className={styles.card} key={project.id} onClick={() => props.open(project)}>
                        <div className={styles.preview}>
                            <img
                                draggable={false}
                                src={project.meta.preview ? project.meta.preview : logo}
                                alt={translate("PROJECT")}
                            />
                        </div>
                        <div className={styles.content}>
                            <strong>{project.meta.name}</strong>
                            <small>{project.meta.lastModification ? project.meta.lastModification : translate("NEVER")}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

Recent.propTypes = {
    projects: PropTypes.array,
    open: PropTypes.func
}