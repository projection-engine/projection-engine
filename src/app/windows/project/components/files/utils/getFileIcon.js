import styles from "../styles/File.module.css"
import Preview from "../../../../components/preview/Preview"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"
import React from "react"
import {Icon} from "@f-ui/core"

export default function getFileIcon({
    path,
    type,
    visualization,
    childrenQuantity
}) {

    const common = (t) => (
        <div className={styles.icon} data-size={`${visualization}`}>
            <Preview
                iconStyles={{fontSize: "4rem"}}

                path={path} className={styles.image}
                fallbackIcon={t}
            >
                <div className={styles.floatingIconWrapper}
                    style={{display: visualization === 2 ? "none" : undefined}}>
                    <Icon className={  styles.floatingIcon }>{t}</Icon>
                </div>
            </Preview>
        </div>
    )
    switch (type) {
    case FILE_TYPES.IMAGE:
        return common("image")
    case FILE_TYPES.MATERIAL:
        return common("texture")
    case FILE_TYPES.MESH:
        return common("view_in_ar")

    case FILE_TYPES.SCRIPT:
        return (
            <div className={styles.icon} data-size={`${visualization}`}>
                <Icon >javascript</Icon>
            </div>
        )
    case FILE_TYPES.SCENE:
        return (
            <div className={styles.icon} data-size={`${visualization}`}>
                <Icon >inventory_2</Icon>
            </div>
        )
    case "folder": {
        return (
            <div className={styles.icon} data-size={`${visualization}`} >
                <Icon  styles={{color: "var(--folder-color)"}}>folder</Icon>
                <div
                    title={"Files"}
                    className={styles.floatingIconWrapper}
                    style={{display: visualization === 2 ? "none" : undefined}}>
                    {childrenQuantity}
                </div>

            </div>
        )
    }
    default:
        return (
            <div className={styles.icon} data-size={`${visualization}`}>
                <Icon >description</Icon>
            </div>
        )
    }
}
