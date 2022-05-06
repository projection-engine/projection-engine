import React from 'react'
import {useEffect, useMemo, useState} from "react";
import useCopyToClipboard from "./useCopyToClipboard";
import markdownParser from "../utils/markdown";
import styles from "../styles/Markdown.module.css";

export default function useMarkdown(markdownData){
    const id = useMemo(() => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }, [])

    const [copyTo, setCopyTo] = useState([])

    const copyToClipboard = useCopyToClipboard()
    const data = useMemo(() => {
        if (markdownData !== undefined && markdownData !== null) {
            const [htmlData, ids, metadata] = new markdownParser(markdownData, id)
            setCopyTo(ids)

            return {htmlData, metadata}
        } else
            return {htmlData: null, metadata: []}
    }, [markdownData, id])

    const handleClick = (event) => {
        const el = event.currentTarget.firstChild
        const success = copyToClipboard(event.currentTarget.parentNode.childNodes[2].textContent)
        if (success) {
            if (el) {
                el.innerText = 'check'
                el.parentNode.classList.add(styles.successButton)
            }
            setTimeout(() => {
                if (el) {
                    el.parentNode.classList.remove(styles.successButton)
                    el.innerText = 'copy'
                }

            }, 1750)
        }
    }

    useEffect(() => {

        copyTo?.forEach(element => {
            const ref = document.getElementById(element)

            if (ref)
                ref.addEventListener('click', handleClick)
        })
        return () => {
            copyTo?.forEach(element => {
                const ref = document.getElementById(element)
                if (ref)
                    ref.removeEventListener('click', handleClick)
            })
        }
    }, [copyTo])

    return {data: data.htmlData, metadata: data.metadata}
}
