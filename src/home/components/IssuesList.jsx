import React, {useEffect, useState} from "react"
import {DataProvider, DataRow, Icon} from "@f-ui/core"
import axios from "axios"
import styles from "../styles/IssuesList.module.css"
import Issue from "./Issue"

const GIT = {name: "editor", owner: "projection-engine"}
export default function IssuesList() {

    const url = "https://api.github.com/repos/" + GIT.owner + "/" + GIT.name + "/issues"
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get(url, {
            params: {page: 1, per_page: 40, state: "open"}, paramsSerializer: function paramsSerializer(params) {
                return Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&")
            }
        }).then(res => setData(res.data))
    }, [])
    const [issue, setIssue] = useState()

    return (
        <div className={styles.wrapper}>
            {issue ?
                <Issue issue={issue} handleClose={() => setIssue(undefined)}/>
                :
                <>
                    <div className={styles.title}>
                        Open issues
                    </div>
                    <DataProvider.Provider
                        value={{
                            data, keys: [{
                                key: "state",
                                label: "State",
                                hideLabel: true,
                                type: "string",
                                additionalWidth: "-95% + 35px",

                                method: (setColor, key, obj) => {
                                    const d = obj[key.key], closed = d === "closed"

                                    return (<Icon
                                        data-closed={`${closed}`}
                                        className={styles.closed}
                                    >
                                        {closed ? "task_alt" : "schedule"}
                                    </Icon>)
                                }
                            }, {
                                key: "title",
                                label: "Title",
                                type: "string",
                                additionalWidth: "200%",
                                method: (setColor, key, obj) => {
                                    const d = obj[key.key], labels = obj.labels.map(l => {
                                        return (<div
                                            className={styles.tag}
                                            style={{
                                                "--accent": "#" + l.color, "--accent-op": "#" + l.color + "40",
                                            }} key={l.node_id + "label" + l.id}>
                                            {l.name}
                                        </div>)
                                    })

                                    return (<div className={styles.titleWrapper}>
                                        {d}
                                        {labels.map(l => l)}
                                    </div>)
                                }

                            }, {
                                key: "created_at",
                                label: "Creation date",
                                additionalWidth: "-100% + 350px",
                                type: "date"
                            }, {
                                key: "user",
                                hideLabel: true,
                                label: "Creator",
                                type: "object",
                                additionalWidth: "-100% + 500px",
                                subfieldKey: "login",

                                method: (setColor, key, obj) => {
                                    const d = obj.user

                                    return (
                                        <div className={styles.titleWrapper} style={{textTransform: "unset"}}>
                                            {d.avatar_url?.length > 0 ?
                                                <img className={styles.image} src={d.avatar_url}
                                                    alt={"avatar"}/> :
                                                <Icon>person</Icon>}
                                            {d.login}
                                        </div>
                                    )
                                }

                            }], selfContained: true
                        }}
                    >
                        {data.map((d, i) => (<React.Fragment key={"data-issue-" + i + d.node_id}>
                            <DataRow
                                onClick={() => setIssue(d)}
                                className={styles.dataRowClickable}
                                index={i}/></React.Fragment>))}
                    </DataProvider.Provider>
                </>}
        </div>)
}
