import React, {useEffect, useState} from 'react'
import {Button, ToolTip} from "@f-ui/core";
import axios from "axios";
import styles from "./styles/Issue.module.css";
import stylesIssues from "./styles/IssuesList.module.css";
import PropTypes from "prop-types";
import {useMarkdown} from "../markdown";
import MarkdownMinimal from "../markdown/component/MarkdownMinimal";

export default function Issue(props) {
    const [comments, setComments] = useState([])
    useEffect(() => {
        axios.get(props.issue.comments_url)
            .then(res => setComments(res.data))
    }, [])
    console.log(props.issue)

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.section}>
                    <Button onClick={() => props.handleClose()} className={styles.returnButton}>
                        <span className={'material-icons-round'}>arrow_left</span>
                    </Button>
                    {props.issue.title}
                </div>
                <div className={styles.section} style={{justifyContent: 'flex-end', fontWeight: '550', fontSize: '.75rem'}}>
                    <img src={props.issue.user.avatar_url} alt={props.issue.user.login} className={styles.image}/>
                    {props.issue.user.login}
                </div>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.content}>
                    <Comment comment={props.issue}/>
                    {comments.map(c => (
                        <React.Fragment key={'comment-' + c.id}>
                            <Comment comment={c}/>
                        </React.Fragment>
                    ))}
                </div>
                <div className={styles.info}>


                <label>Labels</label>
                   <div className={styles.flow}>
                       {props.issue.labels.length > 0 ? props.issue.labels.map(l => (<div
                           className={stylesIssues.tag}
                           style={{
                               '--accent': "#" + l.color, '--accent-op': "#" + l.color + '40',
                           }} key={l.node_id + 'label' + l.id}>
                           {l.name}
                       </div>))
                       :
                           "No labels set."
                       }
                   </div>
                    <div className={styles.divider}/>
                </div>
            </div>

        </div>
    )
}
Issue.propTypes = {
    issue: PropTypes.object,
    handleClose: PropTypes.func
}

function Comment(props) {
    const hook = useMarkdown(props.comment.body)
    return (
        <div style={{display: 'flex', gap: '4px'}}>
            <div className={styles.userWrapper}>
                <img src={props.comment.user.avatar_url} alt={props.comment.user.login} className={styles.image}
                     style={{width: '50px'}}/>
                <ToolTip>
                    {props.comment.user.login}
                </ToolTip>
            </div>
            <div className={styles.commentWrapper}>
                <MarkdownMinimal hook={hook}/>
            </div>
        </div>
    )
}

Comment.propTypes = {
    comment: PropTypes.object
}