import styles from '../styles/Available.module.css'
import {Button, ToolTip, useListData} from "@f-ui/core";
import {allNodes} from "../templates/AllNodes";
import Search from "../../../components/search/Search";
import {useMemo, useState} from "react";

export default function Available() {
    const [searchString, setSearchString] = useState('')
    const nodes = useMemo(() => {
        return allNodes.filter(i => {
            if (typeof i.label === "object")
                return i.label.props.children.includes(searchString)
            else
                return i.label.includes(searchString)
        })
    }, [searchString])
    return (
        <div className={styles.wrapper}>
            <label className={styles.header}>
                Available nodes
                <Search width={'100%'} searchString={searchString} setSearchString={setSearchString}/>
            </label>

            <div className={styles.content}>
                {nodes.map(d => (
                    <div
                        className={styles.option}
                        draggable={true}
                        onDragStart={e => e.dataTransfer.setData('text', d.dataTransfer)}>
                        <div className={styles.icon}>
                            {d.icon}
                        </div>
                        {d.label}
                        <ToolTip content={d.tooltip} align={'middle'} justify={'start'}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
