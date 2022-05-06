import React, {useEffect, useState} from 'react'
import PropTypes from "prop-types";

export default function useGithubFile(props) {
    const [data, setData] = useState()

    useEffect(() => {
        const url = `https://raw.githubusercontent.com/${props.user}/${props.repo}/${props.branch}/${props.filePath}`
        fetch(url).then(res => res.text().then(text => setData(text))).catch(error => {})
    }, [props])

    return data
}
useGithubFile.propTypes = {
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    branch: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired
}